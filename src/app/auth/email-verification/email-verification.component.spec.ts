import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { of, throwError, BehaviorSubject } from 'rxjs';

import { EmailVerificationComponent } from './email-verification.component';
import { UserService } from '../../../../../../shared/src/lib/api';
import { AuthService } from '@core/services/app-auth.service';
import { AuthState, UserDetails } from '@core/store/auth.state';
import { CommonModule } from '@angular/common';
import { ButtonDirective } from 'primeng/button';
import { Card } from 'primeng/card';
import { UserRoles } from '../../../../../draft-be/src/app/user/roles.enum';

// Jest-specific mock setup
const mockStore = {
  select: jest.fn(),
};

const mockUserService = {
  userControllerResendVerificationEmail: jest.fn(),
};

const mockMessageService = {
  add: jest.fn(),
};

const mockRouter = {
  navigate: jest.fn(),
};

const mockAuthService = {
  fetchAndStoreCurrentUser: jest.fn(),
};

describe('EmailVerificationComponent', () => {
  let component: EmailVerificationComponent;
  let fixture: ComponentFixture<EmailVerificationComponent>;
  let storeSpy: jest.Mocked<Store>;
  let userServiceSpy: jest.Mocked<UserService>;
  let messageServiceSpy: jest.Mocked<MessageService>;
  let routerSpy: jest.Mocked<Router>;
  let authServiceSpy: jest.Mocked<AuthService>;

  // Mock user data
  const mockUser: UserDetails = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    role: UserRoles.User,
    isEmailConfirmed: false,
    isSuspended: false,
  };

  const mockUserEmailConfirmed: UserDetails = {
    ...mockUser,
    isEmailConfirmed: true,
  };

  // BehaviorSubject to control email state changes
  let emailSubject: BehaviorSubject<string>;

  beforeEach(async () => {
    // Initialize the subject with a default value
    emailSubject = new BehaviorSubject<string>('test@example.com');

    // Reset all mocks
    jest.clearAllMocks();

    // Setup store mock to return our BehaviorSubject
    mockStore.select.mockReturnValue(emailSubject.asObservable());

    await TestBed.configureTestingModule({
      imports: [EmailVerificationComponent, CommonModule, ButtonDirective, Card],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: UserService, useValue: mockUserService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailVerificationComponent);
    component = fixture.componentInstance;

    // Get the mock instances
    storeSpy = TestBed.inject(Store) as jest.Mocked<Store>;
    userServiceSpy = TestBed.inject(UserService) as jest.Mocked<UserService>;
    messageServiceSpy = TestBed.inject(MessageService) as jest.Mocked<MessageService>;
    routerSpy = TestBed.inject(Router) as jest.Mocked<Router>;
    authServiceSpy = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with correct default values', () => {
      expect(component.isResending()).toBe(false);
      expect(component.isChecking()).toBe(false);
    });

    it('should call store.select with AuthState.getUserEmail', () => {
      expect(storeSpy.select).toHaveBeenCalledWith(AuthState.getUserEmail);
    });

    it('should initialize userEmail signal with store value', () => {
      emailSubject.next('test@example.com');
      fixture.detectChanges();

      expect(component.userEmail()).toBe('test@example.com');
    });

    it('should use fallback when email is null', () => {
      emailSubject.next(null as any);
      fixture.detectChanges();

      expect(component.userEmail()).toBe('your email address');
    });

    it('should update userEmail when store value changes', () => {
      emailSubject.next('initial@example.com');
      fixture.detectChanges();
      expect(component.userEmail()).toBe('initial@example.com');

      emailSubject.next('updated@example.com');
      fixture.detectChanges();
      expect(component.userEmail()).toBe('updated@example.com');
    });
  });

  describe('Resend Verification Email', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      emailSubject.next('test@example.com');
      fixture.detectChanges();
      consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      // Restore console.error after each test
      consoleSpy.mockRestore();
    });

    it('should call userService.userControllerResendVerificationEmail when resendVerificationEmail is called', () => {
      userServiceSpy.userControllerResendVerificationEmail.mockReturnValue(of({}));

      component.resendVerificationEmail();

      expect(userServiceSpy.userControllerResendVerificationEmail).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });

    it('should set isResending to true during the process', () => {
      const resendSubject = new BehaviorSubject({});
      userServiceSpy.userControllerResendVerificationEmail.mockReturnValue(
        resendSubject.asObservable(),
      );

      expect(component.isResending()).toBe(false);

      component.resendVerificationEmail();

      expect(component.isResending()).toBe(true);

      resendSubject.complete();
      expect(component.isResending()).toBe(false);
    });

    it('should show success message after successful resend', () => {
      userServiceSpy.userControllerResendVerificationEmail.mockReturnValue(of({}));

      component.resendVerificationEmail();

      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Email Sent',
        detail: 'A new verification email has been sent to your inbox.',
      });
    });

    it('should handle resend error', () => {
      const errorMessage = 'Failed to send email';
      userServiceSpy.userControllerResendVerificationEmail.mockReturnValue(
        throwError({ error: { message: errorMessage } }),
      );

      component.resendVerificationEmail();

      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
      });
      expect(component.isResending()).toBe(false);
    });

    it('should handle resend error with default message', () => {
      userServiceSpy.userControllerResendVerificationEmail.mockReturnValue(
        throwError({ error: {} }),
      );

      component.resendVerificationEmail();

      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to send verification email. Please try again later.',
      });
    });

    it('should prevent multiple simultaneous resend requests', () => {
      const resendSubject = new BehaviorSubject({});
      userServiceSpy.userControllerResendVerificationEmail.mockReturnValue(
        resendSubject.asObservable(),
      );

      // Start first resend
      component.resendVerificationEmail();
      expect(component.isResending()).toBe(true);

      // Try to start second resend while first is in progress
      const initialCallCount =
        userServiceSpy.userControllerResendVerificationEmail.mock.calls.length;
      component.resendVerificationEmail();

      // Should not make additional API calls
      expect(userServiceSpy.userControllerResendVerificationEmail.mock.calls.length).toBe(
        initialCallCount,
      );
    });
  });

  describe('Confirm Verification', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      fixture.detectChanges();
      consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      // Restore console.error after each test
      consoleSpy.mockRestore();
    });

    it('should call authService.fetchAndStoreCurrentUser when confirmVerification is called', () => {
      authServiceSpy.fetchAndStoreCurrentUser.mockReturnValue(of(mockUserEmailConfirmed));

      component.confirmVerification();

      expect(authServiceSpy.fetchAndStoreCurrentUser).toHaveBeenCalled();
    });

    it('should set isChecking to true during the process', () => {
      const checkingSubject = new BehaviorSubject(mockUserEmailConfirmed);
      authServiceSpy.fetchAndStoreCurrentUser.mockReturnValue(checkingSubject.asObservable());

      expect(component.isChecking()).toBe(false);

      component.confirmVerification();

      expect(component.isChecking()).toBe(true);

      checkingSubject.complete();
      expect(component.isChecking()).toBe(false);
    });

    it('should show success message and navigate when email is confirmed', () => {
      authServiceSpy.fetchAndStoreCurrentUser.mockReturnValue(of(mockUserEmailConfirmed));

      component.confirmVerification();

      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Verified!',
        detail: 'Your email has been verified successfully!',
      });
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should show info message when email is not confirmed', () => {
      authServiceSpy.fetchAndStoreCurrentUser.mockReturnValue(of(mockUser));

      component.confirmVerification();

      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'info',
        summary: 'Not Verified',
        detail:
          'Your email has not been verified yet. Please check your inbox for the verification link.',
      });
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should handle confirmation check error', () => {
      const errorMessage = 'Failed to check verification status. Please try again later.';
      authServiceSpy.fetchAndStoreCurrentUser.mockReturnValue(
        throwError({ error: { message: errorMessage } }),
      );

      component.confirmVerification();

      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
      });
      expect(component.isChecking()).toBe(false);
    });

    it('should handle confirmation check error with default message', () => {
      authServiceSpy.fetchAndStoreCurrentUser.mockReturnValue(throwError({ error: {} }));

      component.confirmVerification();

      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to check verification status. Please try again later.',
      });
    });

    it('should handle user data without isEmailConfirmed property', () => {
      const userWithoutEmailConfirmed = { ...mockUser };
      delete (userWithoutEmailConfirmed as any).isEmailConfirmed;

      authServiceSpy.fetchAndStoreCurrentUser.mockReturnValue(of(userWithoutEmailConfirmed));

      component.confirmVerification();

      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'info',
        summary: 'Not Verified',
        detail:
          'Your email has not been verified yet. Please check your inbox for the verification link.',
      });
    });

    it('should prevent multiple simultaneous verification checks', () => {
      const checkingSubject = new BehaviorSubject(mockUserEmailConfirmed);
      authServiceSpy.fetchAndStoreCurrentUser.mockReturnValue(checkingSubject.asObservable());

      // Start first check
      component.confirmVerification();
      expect(component.isChecking()).toBe(true);

      // Try to start second check while first is in progress
      const initialCallCount = authServiceSpy.fetchAndStoreCurrentUser.mock.calls.length;
      component.confirmVerification();

      // Should not make additional API calls
      expect(authServiceSpy.fetchAndStoreCurrentUser.mock.calls.length).toBe(initialCallCount);
    });
  });

  describe('Component Structure and Styling', () => {
    beforeEach(() => {
      emailSubject.next('test@example.com');
      fixture.detectChanges();
    });

    it('should have correct main container classes', () => {
      const mainContainer = fixture.debugElement.query(
        By.css('.flex.justify-center.items-center.min-h-screen'),
      );
      expect(mainContainer).toBeTruthy();
    });

    it('should have card with correct styling', () => {
      const card = fixture.debugElement.query(By.css('p-card'));
      expect(card.attributes['styleClass']).toBe('w-full max-w-lg');
    });

    it('should have header with correct styling', () => {
      const header = fixture.debugElement.query(
        By.css('.bg-primary-600.text-white.p-4.flex.items-center'),
      );
      expect(header).toBeTruthy();
    });

    it('should have buttons container with correct spacing', () => {
      const buttonsContainer = fixture.debugElement.query(By.css('.space-y-3'));
      expect(buttonsContainer).toBeTruthy();
    });

    it('should have info box with correct styling', () => {
      const infoBox = fixture.debugElement.query(By.css('.bg-blue-50.border-l-4.border-blue-500'));
      expect(infoBox).toBeTruthy();
    });

    it('should have main heading with correct styling', () => {
      const heading = fixture.debugElement.query(By.css('h3.font-medium.text-lg.mb-4'));
      expect(heading).toBeTruthy();
      expect(heading.nativeElement.textContent.trim()).toBe('Verify your email address');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      emailSubject.next('test@example.com');
      fixture.detectChanges();
    });

    it('should have proper button labels', () => {
      const resendButton = fixture.debugElement.query(
        By.css('button[label="Resend Verification Email"]'),
      );
      const checkButton = fixture.debugElement.query(
        By.css('button[label="Check Verification Status"]'),
      );

      expect(resendButton).toBeTruthy();
      expect(checkButton).toBeTruthy();
    });

    it('should have proper button icons', () => {
      const resendButton = fixture.debugElement.query(By.css('button[icon="pi pi-envelope"]'));
      const checkButton = fixture.debugElement.query(By.css('button[icon="pi pi-check-circle"]'));

      expect(resendButton).toBeTruthy();
      expect(checkButton).toBeTruthy();
    });

    it('should show loading state in buttons', () => {
      // Set resending state
      component.isResending.set(true);
      fixture.detectChanges();

      const resendButton = fixture.debugElement.query(By.css('button[loading="true"]'));
      expect(resendButton).toBeTruthy();

      // Reset and set checking state
      component.isResending.set(false);
      component.isChecking.set(true);
      fixture.detectChanges();

      const checkButton = fixture.debugElement.query(By.css('button[loading="true"]'));
      expect(checkButton).toBeTruthy();
    });
  });

  describe('Button States', () => {
    beforeEach(() => {
      emailSubject.next('test@example.com');
      fixture.detectChanges();
    });

    it('should disable resend button when resending', () => {
      component.isResending.set(true);
      fixture.detectChanges();

      const resendButton = fixture.debugElement.query(
        By.css('button[label="Resend Verification Email"]'),
      );
      expect(resendButton.nativeElement.disabled).toBe(true);
    });

    it('should disable check button when checking', () => {
      component.isChecking.set(true);
      fixture.detectChanges();

      const checkButton = fixture.debugElement.query(
        By.css('button[label="Check Verification Status"]'),
      );
      expect(checkButton.nativeElement.disabled).toBe(true);
    });

    it('should show correct button text during loading states', () => {
      component.isResending.set(true);
      fixture.detectChanges();

      const resendButton = fixture.debugElement.query(
        By.css('button[loadingIcon="pi pi-spin pi-spinner"]'),
      );
      expect(resendButton).toBeTruthy();

      component.isResending.set(false);
      component.isChecking.set(true);
      fixture.detectChanges();

      const checkButton = fixture.debugElement.query(
        By.css('button[loadingIcon="pi pi-spin pi-spinner"]'),
      );
      expect(checkButton).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      fixture.detectChanges();
      consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      // Restore console.error after each test
      consoleSpy.mockRestore();
    });

    it('should handle empty email gracefully', () => {
      emailSubject.next('');
      fixture.detectChanges();

      userServiceSpy.userControllerResendVerificationEmail.mockReturnValue(of({}));

      component.resendVerificationEmail();

      expect(userServiceSpy.userControllerResendVerificationEmail).toHaveBeenCalledWith({
        email: 'your email address',
      });
    });

    it('should handle undefined email gracefully', () => {
      emailSubject.next(undefined as any);
      fixture.detectChanges();

      expect(component.userEmail()).toBe('your email address');
    });

    it('should handle rapid state changes correctly', () => {
      // Simulate rapid state changes
      component.isResending.set(true);
      component.isChecking.set(true);
      fixture.detectChanges();

      component.isResending.set(false);
      component.isChecking.set(false);
      fixture.detectChanges();

      expect(component.isResending()).toBe(false);
      expect(component.isChecking()).toBe(false);
    });

    it('should handle network errors gracefully', () => {
      const networkError = { name: 'NetworkError', message: 'Network connection failed' };
      userServiceSpy.userControllerResendVerificationEmail.mockReturnValue(
        throwError(networkError),
      );

      component.resendVerificationEmail();

      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to send verification email. Please try again later.',
      });
    });
  });

  describe('Component Lifecycle', () => {
    it('should handle component destruction gracefully', () => {
      emailSubject.next('test@example.com');
      fixture.detectChanges();

      // Simulate component destruction
      fixture.destroy();

      // Should not throw errors
      expect(() => {
        emailSubject.next('new@example.com');
      }).not.toThrow();
    });

    it('should handle multiple initialization calls', () => {
      // Initialize multiple times
      fixture.detectChanges();
      fixture.detectChanges();
      fixture.detectChanges();

      expect(component).toBeTruthy();
      expect(storeSpy.select).toHaveBeenCalledWith(AuthState.getUserEmail);
    });
  });
});
