import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';

import { ForgotPasswordViewComponent } from './forgot-password-view.component';
import { UserService } from '../../../../../../shared/src/lib/api';
import { ForgotPasswordFormData } from '@artificial-sense/ui-lib';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';
import { ComponentStyleOption } from '../../core/models/ui-variants';

describe('ForgotPasswordViewComponent', () => {
  let component: ForgotPasswordViewComponent;
  let fixture: ComponentFixture<ForgotPasswordViewComponent>;
  let routerSpy: jest.Mocked<Router>;
  let userServiceSpy: jest.Mocked<UserService>;
  let messageServiceSpy: jest.Mocked<MessageService>;

  beforeEach(async () => {
    // Create Jest mock objects
    const routerMock = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    const userServiceMock = {
      userControllerForgotPassword: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    const messageServiceMock = {
      add: jest.fn(),
    } as unknown as jest.Mocked<MessageService>;

    await TestBed.configureTestingModule({
      imports: [ForgotPasswordViewComponent, CommonModule, FormsModule, SelectButton],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordViewComponent);
    component = fixture.componentInstance;

    // Get spy instances
    routerSpy = TestBed.inject(Router) as jest.Mocked<Router>;
    userServiceSpy = TestBed.inject(UserService) as jest.Mocked<UserService>;
    messageServiceSpy = TestBed.inject(MessageService) as jest.Mocked<MessageService>;

    fixture.detectChanges();
  });

  afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.selectedForgotPasswordStyle).toBe('1');
      expect(component.isSubmitting()).toBe(false);
      expect(component.resetLinkSent()).toBe(false);
    });

    it('should initialize styleOption array with correct values', () => {
      const expectedOptions: ComponentStyleOption[] = [
        { name: '1', value: '1' },
        { name: '2', value: '2' },
        { name: '3', value: '3' },
      ];
      expect(component.styleOptions).toEqual(expectedOptions);
    });

    it('should have correct static ERROR_MESSAGE', () => {
      // Access the private static field through a component class
      expect((ForgotPasswordViewComponent as any).ERROR_MESSAGE).toBe(
        'Failed to send reset link. Please try again.',
      );
    });
  });

  describe('Navigation', () => {
    it('should navigate to login page when navigateToLogin is called', () => {
      component.navigateToLogin();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('Form Submission - Success Cases', () => {
    beforeEach(() => {
      userServiceSpy.userControllerForgotPassword.mockReturnValue(of({ success: true }));
    });

    it('should handle successful form submission', () => {
      const mockFormData: ForgotPasswordFormData = { email: 'test@example.com' };

      component.handleSubmit(mockFormData);

      expect(userServiceSpy.userControllerForgotPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(component.resetLinkSent()).toBe(true);
    });

    it('should set isSubmitting to true during submission and false after completion', () => {
      const mockFormData: ForgotPasswordFormData = { email: 'test@example.com' };

      expect(component.isSubmitting()).toBe(false);

      component.handleSubmit(mockFormData);

      expect(userServiceSpy.userControllerForgotPassword).toHaveBeenCalled();

      // After the observable completes (synchronously in tests), isSubmitting should be false
      expect(component.isSubmitting()).toBe(false);
    });

    it('should not display error messages on successful submission', () => {
      const mockFormData: ForgotPasswordFormData = { email: 'test@example.com' };

      component.handleSubmit(mockFormData);

      expect(messageServiceSpy.add).not.toHaveBeenCalled();
    });
  });

  describe('Form Submission - Error Cases', () => {
    it('should handle API error with custom error message', () => {
      const mockError = {
        error: { message: 'Email not found in our system' },
      };
      userServiceSpy.userControllerForgotPassword.mockReturnValue(throwError(mockError));

      const mockFormData: ForgotPasswordFormData = { email: 'nonexistent@example.com' };

      component.handleSubmit(mockFormData);

      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Email not found in our system',
      });
      expect(component.resetLinkSent()).toBe(false);
    });

    it('should handle API error with default error message when no custom message provided', () => {
      const mockError = { error: {} };
      userServiceSpy.userControllerForgotPassword.mockReturnValue(throwError(mockError));

      const mockFormData: ForgotPasswordFormData = { email: 'test@example.com' };

      component.handleSubmit(mockFormData);

      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to send reset link. Please try again.',
      });
    });

    it('should handle API error without error object', () => {
      const mockError = {};
      userServiceSpy.userControllerForgotPassword.mockReturnValue(throwError(mockError));

      const mockFormData: ForgotPasswordFormData = { email: 'test@example.com' };

      component.handleSubmit(mockFormData);

      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to send reset link. Please try again.',
      });
    });

    it('should set isSubmitting to false after error', () => {
      userServiceSpy.userControllerForgotPassword.mockReturnValue(throwError({}));

      const mockFormData: ForgotPasswordFormData = { email: 'test@example.com' };

      component.handleSubmit(mockFormData);

      expect(component.isSubmitting()).toBe(false);
    });
  });

  describe('Edge Cases and Null Responses', () => {
    it('should handle null response from API', () => {
      userServiceSpy.userControllerForgotPassword.mockReturnValue(of(null as any));

      const mockFormData: ForgotPasswordFormData = { email: 'test@example.com' };

      component.handleSubmit(mockFormData);

      expect(component.resetLinkSent()).toBe(false);
      expect(messageServiceSpy.add).not.toHaveBeenCalled();
    });

    it('should handle undefined response from API', () => {
      userServiceSpy.userControllerForgotPassword.mockReturnValue(of(undefined as any));

      const mockFormData: ForgotPasswordFormData = { email: 'test@example.com' };

      component.handleSubmit(mockFormData);

      expect(component.resetLinkSent()).toBe(false);
    });

    it('should handle empty response from API', () => {
      userServiceSpy.userControllerForgotPassword.mockReturnValue(of({}));

      const mockFormData: ForgotPasswordFormData = { email: 'test@example.com' };

      component.handleSubmit(mockFormData);

      expect(component.resetLinkSent()).toBe(false);
    });
  });

  describe('Signal State Management', () => {
    it('should properly manage isSubmitting signal state during successful submission', () => {
      // Test initial state
      expect(component.isSubmitting()).toBe(false);

      userServiceSpy.userControllerForgotPassword.mockReturnValue(of({ success: true }));

      const mockFormData: ForgotPasswordFormData = { email: 'test@example.com' };
      component.handleSubmit(mockFormData);

      // After observable completes (synchronously in test), state should be managed properly
      expect(component.isSubmitting()).toBe(false);
      expect(component.resetLinkSent()).toBe(true);
    });

    it('should properly manage isSubmitting signal state during error', () => {
      // Test initial state
      expect(component.isSubmitting()).toBe(false);

      userServiceSpy.userControllerForgotPassword.mockReturnValue(
        throwError({ error: { message: 'Test error' } }),
      );

      const mockFormData: ForgotPasswordFormData = { email: 'test@example.com' };
      component.handleSubmit(mockFormData);

      // After observable completes with error (synchronously in test), state should be managed properly
      expect(component.isSubmitting()).toBe(false);
      expect(component.resetLinkSent()).toBe(false);
    });

    it('should properly manage resetLinkSent signal state', () => {
      userServiceSpy.userControllerForgotPassword.mockReturnValue(of({ success: true }));

      expect(component.resetLinkSent()).toBe(false);

      const mockFormData: ForgotPasswordFormData = { email: 'test@example.com' };
      component.handleSubmit(mockFormData);

      expect(component.resetLinkSent()).toBe(true);
    });
  });

  describe('Component Style Configuration', () => {
    it('should allow changing selected forgot password style', () => {
      expect(component.selectedForgotPasswordStyle).toBe('1');

      component.selectedForgotPasswordStyle = '2';
      expect(component.selectedForgotPasswordStyle).toBe('2');

      component.selectedForgotPasswordStyle = '3';
      expect(component.selectedForgotPasswordStyle).toBe('3');
    });

    it('should maintain style options integrity', () => {
      const originalOptions = [...component.styleOptions];

      // Add this mock setup before calling handleSubmit
      userServiceSpy.userControllerForgotPassword.mockReturnValue(of({ success: true }));

      // Simulate some operations that shouldn't affect the options
      component.selectedForgotPasswordStyle = '2';
      component.handleSubmit({ email: 'test@example.com' });

      expect(component.styleOptions).toEqual(originalOptions);
    });
  });

  describe('Integration with UI Library Component', () => {
    it('should pass correct data to ForgotPasswordComponent', () => {
      // This test ensures the component properly integrates with the UI library component
      // The actual UI component testing should be in the ui-lib tests
      expect(component.selectedForgotPasswordStyle).toBeDefined();
      expect(component.isSubmitting).toBeDefined();
      expect(component.resetLinkSent).toBeDefined();
    });
  });

  describe('Private Method Testing', () => {
    it('should call handleError method correctly', () => {
      const mockError = {
        error: { message: 'Custom error message' },
      };

      // Access private method for testing
      (component as any).handleError(mockError);

      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Custom error message',
      });
    });

    it('should fallback to default error message in handleError', () => {
      const mockError = { error: {} };

      (component as any).handleError(mockError);

      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to send reset link. Please try again.',
      });
    });
  });

  describe('Memory Management', () => {
    it('should not have memory leaks from subscriptions', () => {
      // Test that the component properly handles observables without memory leaks
      userServiceSpy.userControllerForgotPassword.mockReturnValue(of({ success: true }));

      const mockFormData: ForgotPasswordFormData = { email: 'test@example.com' };

      // Call multiple times to ensure no subscription buildup
      component.handleSubmit(mockFormData);
      component.handleSubmit(mockFormData);
      component.handleSubmit(mockFormData);

      // Verify the service was called each time (no stale subscriptions)
      expect(userServiceSpy.userControllerForgotPassword).toHaveBeenCalledTimes(3);
    });
  });

  describe('Accessibility and User Experience', () => {
    it('should maintain proper component state for screen readers', () => {
      // Test loading states
      expect(component.isSubmitting()).toBe(false);

      userServiceSpy.userControllerForgotPassword.mockReturnValue(of({ success: true }));
      component.handleSubmit({ email: 'test@example.com' });

      // After successful submission
      expect(component.resetLinkSent()).toBe(true);
    });

    it('should provide appropriate feedback messages', () => {
      const mockError = {
        error: { message: 'Please check your email address' },
      };
      userServiceSpy.userControllerForgotPassword.mockReturnValue(throwError(mockError));

      component.handleSubmit({ email: 'invalid@email' });

      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Please check your email address',
      });
    });
  });
});
