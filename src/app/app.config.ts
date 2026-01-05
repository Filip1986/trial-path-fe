import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  isDevMode,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  withXsrfConfiguration,
} from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth-interceptor';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { AuthState } from './core/store/auth.state';
import { MessageService } from 'primeng/api';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { PrivacyPolicyUserService } from './core/services/privacy-policy-user.service';
import { DashboardState } from './core/store/dashboard-stats.state';
import { WebSocketService } from './core/services/websocket.service';
import { CsrfTokenService } from './core/services/csrf-token.service';
import { ToastManagerService } from './core/services/toast-manager.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LayoutState } from './core/store/layout.state';
import { GdprConsentService } from './core/services/gdpr-consent.service';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  AppearanceSettings,
  AppearanceSettingsService,
} from './core/services/appearance-settings.service';
import { StudiesState } from './core/store/studies/studies.state';
import { ParticipantsState } from './core/store/participants/participants.state';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Initializes the CSRF token during the application bootstrap process.
 *
 * This function checks if a token already exists in localStorage before
 * making a request, which helps reduce unnecessary API calls during startup.
 *
 * @param csrfTokenService - The service responsible for managing CSRF tokens.
 * @returns A function that returns an observable, which completes after
 *          ensuring a CSRF token is available.
 */
export function initializeCsrfToken(csrfTokenService: CsrfTokenService): () => Observable<any> {
  return (): Observable<string | null> => {
    return csrfTokenService.ensureToken().pipe(
      catchError((error: any): Observable<null> => {
        console.error('Failed to initialize CSRF token:', error);
        // Return an observable that completes so the app can still bootstrap
        return of(null);
      }),
    );
  };
}

export function initializeAppearanceSettings(
  appearanceService: AppearanceSettingsService,
): () => Observable<any> {
  return (): Observable<any> => {
    // For unauthenticated users, just load from localStorage
    const localSettings: AppearanceSettings = appearanceService.getCurrentSettings();

    // Return an observable that completes immediately
    return of(localSettings).pipe(
      catchError((error: any): Observable<any> => {
        console.error('Failed to initialize appearance settings:', error);
        return of(null);
      }),
    );
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    providePrimeNG({
      theme: {
        preset: Lara,
      },
    }),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    // Enhanced HTTP client configuration
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-CSRF-TOKEN',
      }),
      withInterceptorsFromDi(),
    ),
    importProvidersFrom(
      NgxsModule.forRoot([AuthState, DashboardState, LayoutState, StudiesState, ParticipantsState]),
      ...(isDevMode()
        ? [NgxsLoggerPluginModule.forRoot(), NgxsReduxDevtoolsPluginModule.forRoot()]
        : []),
      NgApexchartsModule,
      ...(isDevMode()
        ? [NgxsLoggerPluginModule.forRoot(), NgxsReduxDevtoolsPluginModule.forRoot()]
        : []),
      TranslateModule.forRoot(),
    ),
    AppearanceSettingsService,
    provideAppInitializer(() => {
      const appearanceService = inject(AppearanceSettingsService);
      return initializeAppearanceSettings(appearanceService)();
    }),
    // Register the HTTP interceptor for authentication
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    MessageService,
    ToastManagerService,
    PrivacyPolicyUserService,
    WebSocketService,
    GdprConsentService,
    provideAppInitializer(() => {
      const csrfTokenService = inject(CsrfTokenService);
      return initializeCsrfToken(csrfTokenService)();
    }),
  ],
};
