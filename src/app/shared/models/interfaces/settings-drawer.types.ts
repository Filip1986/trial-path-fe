export interface SettingsCategory {
  id: string;
  title: string;
  icon: string;
  description?: string;
  order: number;
}

export interface SettingItem {
  id: string;
  label: string;
  description?: string;
  type: 'toggle' | 'dropdown' | 'color' | 'slider' | 'text' | 'number';
  category: string;
  value: any;
  options?: SettingOption[];
  min?: number;
  max?: number;
  step?: number;
  validation?: SettingValidation;
}

export interface SettingOption {
  label: string;
  value: any;
  icon?: string;
  description?: string;
}

export interface SettingValidation {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  customValidator?: (value: any) => boolean;
}

export interface SettingsSection {
  id: string;
  title: string;
  description?: string;
  category: string;
  items: SettingItem[];
  order: number;
}

// Example settings configuration
export const SETTINGS_CONFIGURATION: {
  categories: SettingsCategory[];
  sections: SettingsSection[];
} = {
  categories: [
    {
      id: 'appearance',
      title: 'Appearance & Theme',
      icon: 'pi-palette',
      description: 'Customize colors, themes, and visual appearance',
      order: 1,
    },
    {
      id: 'layout',
      title: 'Layout & Spacing',
      icon: 'pi-th-large',
      description: 'Adjust layout, spacing, and UI density',
      order: 2,
    },
    {
      id: 'behavior',
      title: 'Behavior & Preferences',
      icon: 'pi-cog',
      description: 'Configure application behavior and user preferences',
      order: 3,
    },
    {
      id: 'accessibility',
      title: 'Accessibility',
      icon: 'pi-eye',
      description: 'Accessibility and usability options',
      order: 4,
    },
  ],
  sections: [
    // Appearance category sections
    {
      id: 'theme',
      title: 'Theme & Colors',
      category: 'appearance',
      order: 1,
      items: [
        {
          id: 'theme-mode',
          label: 'Theme Mode',
          type: 'dropdown',
          category: 'appearance',
          value: 'light',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'System', value: 'system' },
          ],
        },
        {
          id: 'primary-color',
          label: 'Primary Color',
          description: 'Main brand color for the application',
          type: 'color',
          category: 'appearance',
          value: '#3b82f6',
        },
      ],
    },
    {
      id: 'typography',
      title: 'Typography',
      category: 'appearance',
      order: 2,
      items: [
        {
          id: 'font-family',
          label: 'Font Family',
          type: 'dropdown',
          category: 'appearance',
          value: 'default',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Inter', value: 'inter' },
            { label: 'Roboto', value: 'roboto' },
            { label: 'Open Sans', value: 'opensans' },
          ],
        },
        {
          id: 'font-size',
          label: 'Font Size',
          type: 'slider',
          category: 'appearance',
          value: 14,
          min: 12,
          max: 18,
          step: 1,
        },
      ],
    },
    // Layout category sections
    {
      id: 'container',
      title: 'Container Layout',
      category: 'layout',
      order: 1,
      items: [
        {
          id: 'boxed-layout',
          label: 'Boxed Layout',
          description: 'Constrain content to a maximum width',
          type: 'toggle',
          category: 'layout',
          value: false,
        },
        {
          id: 'sidebar-position',
          label: 'Sidebar Position',
          type: 'dropdown',
          category: 'layout',
          value: 'left',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' },
          ],
        },
      ],
    },
    {
      id: 'density',
      title: 'Spacing & Density',
      category: 'layout',
      order: 2,
      items: [
        {
          id: 'compact-mode',
          label: 'Compact Mode',
          description: 'Reduce padding and spacing for denser layout',
          type: 'toggle',
          category: 'layout',
          value: false,
        },
        {
          id: 'rounded-borders',
          label: 'Rounded Borders',
          type: 'toggle',
          category: 'layout',
          value: true,
        },
      ],
    },
    // Behavior category sections
    {
      id: 'application',
      title: 'Application Behavior',
      category: 'behavior',
      order: 1,
      items: [
        {
          id: 'auto-save',
          label: 'Auto-save Settings',
          description: 'Automatically save changes as you make them',
          type: 'toggle',
          category: 'behavior',
          value: true,
        },
        {
          id: 'remember-window-size',
          label: 'Remember Window Size',
          type: 'toggle',
          category: 'behavior',
          value: true,
        },
      ],
    },
    {
      id: 'notifications',
      title: 'Notifications',
      category: 'behavior',
      order: 2,
      items: [
        {
          id: 'push-notifications',
          label: 'Push Notifications',
          type: 'toggle',
          category: 'behavior',
          value: true,
        },
        {
          id: 'email-notifications',
          label: 'Email Notifications',
          type: 'toggle',
          category: 'behavior',
          value: false,
        },
      ],
    },
    // Accessibility category sections
    {
      id: 'visual-accessibility',
      title: 'Visual Accessibility',
      category: 'accessibility',
      order: 1,
      items: [
        {
          id: 'high-contrast',
          label: 'High Contrast',
          description: 'Increase contrast for better visibility',
          type: 'toggle',
          category: 'accessibility',
          value: false,
        },
        {
          id: 'larger-text',
          label: 'Larger Text',
          type: 'toggle',
          category: 'accessibility',
          value: false,
        },
      ],
    },
    {
      id: 'motion-accessibility',
      title: 'Motion & Animation',
      category: 'accessibility',
      order: 2,
      items: [
        {
          id: 'reduce-animations',
          label: 'Reduce Animations',
          description: 'Minimize motion and animations',
          type: 'toggle',
          category: 'accessibility',
          value: false,
        },
        {
          id: 'animation-duration',
          label: 'Animation Duration',
          type: 'slider',
          category: 'accessibility',
          value: 300,
          min: 0,
          max: 1000,
          step: 100,
        },
      ],
    },
  ],
};

// Utility functions for working with settings
export class SettingsUtils {
  static getCategoriesSorted(categories: SettingsCategory[]): SettingsCategory[] {
    return categories.sort((a, b) => a.order - b.order);
  }

  static getSectionsByCategory(sections: SettingsSection[], categoryId: string): SettingsSection[] {
    return sections
      .filter((section) => section.category === categoryId)
      .sort((a, b) => a.order - b.order);
  }

  static getSettingsBySection(sections: SettingsSection[], sectionId: string): SettingItem[] {
    const section = sections.find((s) => s.id === sectionId);
    return section ? section.items : [];
  }

  static validateSetting(item: SettingItem, value: any): boolean {
    if (!item.validation) return true;

    const { required, min, max, pattern, customValidator } = item.validation;

    if (required && (value === null || value === undefined || value === '')) {
      return false;
    }

    if (typeof value === 'number') {
      if (min !== undefined && value < min) return false;
      if (max !== undefined && value > max) return false;
    }

    if (typeof value === 'string' && pattern && !pattern.test(value)) {
      return false;
    }

    if (customValidator && !customValidator(value)) {
      return false;
    }

    return true;
  }
}
