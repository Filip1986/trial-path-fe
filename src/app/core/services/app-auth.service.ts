import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, switchMap, map } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { CsrfTokenService } from './csrf-token.service';
import { SetUser } from '../store/auth.actions';
import { UserDetails } from '../store/auth.state';
import { SuspensionService } from './suspension.service';
import { PrivacyPolicyUserService } from './privacy-policy-user.service';
import { ToastManagerService } from './toast-manager.service';
import {LoginService} from '@back-end/services/LoginService';
import {LogoutService} from '@back-end/services/LogoutService';
import {TokenService} from '@back-end/services/TokenService';
import {UserService} from '@back-end/services/UserService';
import {SuccessLoginResponseDto} from '@back-end/models/SuccessLoginResponseDto';
import {CurrentUserDto} from '@back-end/models/CurrentUserDto';
import {TokenResponseDto} from '@back-end/models/TokenResponseDto';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly REFRESH_TOKEN_IDENTIFIER_KEY = 'refresh_token_identifier';

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store,
    private loginService: LoginService,
    private logoutService: LogoutService,
    private tokenService: TokenService,
    private csrfTokenService: CsrfTokenService,
    private userService: UserService,
    private suspensionService: SuspensionService,
    private privacyPolicyUserService: PrivacyPolicyUserService,
    private toastManager: ToastManagerService,
  ) {}

  private _currentUser: UserDetails | null = null;

  get currentUser(): UserDetails | null {
    return this._currentUser;
  }

  /**
   * Login user with username and password
   * @param username User's username or email
   * @param password User's password
   * @param rememberMe Whether to enable "remember me" functionality
   * @returns Observable with a login result
   */
  login(username: string, password: string, rememberMe = false): Observable<any> {
    return this.csrfTokenService.ensureToken().pipe(
      switchMap((): Observable<SuccessLoginResponseDto> => {
        return this.loginService
          .loginControllerLogin({
            username,
            password,
            rememberMe,
            _csrf: this.csrfTokenService.getToken() || undefined,
          })
          .pipe(
            tap((response: SuccessLoginResponseDto): void => {
              // Store tokens and CSRF token
              if (response.csrfToken) {
                this.csrfTokenService.storeToken(response.csrfToken);
              }

              if (response.refreshTokenIdentifier) {
                localStorage.setItem(
                  this.REFRESH_TOKEN_IDENTIFIER_KEY,
                  response.refreshTokenIdentifier,
                );
              }
            }),
            catchError((error: any): Observable<never> => {
              const errorMessage = error.error?.message || 'Login failed';
              return throwError((): Error => new Error(errorMessage));
            }),
          );
      }),
    );
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: string): boolean {
    if (!this._currentUser) return false;

    // Implement your role logic here
    return this._currentUser.role?.includes(role) || false;
  }

  /**
   * Check if user has a specific permission
   */
  hasPermission(permission: string): boolean {
    if (!this._currentUser) return false;

    // Implement your permission logic here
    // This could check user roles, permissions array, etc.
    return true;
  }

  /**
   * Fetch current user data and store it in the application state
   * @returns Observable with the user details or null if not authenticated
   */
  fetchAndStoreCurrentUser(): Observable<UserDetails | null> {
    return this.userService.userControllerGetCurrentUser().pipe(
      map((currentUser: CurrentUserDto): UserDetails => {
        console.log('Current user fetched successfully:', currentUser);

        // Map API response to your UserDetails interface
        const userDetails: UserDetails = {
          id: currentUser.id,
          username: currentUser.username,
          email: currentUser.email,
          role: currentUser.role,
          isEmailConfirmed: currentUser.isEmailConfirmed,
          isSuspended: currentUser.isSuspended,
          suspensionReason: currentUser.suspensionReason,
          needsPrivacyPolicyAcceptance: currentUser.needsPrivacyPolicyAcceptance,
          latestPrivacyPolicyVersion: currentUser.latestPrivacyPolicyVersion,
          privacyPolicyVersion: currentUser.privacyPolicyVersion,
        };

        // Store user in application state
        this.store.dispatch(new SetUser(userDetails));

        // Check for suspension and show dialog if needed
        if (currentUser.isSuspended) {
          this.suspensionService.showSuspensionNotification(currentUser.suspensionReason);
        }

        // Add automatic check for privacy policy acceptance if needed
        if (currentUser.needsPrivacyPolicyAcceptance) {
          this.privacyPolicyUserService.showPrivacyPolicyModal();
        }

        return userDetails;
      }),
      catchError((error: any): Observable<null> => {
        console.error('Failed to fetch current user', error);

        // Check if token expired or not authorized
        if (error.status === 401) {
          console.log('Authentication token expired or invalid');
          // Clear user from store and localStorage
          this.clearAuthState();

          // Display error message and redirect to log in
          this.toastManager.error({
            summary: 'Session Expired',
            detail: 'Your session has expired. Please log in again.',
          });

          void this.router.navigate(['/login']);
        } else {
          // For other errors, show a more general message
          this.toastManager.error({
            summary: 'Authentication Error',
            detail: 'Failed to retrieve user details. Please try again.',
          });
        }

        return of(null);
      }),
    );
  }

  /**
   * Logout the current user
   * @returns Observable with a logout result
   */
  logout(showToast: boolean = true): Observable<any> {
    return this.csrfTokenService.refreshToken().pipe(
      switchMap((newToken: string | null) => {
        return this.logoutService.logoutControllerLogout().pipe(
          tap(() => {
            this.clearAuthState();
            this.navigateToLogin(showToast);
          }),
          catchError((error: any) => {
            console.error('Logout error:', error);
            // Still clear local state and redirect
            this.clearAuthState();
            this.navigateToLogin(showToast);

            // Return success since we've cleared local state
            return of({ success: true, localOnly: true });
          }),
        );
      }),
    );
  }

  /**
   * Renew the access token using refresh token
   * @returns Observable with a token renewal result
   */
  renewToken(): Observable<any> {
    const tokenIdentifier: string | null = localStorage.getItem(this.REFRESH_TOKEN_IDENTIFIER_KEY);
    const csrfToken: string | null = this.csrfTokenService.getToken();

    if (!tokenIdentifier) {
      return throwError((): Error => new Error('No refresh token identifier available'));
    }

    return this.tokenService
      .tokenControllerRenewAccessToken({
        tokenIdentifier,
        _csrf: csrfToken || undefined,
      })
      .pipe(
        tap((response: TokenResponseDto): void => {
          if (response && response.csrfToken) {
            this.csrfTokenService.storeToken(response.csrfToken);
          }
        }),
        catchError((error: any): Observable<never> => {
          return throwError((): Error => new Error('Token renewal failed'));
        }),
      );
  }

  /**
   * Clear all authentication states
   */
  private clearAuthState(): void {
    // Clear tokens
    this.csrfTokenService.clearToken();
    localStorage.removeItem(this.REFRESH_TOKEN_IDENTIFIER_KEY);

    // Clear user from store
    this.store.dispatch(new SetUser(null));
  }

  /**
   * Navigate to login page with a success message
   */
  private navigateToLogin(showToast: boolean = true): void {
    if (showToast) {
      this.toastManager.success({
        summary: 'Logged Out',
        detail: 'You have been successfully logged out.',
      });
    }

    void this.router.navigate(['/login']);
  }
}
