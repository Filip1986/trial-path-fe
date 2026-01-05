import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { GdprConsentPreferences } from '../models/consent.models';
import { catchError, map, tap } from 'rxjs/operators';
import { ToastManagerService } from './toast-manager.service';
import { Store } from '@ngxs/store';
import { AuthState } from '../store/auth.state';
import {GdprService} from '../../../back-end/services/GdprService';
import {GdprConsentDto} from '../../../back-end/models/GdprConsentDto';
import {GdprConsentResponseDto} from '../../../back-end/models/GdprConsentResponseDto';
import {GdprConsentStatusDto} from '../../../back-end/models/GdprConsentStatusDto';

@Injectable({
  providedIn: 'root',
})
export class GdprConsentService {
  private readonly CONSENT_KEY = 'gdpr_consent_preferences';
  private readonly CONSENT_VERSION = '1.0.0'; // Update when consent policy changes

  private consentRequiredSubject = new BehaviorSubject<boolean>(false);
  consentRequired$ = this.consentRequiredSubject.asObservable();

  private showBannerSubject = new BehaviorSubject<boolean>(false);
  showBanner$ = this.showBannerSubject.asObservable();

  private preferencesSubject = new BehaviorSubject<GdprConsentPreferences>({
    necessary: true, // Necessary cookies are always required
    analytics: false,
    marketing: false,
    preferences: false,
    thirdParty: false,
  });
  preferences$ = this.preferencesSubject.asObservable();

  constructor(
    private gdprService: GdprService,
    private toastManager: ToastManagerService,
    private store: Store,
  ) {
    // Initialize with a smarter approach that checks auth status first
    this.initializeConsent();
  }

  /**
   * Checks if user has already provided consent or needs to see the banner
   * This is the main public method for checking consent status
   */
  checkConsentStatus(): void {
    // First check if user is authenticated
    const isAuthenticated = this.store.selectSnapshot(AuthState.isAuthenticated);

    if (isAuthenticated) {
      // User is authenticated, check backend with localStorage fallback
      this.checkConsentStatusFromBackend();
    } else {
      // User is not authenticated, only use localStorage
      this.checkConsentStatusFromLocalStorage();
    }
  }

  /**
   * Save the user's GDPR consent preferences
   * @param preferences The consent preferences to save
   * @returns Observable with success status
   */
  savePreferences(preferences: Partial<GdprConsentPreferences>): Observable<boolean> {
    // Ensure necessary cookies are always enabled
    const completePreferences: GdprConsentPreferences = {
      ...this.preferencesSubject.value,
      ...preferences,
      necessary: true,
      acceptedAt: new Date(),
      version: this.CONSENT_VERSION,
    };

    // Save to local storage immediately
    localStorage.setItem(this.CONSENT_KEY, JSON.stringify(completePreferences));

    // Update subjects immediately for frontend UI
    this.preferencesSubject.next(completePreferences);
    this.consentRequiredSubject.next(false);
    this.showBannerSubject.next(false);

    // Apply the actual cookie settings based on preferences
    this.applyPreferences(completePreferences);

    // Check if user is authenticated before trying to save to backend
    const isAuthenticated = this.store.selectSnapshot(AuthState.isAuthenticated);
    if (!isAuthenticated) {
      // Return success immediately for unauthenticated users
      console.log('User not authenticated, saving consent preferences locally only');
      return of(true);
    }

    // For authenticated users, try to save to backend
    const backendRequest: GdprConsentDto = {
      necessaryCookies: completePreferences.necessary,
      analyticsCookies: completePreferences.analytics,
      marketingCookies: completePreferences.marketing,
      preferencesCookies: completePreferences.preferences,
      thirdPartyCookies: completePreferences.thirdParty,
      consentVersion: this.CONSENT_VERSION,
    };

    return this.gdprService.gdprControllerSaveConsent(backendRequest).pipe(
      map(() => true), // Success case
      tap(() => {
        this.toastManager.success({
          summary: 'Consent Saved',
          detail: 'Your consent preferences have been updated.',
        });
      }),
      catchError((error) => {
        console.error('Error saving consent to backend:', error);
        // Return true as a fallback since we saved to localStorage
        return of(true);
      }),
    );
  }

  /**
   * Accept all consent options
   * @returns Observable with success status
   */
  acceptAll(): Observable<boolean> {
    return this.savePreferences({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
      thirdParty: true,
    });
  }

  /**
   * Accept only necessary cookies
   * @returns Observable with success status
   */
  acceptNecessaryOnly(): Observable<boolean> {
    return this.savePreferences({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
      thirdParty: false,
    });
  }

  /**
   * Show the consent banner (for use in settings/preferences pages)
   */
  showConsentBanner(): void {
    this.showBannerSubject.next(true);
  }

  /**
   * Hide the consent banner
   */
  hideConsentBanner(): void {
    this.showBannerSubject.next(false);
  }

