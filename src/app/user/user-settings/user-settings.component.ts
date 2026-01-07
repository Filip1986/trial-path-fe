import { Component, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SliderModule } from 'primeng/slider';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserSettingsService } from '@core/services/user-settings.service';
import { AuthState, UserDetails } from '@core/store/auth.state';
import { AppearanceSettingsComponent } from './appearance-settings/appearance-settings.component';

interface NotificationTiming {
  name: string;
  value: number;
}

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TabsModule,
    CardModule,
    ToggleSwitchModule,
    SelectModule,
    ButtonModule,
    ToastModule,
    RadioButtonModule,
    SliderModule,
    RippleModule,
    DividerModule,
    InputTextModule,
    SelectButtonModule,
    ColorPickerModule,
    AppearanceSettingsComponent,
  ],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss',
})
export class UserSettingsComponent implements OnInit {
  @ViewChild(AppearanceSettingsComponent)
  appearanceSettingsComponent!: AppearanceSettingsComponent;

  // User information
  user: UserDetails | null = null;

  // Form groups for different setting sections
  notificationSettings: FormGroup;
  privacySettings: FormGroup;
  accessibilitySettings: FormGroup;

  // Options for selects/dropdowns
  notificationTimingOptions: NotificationTiming[] = [
    { name: 'Immediately', value: 0 },
    { name: 'Hourly', value: 1 },
    { name: 'Daily', value: 24 },
    { name: 'Weekly', value: 168 },
  ];

  fontSizeOptions = [
    { name: 'Small', value: 'small' },
    { name: 'Medium', value: 'medium' },
    { name: 'Large', value: 'large' },
  ];

