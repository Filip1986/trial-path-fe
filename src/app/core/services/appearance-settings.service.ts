import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { CsrfTokenService } from './csrf-token.service';
import { ToastManagerService } from './toast-manager.service';
import { switchMap } from 'rxjs/operators';
import {AppearanceService} from '@back-end/services/AppearanceService';
import {AppearanceSettingsDto} from '@back-end/models/AppearanceSettingsDto';

// Type definitions
export interface ThemeColor {
  name: string;
  value: string;
  variable: string;
}

export interface BackgroundColor {
  name: string;
  value: string;
  variable: string;
}

export interface BoxShadowOption {
  name: string;
  value: string;
  preview: string;
}

export interface FontOption {
  name: string;
  value: string;
  class: string;
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  primaryColor: string;
  selectedFont: string;
  isBordersRounded: boolean;
  selectedShadow: string;
  selectedBackground: string;
  isBoxedLayout: boolean;
  compactMode: boolean;
  language?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AppearanceSettingsService {
  // Available options
  public readonly themeColors: ThemeColor[] = [
    { name: 'Blue', value: '#3B82F6', variable: '--primary-color' },
    { name: 'Green', value: '#10B981', variable: '--primary-color' },
    { name: 'Purple', value: '#8B5CF6', variable: '--primary-color' },
    { name: 'Orange', value: '#F59E0B', variable: '--primary-color' },
    { name: 'Red', value: '#EF4444', variable: '--primary-color' },
    { name: 'Teal', value: '#14B8A6', variable: '--primary-color' },
  ];
  public readonly backgroundColors: BackgroundColor[] = [
    { name: 'Default Dark', value: '#141a21', variable: '--background-color' },
    { name: 'Navy', value: '#0f172a', variable: '--background-color' },
    { name: 'Charcoal', value: '#1e1e2e', variable: '--background-color' },
    { name: 'Slate', value: '#1e293b', variable: '--background-color' },
    { name: 'Midnight', value: '#111827', variable: '--background-color' },
    { name: 'Deep Purple', value: '#1e1b4b', variable: '--background-color' },
  ];
  public readonly boxShadows: BoxShadowOption[] = [
    { name: 'Flat', value: 'none', preview: 'shadow-none' },
    { name: 'Subtle', value: '0 2px 5px rgba(0, 0, 0, 0.05)', preview: 'shadow-sm' },
    { name: 'Regular', value: '0 2px 10px rgba(0, 0, 0, 0.1)', preview: 'shadow' },
    { name: 'Medium', value: '0 4px 15px rgba(0, 0, 0, 0.15)', preview: 'shadow-md' },
    {
      name: 'Large',
      value: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
      preview: 'shadow-lg',
    },
    {
      name: 'Extra Large',
      value:
        'rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset',
      preview: 'shadow-xl',
    },
    {
      name: 'Inner',
      value: 'rgba(0, 0, 0, 0.45) 0px 25px 20px -20px',
      preview: 'shadow-inner',
    },
    {
      name: 'Double',
      value: '0 5px 10px rgba(0, 0, 0, 0.1), 0 10px 30px rgba(0, 0, 0, 0.15)',
      preview: 'shadow-2xl',
    },
  ];
  public readonly fontOptions: FontOption[] = [
    { name: 'Default', value: 'default', class: '' },
    { name: 'Noto Serif', value: 'noto-serif', class: 'font-noto-serif' },
    { name: 'Bree Serif', value: 'bree-serif', class: 'font-bree-serif' },
  ];
  // Default settings
  private readonly defaultSettings: AppearanceSettings = {
    theme: 'system',
    primaryColor: '#3B82F6',
    selectedFont: 'default',
    isBordersRounded: true,
    selectedShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    selectedBackground: '#141a21',
    isBoxedLayout: false,
    compactMode: false,
    language: 'en',
  };
  // Current settings subject
  private settingsSubject = new BehaviorSubject<AppearanceSettings>(this.defaultSettings);
  settings$ = this.settingsSubject.asObservable();

  // Loading state
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  // Initialization flag
  private initialized = false;

  constructor(
    private apiAppearanceService: AppearanceService,
    private csrfTokenService: CsrfTokenService,
    private toastManager: ToastManagerService,
  ) {
    // Load settings on init
    this.loadSettings();
    this.initializeSettings();
  }

  /**
   * Load settings from API, falling back to localStorage if API fails
   * @returns Observable of the loaded settings
   */
  loadSettings(): Observable<AppearanceSettings> {
    if (this.initialized) {
      return this.settings$;
    }

    this.loadingSubject.next(true);

    // Try to get settings from API first
    return this.apiAppearanceService.appearanceControllerGetAppearanceSettings().pipe(
      map((apiSettings: AppearanceSettingsDto) => {
        // Map API settings to our format
        const settings: AppearanceSettings = {
          theme: apiSettings.theme as 'light' | 'dark' | 'system',
          primaryColor: apiSettings.primaryColor,
          selectedFont: apiSettings.selectedFont,
          isBordersRounded: apiSettings.isBordersRounded,
          selectedShadow: apiSettings.selectedShadow,
          selectedBackground:
            apiSettings.selectedBackground || this.defaultSettings.selectedBackground,
          isBoxedLayout: apiSettings.isBoxedLayout,
          compactMode: apiSettings.compactMode,
          language: 'en', // Default, could be extended in the future
        };

        // Apply settings to the DOM
        this.applySettings(settings);

        // Save to state and localStorage
        this.settingsSubject.next(settings);
        this.saveToLocalStorage(settings);

        this.initialized = true;
        this.loadingSubject.next(false);
        return settings;
      }),
      catchError((error) => {
        console.error('Failed to load appearance settings from API:', error);

        // Fallback to localStorage if API fails
        const localSettings = this.loadFromLocalStorage();
        this.settingsSubject.next(localSettings);
        this.applySettings(localSettings);
        this.initialized = true;
        this.loadingSubject.next(false);
        return of(localSettings);
      }),
    );
  }

  /**
   * Get current settings
   * @returns Current appearance settings
   */
  getCurrentSettings(): AppearanceSettings {
    return this.settingsSubject.getValue();
  }

  /**
   * Update settings locally (used by settings drawer)
   * Applies changes to DOM and saves to localStorage only
   * @param newSettings Partial settings to update
   */
  updateLocalSettings(newSettings: Partial<AppearanceSettings>): void {
    const currentSettings = this.settingsSubject.getValue();
    const updatedSettings = { ...currentSettings, ...newSettings };

    // Update state
    this.settingsSubject.next(updatedSettings);

    // Apply to DOM
    this.applySettings(updatedSettings);

    // Save to localStorage only
    this.saveToLocalStorage(updatedSettings);
  }

  /**
   * Update settings with persistence to API (used by appearance-settings component)
   * Applies changes to DOM, saves to localStorage, and prepares for API save
   * @param newSettings Partial settings to update
   */
  updateSettings(newSettings: Partial<AppearanceSettings>): void {
    const currentSettings = this.settingsSubject.getValue();
    const updatedSettings = { ...currentSettings, ...newSettings };

    // Update state and apply
    this.settingsSubject.next(updatedSettings);
    this.applySettings(updatedSettings);

    // Save to localStorage
    this.saveToLocalStorage(updatedSettings);
  }

  /**
   * Save current settings to the API
   * @returns Observable of save operation success/failure
   */
  saveToApi(): Observable<boolean> {
    const settings = this.settingsSubject.getValue();

    // Return an observable that completes when the API call is done
    return this.csrfTokenService.ensureToken().pipe(
      switchMap((token) => {
        if (!token) {
          console.error('No CSRF token available');
          return of(false);
        }

        // Map our settings to API format
        const apiSettings: AppearanceSettingsDto = {
          theme: settings.theme as AppearanceSettingsDto.theme,
          primaryColor: settings.primaryColor,
          selectedFont: settings.selectedFont as AppearanceSettingsDto.selectedFont,
          isBordersRounded: settings.isBordersRounded,
          selectedShadow: settings.selectedShadow,
          selectedBackground: settings.selectedBackground,
          isBoxedLayout: settings.isBoxedLayout,
          compactMode: settings.compactMode,
          _csrf: token,
        };

        // Send to API
        return this.apiAppearanceService
          .appearanceControllerSaveAppearanceSettings(apiSettings)
          .pipe(
            map(() => true),
            tap(() => {
              this.toastManager.success({
                summary: 'Settings Saved',
                detail: 'Appearance settings have been saved successfully.',
              });
            }),
            catchError((error) => {
              console.error('Failed to save appearance settings to API:', error);
              this.toastManager.error({
                summary: 'Settings Error',
                detail: 'Failed to save appearance settings to server. Changes saved locally only.',
              });
              return of(false);
            }),
          );
      }),
    );
  }

  /**
   * Reset settings to defaults
   * @param saveToApi Whether to also save reset settings to API
   */
  resetToDefaults(saveToApi: boolean = false): Observable<boolean> {
    this.settingsSubject.next({ ...this.defaultSettings });
    this.applySettings(this.defaultSettings);
    this.saveToLocalStorage(this.defaultSettings);

    if (saveToApi) {
      return this.saveToApi();
    }
    return of(true);
  }

  /**
   * Initialize settings on service creation
   * This ensures settings are loaded early in the app lifecycle
   */
  private initializeSettings(): void {
    // Check if user is authenticated before trying API
    const hasAuthToken = document.cookie.includes('accessToken');

    if (hasAuthToken) {
      // Try API first, fall back to localStorage
      this.loadSettings().subscribe({
        next: (settings) => console.log('Appearance settings initialized from API or localStorage'),
        error: (err) => console.error('Error initializing appearance settings:', err),
      });
    } else {
      // Use localStorage settings only (for unauthenticated users)
      const localSettings = this.loadFromLocalStorage();
      this.settingsSubject.next(localSettings);
      this.applySettings(localSettings);
      this.initialized = true;
    }
  }

  /**
   * Apply settings to the DOM
   * @param settings Settings to apply
   */
  private applySettings(settings: AppearanceSettings): void {
    // Apply primary color
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);

    // Apply font
    document.body.classList.remove('font-noto-serif', 'font-bree-serif');
    if (settings.selectedFont !== 'default') {
      document.body.classList.add(`font-${settings.selectedFont}`);
    }

    // Apply border radius
    const borderRadius = settings.isBordersRounded ? '6px' : '0px';
    const checkboxRadius = settings.isBordersRounded ? '4px' : '0px';
    const cardRadius = settings.isBordersRounded ? '8px' : '0px';
    document.documentElement.style.setProperty('--p-inputtext-border-radius', borderRadius);
    document.documentElement.style.setProperty('--p-checkbox-border-radius', checkboxRadius);
    document.documentElement.style.setProperty('--p-button-border-radius', borderRadius);
    document.documentElement.style.setProperty('--p-card-border-radius', cardRadius);
    document.documentElement.style.setProperty('--p-select-border-radius', borderRadius);

    // Apply shadows
    document.documentElement.style.setProperty('--p-card-shadow', settings.selectedShadow);
    document.documentElement.style.setProperty('--card-shadow', settings.selectedShadow);

    // Apply dark mode background color
    if (settings.theme === 'dark' && settings.selectedBackground) {
      document.documentElement.style.setProperty('--background-color', settings.selectedBackground);
    }

    // Apply container layout
    if (settings.isBoxedLayout) {
      document.body.classList.add('boxed-layout');
    } else {
      document.body.classList.remove('boxed-layout');
    }

    // Apply compact mode
    if (settings.compactMode) {
      document.body.classList.add('compact-mode');
    } else {
      document.body.classList.remove('compact-mode');
    }
  }

