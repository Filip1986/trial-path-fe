import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, tap, filter, take } from 'rxjs/operators';
import {TokenService} from '../../back-end/services/TokenService';
import {TokenResponseDto} from '../../back-end/models/TokenResponseDto';

/**
 * Service for managing CSRF tokens and applying them to HTTP requests
 */
@Injectable({
  providedIn: 'root',
})
export class CsrfTokenService {
  private csrfToken: string | null = null;
  private readonly CSRF_TOKEN_KEY = 'csrf_token';
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private tokenService: TokenService) {
    // Attempt to load token from localStorage on service initialization
    this.loadTokenFromStorage();
  }

  /**
   * Get the current CSRF token
   */
  getToken(): string | null {
    return this.csrfToken || localStorage.getItem(this.CSRF_TOKEN_KEY);
  }

  /**
   * Store a CSRF token both in-memory and localStorage
   */
  storeToken(token: string): void {
    if (!token) return;

    this.csrfToken = token;
    localStorage.setItem(this.CSRF_TOKEN_KEY, token);
  }

  /**
   * Clear the CSRF token
   */
  clearToken(): void {
    this.csrfToken = null;
    localStorage.removeItem(this.CSRF_TOKEN_KEY);
  }

  /**
   * Refresh the CSRF token with improved concurrency handling
   * @returns Observable with the new CSRF token
   */
  refreshToken(): Observable<string | null> {
    // If already refreshing, wait for the existing refresh to complete
    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
      );
    }

    // Start a new refresh
    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    return this.tokenService.tokenControllerGetCsrfToken().pipe(
      map((response: TokenResponseDto): string => {
        const token: string = response.csrfToken;

        // Validate token before storing
        if (token) {
          this.storeToken(token);
          this.refreshTokenSubject.next(token);
          return token;
        }

        throw new Error('Invalid CSRF token received');
      }),
      catchError((error) => {
        console.error('Failed to refresh CSRF token:', error);

        // Reset the refresh state
        this.isRefreshing = false;
        this.refreshTokenSubject.next(null);

        return throwError(() => error);
      }),
      tap({
        // Ensure refresh state is reset regardless of success or failure
        finalize: () => {
          this.isRefreshing = false;
        },
      }),
    );
  }

  /**
   * Ensure a CSRF token is available, refreshing it if needed
   * @returns Observable with the CSRF token
   */
  ensureToken(): Observable<string | null> {
    const currentToken = this.getToken();

    // If we have a token, return it
    if (currentToken) {
      return of(currentToken);
    }

    // If no token, refresh it
    return this.refreshToken().pipe(
      catchError((error) => {
        console.error('Failed to ensure token:', error);
        return of(null);
      }),
    );
  }

  /**
   * Add CSRF token to an HTTP request
   * @param request The original HTTP request
   * @returns A new request with the CSRF token added
   */
  addTokenToRequest(request: HttpRequest<any>): HttpRequest<any> {
    const token = this.getToken();

    if (!token) {
      return request.clone({ withCredentials: true });
    }

    // For mutation requests (POST, PUT, DELETE, PATCH), add token to body
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
      return this.addTokenToRequestBody(request, token);
    }

    // For GET requests, add token to headers
    if (request.method === 'GET') {
      return request.clone({
        headers: request.headers.set('X-CSRF-Token', token),
        withCredentials: true,
      });
    }

    // For other request types, just ensure credentials are included
    return request.clone({ withCredentials: true });
  }

  /**
   * Private method to load token from storage on service init
   */
  private loadTokenFromStorage(): void {
    const storedToken = localStorage.getItem(this.CSRF_TOKEN_KEY);
    if (storedToken) {
      this.csrfToken = storedToken;
    }
  }

  /**
   * Private method to add token to request body based on body type
   */
  private addTokenToRequestBody(request: HttpRequest<any>, token: string): HttpRequest<any> {
    // Handle FormData
    if (request.body instanceof FormData) {
      const formData = new FormData();
      request.body.forEach((value, key) => {
        formData.append(key, value);
      });
      formData.append('_csrf', token);
      return request.clone({ body: formData, withCredentials: true });
    }

    // Handle object body
    if (typeof request.body === 'object' && request.body !== null) {
      return request.clone({
        body: { ...request.body, _csrf: token },
        withCredentials: true,
      });
    }

    // Handle string body (JSON)
    if (typeof request.body === 'string') {
      try {
        const bodyObject = JSON.parse(request.body);
        bodyObject._csrf = token;
        return request.clone({
          body: JSON.stringify(bodyObject),
          withCredentials: true,
        });
      } catch (e) {
        // If parsing fails, just add credentials
        return request.clone({ withCredentials: true });
      }
    }

    // Handle empty body case
    if (!request.body) {
      return request.clone({
        body: { _csrf: token },
        withCredentials: true,
      });
    }

    // Default case
    return request.clone({ withCredentials: true });
  }
}
