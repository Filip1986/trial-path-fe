import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SuspensionService } from '../services/suspension.service';
import { CsrfTokenService } from '../services/csrf-token.service';
import { AuthService } from '../services/app-auth.service';
import { ToastManagerService } from '../services/toast-manager.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private csrfTokenService: CsrfTokenService,
    private authService: AuthService,
    private router: Router,
    private toastManager: ToastManagerService,
    private suspensionService: SuspensionService,
  ) {}

  /**
   * Intercepts HTTP requests to add CSRF token and handle errors
   * @param request The outgoing request
   * @param next The next handler
   * @returns An observable of the HTTP event stream
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add CSRF token to the request
    const modifiedRequest: HttpRequest<any> = this.csrfTokenService.addTokenToRequest(request);

    return next.handle(modifiedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle different errors
        if (error.status === 403 && error.error?.isSuspended) {
          return this.handleSuspension(error);
        }

        if (
          (error.status === 403 || error.status === 400) &&
          error.error?.code?.includes('CSRF_TOKEN_INVALID')
        ) {
          return this.refreshCsrfAndRetry(request, next);
        }

        if (error.status === 401) {
          return this.handleUnauthorized(request, next);
        }

        return throwError(() => error);
      }),
    );
  }

  /**
   * Handles different types of HTTP errors
   * @param error The HTTP error response
   * @param request The original request
   * @param next The next handler
   * @returns An observable of the HTTP event stream
   */
  private handleError(
    error: HttpErrorResponse,
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    // Handle account suspension error
    if (error.status === 403 && error.error?.isSuspended) {
      return this.handleSuspension(error);
    }

    // Handle CSRF token errors
    if (
      (error.status === 403 || error.status === 400) &&
      (error.error?.message?.includes('CSRF') || error.message?.includes('CSRF'))
    ) {
      return this.refreshCsrfAndRetry(request, next);
    }

    // Handle unauthorized error for JWT tokens
    if (error.status === 401) {
      return this.handleUnauthorized(request, next);
    }

    // Throw other errors
    return throwError(() => error);
  }

  /**
   * Refreshes CSRF token and retries the request
   * @param request The original request
   * @param next The next handler
   * @returns An observable of the HTTP event stream
   */
  private refreshCsrfAndRetry(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return this.csrfTokenService.refreshToken().pipe(
      switchMap((token: string | null): Observable<HttpEvent<any>> => {
        if (!token) {
          return this.handleTokenRefreshFailed();
        }
        // Add the new CSRF token to the request
        const updatedRequest: HttpRequest<any> = this.csrfTokenService.addTokenToRequest(request);
        return next.handle(updatedRequest);
      }),
      catchError((): Observable<never> => {
        return this.handleTokenRefreshFailed();
      }),
    );
  }

  /**
   * Handles unauthorized errors by trying to refresh the access token
   * @param request The original request
   * @param next The next handler
   * @returns An observable of the HTTP event stream
   */
  private handleUnauthorized(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.renewToken().pipe(
        switchMap((response): Observable<HttpEvent<any>> => {
          this.isRefreshing = false;

          // Store the new CSRF token if present
          if (response?.csrfToken) {
            this.csrfTokenService.storeToken(response.csrfToken);
          }

          this.refreshTokenSubject.next(true);

          // Add the refreshed token and retry
          const updatedRequest: HttpRequest<any> = this.csrfTokenService.addTokenToRequest(request);
          return next.handle(updatedRequest);
        }),
        catchError((err: any): Observable<never> => {
          this.isRefreshing = false;
          this.handleLogout();
          return throwError((): any => err);
        }),
        finalize((): void => {
          this.isRefreshing = false;
        }),
      );
    } else {
      // Wait for the token refresh to complete
      return this.refreshTokenSubject.pipe(
        filter((token: any): boolean => token !== null),
        take(1),
        switchMap((): Observable<HttpEvent<any>> => {
          const updatedRequest = this.csrfTokenService.addTokenToRequest(request);
          return next.handle(updatedRequest);
        }),
      );
    }
  }

  /**
   * Handles account suspension errors
   * @param error The HTTP error response
   * @returns An observable that throws an error
   */
  private handleSuspension(error: HttpErrorResponse): Observable<never> {
    this.suspensionService.showSuspensionNotification(
      error.error.reason || 'Your account has been suspended.',
    );
    this.handleLogout();
    return throwError((): HttpErrorResponse => error);
  }

  /**
   * Handles failed token refresh
   * @returns An observable that throws an error
   */
  private handleTokenRefreshFailed(): Observable<never> {
    this.toastManager.error({
      summary: 'Authentication Error',
      detail: 'Your session has expired. Please log in again.',
    });

    this.handleLogout();
    return throwError((): Error => new Error('Authentication token refresh failed'));
  }

  /**
   * Common logout handling
   */
  private handleLogout(): void {
    this.authService.logout(false).subscribe();
  }
}
