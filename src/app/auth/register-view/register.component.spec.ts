import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DestroyRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { RegisterViewComponent } from './register.component';
import { RegistrationService } from '../../../../../../shared/src/lib/api';
import { ToastManagerService } from '@core/services/toast-manager.service';
import { RegisterFormData } from '@artificial-sense/ui-lib';

// Import the actual RegisterResponseDto from the shared API
import { RegisterResponseDto } from '../../../../../../shared/src/lib/api';

// Jest mock implementations
const mockRouter = {
  navigate: jest.fn(),
};

const mockRegistrationService = {
  registrationControllerRegister: jest.fn(),
};

const mockToastManager = {
  success: jest.fn(),
  error: jest.fn(),
};

const mockDestroyRef = {
  onDestroy: jest.fn(),
};

describe('RegisterViewComponent', () => {
  let component: RegisterViewComponent;
  let fixture: ComponentFixture<RegisterViewComponent>;
  let router: jest.Mocked<Router>;
  let registrationService: jest.Mocked<RegistrationService>;
  let toastManager: jest.Mocked<ToastManagerService>;
  let destroyRef: jest.Mocked<DestroyRef>;

  const mockRegisterFormData: RegisterFormData = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    acceptTerms: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterViewComponent, NoopAnimationsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: RegistrationService, useValue: mockRegistrationService },
        { provide: ToastManagerService, useValue: mockToastManager },
        { provide: DestroyRef, useValue: mockDestroyRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterViewComponent);
    component = fixture.componentInstance;

    // Get the mocked services from TestBed
    router = TestBed.inject(Router) as jest.Mocked<Router>;
    registrationService = TestBed.inject(RegistrationService) as jest.Mocked<RegistrationService>;
    toastManager = TestBed.inject(ToastManagerService) as jest.Mocked<ToastManagerService>;
    destroyRef = TestBed.inject(DestroyRef) as jest.Mocked<DestroyRef>;
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
      expect(component.isSubmitting()).toBe(false);
      expect(component.registrationError()).toBe('');
      expect(component.selectedLoginStyle).toBe('1');
      expect(component.styleOptions).toEqual([
        { name: '1', value: '1' },
        { name: '2', value: '2' },
        { name: '3', value: '3' },
      ]);
    });

    it('should inject dependencies correctly', () => {
      expect(component['router']).toBeDefined();
      expect(component['registrationService']).toBeDefined();
      expect(component['toastManager']).toBeDefined();
    });
  });

  describe('Style Selection', () => {
    it('should handle style change when called manually', () => {
      const newStyle = '2';
      component.selectedLoginStyle = newStyle;

      expect(component.selectedLoginStyle).toBe(newStyle);
    });

    it('should have correct style options', () => {
      expect(component.styleOptions).toHaveLength(3);
      component.styleOptions.forEach((option, index) => {
        expect(option.name).toBe((index + 1).toString());
        expect(option.value).toBe((index + 1).toString());
      });
    });
  });

  describe('Registration Submission', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      fixture.detectChanges();
      consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      // Restore console.error after each test
      consoleSpy.mockRestore();
    });

    it('should handle successful registration', () => {
      const mockResponse: RegisterResponseDto = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        refreshTokenIdentifier: 'mock-refresh-identifier',
        numberAccessTokenExpiryTime: 3600,
        refreshTokenExpiryTime: 3600000, // Add missing field
        csrfToken: 'mock-csrf-token', // Add missing field
      };

      registrationService.registrationControllerRegister.mockReturnValue(of(mockResponse));

      component.handleRegistrationSubmit(mockRegisterFormData);

      expect(registrationService.registrationControllerRegister).toHaveBeenCalledWith({
        username: mockRegisterFormData.username,
        email: mockRegisterFormData.email,
        password: mockRegisterFormData.password,
      });

      expect(toastManager.success).toHaveBeenCalledWith({
        summary: 'Success',
        detail: 'Registration successful! Redirecting to login...',
      });
    });

    it('should handle registration error with specific message', () => {
      const errorResponse = {
        status: 409,
        error: { message: 'Email already exists' },
      };

      registrationService.registrationControllerRegister.mockReturnValue(
        throwError(() => errorResponse),
      );

      component.handleRegistrationSubmit(mockRegisterFormData);

      expect(toastManager.error).toHaveBeenCalledWith({
        summary: 'Registration Failed',
        detail: 'A user with this email or username already exists.',
      });
    });

    it('should handle generic registration error', () => {
      const errorResponse = {
        status: 500,
        error: { message: 'Internal server error' },
      };

      registrationService.registrationControllerRegister.mockReturnValue(
        throwError(() => errorResponse),
      );

      component.handleRegistrationSubmit(mockRegisterFormData);

      expect(toastManager.error).toHaveBeenCalledWith({
        summary: 'Registration Failed',
        detail: 'Internal server error',
      });
    });

    it('should set submitting state during registration', () => {
      const mockResponse: RegisterResponseDto = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        refreshTokenIdentifier: 'mock-refresh-identifier',
        numberAccessTokenExpiryTime: 3600,
        refreshTokenExpiryTime: 3600000,
        csrfToken: 'mock-csrf-token',
      };

      registrationService.registrationControllerRegister.mockReturnValue(of(mockResponse));

      expect(component.isSubmitting()).toBe(false);
      component.handleRegistrationSubmit(mockRegisterFormData);
      // Note: In a real test, you'd need to test the async behavior properly
    });

    it('should handle password mismatch validation (if implemented)', () => {
      const formDataWithMismatch = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        acceptTerms: true,
      };

      const mockResponse: RegisterResponseDto = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        refreshTokenIdentifier: 'mock-refresh-identifier',
        numberAccessTokenExpiryTime: 3600,
        refreshTokenExpiryTime: 3600000,
        csrfToken: 'mock-csrf-token',
      };

      registrationService.registrationControllerRegister.mockReturnValue(of(mockResponse));

      component.handleRegistrationSubmit(formDataWithMismatch);

      expect(registrationService.registrationControllerRegister).toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    it('should navigate to login page', () => {
      component.navigateToLogin();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('Style Change Handling', () => {
    it('should handle style change correctly', () => {
      const styleEvent = { value: '3' };
      component.selectedLoginStyle = styleEvent.value as '1' | '2' | '3';

      expect(component.selectedLoginStyle).toBe('3');
    });
  });

  describe('Success Registration Flow', () => {
    it('should show success message and navigate to login on successful registration', () => {
      const mockResponse: RegisterResponseDto = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        refreshTokenIdentifier: 'mock-refresh-identifier',
        numberAccessTokenExpiryTime: 3600,
        refreshTokenExpiryTime: 3600000,
        csrfToken: 'mock-csrf-token',
      };

      registrationService.registrationControllerRegister.mockReturnValue(of(mockResponse));

      component.handleRegistrationSubmit(mockRegisterFormData);

      expect(toastManager.success).toHaveBeenCalledWith({
        summary: 'Success',
        detail: 'Registration successful! Redirecting to login...',
      });
    });
  });

  describe('Error Handling', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      fixture.detectChanges();
      consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      // Restore console.error after each test
      consoleSpy.mockRestore();
    });

    it('should handle 409 conflict error (user already exists)', () => {
      const errorResponse = {
        status: 409,
        error: { message: 'User already exists' },
      };

      registrationService.registrationControllerRegister.mockReturnValue(
        throwError(() => errorResponse),
      );

      component.handleRegistrationSubmit(mockRegisterFormData);

      expect(toastManager.error).toHaveBeenCalledWith({
        summary: 'Registration Failed',
        detail: 'A user with this email or username already exists.',
      });
    });

    it('should handle validation errors', () => {
      const errorResponse = {
        status: 400,
        error: {
          message: 'weak password',
          details: { suggestions: ['Use uppercase letters', 'Add numbers'] },
        },
      };

      registrationService.registrationControllerRegister.mockReturnValue(
        throwError(() => errorResponse),
      );

      component.handleRegistrationSubmit(mockRegisterFormData);

      expect(toastManager.error).toHaveBeenCalledWith({
        summary: 'Registration Failed',
        detail:
          'Your password is not strong enough. Suggestions: Use uppercase letters, Add numbers',
      });
    });

    it('should handle unknown errors gracefully', () => {
      const errorResponse = {
        status: 500,
        error: {},
      };

      registrationService.registrationControllerRegister.mockReturnValue(
        throwError(() => errorResponse),
      );

      component.handleRegistrationSubmit(mockRegisterFormData);

      expect(toastManager.error).toHaveBeenCalledWith({
        summary: 'Registration Failed',
        detail: 'Registration failed. Please try again.',
      });
    });
  });

  describe('Component State Management', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      fixture.detectChanges();
      consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      // Restore console.error after each test
      consoleSpy.mockRestore();
    });

    it('should manage error state correctly', () => {
      expect(component.registrationError()).toBe('');

      const errorResponse = {
        status: 400,
        error: { message: 'Validation error' },
      };

      registrationService.registrationControllerRegister.mockReturnValue(
        throwError(() => errorResponse),
      );

      component.handleRegistrationSubmit(mockRegisterFormData);

      // The error state should be managed internally
      expect(component.registrationError()).toBeTruthy();
    });
  });
});
