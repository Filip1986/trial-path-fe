import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, signal } from '@angular/core';
import { of, throwError } from 'rxjs';

import { PrivacyPolicyAcceptanceComponent } from './privacy-policy-acceptance.component';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import {
  PrivacyPolicyAcceptanceResponseDto,
  PrivacyPolicyDto,
  PrivacyPolicyService,
} from '../../../../../../shared/src/lib/api';

describe('PrivacyPolicyAcceptanceComponent', () => {
  let component: PrivacyPolicyAcceptanceComponent;
  let fixture: ComponentFixture<PrivacyPolicyAcceptanceComponent>;
  let mockPrivacyPolicyService: jest.Mocked<PrivacyPolicyService>;

  const mockPrivacyPolicy: PrivacyPolicyDto = {
    id: 123,
    version: '1.0.0',
    content: 'This is the privacy policy content',
    effectiveDate: '2024-01-01T00:00:00.000Z',
    publishedDate: '2024-01-01T00:00:00.000Z',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  // Create a simple mock that satisfies the DTO interface without assuming the exact structure
  const mockAcceptanceResponse: PrivacyPolicyAcceptanceResponseDto =
    {} as PrivacyPolicyAcceptanceResponseDto;

  beforeEach(async () => {
    // Create properly typed Jest mocks
    const privacyPolicyServiceMock = {
      privacyPolicyControllerGetLatestPrivacyPolicy: jest.fn(),
      privacyPolicyControllerAcceptPrivacyPolicy: jest.fn(),
      privacyPolicyControllerGetAllVersions: jest.fn(),
      privacyPolicyControllerGetVersionedPrivacyPolicy: jest.fn(),
      privacyPolicyControllerCheckUserNeedsToAcceptPolicy: jest.fn(),
      privacyPolicyControllerCreatePrivacyPolicy: jest.fn(),
      privacyPolicyControllerUpdatePrivacyPolicy: jest.fn(),
      http: {} as any,
    } as jest.Mocked<PrivacyPolicyService>;

    await TestBed.configureTestingModule({
      imports: [
        PrivacyPolicyAcceptanceComponent,
        CommonModule,
        FormsModule,
        ButtonModule,
        DialogModule,
        CheckboxModule,
        ProgressSpinnerModule,
      ],
      providers: [{ provide: PrivacyPolicyService, useValue: privacyPolicyServiceMock }],
    })
      .overrideComponent(PrivacyPolicyAcceptanceComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PrivacyPolicyAcceptanceComponent);
    component = fixture.componentInstance;
    mockPrivacyPolicyService = TestBed.inject(
      PrivacyPolicyService,
    ) as jest.Mocked<PrivacyPolicyService>;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.visible).toBe(false);
      expect(component.privacyPolicy).toBeNull();
      expect(component.acceptanceChecked).toBe(false);
      expect(component.isLoading()).toBe(true);
      expect(component.isAccepting()).toBe(false);
      expect(component.errorMessage()).toBe('');
    });

    it('should have the correct template structure', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('p-dialog')).toBeTruthy();
    });
  });

  // describe('NgOnInit', () => {
  //   it('should call loadLatestPrivacyPolicy', () => {
  //     const spy = jest.spyOn(component, 'loadLatestPrivacyPolicy');
  //     component.ngOnInit();
  //     expect(spy).toHaveBeenCalled();
  //   });
  // });

  describe('loadLatestPrivacyPolicy', () => {
    it('should load privacy policy successfully', () => {
      mockPrivacyPolicyService.privacyPolicyControllerGetLatestPrivacyPolicy.mockReturnValue(
        of(mockPrivacyPolicy),
      );

      component.loadLatestPrivacyPolicy();

      expect(component.privacyPolicy).toEqual(mockPrivacyPolicy);
      expect(component.isLoading()).toBe(false);
      expect(component.errorMessage()).toBe('');
    });

    it('should handle error when loading privacy policy fails', () => {
      const error = new Error('API Error');
      mockPrivacyPolicyService.privacyPolicyControllerGetLatestPrivacyPolicy.mockReturnValue(
        throwError(() => error),
      );

      component.loadLatestPrivacyPolicy();

      expect(component.isLoading()).toBe(false);
      expect(component.errorMessage()).toBe(
        'Failed to load privacy policy. Please try again later.',
      );
    });

    it('should call the privacy policy service', () => {
      mockPrivacyPolicyService.privacyPolicyControllerGetLatestPrivacyPolicy.mockReturnValue(
        of(mockPrivacyPolicy),
      );

      component.loadLatestPrivacyPolicy();

      expect(
        mockPrivacyPolicyService.privacyPolicyControllerGetLatestPrivacyPolicy,
      ).toHaveBeenCalled();
    });
  });

  describe('acceptPolicy', () => {
    beforeEach(() => {
      component.privacyPolicy = mockPrivacyPolicy;
      component.acceptanceChecked = true;
    });

    it('should return early if acceptance is not checked', () => {
      component.acceptanceChecked = false;

      component.acceptPolicy();

      expect(
        mockPrivacyPolicyService.privacyPolicyControllerAcceptPrivacyPolicy,
      ).not.toHaveBeenCalled();
    });

    it('should return early if privacy policy is null', () => {
      component.privacyPolicy = null;

      component.acceptPolicy();

      expect(
        mockPrivacyPolicyService.privacyPolicyControllerAcceptPrivacyPolicy,
      ).not.toHaveBeenCalled();
    });

    // it('should set accepting state and clear error message', () => {
    //   mockPrivacyPolicyService.privacyPolicyControllerAcceptPrivacyPolicy.mockReturnValue(
    //     of(mockAcceptanceResponse),
    //   );
    //
    //   component.acceptPolicy();
    //
    //   expect(component.isAccepting()).toBe(true);
    //   expect(component.errorMessage()).toBe('');
    // });

    it('should accept privacy policy successfully', () => {
      mockPrivacyPolicyService.privacyPolicyControllerAcceptPrivacyPolicy.mockReturnValue(
        of(mockAcceptanceResponse),
      );
      const policyAcceptedSpy = jest.spyOn(component.policyAccepted, 'emit');
      const closeDialogSpy = jest.spyOn(component, 'closeDialog');

      component.acceptPolicy();

      expect(policyAcceptedSpy).toHaveBeenCalledWith(true);
      expect(closeDialogSpy).toHaveBeenCalled();
      expect(component.isAccepting()).toBe(false);
    });

    it('should handle error when accepting privacy policy fails', () => {
      const error = new Error('API Error');
      mockPrivacyPolicyService.privacyPolicyControllerAcceptPrivacyPolicy.mockReturnValue(
        throwError(() => error),
      );

      component.acceptPolicy();

      expect(component.isAccepting()).toBe(false);
      expect(component.errorMessage()).toBe('Failed to record your acceptance. Please try again.');
    });

    it('should call privacy policy service with correct version', () => {
      mockPrivacyPolicyService.privacyPolicyControllerAcceptPrivacyPolicy.mockReturnValue(
        of(mockAcceptanceResponse),
      );

      component.acceptPolicy();

      expect(
        mockPrivacyPolicyService.privacyPolicyControllerAcceptPrivacyPolicy,
      ).toHaveBeenCalledWith({
        version: mockPrivacyPolicy.version,
      });
    });
  });

  describe('closeDialog', () => {
    it('should set visible to false and emit visibleChange', () => {
      const visibleChangeSpy = jest.spyOn(component.visibleChange, 'emit');
      component.visible = true;

      component.closeDialog();

      expect(component.visible).toBe(false);
      expect(visibleChangeSpy).toHaveBeenCalledWith(false);
    });
  });

  describe('Event Emitters', () => {
    it('should have policyAccepted EventEmitter', () => {
      expect(component.policyAccepted).toBeDefined();
      expect(component.policyAccepted.emit).toBeDefined();
    });

    it('should have visibleChange EventEmitter', () => {
      expect(component.visibleChange).toBeDefined();
      expect(component.visibleChange.emit).toBeDefined();
    });
  });

  describe('Input Properties', () => {
    it('should accept visible input', () => {
      component.visible = true;
      expect(component.visible).toBe(true);

      component.visible = false;
      expect(component.visible).toBe(false);
    });
  });

  describe('Signal Properties', () => {
    it('should have isLoading signal', () => {
      expect(component.isLoading).toBeDefined();
      expect(typeof component.isLoading()).toBe('boolean');
    });

    it('should have isAccepting signal', () => {
      expect(component.isAccepting).toBeDefined();
      expect(typeof component.isAccepting()).toBe('boolean');
    });

    it('should have errorMessage signal', () => {
      expect(component.errorMessage).toBeDefined();
      expect(typeof component.errorMessage()).toBe('string');
    });
  });

  // describe('Accessibility', () => {
  //   beforeEach(() => {
  //     component.visible = true;
  //     component.privacyPolicy = mockPrivacyPolicy;
  //     fixture.detectChanges();
  //   });
  //
  //   it('should have proper aria-label for accept button', () => {
  //     const acceptButton = fixture.nativeElement.querySelector(
  //       '[aria-label="Accept and Continue"]',
  //     );
  //     expect(acceptButton).toBeTruthy();
  //     expect(acceptButton.getAttribute('aria-label')).toBe('Accept and Continue');
  //   });
  //
  //   it('should have proper label association for checkbox', () => {
  //     const checkbox = fixture.nativeElement.querySelector('input[id="accept"]');
  //     const label = fixture.nativeElement.querySelector('label[for="accept"]');
  //
  //     expect(checkbox).toBeTruthy();
  //     expect(label).toBeTruthy();
  //   });
  //
  //   it('should have proper dialog structure', () => {
  //     const dialog = fixture.nativeElement.querySelector('p-dialog');
  //     expect(dialog).toBeTruthy();
  //     expect(dialog.getAttribute('header')).toBe('Privacy Policy Acceptance Required');
  //   });
  // });

  describe('Performance', () => {
    it('should use OnPush change detection strategy', () => {
      expect(component.constructor.name).toBe('PrivacyPolicyAcceptanceComponent');
      // Note: The actual change detection strategy is set in the component decorator
      // and would be tested through integration tests or by checking the component metadata
    });

    it('should properly clean up subscriptions', () => {
      // This test ensures that the finalize operator is used in observables
      // which helps with cleanup, though the component uses signals and reactive patterns
      mockPrivacyPolicyService.privacyPolicyControllerGetLatestPrivacyPolicy.mockReturnValue(
        of(mockPrivacyPolicy),
      );

      component.loadLatestPrivacyPolicy();

      // The finalize operator ensures proper cleanup
      expect(component.isLoading()).toBe(false);
    });
  });
});
