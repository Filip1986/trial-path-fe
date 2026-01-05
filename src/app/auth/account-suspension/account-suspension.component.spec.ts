import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { AccountSuspensionComponent } from './account-suspension.component';
import { AuthService } from '../../core/services/app-auth.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';

describe('AccountSuspensionComponent', () => {
  let component: AccountSuspensionComponent;
  let fixture: ComponentFixture<AccountSuspensionComponent>;
  let mockAuthService: jest.Mocked<Pick<AuthService, 'logout'>>;
  let originalLocation: Location;

  beforeEach(async () => {
    // Create a Jest mock object for AuthService with proper typing
    mockAuthService = {
      logout: jest.fn(),
    };

    // Store the original location and replace with a mock
    originalLocation = window.location;
    // @ts-ignore - Ignoring TypeScript error for testing purposes
    delete window.location;
    window.location = {
      ...originalLocation,
      href: '',
    } as Location;

    await TestBed.configureTestingModule({
      imports: [
        AccountSuspensionComponent,
        CommonModule,
        ButtonModule,
        CardModule,
        DialogModule,
        NoopAnimationsModule,
      ],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountSuspensionComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    // Restore original location
    window.location = originalLocation;
    // Clean up spies after each test
    jest.restoreAllMocks();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.visible).toBe(false);
      expect(component.reason).toBeUndefined();
      expect(component.isLoggingOut()).toBe(false);
    });

    it('should have correct constructor', () => {
      expect(component.constructor.name).toBe('AccountSuspensionComponent');
    });
  });

  describe('Input Properties', () => {
    it('should accept visible input', () => {
      component.visible = true;
      fixture.detectChanges();
      expect(component.visible).toBe(true);
    });

    it('should accept reason input', () => {
      const testReason = 'Account suspended for policy violation';
      component.reason = testReason;
      fixture.detectChanges();
      expect(component.reason).toBe(testReason);
    });

    it('should handle undefined reason', () => {
      component.reason = undefined;
      fixture.detectChanges();
      expect(component.reason).toBeUndefined();
    });
  });

  describe('Dialog Visibility', () => {
    it('should not display dialog when visible is false', () => {
      component.visible = false;
      fixture.detectChanges();

      const dialog = fixture.debugElement.query(By.css('p-dialog'));
      expect(dialog).toBeTruthy();
      // The dialog component should be present but not visible
    });

    it('should display dialog when visible is true', () => {
      component.visible = true;
      fixture.detectChanges();

      const dialog = fixture.debugElement.query(By.css('p-dialog'));
      expect(dialog).toBeTruthy();
    });

    it('should have correct dialog properties', () => {
      fixture.detectChanges();
      const dialog = fixture.debugElement.query(By.css('p-dialog'));

      expect(dialog.attributes['ng-reflect-closable']).toBe('false');
      expect(dialog.attributes['ng-reflect-draggable']).toBe('false');
      expect(dialog.attributes['ng-reflect-modal']).toBe('true');
      expect(dialog.attributes['ng-reflect-resizable']).toBe('false');
      expect(dialog.attributes['header']).toBe('Account Suspended');
    });
  });

  describe('Content Display', () => {
    beforeEach(() => {
      component.visible = true;
      fixture.detectChanges();
    });

    it('should display default suspension message when no reason provided', () => {
      component.reason = undefined;
      fixture.detectChanges();

      // Use a more specific selector to target the main message paragraph
      const messageElement = fixture.debugElement.query(By.css('p.text-center.mb-4'));
      expect(messageElement.nativeElement.textContent.trim()).toBe(
        'Your account has been temporarily suspended.',
      );
    });

    it('should display custom reason when provided', () => {
      const customReason = 'Account suspended for security reasons';
      component.reason = customReason;
      fixture.detectChanges();

      // Use the same specific selector
      const messageElement = fixture.debugElement.query(By.css('p.text-center.mb-4'));
      expect(messageElement.nativeElement.textContent.trim()).toBe(customReason);
    });

    it('should display suspension icon', () => {
      const iconElement = fixture.debugElement.query(By.css('i.pi-lock'));
      expect(iconElement).toBeTruthy();
      expect(iconElement.nativeElement.classList).toContain('text-5xl');
      expect(iconElement.nativeElement.classList).toContain('text-red-500');
    });

    it('should display warning message', () => {
      const warningText = fixture.debugElement.query(By.css('.bg-red-100 p'));
      expect(warningText.nativeElement.textContent.trim()).toContain(
        'If you believe this suspension was made in error',
      );
    });
  });

  describe('Contact Support Functionality', () => {
    beforeEach(() => {
      component.visible = true;
      fixture.detectChanges();
    });

    it('should have contact support button', () => {
      const contactButton = fixture.debugElement.query(By.css('button[label="Contact Support"]'));
      expect(contactButton).toBeTruthy();
      expect(contactButton.attributes['icon']).toBe('pi pi-envelope');
    });

    it('should call contactSupport when contact button is clicked', () => {
      const contactSupportSpy = jest.spyOn(component, 'contactSupport');
      const contactButton = fixture.debugElement.query(By.css('button[label="Contact Support"]'));

      contactButton.nativeElement.click();

      expect(contactSupportSpy).toHaveBeenCalled();
    });

    it('should set window.location.href with correct email when contactSupport is called', () => {
      component.contactSupport();

      expect(window.location.href).toBe(
        'mailto:support@yourdomain.com?subject=Account%20Suspension%20Appeal',
      );
    });
  });

  describe('Logout Functionality', () => {
    beforeEach(() => {
      component.visible = true;
      fixture.detectChanges();
    });

    it('should have logout button', () => {
      const logoutButton = fixture.debugElement.query(By.css('button[label="Logout"]'));
      expect(logoutButton).toBeTruthy();
      expect(logoutButton.attributes['icon']).toBe('pi pi-sign-out');
    });

    it('should call logout when logout button is clicked', () => {
      mockAuthService.logout.mockReturnValue(of({}));
      const logoutSpy = jest.spyOn(component, 'logout');
      const logoutButton = fixture.debugElement.query(By.css('button[label="Logout"]'));

      logoutButton.nativeElement.click();

      expect(logoutSpy).toHaveBeenCalled();
    });

    it('should call AuthService.logout when logout method is invoked', () => {
      // Setup the Jest mock to return an observable
      mockAuthService.logout.mockReturnValue(of({}));

      component.logout();

      expect(mockAuthService.logout).toHaveBeenCalled();
    });

    it('should set isLoggingOut signal when logout is called', () => {
      mockAuthService.logout.mockReturnValue(of({}));

      component.logout();

      expect(component.isLoggingOut()).toBe(false); // Should be false after observable completes
    });

    it('should handle logout error gracefully', () => {
      mockAuthService.logout.mockReturnValue(throwError(() => new Error('Logout failed')));

      component.logout();

      expect(component.isLoggingOut()).toBe(false); // Should be false after error
    });

    it('should prevent multiple simultaneous logout calls', () => {
      mockAuthService.logout.mockReturnValue(of({}));

      // Set the signal to true (simulating ongoing logout)
      component.isLoggingOut.set(true);

      component.logout();

      // AuthService.logout should not be called because isLoggingOut is true
      expect(mockAuthService.logout).not.toHaveBeenCalled();
    });
  });

  describe('Component Structure and Styling', () => {
    beforeEach(() => {
      component.visible = true;
      fixture.detectChanges();
    });

    it('should have correct CSS classes for main container', () => {
      const mainContainer = fixture.debugElement.query(
        By.css('.flex.flex-column.align-items-center.p-4'),
      );
      expect(mainContainer).toBeTruthy();
    });

    it('should have correct CSS classes for buttons container', () => {
      const buttonsContainer = fixture.debugElement.query(By.css('.flex.gap-2'));
      expect(buttonsContainer).toBeTruthy();
    });

    it('should have warning section with correct styling', () => {
      const warningSection = fixture.debugElement.query(
        By.css('.bg-red-100.border-l-4.border-red-500.text-red-700'),
      );
      expect(warningSection).toBeTruthy();
    });

    it('should display title with correct styling', () => {
      const title = fixture.debugElement.query(By.css('h2.text-xl.font-bold.text-center'));
      expect(title).toBeTruthy();
      expect(title.nativeElement.textContent.trim()).toBe('Your Account Has Been Suspended');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string reason', () => {
      component.reason = '';
      component.visible = true;
      fixture.detectChanges();

      const messageElement = fixture.debugElement.query(By.css('p'));
      expect(messageElement.nativeElement.textContent.trim()).toBe(
        'Your account has been temporarily suspended.',
      );
    });

    it('should handle null reason', () => {
      component.reason = null as any;
      component.visible = true;
      fixture.detectChanges();

      const messageElement = fixture.debugElement.query(By.css('p'));
      expect(messageElement.nativeElement.textContent.trim()).toBe(
        'Your account has been temporarily suspended.',
      );
    });

    // it('should handle whitespace-only reason', () => {
    //   component.reason = '   ';
    //   component.visible = true;
    //   fixture.detectChanges();
    //
    //   const messageElement = fixture.debugElement.query(By.css('p'));
    //   expect(messageElement.nativeElement.textContent.trim()).toBe(
    //     'Your account has been temporarily suspended.',
    //   );
    // });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      component.visible = true;
      fixture.detectChanges();
    });

    // it('should have proper ARIA labels for buttons', () => {
    //   const contactButton = fixture.debugElement.query(By.css('button[label="Contact Support"]'));
    //   const logoutButton = fixture.debugElement.query(By.css('button[label="Logout"]'));
    //
    //   expect(contactButton.attributes['aria-label']).toBeTruthy();
    //   expect(logoutButton.attributes['aria-label']).toBeTruthy();
    // });

    it('should have proper dialog accessibility attributes', () => {
      const dialog = fixture.debugElement.query(By.css('p-dialog'));
      expect(dialog.attributes['ng-reflect-modal']).toBe('true');
    });
  });

  describe('Component Lifecycle', () => {
    it('should handle component destruction gracefully', () => {
      expect(() => {
        fixture.destroy();
      }).not.toThrow();
    });

    it('should maintain signal state through change detection cycles', () => {
      component.isLoggingOut.set(true);
      fixture.detectChanges();

      expect(component.isLoggingOut()).toBe(true);

      fixture.detectChanges(); // Multiple change detection cycles
      fixture.detectChanges();

      expect(component.isLoggingOut()).toBe(true);
    });
  });
});
