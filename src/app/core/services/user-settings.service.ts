import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

export interface UserSettings {
  notifications?: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    notificationSound: boolean;
    notificationTiming: number;
    desktopAlerts: boolean;
    reminderEmails: boolean;
  };
  privacy?: {
    profileVisibility: string;
    activityTracking: boolean;
    dataSharingConsent: boolean;
    dataCollection: boolean;
    cookiesConsent: boolean;
  };
  accessibility?: {
    highContrast: boolean;
    fontSize: string;
    animationsReduced: boolean;
    screenReaderOptimized: boolean;
    keyboardNavigation: boolean;
  };
}

const DEFAULT_SETTINGS: UserSettings = {
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    notificationSound: true,
    notificationTiming: 0,
    desktopAlerts: true,
    reminderEmails: true,
  },
  privacy: {
    profileVisibility: 'public',
    activityTracking: true,
    dataSharingConsent: false,
    dataCollection: true,
    cookiesConsent: true,
  },
  accessibility: {
    highContrast: false,
    fontSize: 'medium',
    animationsReduced: false,
    screenReaderOptimized: false,
    keyboardNavigation: true,
  },
};

@Injectable({
  providedIn: 'root',
})
export class UserSettingsService {
  constructor(private messageService: MessageService) {}

  /**
   * Gets the user's settings from localStorage
   * @returns The user's settings, or default settings if none are found
   */
  getUserSettings(): UserSettings {
    try {
      const savedSettings = localStorage.getItem('user_settings');
      if (savedSettings) {
        return JSON.parse(savedSettings);
      }
      return DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error loading user settings:', error);
      return DEFAULT_SETTINGS;
    }
  }

  /**
   * Saves the user's settings to localStorage and simulates an API call
   * @param settings The settings to save
   * @returns An observable that completes when the settings are saved
   */
  saveUserSettings(settings: UserSettings): Observable<boolean> {
    try {
      // Save to localStorage
      localStorage.setItem('user_settings', JSON.stringify(settings));

      // Simulate API call with delay
      return of(true).pipe(
        delay(800), // Add a small delay to simulate network request
        map(() => {
          console.log('Settings saved successfully');
          return true;
        }),
        catchError((error) => {
          console.error('Error saving settings:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to save settings to server. Settings saved locally only.',
          });
          return of(false);
        }),
      );
    } catch (error) {
      console.error('Error saving user settings:', error);
      return of(false);
    }
  }
}
