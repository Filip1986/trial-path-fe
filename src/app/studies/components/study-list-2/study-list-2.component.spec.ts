import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationService, MessageService } from 'primeng/api';

import { StudyList2Component } from './study-list-2.component';

// Mock Router
const mockRouter = {
  navigate: jasmine.createSpy('navigate'),
};

// Mock ConfirmationService
const mockConfirmationService = {
  confirm: jasmine.createSpy('confirm'),
};

// Mock MessageService
const mockMessageService = {
  add: jasmine.createSpy('add'),
};

describe('AllStudiesComponent', () => {
  let component: StudyList2Component;
  let fixture: ComponentFixture<StudyList2Component>;
  let router: Router;
  let confirmationService: ConfirmationService;
  let messageService: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StudyList2Component,
        NoopAnimationsModule, // Disable animations for testing
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ConfirmationService, useValue: mockConfirmationService },
        { provide: MessageService, useValue: mockMessageService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudyList2Component);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    confirmationService = TestBed.inject(ConfirmationService);
    messageService = TestBed.inject(MessageService);
  });

  beforeEach(() => {
    // Reset spies before each test
    (router.navigate as jasmine.Spy).calls.reset();
    (confirmationService.confirm as jasmine.Spy).calls.reset();
    (messageService.add as jasmine.Spy).calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.studies).toEqual([]);
    expect(component.filteredStudies).toEqual([]);
    expect(component.loading).toBeFalsy();
    expect(component.globalFilterValue).toBe('');
  });

  it('should load studies on init', () => {
    spyOn(component, 'loadStudies');
    component.ngOnInit();
    expect(component.loadStudies).toHaveBeenCalled();
  });

  it('should generate mock studies when loadStudies is called', (done) => {
    component.loadStudies();
    expect(component.loading).toBeTruthy();

    // Wait for the setTimeout to complete
    setTimeout(() => {
      expect(component.loading).toBeFalsy();
      expect(component.studies.length).toBeGreaterThan(0);
      expect(component.filteredStudies.length).toEqual(component.studies.length);
      done();
    }, 1100);
  });

  describe('Status severity mapping', () => {
    it('should return correct severity for active status', () => {
      expect(component.getStatusSeverity('active' as any)).toBe('success');
    });

    it('should return correct severity for recruiting status', () => {
      expect(component.getStatusSeverity('recruiting' as any)).toBe('success');
    });

    it('should return correct severity for planning status', () => {
      expect(component.getStatusSeverity('planning' as any)).toBe('info');
    });

    it('should return correct severity for draft status', () => {
      expect(component.getStatusSeverity('draft' as any)).toBe('info');
    });

    it('should return correct severity for suspended status', () => {
      expect(component.getStatusSeverity('suspended' as any)).toBe('warning');
    });

    it('should return correct severity for completed status', () => {
      expect(component.getStatusSeverity('completed' as any)).toBe('secondary');
    });

    it('should return correct severity for cancelled status', () => {
      expect(component.getStatusSeverity('cancelled' as any)).toBe('danger');
    });

    it('should return default severity for unknown status', () => {
      expect(component.getStatusSeverity('unknown' as any)).toBe('info');
    });
  });

  describe('Label mapping functions', () => {
    it('should return correct phase label', () => {
      expect(component.getPhaseLabel('phase_1')).toBe('Phase I');
      expect(component.getPhaseLabel('phase_2')).toBe('Phase II');
      expect(component.getPhaseLabel('unknown_phase')).toBe('unknown_phase');
    });

    it('should return correct study type label', () => {
      expect(component.getStudyTypeLabel('interventional')).toBe('Interventional');
      expect(component.getStudyTypeLabel('observational')).toBe('Observational');
      expect(component.getStudyTypeLabel('unknown_type')).toBe('unknown_type');
    });

    it('should return correct therapeutic areas labels', () => {
      const areas = ['oncology', 'cardiology'];
      expect(component.getTherapeuticAreasLabels(areas)).toBe('Oncology, Cardiology');
    });
  });

  // describe('Global filter', () => {
  //   it('should update global filter value on input', () => {
  //     const mockEvent = {
  //       target: { value: 'test search' } as HTMLInputElement,
  //     } as Event;
  //
  //     component.onGlobalFilter(mockEvent);
  //     expect(component.globalFilterValue).toBe('test search');
  //   });
  // });

  describe('Filter actions', () => {
    it('should clear filters', () => {
      component.globalFilterValue = 'test';
      component.studies = [{ id: '1' } as any];
      component.filteredStudies = [];

      component.clearFilters();

      expect(component.globalFilterValue).toBe('');
      expect(component.filteredStudies).toEqual(component.studies);
    });
  });

  describe('Navigation actions', () => {
    it('should navigate to create new study', () => {
      component.createNewStudy();
      expect(router.navigate).toHaveBeenCalledWith(['/studies/create']);
    });

    it('should navigate to view study', () => {
      const mockStudy = { id: '123' } as any;
      component.viewStudy(mockStudy);
      expect(router.navigate).toHaveBeenCalledWith(['/studies', '123']);
    });

    it('should navigate to edit study', () => {
      const mockStudy = { id: '123' } as any;
      component.editStudy(mockStudy);
      expect(router.navigate).toHaveBeenCalledWith(['/studies', '123', 'edit']);
    });
  });

  describe('Study actions', () => {
    const mockStudy = {
      id: '123',
      title: 'Test Study',
      shortTitle: 'TEST-001',
    } as any;

    it('should show confirmation dialog for duplicate study', () => {
      component.duplicateStudy(mockStudy);
      expect(confirmationService.confirm).toHaveBeenCalled();

      const confirmArgs = (confirmationService.confirm as jasmine.Spy).calls.mostRecent().args[0];
      expect(confirmArgs.message).toContain('duplicate');
      expect(confirmArgs.message).toContain('Test Study');
    });

    it('should show confirmation dialog for archive study', () => {
      component.archiveStudy(mockStudy);
      expect(confirmationService.confirm).toHaveBeenCalled();

      const confirmArgs = (confirmationService.confirm as jasmine.Spy).calls.mostRecent().args[0];
      expect(confirmArgs.message).toContain('archive');
      expect(confirmArgs.message).toContain('Test Study');
    });
  });

  describe('Action menu items', () => {
    const mockStudy = { id: '123', title: 'Test Study' } as any;

    it('should return correct menu items', () => {
      const menuItems = component.getActionMenuItems(mockStudy);

      expect(menuItems.length).toBeGreaterThan(0);
      expect(menuItems.some((item) => item.label === 'View Details')).toBeTruthy();
      expect(menuItems.some((item) => item.label === 'Edit')).toBeTruthy();
      expect(menuItems.some((item) => item.label === 'Duplicate')).toBeTruthy();
      expect(menuItems.some((item) => item.label === 'Export')).toBeTruthy();
      expect(menuItems.some((item) => item.label === 'Archive')).toBeTruthy();
    });

    // it('should execute view action when menu item is clicked', () => {
    //   spyOn(component, 'viewStudy');
    //   const menuItems = component.getActionMenuItems(mockStudy);
    //   const viewItem = menuItems.find((item) => item.label === 'View Details');
    //
    //   viewItem?.command?.();
    //   expect(component.viewStudy).toHaveBeenCalledWith(mockStudy);
    // });
    //
    // it('should execute edit action when menu item is clicked', () => {
    //   spyOn(component, 'editStudy');
    //   const menuItems = component.getActionMenuItems(mockStudy);
    //   const editItem = menuItems.find((item) => item.label === 'Edit');
    //
    //   editItem?.command?.();
    //   expect(component.editStudy).toHaveBeenCalledWith(mockStudy);
    // });
  });

  describe('Enrollment progress calculations', () => {
    it('should calculate enrollment progress correctly', () => {
      expect(component.getEnrollmentProgress(50, 100)).toBe(50);
      expect(component.getEnrollmentProgress(0, 100)).toBe(0);
      expect(component.getEnrollmentProgress(100, 100)).toBe(100);
      expect(component.getEnrollmentProgress(50, 0)).toBe(0);
    });

    it('should return correct progress colors', () => {
      expect(component.getEnrollmentProgressColor(95)).toBe('#10b981'); // green
      expect(component.getEnrollmentProgressColor(75)).toBe('#f59e0b'); // yellow
      expect(component.getEnrollmentProgressColor(55)).toBe('#f97316'); // orange
      expect(component.getEnrollmentProgressColor(25)).toBe('#ef4444'); // red
    });
  });

  describe('Component rendering', () => {
    it('should render the header with title and create button', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement;

      expect(compiled.querySelector('h1').textContent).toContain('All Studies');
      expect(compiled.querySelector('p-button[label="Create New Study"]')).toBeTruthy();
    });

    it('should render the data table', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement;

      expect(compiled.querySelector('p-table')).toBeTruthy();
    });

    it('should show loading spinner when loading', () => {
      component.loading = true;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('p-progressSpinner')).toBeTruthy();
    });
  });
});
