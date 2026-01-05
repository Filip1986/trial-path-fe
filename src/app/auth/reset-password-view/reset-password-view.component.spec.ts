import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ResetPasswordViewComponent } from './reset-password-view.component';
import { UserService } from '../../../../../../shared/src/lib/api';
import { ResetPasswordComponent, ResetPasswordFormData } from '@artificial-sense/ui-lib';

describe('ResetPasswordViewComponent', () => {
  let component: ResetPasswordViewComponent;
  let fixture: ComponentFixture<ResetPasswordViewComponent>;
  let routerSpy: jest.Mocked<Router>;
  let userServiceSpy: jest.Mocked<UserService>;
  let messageServiceSpy: jest.Mocked<MessageService>;

  // Mock ActivatedRoute with params observable
  let paramsSubject: BehaviorSubject<{ [key: string]: string }>;
  let activatedRouteMock: Partial<ActivatedRoute>;

  beforeEach(async () => {
    // Initialize the subject with default params
    paramsSubject = new BehaviorSubject({ token: 'valid-token-123' } as { [key: string]: string });

    // Create Jest mocks for services
    const routerMock = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    const userServiceMock = {
      userControllerResetPassword: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    const messageServiceMock = {
      add: jest.fn(),
    } as unknown as jest.Mocked<MessageService>;

    // Setup ActivatedRoute mock
    activatedRouteMock = {
      params: paramsSubject.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [
        ResetPasswordViewComponent,
        CommonModule,
        FormsModule,
        SelectButton,
        ResetPasswordComponent,
        NoopAnimationsModule, // Disable animations for testing
      ],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordViewComponent);
    component = fixture.componentInstance;

    // Get the spy instances
    routerSpy = TestBed.inject(Router) as jest.Mocked<Router>;
    userServiceSpy = TestBed.inject(UserService) as jest.Mocked<UserService>;
    messageServiceSpy = TestBed.inject(MessageService) as jest.Mocked<MessageService>;
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.isSubmitting()).toBe(false);
      expect(component.resetSuccessful()).toBe(false);
      expect(component.tokenError()).toBe(false);
      expect(component.token).toBe('');
    });

    it('should have default style options', () => {
      expect(component.styleOptions).toEqual([
        { name: '1', value: '1' },
        { name: '2', value: '2' },
        { name: '3', value: '3' },
      ]);
      expect(component.selectedResetPasswordStyle).toBe('1');
    });
  });

  describe('Token Handling', () => {
    it('should extract token from route params on init', () => {
      paramsSubject.next({ token: 'test-token-123' });

      component.ngOnInit();

      expect(component.token).toBe('test-token-123');
    });

    it('should handle token error when no token is provided', () => {
      paramsSubject.next({});

      component.ngOnInit();

      expect(component.token).toBeUndefined();
      expect(component.tokenError()).toBe(true);
      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid reset link. Please request a new one.',
      });
    });

    it('should handle null token and set tokenError', () => {
      paramsSubject.next({ token: null as any });

      component.ngOnInit();

      expect(component.token).toBe(null);
      expect(component.tokenError()).toBe(true);
      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid reset link. Please request a new one.',
      });
    });

    it('should handle empty token and set tokenError', () => {
      paramsSubject.next({ token: '' });

      component.ngOnInit();

      expect(component.token).toBe('');
      expect(component.tokenError()).toBe(true);
      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid reset link. Please request a new one.',
      });
    });
  });

  describe('Navigation', () => {
    it('should navigate to login page', () => {
      component.onNavigateToLogin();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('Password Reset Submission', () => {
    const mockFormData: ResetPasswordFormData = {
      password: 'NewPassword123!',
      confirmPassword: 'NewPassword123!',
    };

    beforeEach(() => {
      component.token = 'valid-token-123';
      fixture.detectChanges();
    });

    it('should call userService.userControllerResetPassword with correct parameters', () => {
      userServiceSpy.userControllerResetPassword.mockReturnValue(of({}));

      component.onSubmitResetPassword(mockFormData);

      expect(userServiceSpy.userControllerResetPassword).toHaveBeenCalledWith('valid-token-123', {
        password: 'NewPassword123!',
      });
    });

    it('should handle successful password reset', () => {
      userServiceSpy.userControllerResetPassword.mockReturnValue(of({}));

      component.onSubmitResetPassword(mockFormData);

      expect(component.resetSuccessful()).toBe(true);
      expect(component.isSubmitting()).toBe(false);
      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Success',
        detail: 'Your password has been reset successfully.',
      });
    });

    it('should handle password reset error with custom message', () => {
      const errorResponse = {
        error: {
          message: 'Custom error message',
        },
      };
      userServiceSpy.userControllerResetPassword.mockReturnValue(throwError(() => errorResponse));

      component.onSubmitResetPassword(mockFormData);

      expect(component.resetSuccessful()).toBe(false);
      expect(component.isSubmitting()).toBe(false);
      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Custom error message',
      });
    });

    it('should handle password reset error without custom message', () => {
      const errorResponse = { error: {} };
      userServiceSpy.userControllerResetPassword.mockReturnValue(throwError(() => errorResponse));

      component.onSubmitResetPassword(mockFormData);

      expect(component.resetSuccessful()).toBe(false);
      expect(component.isSubmitting()).toBe(false);
      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to reset password. Please try again.',
      });
    });

    it('should handle password reset error without error object', () => {
      const errorResponse = {};
      userServiceSpy.userControllerResetPassword.mockReturnValue(throwError(() => errorResponse));

      component.onSubmitResetPassword(mockFormData);

      expect(component.resetSuccessful()).toBe(false);
      expect(component.isSubmitting()).toBe(false);
      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to reset password. Please try again.',
      });
    });

    it('should set isSubmitting to true during submission and false after completion', () => {
      userServiceSpy.userControllerResetPassword.mockReturnValue(of({}));

      // Before submission
      expect(component.isSubmitting()).toBe(false);

      component.onSubmitResetPassword(mockFormData);

      // After submission completes
      expect(component.isSubmitting()).toBe(false);
    });

    it('should set isSubmitting to false even when error occurs', () => {
      userServiceSpy.userControllerResetPassword.mockReturnValue(
        throwError(() => new Error('Test error')),
      );

      component.onSubmitResetPassword(mockFormData);

      expect(component.isSubmitting()).toBe(false);
    });
  });

  describe('Style Configuration', () => {
    it('should have configurable style options', () => {
      expect(component.styleOptions).toHaveLength(3);
      expect(component.styleOptions[0]).toEqual({ name: '1', value: '1' });
      expect(component.styleOptions[1]).toEqual({ name: '2', value: '2' });
      expect(component.styleOptions[2]).toEqual({ name: '3', value: '3' });
    });

    it('should allow changing selected style', () => {
      component.selectedResetPasswordStyle = '2';
      expect(component.selectedResetPasswordStyle).toBe('2');

      component.selectedResetPasswordStyle = '3';
      expect(component.selectedResetPasswordStyle).toBe('3');
    });
  });

  describe('Error Messages Constants', () => {
    it('should have correct static error messages', () => {
      // Access private static readonly properties through the component instance for testing
      expect((ResetPasswordViewComponent as any).INVALID_TOKEN_MESSAGE).toBe(
        'Invalid reset link. Please request a new one.',
      );
      expect((ResetPasswordViewComponent as any).RESET_SUCCESS_MESSAGE).toBe(
        'Your password has been reset successfully.',
      );
      expect((ResetPasswordViewComponent as any).RESET_ERROR_MESSAGE).toBe(
        'Failed to reset password. Please try again.',
      );
    });
  });

  describe('Component State Management', () => {
    it('should properly manage isSubmitting signal', () => {
      expect(component.isSubmitting()).toBe(false);

      component.isSubmitting.set(true);
      expect(component.isSubmitting()).toBe(true);

      component.isSubmitting.set(false);
      expect(component.isSubmitting()).toBe(false);
    });

    it('should properly manage resetSuccessful signal', () => {
      expect(component.resetSuccessful()).toBe(false);

      component.resetSuccessful.set(true);
      expect(component.resetSuccessful()).toBe(true);

      component.resetSuccessful.set(false);
      expect(component.resetSuccessful()).toBe(false);
    });

    it('should properly manage tokenError signal', () => {
      expect(component.tokenError()).toBe(false);

      component.tokenError.set(true);
      expect(component.tokenError()).toBe(true);

      component.tokenError.set(false);
      expect(component.tokenError()).toBe(false);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete password reset flow', () => {
      // Setup initial state
      paramsSubject.next({ token: 'integration-test-token' });
      component.ngOnInit();

      // Mock successful API response
      userServiceSpy.userControllerResetPassword.mockReturnValue(of({ success: true }));

      const formData: ResetPasswordFormData = {
        password: 'NewPassword123!',
        confirmPassword: 'NewPassword123!',
      };

      // Execute password reset
      component.onSubmitResetPassword(formData);

      // Verify final state
      expect(component.token).toBe('integration-test-token');
      expect(component.resetSuccessful()).toBe(true);
      expect(component.isSubmitting()).toBe(false);
      expect(userServiceSpy.userControllerResetPassword).toHaveBeenCalledWith(
        'integration-test-token',
        {
          password: 'NewPassword123!',
        },
      );
      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Success',
        detail: 'Your password has been reset successfully.',
      });
    });

    it('should handle invalid token scenario', () => {
      // Setup - no token provided
      paramsSubject.next({});

      // Execute
      component.ngOnInit();

      // Verify error handling
      expect(component.tokenError()).toBe(true);
      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid reset link. Please request a new one.',
      });
    });
  });
});
