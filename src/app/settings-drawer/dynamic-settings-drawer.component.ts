import { Component, OnInit, signal, WritableSignal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { AccordionModule } from 'primeng/accordion';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { ColorPickerModule } from 'primeng/colorpicker';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import {
  SettingItem,
  SETTINGS_CONFIGURATION,
  SettingsCategory,
  SettingsSection,
  SettingsUtils,
} from '../shared/models/interfaces/settings-drawer.types';

@Component({
  selector: 'app-dynamic-settings-drawer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    ToggleSwitchModule,
    AccordionModule,
    SelectModule,
    SliderModule,
    ColorPickerModule,
    InputTextModule,
    InputNumberModule,
  ],
  templateUrl: './dynamic-settings-drawer.component.html',
  styleUrls: ['./dynamic-settings-drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicSettingsDrawerComponent implements OnInit {
  // Drawer state
  isOpen: WritableSignal<boolean> = signal(false);
  activeAccordionTabs: WritableSignal<number[]> = signal([0]);
  isSaving: WritableSignal<boolean> = signal(false);

  // Settings configuration
  categories: SettingsCategory[] = [];
  sections: SettingsSection[] = [];

  // Settings values (in a real app, this would come from a service)
  settingsValues: WritableSignal<Record<string, any>> = signal({});

  constructor() {
    // Load configuration
    this.categories = SettingsUtils.getCategoriesSorted(SETTINGS_CONFIGURATION.categories);
    this.sections = SETTINGS_CONFIGURATION.sections;
  }

  ngOnInit(): void {
    this.loadSettingsValues();
  }

  // Drawer controls
  openDrawer(): void {
    this.isOpen.set(true);
  }

  closeDrawer(): void {
    this.isOpen.set(false);
  }

  toggleDrawer(): void {
    this.isOpen.set(!this.isOpen());
  }

  // Data access methods
  getSectionsByCategory(categoryId: string): SettingsSection[] {
    return SettingsUtils.getSectionsByCategory(this.sections, categoryId);
  }

  getSettingValue(settingId: string): any {
    return this.settingsValues()[settingId];
  }

  updateSetting(settingId: string, value: any): void {
    const currentValues = this.settingsValues();
    this.settingsValues.set({
      ...currentValues,
      [settingId]: value,
    });

    // Apply setting immediately (if needed)
    this.applySetting(settingId, value);
  }

  // Handle color picker events specifically
  onColorPickerChange(settingId: string, event: any): void {
    // Handle both string and object formats from ColorPicker
    const color = typeof event === 'string' ? event : event.value || event;
    this.updateSetting(settingId, color);
  }

  private applySetting(settingId: string, value: any): void {
    // Apply immediate changes based on setting ID
    switch (settingId) {
      case 'theme-mode':
        // Apply theme change immediately
        document.documentElement.setAttribute('data-theme', value);
        break;
      case 'primary-color':
        // Apply color change immediately
        document.documentElement.style.setProperty('--primary-color', value);
        break;
      case 'compact-mode':
        // Apply compact mode immediately
        if (value) {
          document.body.classList.add('compact-mode');
        } else {
          document.body.classList.remove('compact-mode');
        }
        break;
      // Add more immediate applications as needed
    }
  }

  private loadSettingsValues(): void {
    // In a real app, load from your settings service
    const defaultValues: Record<string, any> = {};

    // Initialize with default values from configuration
    this.sections.forEach((section) => {
      section.items.forEach((item) => {
        defaultValues[item.id] = item.value;
      });
    });

    this.settingsValues.set(defaultValues);
  }

  saveAllSettings(): void {
    this.isSaving.set(true);

    // Simulate save operation
    setTimeout(() => {
      console.log('Settings saved:', this.settingsValues());
      this.isSaving.set(false);
      // In a real app, call your settings service here
    }, 1000);
  }

  // Helper methods for styling
  getItemClasses(item: SettingItem): string[] {
    const classes = [`setting-${item.type}`];

    if (item.type === 'slider') {
      classes.push('full-width-item');
    }

    return classes;
  }

  // TrackBy functions for performance
  trackByCategory(index: number, category: SettingsCategory): string {
    return category.id;
  }

  trackBySection(index: number, section: SettingsSection): string {
    return section.id;
  }

  trackByItem(index: number, item: SettingItem): string {
    return item.id;
  }
}
