import { Component, DestroyRef, inject, signal, WritableSignal } from '@angular/core';

import { LoginComponent, LoginFeatures, LoginFormData } from '@artificial-sense/ui-lib';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { SelectButton } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { UserDetails } from '../../core/store/auth.state';
import { AuthService } from '../../core/services/app-auth.service';
import { ToastManagerService } from '../../core/services/toast-manager.service';
import { GdprConsentService } from '../../core/services/gdpr-consent.service';
import { AppearanceSettingsService } from '../../core/services/appearance-settings.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';

interface LoginStyleOption {
  name: string;
  value: '1' | '2' | '3';
}
interface LoginResponse {
  success: boolean;
  refreshTokenIdentifier?: string;
  message?: string;
}

@Component({
  selector: 'app-login-view',
  standalone: true,
  imports: [LoginComponent, SelectButton, FormsModule, ToastModule, TranslateModule],
  templateUrl: './login-view.component.html',
  styleUrl: './login-view.component.scss',
})
export class LoginViewComponent {
  // Login style selection
  styleOptions: LoginStyleOption[] = [
    { name: '1', value: '1' },
    { name: '2', value: '2' },
    { name: '3', value: '3' },
  ];

  selectedLoginStyle: '1' | '2' | '3' = '1';

  // Feature configuration
  loginFeatures: LoginFeatures = {
    showSocialLogin: true,
    showRememberMe: true,
    showForgotPassword: true,
    showRegisterLink: true,
  };

  // Loading state
  loading: WritableSignal<boolean> = signal(false);

  private readonly REGISTER_ROUTE = '/register';
  private readonly FORGOT_PASSWORD_ROUTE = '/forgot-password';

  private destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastManager: ToastManagerService,
    private gdprConsentService: GdprConsentService,
    private appearanceSettingsService: AppearanceSettingsService,
  ) {}

  /**
   * Handle login form submission
   * @param formData Login form data
   */
  handleLoginSubmit(formData: LoginFormData): void {
    if (this.loading()) return; // Prevent multiple submissions

    this.loading.set(true);

    // Call the auth service to perform login
    this.authService
      .login(formData.username, formData.password, formData.rememberMe)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error: HttpErrorResponse): Observable<null> => {
          console.error('Login error:', error);
          this.toastManager.error({
            summary: 'Login Failed',
            detail: error.message || 'Authentication failed. Please try again.',
          });
          return of(null);
        }),
        finalize((): void => {
          this.loading.set(false);
        }),
      )
      .subscribe((response: LoginResponse | null): void => {
        // If login was successful, proceed to fetch user data
        if (response) {
          this.handleLoginSuccess(response);
        }
      });
  }

  /**
   * Navigate to registration page
   */
  navigateToRegister(): void {
    void this.router.navigate([this.REGISTER_ROUTE]);
  }

  /**
   * Handle "Remember Me" preference change
   * @param event New remember me state
   */
  handleRememberMeChange(event: boolean): void {
    // Update localStorage with remember me preference
    localStorage.setItem('remember_me_preference', event ? 'true' : 'false');
    console.log('Remember me preference updated:', event);
  }

  /**
   * Handle forgot password request
   */
  handleForgotPassword(): void {
    void this.router.navigate([this.FORGOT_PASSWORD_ROUTE]);
  }

  /**
   * Handle login success by obtaining and verifying necessary authentication tokens
   * @param response Login response data
   */
  private handleLoginSuccess(response: {
    success: boolean;
    refreshTokenIdentifier?: string;
  }): void {
    console.log('Login success, received login response:', response);

    // Pass the login response to fetch user
    this.authService
      .fetchAndStoreCurrentUser()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error: any): Observable<null> => {
          console.error('Error during login process:', error);
          this.toastManager.error({
            summary: 'Login Error',
            detail: 'Could not complete login. Please try again.',
          });
          return of(null);
        }),
        // load appearance settings after successful login
        switchMap((user: UserDetails | null) => {
          if (user) {
            // Load user appearance settings
            return this.appearanceSettingsService.loadSettings().pipe(
              map((): UserDetails => user),
              catchError((error): Observable<UserDetails> => {
                console.error('Failed to load appearance settings after login:', error);
                return of(user); // Continue with user even if appearance settings fail
              }),
            );
          }
          return of(user);
        }),
      )
      .subscribe({
        next: (user: UserDetails | null): void => {
          if (!user) {
            console.log('No user data returned');
            return;
          }

          console.log('User data loaded successfully:', user);

          // Sync local GDPR consent with backend after successful login
          this.gdprConsentService.syncPreferencesAfterLogin();

          // Check if policy acceptance required
          if (!user.needsPrivacyPolicyAcceptance) {
            console.log('No policy acceptance needed, navigating to dashboard');
            this.navigateToDashboard(user);
          } else {
            console.log('Policy acceptance required, modal will be shown by service');
            // The privacyPolicyUserService will handle the modal and redirection
          }
        },
        error: (error: any): void => {
          console.error('Login subscription error:', error);
        },
      });
  }

  /**
   * Navigate to dashboard after successful login
   * @param user User details
   */
  private navigateToDashboard(user: UserDetails): void {
    console.log('Navigating to unified dashboard');

    // Now both admin and user go to the same dashboard route
    // The dashboard will show appropriate content based on user role
    const targetRoute = '/dashboard';

    void this.router
      .navigate([targetRoute], {
        state: { fromLogin: true, username: user.username },
      })
      .then((): void => {
        console.log('Navigation to dashboard completed');
      })
      .catch((error: any): void => {
        console.error('Navigation error:', error);
      });
  }
}
