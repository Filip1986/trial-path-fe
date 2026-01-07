import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

// PrimeNG Components
import { CardModule } from 'primeng/card';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DividerModule } from 'primeng/divider';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

// Service and interfaces
import { toSignal } from '@angular/core/rxjs-interop';
import { ThemeService } from '@artificial-sense/ui-lib';
import { tap } from 'rxjs/operators';
import {
  AppearanceSettings,
  AppearanceSettingsService,
  BackgroundColor,
  BoxShadowOption,
  FontOption,
  ThemeColor,
} from '@core/services/appearance-settings.service';

interface ThemeOption {
  name: string;
  value: 'light' | 'dark' | 'system';
}

interface LanguageOption {
  name: string;
  code: string;
}

@Component({
  selector: 'app-appearance-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
    ToggleSwitchModule,
    ColorPickerModule,
    SelectButtonModule,
    RadioButtonModule,
    DividerModule,
    CardModule,
    RippleModule,
  ],
  templateUrl: './appearance-settings.component.html',
  styleUrl: './appearance-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppearanceSettingsComponent implements OnInit {
  // Available options
  themeOptions: ThemeOption[] = [
    { name: 'Light', value: 'light' },
    { name: 'Dark', value: 'dark' },
    { name: 'System Default', value: 'system' },
  ];

  languageOptions: LanguageOption[] = [
    { name: 'English', code: 'en' },
    { name: 'French', code: 'fr' },
    { name: 'German', code: 'de' },
    { name: 'Spanish', code: 'es' },
  ];

  // Current settings as signal (initialized in constructor after DI)
  settings!: Signal<AppearanceSettings>;

  // Display options from service
  themeColors: ThemeColor[] = [];
  backgroundColors: BackgroundColor[] = [];
  boxShadows: BoxShadowOption[] = [];
  fontOptions: FontOption[] = [];

  // Loading state as signal
  isSaving: WritableSignal<boolean> = signal(false);

  constructor(
    private appearanceService: AppearanceSettingsService,
    private themeService: ThemeService,
  ) {
    // Initialize settings signal after DI is ready
    this.settings = toSignal(this.appearanceService.settings$, {
      initialValue: this.appearanceService.getCurrentSettings(),
    });

    this.themeColors = this.appearanceService.themeColors;
    this.backgroundColors = this.appearanceService.backgroundColors;
    this.boxShadows = this.appearanceService.boxShadows;
    this.fontOptions = this.appearanceService.fontOptions;
  }

  ngOnInit(): void {
    // Load settings from BE
    this.appearanceService.loadSettings().subscribe({
      next: (): void => console.log('Settings loaded from BE or localStorage'),
      error: (err): void => console.error('Error loading settings:', err),
    });
  }

  /**
   * Toggle between light and dark mode
   * @param theme The theme to set
   */
  onThemeChange(theme: 'light' | 'dark' | 'system'): void {
    // Update settings through service
    this.appearanceService.updateSettings({ theme });

    // Update theme immediately via theme service
    if (theme !== 'system') {
      this.themeService.setTheme(theme);
    } else {
      // If system, use device preference
      const isDarkMode: boolean = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.themeService.setTheme(isDarkMode ? 'dark' : 'light');
    }
  }

  /**
   * Toggle border radius setting
   */
  toggleBorderRadius(checked: boolean): void {
    this.appearanceService.updateSettings({
      isBordersRounded: checked,
    });
  }

  /**
   * Update primary color
   * @param event The color picker change event
   */
  onColorChange(event: any): void {
    this.appearanceService.updateSettings({ primaryColor: event.value });
  }

  /**
   * Change background color for dark mode
   * @param color The color to set
   */
  changeBackgroundColor(color: string): void {
    // Only change background if in dark mode
    const isDarkTheme: boolean =
      this.settings().theme === 'dark' ||
      (this.settings().theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDarkTheme) {
      this.appearanceService.updateSettings({ selectedBackground: color });
    } else {
      // Could display a message that this only works in dark mode
      console.log('Background color customization only applies to dark mode');
    }
  }

  /**
   * Change the box shadow style
   * @param shadow The shadow style to apply
   */
  changeBoxShadow(shadow: string): void {
    this.appearanceService.updateSettings({ selectedShadow: shadow });
  }

  /**
   * Change the font family
   * @param fontValue The font to apply
   */
  changeFont(fontValue: string): void {
    this.appearanceService.updateSettings({ selectedFont: fontValue });
  }

  /**
   * Toggle between boxed and full width container layouts
   */
  toggleContainerLayout(): void {
    this.appearanceService.updateSettings({
      isBoxedLayout: !this.settings().isBoxedLayout,
    });
  }

  /**
   * Handle compact mode toggle
   */
  toggleCompactMode(checked: boolean): void {
    this.appearanceService.updateSettings({
      compactMode: checked,
    });
  }

  /**
   * Change the application language
   * @param language The language code to set
   */
  onLanguageChange(language: string): void {
    this.appearanceService.updateSettings({ language });
  }

  /**
   * Save all settings to the backend
   * @returns Observable of save operation success
   */
  saveSettings(): Observable<boolean> {
    this.isSaving.set(true);
    return this.appearanceService.saveToApi().pipe(
      tap({
        finalize: (): void => {
          this.isSaving.set(false);
        },
      }),
    );
  }
}
