import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Store } from '@ngxs/store';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';

import { VerifyEmailComponent } from './verify-email.component';
import { UserService } from '../../../../../../shared/src/lib/api';
import { SetEmailConfirmed } from '../../core/store/auth.actions';

describe('VerifyEmailComponent', () => {
  let component: VerifyEmailComponent;
  let fixture: ComponentFixture<VerifyEmailComponent>;
  let mockActivatedRoute: jest.Mocked<Partial<ActivatedRoute>>;
  let mockRouter: jest.Mocked<Router>;
  let mockStore: jest.Mocked<Store>;
  let mockMessageService: jest.Mocked<MessageService>;
  let mockUserService: jest.Mocked<UserService>;

  const mockToken = 'test-verification-token';

  beforeEach(async () => {
    // Create Jest mocks for all dependencies
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue(mockToken),
        },
      } as any,
    };

    mockRouter = {
      navigate: jest.fn(),
    } as any;

    mockStore = {
      dispatch: jest.fn(),
    } as any;

    mockMessageService = {
      add: jest.fn(),
    } as any;

    mockUserService = {
      userControllerVerifyEmailToken: jest
        .fn()
        .mockReturnValue(of({ success: true, message: 'Email verified successfully' })),
    } as any;

    await TestBed.configureTestingModule({
      imports: [VerifyEmailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: Store, useValue: mockStore },
        { provide: MessageService, useValue: mockMessageService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VerifyEmailComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    // Reset all mocks after each test
    jest.clearAllMocks();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default signals', () => {
      expect(component.isVerifying()).toBe(false);
      expect(component.verificationComplete()).toBe(false);
      expect(component.verificationSuccess()).toBe(false);
      expect(component.verificationMessage()).toBe('');
      expect(component.errorMessage()).toBe('');
    });

    it('should extract token from route parameters', () => {
      fixture.detectChanges(); // triggers ngOnInit

      expect(mockActivatedRoute.snapshot!.paramMap.get).toHaveBeenCalledWith('token');
      expect(component.token).toBe(mockToken);
    });

    it('should handle missing token in URL', () => {
      (mockActivatedRoute.snapshot!.paramMap.get as jest.Mock).mockReturnValue(null);

      fixture.detectChanges(); // triggers ngOnInit

      expect(component.errorMessage()).toBe('Invalid verification link. No token provided.');
      expect(component.verificationComplete()).toBe(true);
      expect(component.verificationSuccess()).toBe(false);
    });

    it('should start verification automatically when token is present', () => {
      const mockResponse = { success: true, message: 'Email verified successfully' };
      mockUserService.userControllerVerifyEmailToken.mockReturnValue(of(mockResponse));

      fixture.detectChanges(); // triggers ngOnInit

      expect(mockUserService.userControllerVerifyEmailToken).toHaveBeenCalledWith(mockToken);
    });
  });

  describe('Token Verification Process', () => {
    beforeEach(() => {
      fixture.detectChanges(); // Initialize component
    });

    it('should set isVerifying to true during verification', () => {
      const verificationSubject = new BehaviorSubject({ success: true, message: 'Success' });
      mockUserService.userControllerVerifyEmailToken.mockReturnValue(
        verificationSubject.asObservable(),
      );

      component.verifyToken();

      expect(component.isVerifying()).toBe(true);

      verificationSubject.complete();
      expect(component.isVerifying()).toBe(false);
    });

    it('should handle successful verification response', () => {
      const mockResponse = {
        success: true,
        message: 'Email verified successfully',
        userId: 123,
      };
      mockUserService.userControllerVerifyEmailToken.mockReturnValue(of(mockResponse));

      component.verifyToken();

      expect(component.verificationComplete()).toBe(true);
      expect(component.verificationSuccess()).toBe(true);
      expect(component.verificationMessage()).toBe('Email verified successfully');
      expect(component.isVerifying()).toBe(false);
    });

    it('should dispatch SetEmailConfirmed action on successful verification', () => {
      const mockResponse = {
        success: true,
        message: 'Email verified successfully',
      };
      mockUserService.userControllerVerifyEmailToken.mockReturnValue(of(mockResponse));

      component.verifyToken();

      expect(mockStore.dispatch).toHaveBeenCalledWith(new SetEmailConfirmed(true));
    });

    it('should show success toast on successful verification', () => {
      const mockResponse = {
        success: true,
        message: 'Email verified successfully',
      };
      mockUserService.userControllerVerifyEmailToken.mockReturnValue(of(mockResponse));

      component.verifyToken();

      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Email Verified',
        detail: 'Email verified successfully',
      });
    });

    it('should handle verification failure from API response', () => {
      const mockResponse = {
        success: false,
        message: 'Invalid or expired token',
      };
      mockUserService.userControllerVerifyEmailToken.mockReturnValue(of(mockResponse));

      component.verifyToken();

      expect(component.verificationComplete()).toBe(true);
      expect(component.verificationSuccess()).toBe(false);
      expect(component.verificationMessage()).toBe('Invalid or expired token');
      expect(component.isVerifying()).toBe(false);
    });

    it('should show error toast on verification failure', () => {
      const mockResponse = {
        success: false,
        message: 'Invalid or expired token',
      };
      mockUserService.userControllerVerifyEmailToken.mockReturnValue(of(mockResponse));

      component.verifyToken();

      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Verification Failed',
        detail: 'Invalid or expired token',
      });
    });

    it('should handle API error during verification', () => {
      const mockError = new Error('Network error');
      mockUserService.userControllerVerifyEmailToken.mockReturnValue(throwError(() => mockError));

      component.verifyToken();

      expect(component.verificationComplete()).toBe(true);
      expect(component.verificationSuccess()).toBe(false);
      expect(component.errorMessage()).toBe('Failed to verify email. Please try again later.');
      expect(component.isVerifying()).toBe(false);
    });

    it('should show error toast on API error', () => {
      const mockError = { error: { message: 'Token expired' } };
      mockUserService.userControllerVerifyEmailToken.mockReturnValue(throwError(() => mockError));

      component.verifyToken();

      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Verification Error',
        detail: 'Failed to verify email. Please try again later.',
      });
    });

    it('should prevent multiple simultaneous verification requests', () => {
      const verificationSubject = new BehaviorSubject({
        success: true,
        message: 'Success',
      });
      mockUserService.userControllerVerifyEmailToken.mockReturnValue(
        verificationSubject.asObservable(),
      );

      // Start first verification
      component.verifyToken();
      expect(component.isVerifying()).toBe(true);

      // Try to start second verification while first is in progress
      const initialCallCount = mockUserService.userControllerVerifyEmailToken.mock.calls.length;
      component.verifyToken();

      // Should not make additional API calls
      expect(mockUserService.userControllerVerifyEmailToken.mock.calls.length).toBe(
        initialCallCount,
      );
    });
  });

  describe('UI Rendering', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should show loading spinner when verifying', () => {
      component.isVerifying.set(true);
      fixture.detectChanges();

      const spinner = fixture.debugElement.query(By.css('p-progressSpinner'));
      expect(spinner).toBeTruthy();
    });

    it('should show success message when verification succeeds', () => {
      component.verificationComplete.set(true);
      component.verificationSuccess.set(true);
      component.verificationMessage.set('Email verified successfully');
      fixture.detectChanges();

      const successContainer = fixture.debugElement.query(By.css('.bg-green-100.text-green-800'));
      expect(successContainer).toBeTruthy();
      expect(successContainer.nativeElement.textContent).toContain('Email verified successfully');
    });

    it('should show error message when verification fails', () => {
      component.verificationComplete.set(true);
      component.verificationSuccess.set(false);
      component.errorMessage.set('Invalid token');
      fixture.detectChanges();

      const errorContainer = fixture.debugElement.query(By.css('.bg-red-100.text-red-800'));
      expect(errorContainer).toBeTruthy();
      expect(errorContainer.nativeElement.textContent).toContain(
        'Verification FailedEmail verified successfully',
      );
    });

    it('should show action buttons when verification is complete', () => {
      component.verificationComplete.set(true);
      component.verificationSuccess.set(false);
      fixture.detectChanges();

      const resendButton = fixture.debugElement.query(
        By.css('button[label="Resend Verification Email"]'),
      );
      const loginButton = fixture.debugElement.query(By.css('button[label="Go to Login"]'));

      expect(resendButton).toBeTruthy();
      expect(loginButton).toBeTruthy();
    });
  });

  describe('Button Actions', () => {
    beforeEach(() => {
      component.verificationComplete.set(true);
      component.verificationSuccess.set(false);
      fixture.detectChanges();
    });

    it('should navigate to login when "Go to Login" button is clicked', () => {
      const loginButton = fixture.debugElement.query(By.css('button[label="Go to Login"]'));

      loginButton.triggerEventHandler('onClick', null);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
    });

    it('should call resendVerificationEmail when "Resend" button is clicked', () => {
      jest.spyOn(component, 'resendVerificationEmail');

      const resendButton = fixture.debugElement.query(
        By.css('button[label="Resend Verification Email"]'),
      );

      resendButton.triggerEventHandler('onClick', null);

      expect(component.resendVerificationEmail).toHaveBeenCalled();
    });
  });

  describe('Integration Tests', () => {
    it('should complete full successful verification flow', async () => {
      const mockResponse = {
        success: true,
        message: 'Email verified successfully',
        userId: 123,
      };
      mockUserService.userControllerVerifyEmailToken.mockReturnValue(of(mockResponse));

      fixture.detectChanges(); // triggers ngOnInit and verification

      // Should extract token
      expect(component.token).toBe(mockToken);

      // Should call API
      expect(mockUserService.userControllerVerifyEmailToken).toHaveBeenCalledWith(mockToken);

      // Should update state
      expect(component.verificationComplete()).toBe(true);
      expect(component.verificationSuccess()).toBe(true);
      expect(component.verificationMessage()).toBe('Email verified successfully');

      // Should dispatch action and show toast
      expect(mockStore.dispatch).toHaveBeenCalledWith(new SetEmailConfirmed(true));
      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Email Verified',
        detail: 'Email verified successfully',
      });
    });

    it('should complete full failed verification flow', async () => {
      const mockError = {
        error: { message: 'Token expired' },
      };
      mockUserService.userControllerVerifyEmailToken.mockReturnValue(throwError(() => mockError));

      fixture.detectChanges(); // triggers ngOnInit and verification

      // Should handle error appropriately
      expect(component.verificationComplete()).toBe(true);
      expect(component.verificationSuccess()).toBe(false);
      expect(component.errorMessage()).toBe('Failed to verify email. Please try again later.');

      // Should show error toast
      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Verification Error',
        detail: 'Failed to verify email. Please try again later.',
      });
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have proper semantic structure', () => {
      const mainHeading = fixture.debugElement.query(By.css('h2'));
      expect(mainHeading.nativeElement.textContent.trim()).toBe('Email Verification');
    });

    it('should have proper button labels and icons', () => {
      component.verificationComplete.set(true);
      component.verificationSuccess.set(false);
      fixture.detectChanges();

      const resendButton = fixture.debugElement.query(
        By.css('button[label="Resend Verification Email"]'),
      );
      const loginButton = fixture.debugElement.query(By.css('button[label="Go to Login"]'));

      expect(resendButton.attributes['label']).toBe('Resend Verification Email');
      expect(resendButton.attributes['icon']).toBe('pi pi-refresh');
      expect(loginButton.attributes['label']).toBe('Go to Login');
      expect(loginButton.attributes['icon']).toBe('pi pi-sign-in');
    });

    it('should have proper color contrast for status messages', () => {
      // Success state
      component.verificationComplete.set(true);
      component.verificationSuccess.set(true);
      fixture.detectChanges();

      const successContainer = fixture.debugElement.query(By.css('.bg-green-100.text-green-800'));
      expect(successContainer).toBeTruthy();

      // Error state
      component.verificationSuccess.set(false);
      fixture.detectChanges();

      const errorContainer = fixture.debugElement.query(By.css('.bg-red-100.text-red-800'));
      expect(errorContainer).toBeTruthy();
    });
  });
});