  // Submit status
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private settingsService: UserSettingsService,
    private messageService: MessageService,
  ) {
    // Initialize form groups (removed appearanceSettings as it's now handled by AppearanceSettingsComponent)
    this.notificationSettings = this.fb.group({
      emailNotifications: [true],
      pushNotifications: [true],
      notificationSound: [true],
      notificationTiming: [0],
      desktopAlerts: [true],
      reminderEmails: [true],
    });

    this.privacySettings = this.fb.group({
      profileVisibility: ['public'],
      activityTracking: [true],
      dataSharingConsent: [false],
      dataCollection: [true],
      cookiesConsent: [true],
    });

    this.accessibilitySettings = this.fb.group({
      highContrast: [false],
      fontSize: ['medium'],
      animationsReduced: [false],
      screenReaderOptimized: [false],
      keyboardNavigation: [true],
    });
  }

  ngOnInit(): void {
    // Get user from state
    this.user = this.store.selectSnapshot(AuthState.getUser);

    // Load saved settings if available
    this.loadSavedSettings();
  }

  /**
   * Loads the user's saved settings from the service
   */
  loadSavedSettings(): void {
    // Get settings from service
    const savedSettings = this.settingsService.getUserSettings();

    if (savedSettings) {
      // Update form values with saved settings
      // (We no longer need to handle appearance settings here)
      if (savedSettings.notifications) {
        this.notificationSettings.patchValue(savedSettings.notifications);
      }

      if (savedSettings.privacy) {
        this.privacySettings.patchValue(savedSettings.privacy);
      }

      if (savedSettings.accessibility) {
        this.accessibilitySettings.patchValue(savedSettings.accessibility);
      }
    }
  }

  /**
   * Saves all settings including appearance settings
   */
  saveSettings(): void {
    this.isSaving = true;

    // Create settings object from form values
    const allSettings = {
      notifications: this.notificationSettings.value,
      privacy: this.privacySettings.value,
      accessibility: this.accessibilitySettings.value,
    };

    // First save the appearance settings to the backend
    const saveAppearance$ = this.appearanceSettingsComponent
      ? this.appearanceSettingsComponent.saveSettings()
      : of(true);

    // Then save the other settings
    saveAppearance$
      .pipe(
        switchMap((appearanceSaved: boolean) => {
          if (!appearanceSaved) {
            console.warn('Appearance settings may not have been saved to the backend');
          }
          // Save other settings via service
          return this.settingsService.saveUserSettings(allSettings);
        }),
      )
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Settings Saved',
            detail: 'Your settings have been updated successfully.',
          });
          this.isSaving = false;

          // Apply settings where needed
          this.applySettings(allSettings);
        },
        error: (): void => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to save settings. Please try again.',
          });
          this.isSaving = false;
        },
      });
  }

  /**
   * Applies settings that need immediate effect
   * @param settings The settings to apply
   */
  applySettings(settings: any): void {
    // Apply accessibility settings
    const fontSize = settings.accessibility.fontSize;
    document.documentElement.style.fontSize =
      fontSize === 'small' ? '14px' : fontSize === 'large' ? '18px' : '16px';

    // Apply high contrast if enabled
    if (settings.accessibility.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    // Apply reduced animations if enabled
    if (settings.accessibility.animationsReduced) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  }

  /**
   * Resets all settings to defaults
   */
  resetToDefaults(): void {
    // Confirm with user
    if (
      confirm(
        'Are you sure you want to reset all settings to default values? This cannot be undone.',
      )
    ) {
      // Reset forms
      this.notificationSettings.reset({
        emailNotifications: true,
        pushNotifications: true,
        notificationSound: true,
        notificationTiming: 0,
        desktopAlerts: true,
        reminderEmails: true,
      });

      this.privacySettings.reset({
        profileVisibility: 'public',
        activityTracking: true,
        dataSharingConsent: false,
        dataCollection: true,
        cookiesConsent: true,
      });

      this.accessibilitySettings.reset({
        highContrast: false,
        fontSize: 'medium',
        animationsReduced: false,
        screenReaderOptimized: false,
        keyboardNavigation: true,
      });

      // Save to service
      this.saveSettings();

      this.messageService.add({
        severity: 'info',
        summary: 'Settings Reset',
        detail: 'All settings have been reset to default values.',
      });
    }
  }

  /**
   * Exports the user's settings as a JSON file download
   */
  exportSettings(): void {
    const settings = {
      // We would need to get appearance settings from the AppearanceSettingsService
      // but to keep it simple, we'll just include notification, privacy and accessibility
      notifications: this.notificationSettings.value,
      privacy: this.privacySettings.value,
      accessibility: this.accessibilitySettings.value,
    };

    // Create a JSON string of settings
    const settingsJson = JSON.stringify(settings, null, 2);

    // Create a blob of the JSON
    const blob = new Blob([settingsJson], { type: 'application/json' });

    // Create an object URL of the blob
    const url = URL.createObjectURL(blob);

    // Create a link element, set its href to the blob URL, and click it
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tyme-settings.json';
    a.click();

    // Clean up by revoking the object URL
    URL.revokeObjectURL(url);

    this.messageService.add({
      severity: 'success',
      summary: 'Settings Exported',
      detail: 'Your settings have been exported as JSON.',
    });
  }

  /**
   * Validates that imported settings have the required properties
   * @param settings The settings to validate
   * @returns Whether the settings are valid
   */
  isValidSettings(settings: any): boolean {
    return settings.notifications && settings.privacy && settings.accessibility;
  }

  /**
   * Updates form values with imported settings
   * @param settings The settings to apply to the forms
   */
  updateFormValues(settings: any): void {
    this.notificationSettings.patchValue(settings.notifications);
    this.privacySettings.patchValue(settings.privacy);
    this.accessibilitySettings.patchValue(settings.accessibility);
  }

  /**
   * Imports settings from a JSON file
   * @param event The file input change event
   */
  importSettings(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const settings = JSON.parse(e.target?.result as string);

        if (this.isValidSettings(settings)) {
          this.updateFormValues(settings);
          this.saveSettings();

          this.messageService.add({
            severity: 'success',
            summary: 'Settings Imported',
            detail: 'Your settings have been imported successfully.',
          });
        } else {
          throw new Error('Invalid settings format');
        }
      } catch (error: any) {
        this.messageService.add({
          severity: 'error',
          summary: 'Import Failed',
          detail: 'The selected file contains invalid settings.',
        });
      }
    };

    reader.readAsText(file);

    // Clear the file input
    event.target.value = '';
  }
}