  /**
   * Clear consent and show the banner again
   * Also withdraws consent on the backend if authenticated
   * @returns Observable with success status
   */
  clearConsent(): Observable<boolean> {
    // Clear local state
    localStorage.removeItem(this.CONSENT_KEY);
    this.preferencesSubject.next({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
      thirdParty: false,
    });
    this.consentRequiredSubject.next(true);
    this.showBannerSubject.next(true);

    // Check if user is authenticated before making backend calls
    const isAuthenticated = this.store.selectSnapshot(AuthState.isAuthenticated);
    if (!isAuthenticated) {
      // Return success immediately for unauthenticated users
      return of(true);
    }

    // For authenticated users, try to withdraw consent on backend
    return this.gdprService.gdprControllerWithdrawConsent().pipe(
      map(() => true), // Success case
      tap(() => {
        this.toastManager.success({
          summary: 'Consent Withdrawn',
          detail: 'Your consent preferences have been reset.',
        });
      }),
      catchError((error) => {
        console.error('Error withdrawing consent from backend:', error);
        // Return true since localStorage was cleared
        return of(true);
      }),
    );
  }

  /**
   * Checks if a specific consent type is granted
   * @param type The type of consent to check
   * @returns Boolean indicating if consent is granted
   */
  hasConsent(type: keyof GdprConsentPreferences): boolean {
    if (type === 'necessary') {
      return true; // Necessary cookies always have consent
    }

    const value = this.preferencesSubject.value[type];
    return value === true;
  }

  /**
   * Get current consent preferences
   * @returns The current consent preferences
   */
  getCurrentPreferences(): GdprConsentPreferences {
    return this.preferencesSubject.value;
  }

  /**
   * Sync local preferences with backend after login
   * Should be called after successful authentication
   */
  syncPreferencesAfterLogin(): void {
    const localPreferences = this.getSavedPreferences();
    if (localPreferences) {
      // We have local preferences to sync
      this.syncWithBackend(localPreferences);
    } else {
      // No local preferences, try to fetch from backend
      this.getConsentFromBackend();
    }
  }

  /**
   * Initialize the consent system based on authentication status
   * This prevents unnecessary API calls when user is not authenticated
   */
  private initializeConsent(): void {
    // First check if user is authenticated
    const isAuthenticated = this.store.selectSnapshot(AuthState.isAuthenticated);

    if (isAuthenticated) {
      // User is authenticated, try backend first
      this.checkConsentStatusFromBackend();
    } else {
      // User is not authenticated, use localStorage only
      this.checkConsentStatusFromLocalStorage();
    }
  }

  /**
   * Retrieve consent preferences from backend
   * Only use this when user is authenticated
   */
  private getConsentFromBackend(): void {
    this.gdprService
      .gdprControllerGetUserConsent()
      .pipe(
        catchError((error) => {
          console.error('Error fetching consent from backend:', error);
          // Fall back to local storage
          return of(null);
        }),
      )
      .subscribe((response: GdprConsentResponseDto | null) => {
        if (response) {
          // Map backend model to frontend model
          const preferences: GdprConsentPreferences = {
            necessary: response.necessaryCookies,
            analytics: response.analyticsCookies,
            marketing: response.marketingCookies,
            preferences: response.preferencesCookies,
            thirdParty: response.thirdPartyCookies,
            acceptedAt: new Date(response.consentTimestamp),
            version: response.consentVersion,
          };

          // Update state
          this.preferencesSubject.next(preferences);

          // Also update localStorage for consistency
          localStorage.setItem(this.CONSENT_KEY, JSON.stringify(preferences));

          // Apply preferences
          this.applyPreferences(preferences);

          // Update banner visibility
          this.consentRequiredSubject.next(false);
          this.showBannerSubject.next(false);
        } else {
          // If backend fetch fails, try to load from localStorage
          const savedPreferences = this.getSavedPreferences();
          if (savedPreferences) {
            this.preferencesSubject.next(savedPreferences);
            this.consentRequiredSubject.next(false);
            this.showBannerSubject.next(false);
          } else {
            // No saved preferences, show banner
            this.consentRequiredSubject.next(true);
            this.showBannerSubject.next(true);
          }
        }
      });
  }

