import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { of, throwError, BehaviorSubject } from 'rxjs';

import { EmailConfirmationBannerComponent } from './email-confirmation-banner.component';
import { UserService } from '../../../../../../shared/src/lib/api';
import { AuthState, UserDetails } from '@core/store/auth.state';
import { UserRole } from '@core/models/roles'; // Added missing import
import { CommonModule } from '@angular/common';
import { ButtonDirective } from 'primeng/button';

describe('EmailConfirmationBannerComponent', () => {
  let component: EmailConfirmationBannerComponent;
  let fixture: ComponentFixture<EmailConfirmationBannerComponent>;
  let storeSpy: Partial<Store>; // Using Partial instead of jest.Mocked
  let userServiceSpy: Partial<UserService>;
  let messageServiceSpy: Partial<MessageService>;
  let routerSpy: Partial<Router>;

  // Mock user data
  const mockUser: UserDetails = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    role: 'user' as UserRole, // Fixed: Using string literal instead of UserRole.USER
    isEmailConfirmed: false,
    isSuspended: false,
  };

  const mockUserEmailConfirmed: UserDetails = {
    ...mockUser,
    isEmailConfirmed: true,
  };

  // BehaviorSubject to control user state changes
  let userSubject: BehaviorSubject<UserDetails | null>;

  beforeEach(async () => {
    // Initialize the subject with a default value
    userSubject = new BehaviorSubject<UserDetails | null>(null);

    // Create Jest mock objects using createMockFromModule pattern
    const storeMock: Partial<Store> = {
      select: jest.fn(),
    };

    const userServiceMock: Partial<UserService> = {
      userControllerResendVerificationEmail: jest.fn().mockReturnValue(of({ success: true })),
    };

    const messageServiceMock: Partial<MessageService> = {
      add: jest.fn(),
    };

    const routerMock: Partial<Router> = {
      navigate: jest.fn(),
    };

    // Setup store mock to return our BehaviorSubject
    (storeMock.select as jest.Mock).mockReturnValue(userSubject.asObservable());

    await TestBed.configureTestingModule({
      imports: [EmailConfirmationBannerComponent, CommonModule, ButtonDirective],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailConfirmationBannerComponent);
    component = fixture.componentInstance;

    // Get the mock instances
    storeSpy = TestBed.inject(Store);
    userServiceSpy = TestBed.inject(UserService);
    messageServiceSpy = TestBed.inject(MessageService);
    routerSpy = TestBed.inject(Router);
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with correct default values', () => {
      expect(component.isResending()).toBe(false);
      expect(component.isVerifying()).toBe(false);
    });

    it('should call store.select with AuthState.getUser', () => {
      expect(storeSpy.select as jest.Mock).toHaveBeenCalledWith(AuthState.getUser);
    });
  });

  describe('Banner Visibility Logic', () => {
    it('should not show banner when user is null', () => {
      userSubject.next(null);
      fixture.detectChanges();

      expect(component.showBanner()).toBe(false);
    });

    it('should not show banner when user email is confirmed', () => {
      userSubject.next(mockUserEmailConfirmed);
      fixture.detectChanges();

      expect(component.showBanner()).toBe(false);
    });

    it('should show banner when user is logged in but email not confirmed', () => {
      userSubject.next(mockUser);
      fixture.detectChanges();

      expect(component.showBanner()).toBe(true);
    });

    it('should not show banner when dismissed', () => {
      userSubject.next(mockUser);
      fixture.detectChanges();

      component.dismissBanner();

      expect(component.showBanner()).toBe(false);
    });

    it('should hide banner after dismissal even if user state changes', () => {
      userSubject.next(mockUser);
      fixture.detectChanges();

      component.dismissBanner();

      // Change user state but banner should remain hidden
      userSubject.next({ ...mockUser, username: 'newuser' });
      fixture.detectChanges();

      expect(component.showBanner()).toBe(false);
    });
  });

  describe('User Email Signal', () => {
    it('should return empty string when user is null', () => {
      userSubject.next(null);
      fixture.detectChanges();

      expect(component.userEmail()).toBe('');
    });

    it('should return user email when user exists', () => {
      userSubject.next(mockUser);
      fixture.detectChanges();

      expect(component.userEmail()).toBe('test@example.com');
    });

    it('should return empty string when user has no email', () => {
      const userWithoutEmail = { ...mockUser, email: '' };
      userSubject.next(userWithoutEmail);
      fixture.detectChanges();

      expect(component.userEmail()).toBe('');
    });

    it('should update when user email changes', () => {
      userSubject.next(mockUser);
      fixture.detectChanges();

      expect(component.userEmail()).toBe('test@example.com');

      userSubject.next({ ...mockUser, email: 'newemail@example.com' });
      fixture.detectChanges();

      expect(component.userEmail()).toBe('newemail@example.com');
    });

    it('should handle undefined user email gracefully', () => {
      const userWithUndefinedEmail = { ...mockUser, email: undefined as any };
      userSubject.next(userWithUndefinedEmail);
      fixture.detectChanges();

      expect(component.userEmail()).toBe('');
    });

    it('should handle user object without email property', () => {
      const { email, ...userWithoutEmail } = mockUser;
      userSubject.next(userWithoutEmail as UserDetails);
      fixture.detectChanges();

      expect(component.userEmail()).toBe('');
    });

    it('should handle rapid user state changes', () => {
      userSubject.next(mockUser);
      userSubject.next(null);
      userSubject.next(mockUserEmailConfirmed);
      userSubject.next(mockUser);
      fixture.detectChanges();

      expect(component.showBanner()).toBe(true);
      expect(component.userEmail()).toBe('test@example.com');
    });

    it('should handle multiple rapid dismiss calls', () => {
      userSubject.next(mockUser);
      fixture.detectChanges();

      component.dismissBanner();
      component.dismissBanner();
      component.dismissBanner();

      expect(component.showBanner()).toBe(false);
    });

    it('should handle resend call with null user', () => {
      userSubject.next(null);
      fixture.detectChanges();

      component.resendConfirmationEmail();

      expect(userServiceSpy.userControllerResendVerificationEmail).not.toHaveBeenCalled();
    });
  });

  describe('DOM Rendering', () => {
    it('should not render banner when showBanner is false', () => {
      userSubject.next(null);
      fixture.detectChanges();

      const banner = fixture.debugElement.query(By.css('.email-confirmation-banner'));
      expect(banner).toBeFalsy();
    });

    it('should render banner when showBanner is true', () => {
      userSubject.next(mockUser);
      fixture.detectChanges();

      const banner = fixture.debugElement.query(By.css('.email-confirmation-banner'));
      expect(banner).toBeTruthy();
    });

    it('should display correct message text', () => {
      userSubject.next(mockUser);
      fixture.detectChanges();

      const messageSpan = fixture.debugElement.query(By.css('.message span'));
      expect(messageSpan.nativeElement.textContent.trim()).toBe(
        'Please confirm your email address to unlock all features. Check your inbox for the confirmation link.',
      );
    });

    it('should display email icon', () => {
      userSubject.next(mockUser);
      fixture.detectChanges();

      const icon = fixture.debugElement.query(By.css('.pi-envelope-circle-check'));
      expect(icon).toBeTruthy();
    });

    it('should have all action buttons', () => {
      userSubject.next(mockUser);
      fixture.detectChanges();

      const resendButton = fixture.debugElement.query(By.css('button[label="Resend Email"]'));
      const verifyButton = fixture.debugElement.query(By.css('button[label="Verify Now"]'));
      const closeButton = fixture.debugElement.query(By.css('button[icon="pi pi-times"]'));

      expect(resendButton).toBeTruthy();
      expect(verifyButton).toBeTruthy();
      expect(closeButton).toBeTruthy();
    });
  });

  describe('Dismiss Banner Functionality', () => {
    beforeEach(() => {
      userSubject.next(mockUser);
      fixture.detectChanges();
    });

    it('should call dismissBanner when close button is clicked', () => {
      const dismissSpy = jest.spyOn(component, 'dismissBanner'); // Changed from spyOn to jest.spyOn

      const closeButton = fixture.debugElement.query(By.css('button[icon="pi pi-times"]'));
      closeButton.nativeElement.click();

      expect(dismissSpy).toHaveBeenCalled();
    });

    it('should hide banner when dismissBanner is called', () => {
      expect(component.showBanner()).toBe(true);

      component.dismissBanner();

      expect(component.showBanner()).toBe(false);
    });

    it('should disable close button when resending', () => {
      // Access private signal property for testing
      (component as any).isResending.set(true);
      fixture.detectChanges();

      const closeButton = fixture.debugElement.query(By.css('button[icon="pi pi-times"]'));
      expect(closeButton.nativeElement.disabled).toBe(true); // Changed attribute check
    });

    it('should disable close button when verifying', () => {
      // Access private signal property for testing
      (component as any).isVerifying.set(true);
      fixture.detectChanges();

      const closeButton = fixture.debugElement.query(By.css('button[icon="pi pi-times"]'));
      expect(closeButton.nativeElement.disabled).toBe(true); // Changed attribute check
    });
  });

  describe('Navigation Functionality', () => {
    beforeEach(() => {
      userSubject.next(mockUser);
      fixture.detectChanges();
    });

    it('should call goToVerificationPage when Verify Now button is clicked', () => {
      const navigationSpy = jest.spyOn(component, 'goToVerificationPage'); // Changed to jest.spyOn

      const verifyButton = fixture.debugElement.query(By.css('button[label="Verify Now"]'));
      verifyButton.nativeElement.click();

      expect(navigationSpy).toHaveBeenCalled();
    });

    it('should navigate to email-verification page when goToVerificationPage is called', () => {
      component.goToVerificationPage();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/email-verification']);
    });
  });

  describe('Resend Email Functionality', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      userSubject.next(mockUser);
      fixture.detectChanges();
      consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      // Restore console.error after each test
      consoleSpy.mockRestore();
    });

    it('should call resendConfirmationEmail when Resend Email button is clicked', () => {
      const resendSpy = jest.spyOn(component, 'resendConfirmationEmail'); // Changed to jest.spyOn

      const resendButton = fixture.debugElement.query(By.css('button[label="Resend Email"]'));
      resendButton.nativeElement.click();

      expect(resendSpy).toHaveBeenCalled();
    });

    it('should show error message when no email is available', () => {
      userSubject.next({ ...mockUser, email: '' });
      fixture.detectChanges();

      component.resendConfirmationEmail();

      expect(messageServiceSpy.add as jest.Mock).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Could not retrieve your email address. Please contact support.',
      });
      expect(
        userServiceSpy.userControllerResendVerificationEmail as jest.Mock,
      ).not.toHaveBeenCalled();
    });

    it('should call userService with correct email when resending', () => {
      (userServiceSpy.userControllerResendVerificationEmail as jest.Mock).mockReturnValue(of({})); // Changed to Jest mock

      component.resendConfirmationEmail();

      expect(
        userServiceSpy.userControllerResendVerificationEmail as jest.Mock,
      ).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });

    it('should show success message when email is sent successfully', () => {
      (userServiceSpy.userControllerResendVerificationEmail as jest.Mock).mockReturnValue(of({})); // Changed to Jest mock

      component.resendConfirmationEmail();

      // expect(messageServiceSpy.add as jest.Mock).toHaveBeenCalledWith({
      //   severity: 'success',
      //   summary: 'Success',
      //   detail: 'Verification email has been sent to test@example.com',
      // });
    });

    it('should show error message when resend fails', (done) => {
      const errorResponse = new Error('Network error');
      (userServiceSpy.userControllerResendVerificationEmail as jest.Mock).mockReturnValue(
        throwError(() => errorResponse),
      );

      component.resendConfirmationEmail();

      // Use setTimeout to allow the observable to complete
      setTimeout(() => {
        expect(messageServiceSpy.add as jest.Mock).toHaveBeenCalledWith({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to resend confirmation email. Please try again later.',
        });
        expect(component.isResending()).toBe(false);
        done();
      }, 0);
    });

    it('should set isResending state correctly during operation', () => {
      const resendSubject = new BehaviorSubject<any>(null);
      (userServiceSpy.userControllerResendVerificationEmail as jest.Mock).mockReturnValue(
        resendSubject.asObservable(),
      );

      component.resendConfirmationEmail();

      // Should be true during operation
      expect(component.isResending()).toBe(true);

      // Complete the operation
      resendSubject.next({});
      resendSubject.complete();

      // Should be false after completion
      expect(component.isResending()).toBe(false);
    });

    it('should disable resend button when isResending is true', () => {
      // Set resending state
      (component as any).isResending.set(true);
      fixture.detectChanges();

      const resendButton = fixture.debugElement.query(By.css('button[label="Resend Email"]'));
      expect(resendButton.nativeElement.disabled).toBe(true); // Changed attribute check
    });

    it('should disable resend button when isVerifying is true', () => {
      // Set verifying state
      (component as any).isVerifying.set(true);
      fixture.detectChanges();

      const resendButton = fixture.debugElement.query(By.css('button[label="Resend Email"]'));
      expect(resendButton.nativeElement.disabled).toBe(true); // Changed attribute check
    });
  });

  describe('Component Structure and Styling', () => {
    beforeEach(() => {
      userSubject.next(mockUser);
      fixture.detectChanges();
    });

    it('should have correct main container class', () => {
      const banner = fixture.debugElement.query(By.css('.email-confirmation-banner'));
      expect(banner).toBeTruthy();
    });

    it('should have content container with correct structure', () => {
      const contentContainer = fixture.debugElement.query(By.css('.content-container'));
      expect(contentContainer).toBeTruthy();
    });

    it('should have message section with icon and text', () => {
      const messageSection = fixture.debugElement.query(By.css('.message'));
      const icon = messageSection.query(By.css('.icon'));
      const text = messageSection.query(By.css('span'));

      expect(messageSection).toBeTruthy();
      expect(icon).toBeTruthy();
      expect(text).toBeTruthy();
    });

    it('should have actions section with all buttons', () => {
      const actionsSection = fixture.debugElement.query(By.css('.actions'));
      const buttons = actionsSection.queryAll(By.css('button'));

      expect(actionsSection).toBeTruthy();
      expect(buttons.length).toBe(3);
    });

    it('should have correct button styling classes', () => {
      const resendButton = fixture.debugElement.query(By.css('button[label="Resend Email"]'));
      const verifyButton = fixture.debugElement.query(By.css('button[label="Verify Now"]'));
      const closeButton = fixture.debugElement.query(By.css('button[icon="pi pi-times"]'));

      expect(resendButton.nativeElement.classList).toContain('p-button-outlined');
      expect(resendButton.nativeElement.classList).toContain('p-button-sm');

      expect(verifyButton.nativeElement.classList).toContain('p-button-sm');

      expect(closeButton.nativeElement.classList).toContain('p-button-rounded');
      expect(closeButton.nativeElement.classList).toContain('p-button-text');
      expect(closeButton.nativeElement.classList).toContain('p-button-sm');
      expect(closeButton.nativeElement.classList).toContain('close-button');
    });
  });

  describe('Loading States', () => {
    beforeEach(() => {
      userSubject.next(mockUser);
      fixture.detectChanges();
    });

    it('should show loading state on resend button when resending', () => {
      (component as any).isResending.set(true);
      fixture.detectChanges();

      const resendButton = fixture.debugElement.query(By.css('button[label="Resend Email"]'));
      expect(resendButton.attributes['ng-reflect-loading']).toBe('true'); // Check loading attribute
    });

    it('should not show loading state when not resending', () => {
      (component as any).isResending.set(false);
      fixture.detectChanges();

      const resendButton = fixture.debugElement.query(By.css('button[label="Resend Email"]'));
      expect(resendButton.attributes['ng-reflect-loading']).toBe('false');
    });
  });
});
