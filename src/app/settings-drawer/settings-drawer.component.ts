import { Component, OnInit, signal, WritableSignal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { ThemeService } from '@artificial-sense/ui-lib';
import {
  AppearanceSettings,
  AppearanceSettingsService,
  BackgroundColor,
  BoxShadowOption,
  FontOption,
  ThemeColor,
} from '../core/services/appearance-settings.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-settings-drawer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    ToggleSwitchModule,
    DividerModule,
    RippleModule,
  ],
  templateUrl: './settings-drawer.component.html',
  styleUrls: ['./settings-drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsDrawerComponent implements OnInit {
  // Drawer/UI state
  isOpen: WritableSignal<boolean> = signal(false);
  // Keep as a class property due to [(ngModel)] binding
  isDarkMode = false;
  // Keep as a class property due to [(ngModel)] binding
  isBordersRounded = true;

  // Reference appearance settings from the service
  themeColors: ThemeColor[] = [];
  backgroundColors: BackgroundColor[] = [];
  boxShadows: BoxShadowOption[] = [];
  fontOptions: FontOption[] = [];

  // Track selected values as signals
  selectedColor: WritableSignal<string> = signal('');
  selectedShadow: WritableSignal<string> = signal('');
  selectedBackground: WritableSignal<string> = signal('');
  selectedFont: WritableSignal<string> = signal('default');
  isBoxedLayout: WritableSignal<boolean> = signal(false);

  // Language switcher
  supportedLanguages = [
    { code: 'en', label: 'English' },
    { code: 'de', label: 'Deutsch' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
  ];
  selectedLanguage = 'en';

  constructor(
    private themeService: ThemeService,
    private appearanceService: AppearanceSettingsService,
    private translate: TranslateService,
  ) {
    this.themeColors = this.appearanceService.themeColors;
    this.backgroundColors = this.appearanceService.backgroundColors;
    this.boxShadows = this.appearanceService.boxShadows;
    this.fontOptions = this.appearanceService.fontOptions;

    // Initialize language from localStorage or default
    const savedLang = localStorage.getItem('appLanguage');
    this.selectedLanguage = savedLang || 'en';
    this.translate.use(this.selectedLanguage);
  }

  ngOnInit(): void {
    // Subscribe to the theme service to know the current theme mode
    this.themeService.isDarkMode$.subscribe((isDark: boolean): void => {
      this.isDarkMode = isDark;
    });

    // Load settings from a service
    const currentSettings: AppearanceSettings = this.appearanceService.getCurrentSettings();
    this.selectedColor.set(currentSettings.primaryColor);
    this.selectedShadow.set(currentSettings.selectedShadow);
    this.selectedBackground.set(currentSettings.selectedBackground);
    this.selectedFont.set(currentSettings.selectedFont);
    this.isBordersRounded = currentSettings.isBordersRounded;
    this.isBoxedLayout.set(currentSettings.isBoxedLayout);
  }

  toggleDrawer(): void {
    this.isOpen.update((v: boolean): boolean => !v);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();

    // Update the theme in the settings service (locally only)
    const newTheme = this.isDarkMode ? 'light' : 'dark';
    this.appearanceService.updateLocalSettings({ theme: newTheme });
  }

  toggleBorderRadius(): void {
    // Update in service (locally only)
    this.appearanceService.updateLocalSettings({
      isBordersRounded: this.isBordersRounded,
    });
  }

  /**
   * Toggles between boxed and full-width container layouts
   */
  toggleContainerLayout(): void {
    const newValue = !this.isBoxedLayout();
    this.isBoxedLayout.set(newValue);

    // Update in service (locally only)
    this.appearanceService.updateLocalSettings({
      isBoxedLayout: newValue,
    });
  }

  /**
   * Changes the application font
   * @param fontValue The font to apply
   */
  changeFont(fontValue: string): void {
    this.selectedFont.set(fontValue);

    // Update in service (locally only)
    this.appearanceService.updateLocalSettings({
      selectedFont: fontValue,
    });
  }

  /**
   * Changes the background color for dark mode
   * @param color Background color hex value to apply
   */
  changeBackgroundColor(color: string): void {
    if (this.isDarkMode) {
      this.selectedBackground.set(color);

      // Update in service (locally only)
      this.appearanceService.updateLocalSettings({
        selectedBackground: color,
      });
    }
  }

  changeThemeColor(color: string): void {
    this.selectedColor.set(color);

    // Update in service (locally only)
    this.appearanceService.updateLocalSettings({
      primaryColor: color,
    });
  }

  /**
   * Changes the box shadow style for cards and other elements
   * @param shadow The box shadow value to apply
   */
  changeBoxShadow(shadow: string): void {
    this.selectedShadow.set(shadow);

    // Update in service (locally only)
    this.appearanceService.updateLocalSettings({
      selectedShadow: shadow,
    });
  }

  onLanguageChange(lang: string) {
    this.selectedLanguage = lang;
    this.translate.use(lang);
    localStorage.setItem('appLanguage', lang);
  }
}