  /**
   * Retrieve saved preferences from local storage
   * @returns Saved preferences or null if none found or invalid
   */
  private getSavedPreferences(): GdprConsentPreferences | null {
    const savedPreferences = localStorage.getItem(this.CONSENT_KEY);

    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences) as GdprConsentPreferences;
        return preferences;
      } catch (e) {
        console.error('Error parsing saved GDPR consent preferences', e);
        return null;
      }
    }

    return null;
  }

  /**
   * Apply the user's preferences to actual cookies and tracking services
   * @param preferences The preferences to apply
   */
  private applyPreferences(preferences: GdprConsentPreferences): void {
    // Set a cookie indicating consent has been given
    document.cookie = `gdpr_consent=granted; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;

    // Apply preferences to analytics services
    if (preferences.analytics) {
      this.enableAnalytics();
    } else {
      this.disableAnalytics();
    }

    // Apply preferences to marketing cookies
    if (preferences.marketing) {
      this.enableMarketingCookies();
    } else {
      this.disableMarketingCookies();
    }

    // Apply preferences to preference cookies
    if (preferences.preferences) {
      this.enablePreferenceCookies();
    } else {
      this.disablePreferenceCookies();
    }

    // Apply preferences to third-party cookies
    if (preferences.thirdParty) {
      this.enableThirdPartyCookies();
    } else {
      this.disableThirdPartyCookies();
    }
  }

  /**
   * Checks consent status from backend for authenticated users
   */
  private checkConsentStatusFromBackend(): void {
    this.gdprService
      .gdprControllerCheckConsentStatus()
      .pipe(
        catchError((error) => {
          console.error('Error checking consent status from backend:', error);
          // Check if this is an authentication error
          if (error.status === 401) {
            // Fall back to local storage for unauthorized users
            this.checkConsentStatusFromLocalStorage();
          }
          return of(null);
        }),
      )
      .subscribe((status: GdprConsentStatusDto | null) => {
        if (status) {
          if (status.hasConsent && !status.needsUpdate) {
            // User has valid consent, retrieve their preferences
            this.getConsentFromBackend();
          } else {
            // User needs to provide or update consent
            this.consentRequiredSubject.next(true);
            this.showBannerSubject.next(true);
          }
        }
      });
  }

  /**
   * Checks consent status from local storage
   * Used for non-authenticated users or as fallback
   */
  private checkConsentStatusFromLocalStorage(): void {
    const savedPreferences = this.getSavedPreferences();

    if (savedPreferences && savedPreferences.version === this.CONSENT_VERSION) {
      // User has valid local consent
      this.preferencesSubject.next(savedPreferences);
      this.consentRequiredSubject.next(false);
      this.showBannerSubject.next(false);
      // Apply preferences
      this.applyPreferences(savedPreferences);
    } else {
      // User needs to provide or update consent
      this.consentRequiredSubject.next(true);
      this.showBannerSubject.next(true);
    }
  }

  /**
   * Sync local preferences with backend
   * @param localPreferences The locally stored preferences to sync
   */
  private syncWithBackend(localPreferences: GdprConsentPreferences): void {
    // Check if user is authenticated
    const isAuthenticated = this.store.selectSnapshot(AuthState.isAuthenticated);
    if (!isAuthenticated) {
      return; // Don't try to sync if not authenticated
    }

    const backendRequest: GdprConsentDto = {
      necessaryCookies: localPreferences.necessary,
      analyticsCookies: localPreferences.analytics,
      marketingCookies: localPreferences.marketing,
      preferencesCookies: localPreferences.preferences,
      thirdPartyCookies: localPreferences.thirdParty,
      consentVersion: localPreferences.version || this.CONSENT_VERSION,
    };

    this.gdprService
      .gdprControllerSaveConsent(backendRequest)
      .pipe(
        catchError((error) => {
          console.error('Failed to sync local consent with backend:', error);
          return of(null);
        }),
      )
      .subscribe();
  }

  // Implementation of cookie management methods below
  // These don't need to change but I'm including them for completeness

  /**
   * Enable analytics tracking
   */
  private enableAnalytics(): void {
    // In a real application, you would initialize your analytics service here
    console.log('Analytics enabled');
  }

  /**
   * Disable analytics tracking
   */
  private disableAnalytics(): void {
    // In a real application, you would disable your analytics service here
    console.log('Analytics disabled');
  }

  /**
   * Enable marketing cookies
   */
  private enableMarketingCookies(): void {
    // Enable marketing/advertising cookies
    console.log('Marketing cookies enabled');
  }

  /**
   * Disable marketing cookies
   */
  private disableMarketingCookies(): void {
    // Disable marketing/advertising cookies
    console.log('Marketing cookies disabled');
  }

  /**
   * Enable preference cookies
   */
  private enablePreferenceCookies(): void {
    // Enable preference/functional cookies
    console.log('Preference cookies enabled');
  }

  /**
   * Disable preference cookies
   */
  private disablePreferenceCookies(): void {
    // Disable preference/functional cookies
    console.log('Preference cookies disabled');
  }

  /**
   * Enable third-party cookies
   */
  private enableThirdPartyCookies(): void {
    // Enable third-party cookies/services
    console.log('Third-party cookies enabled');
  }

  /**
   * Disable third-party cookies
   */
  private disableThirdPartyCookies(): void {
    // Disable third-party cookies/services
    console.log('Third-party cookies disabled');
  }
}