  /**
   * Save settings to API and localStorage
   * @param settings Settings to save
   */
  private saveSettings(settings: AppearanceSettings): void {
    // Save to localStorage as a fallback
    this.saveToLocalStorage(settings);

    // Get CSRF token and save to API
    this.csrfTokenService.ensureToken().subscribe((token) => {
      if (!token) {
        console.error('No CSRF token available');
        return;
      }

      // Map our settings to API format
      const apiSettings: AppearanceSettingsDto = {
        theme: settings.theme as AppearanceSettingsDto.theme,
        primaryColor: settings.primaryColor,
        selectedFont: settings.selectedFont as AppearanceSettingsDto.selectedFont,
        isBordersRounded: settings.isBordersRounded,
        selectedShadow: settings.selectedShadow,
        selectedBackground: settings.selectedBackground,
        isBoxedLayout: settings.isBoxedLayout,
        compactMode: settings.compactMode,
        _csrf: token,
      };

      // Send to API
      this.apiAppearanceService
        .appearanceControllerSaveAppearanceSettings(apiSettings)
        .pipe(
          catchError((error) => {
            console.error('Failed to save appearance settings to API:', error);
            this.toastManager.error({
              summary: 'Settings Error',
              detail:
                'Failed to save appearance settings to server. Changes will only be saved locally.',
            });
            return of(null);
          }),
        )
        .subscribe((result) => {
          if (result) {
            // Successfully saved to API
            console.log('Appearance settings saved to server');
          }
        });
    });
  }

  /**
   * Save settings to localStorage
   * @param settings Settings to save
   */
  private saveToLocalStorage(settings: AppearanceSettings): void {
    try {
      localStorage.setItem('appearance_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error);
    }
  }

  /**
   * Load settings from localStorage
   * @returns Loaded settings or defaults
   */
  private loadFromLocalStorage(): AppearanceSettings {
    try {
      const storedSettings = localStorage.getItem('appearance_settings');
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        return { ...this.defaultSettings, ...parsedSettings };
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error);
    }
    return { ...this.defaultSettings };
  }
}
