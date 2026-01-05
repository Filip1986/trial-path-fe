import { Injectable } from '@angular/core';
import { DialogConfigurationBuilder } from './dialog-configuration-builder';
import { FormElementType } from '../../../core/models/enums/form.enums';
import { IDialogConfiguration } from '../../../core/models/interfaces/dialog.interfaces';
import { ConfigSectionComponent } from '../../shared/components/config-section/config-section.component';
import { CustomValidationSettingsComponent } from '../../shared/components/tab-sections/custom-validation-settings/custom-validation-settings.component';

@Injectable({
  providedIn: 'root',
})
export class DialogConfigurationRegistry {
  private static configs: Map<FormElementType, IDialogConfiguration> = new Map();
  private static initialized = false;

  constructor() {
    if (!DialogConfigurationRegistry.initialized) {
      this.registerAllConfigurations();
      DialogConfigurationRegistry.initialized = true;
    }
  }

  /**
   * Get configuration for a specific element type
   */
  getConfiguration(elementType: FormElementType): IDialogConfiguration {
    const config: IDialogConfiguration<any> | undefined =
      DialogConfigurationRegistry.configs.get(elementType);
    if (!config) {
      throw new Error(`No configuration registered for element type: ${elementType}`);
    }
    // Return a deep copy to prevent mutations
    return JSON.parse(JSON.stringify(config));
  }

  /**
   * Check if a configuration exists for an element type
   */
  hasConfiguration(elementType: FormElementType): boolean {
    return DialogConfigurationRegistry.configs.has(elementType);
  }

  /**
   * Get all registered element types
   */
  getRegisteredTypes(): FormElementType[] {
    return Array.from(DialogConfigurationRegistry.configs.keys());
  }

  /**
   * Register all dialog configurations
   */
  private registerAllConfigurations(): void {
    // Input Text Configuration
    this.register(
      FormElementType.INPUT_TEXT,
      DialogConfigurationBuilder.for(FormElementType.INPUT_TEXT)
        .setTitle('Configure Input Text')
        .setDimensions('700px', '70vh')
        .addBasicTab()
        .addBehaviorTab([
          { name: 'required', label: 'Required field', controlName: 'required' },
          { name: 'disabled', label: 'Disabled', controlName: 'disabled' },
        ])
        .addValidationTab('text')
        .addAppearanceTab()
        .setDefaultValues({
          label: 'Text Field',
          placeholder: 'Enter text here...',
          required: false,
          disabled: false,
          labelStyle: 'DEFAULT',
          labelPosition: 'ABOVE',
          iconPosition: 'LEFT',
          customValidationRules: [],
        })
        .enablePresets()
        .build(),
    );

    // Textarea Configuration
    this.register(
      FormElementType.TEXT_AREA,
      DialogConfigurationBuilder.for(FormElementType.TEXT_AREA)
        .setTitle('Configure Text Area')
        .setDimensions('700px', '70vh')
        .addBasicTab()
        .addBehaviorTab([
          { name: 'required', label: 'Required field', controlName: 'required' },
          { name: 'disabled', label: 'Disabled', controlName: 'disabled' },
          { name: 'autoResize', label: 'Auto Resize', controlName: 'autoResize' },
        ])
        .addValidationTab('text')
        .addAppearanceTab()
        .setDefaultValues({
          label: 'Text Area',
          placeholder: 'Enter text here...',
          required: false,
          disabled: false,
          rows: 3,
          cols: 30,
          autoResize: false,
          labelStyle: 'DEFAULT',
          labelPosition: 'ABOVE',
        })
        .enablePresets()
        .build(),
    );

    // Checkbox Configuration
    this.register(
      FormElementType.CHECKBOX,
      DialogConfigurationBuilder.for(FormElementType.CHECKBOX)
        .setTitle('Configure Checkbox')
        .setDimensions('700px', '70vh')
        .addBasicTab()
        .addBehaviorTab([
          { name: 'required', label: 'Required field', controlName: 'required' },
          { name: 'disabled', label: 'Disabled', controlName: 'disabled' },
          { name: 'indeterminate', label: 'Indeterminate', controlName: 'indeterminate' },
        ])
        .addOptionsTab(1, false)
        .addAppearanceTab()
        .setDefaultValues({
          label: 'Checkbox',
          required: false,
          disabled: false,
          mode: 'BINARY',
          size: 'NORMAL',
          variant: 'OUTLINED',
          indeterminate: false,
          labelStyle: 'DEFAULT',
          labelPosition: 'ABOVE',
        })
        .enablePresets()
        .build(),
    );

    // Radio Button Configuration
    this.register(
      FormElementType.RADIO,
      DialogConfigurationBuilder.for(FormElementType.RADIO)
        .setTitle('Configure Radio Button')
        .setDimensions('700px', '70vh')
        .addBasicTab()
        .addBehaviorTab([
          { name: 'required', label: 'Required field', controlName: 'required' },
          { name: 'disabled', label: 'Disabled', controlName: 'disabled' },
        ])
        .addOptionsTab(2, false)
        .addAppearanceTab()
        .setDefaultValues({
          label: 'Radio Button',
          name: 'radio-group',
          required: false,
          disabled: false,
          mode: 'STANDARD',
          size: 'NORMAL',
          variant: 'OUTLINED',
          labelStyle: 'DEFAULT',
          labelPosition: 'ABOVE',
        })
        .enablePresets()
        .build(),
    );

    // Date Picker Configuration
    this.register(
      FormElementType.DATE_PICKER,
      DialogConfigurationBuilder.for(FormElementType.DATE_PICKER)
        .setTitle('Configure Date Picker')
        .setDimensions('700px', '70vh')
        .addBasicTab()
        .addBehaviorTab([
          { name: 'required', label: 'Required field', controlName: 'required' },
          { name: 'disabled', label: 'Disabled', controlName: 'disabled' },
          { name: 'showTime', label: 'Show time', controlName: 'showTime' },
          { name: 'showIcon', label: 'Show icon', controlName: 'showIcon' },
        ])
        .addValidationTab('date')
        .addAppearanceTab()
        .setDefaultValues({
          label: 'Date',
          placeholder: 'Select a date',
          required: false,
          disabled: false,
          selectionMode: 'SINGLE',
          view: 'DATE',
          dateFormat: 'mm/dd/yy',
          showTime: false,
          hourFormat: 'TWENTY_FOUR',
          labelStyle: 'DEFAULT',
          labelPosition: 'ABOVE',
          showIcon: true,
        })
        .enablePresets()
        .build(),
    );

    // Time Picker Configuration
    this.register(
      FormElementType.TIME_PICKER,
      DialogConfigurationBuilder.for(FormElementType.TIME_PICKER)
        .setTitle('Configure Time Picker')
        .setDimensions('600px', '70vh') // Slightly taller to accommodate the time settings tab
        .addBasicTab()
        .addTab({
          id: 'time-settings',
          label: 'Time Settings',
          component: ConfigSectionComponent, // You'll need to create this or use ConfigSectionComponent
          order: 1,
          config: {
            fields: [
              {
                name: 'stepMinute',
                config: {
                  label: 'Minute Step',
                  placeholder: '1',
                  type: 'number',
                  min: 1,
                  max: 60,
                  helperText: 'Increment/decrement step for minutes',
                },
              },
              {
                name: 'stepSecond',
                config: {
                  label: 'Second Step',
                  placeholder: '1',
                  type: 'number',
                  min: 1,
                  max: 60,
                  helperText: 'Increment/decrement step for seconds',
                },
              },
            ],
          },
        })
        .addBehaviorTab([
          { name: 'required', label: 'Required field', controlName: 'required' },
          { name: 'disabled', label: 'Disabled', controlName: 'disabled' },
          { name: 'showSeconds', label: 'Show seconds', controlName: 'showSeconds' },
          { name: 'showIcon', label: 'Show icon', controlName: 'showIcon' },
        ])
        .addAppearanceTab()
        .setDefaultValues({
          label: 'Time',
          placeholder: 'Select time',
          required: false,
          disabled: false,
          format: 'TWELVE',
          showSeconds: false,
          stepMinute: 1,
          stepSecond: 1,
          labelStyle: 'DEFAULT',
          labelPosition: 'ABOVE',
          showIcon: true,
          size: 'NORMAL',
        })
        .enablePresets()
        .build(),
    );

    // Input Number Configuration
    this.register(
      FormElementType.INPUT_NUMBER,
      DialogConfigurationBuilder.for(FormElementType.INPUT_NUMBER)
        .setTitle('Configure Number Input')
        .setDimensions('700px', '70vh')
        .addBasicTab()
        .addValidationTab('number')
        .addBehaviorTab([
          { name: 'required', label: 'Required field', controlName: 'required' },
          { name: 'disabled', label: 'Disabled', controlName: 'disabled' },
          { name: 'useGrouping', label: 'Use thousand separators', controlName: 'useGrouping' },
        ])
        .addAppearanceTab()
        .setDefaultValues({
          label: 'Number Input',
          placeholder: 'Enter number',
          required: false,
          disabled: false,
          step: 1,
          mode: 'DECIMAL',
          labelStyle: 'DEFAULT',
          labelPosition: 'ABOVE',
          useGrouping: true,
          minFractionDigits: 0,
          maxFractionDigits: 2,
        })
        .enablePresets()
        .build(),
    );

    // Select Configuration
    this.register(
      FormElementType.SELECT,
      DialogConfigurationBuilder.for(FormElementType.SELECT)
        .setTitle('Configure Select')
        .setDimensions('700px', '70vh')
        .addBasicTab()
        .addOptionsTab(1, false)
        .addBehaviorTab([
          { name: 'required', label: 'Required field', controlName: 'required' },
          { name: 'disabled', label: 'Disabled', controlName: 'disabled' },
          { name: 'filter', label: 'Enable filter', controlName: 'filter' },
          { name: 'showClear', label: 'Show clear button', controlName: 'showClear' },
          { name: 'group', label: 'Use grouped options', controlName: 'group' },
        ])
        .addAppearanceTab()
        .setDefaultValues({
          label: 'Select',
          placeholder: 'Select an option',
          required: false,
          disabled: false,
          filter: false,
          showClear: false,
          group: false,
          optionLabel: 'label',
          optionValue: 'value',
          labelStyle: 'DEFAULT',
          labelPosition: 'ABOVE',
          size: 'NORMAL',
          variant: 'OUTLINED',
        })
        .enablePresets()
        .build(),
    );

    // Multiselect Configuration
    this.register(
      FormElementType.MULTISELECT,
      DialogConfigurationBuilder.for(FormElementType.MULTISELECT)
        .setTitle('Configure Multiselect')
        .setDimensions('700px', '70vh')
        .addBasicTab()
        .addOptionsTab(1, false)
        .addBehaviorTab([
          { name: 'required', label: 'Required field', controlName: 'required' },
          { name: 'disabled', label: 'Disabled', controlName: 'disabled' },
          { name: 'filter', label: 'Enable Filter', controlName: 'filter' },
          { name: 'showToggleAll', label: 'Show Select All', controlName: 'showToggleAll' },
          { name: 'group', label: 'Use grouped options', controlName: 'group' },
        ])
        .addAppearanceTab()
        .setDefaultValues({
          label: 'Multiselect',
          placeholder: 'Select options',
          required: false,
          disabled: false,
          multiple: true,
          filter: false,
          showToggleAll: true,
          group: false,
          optionLabel: 'label',
          optionValue: 'value',
          labelStyle: 'DEFAULT',
          labelPosition: 'ABOVE',
          display: 'COMMA',
          size: 'NORMAL',
          variant: 'OUTLINED',
        })
        .enablePresets()
        .build(),
    );

    // List Box Configuration
    this.register(
      FormElementType.LIST_BOX,
      DialogConfigurationBuilder.for(FormElementType.LIST_BOX)
        .setTitle('Configure ListBox')
        .setDimensions('700px', '70vh')
        .addBasicTab()
        .addOptionsTab(1, false)
        .addBehaviorTab([
          { name: 'required', label: 'Required field', controlName: 'required' },
          { name: 'disabled', label: 'Disabled', controlName: 'disabled' },
          { name: 'multiple', label: 'Multiple selection', controlName: 'multiple' },
          { name: 'checkbox', label: 'Show checkboxes', controlName: 'checkbox' },
          { name: 'filter', label: 'Enable filter', controlName: 'filter' },
          { name: 'group', label: 'Use grouped options', controlName: 'group' },
        ])
        .addAppearanceTab()
        .setDefaultValues({
          label: 'ListBox',
          required: false,
          disabled: false,
          multiple: false,
          checkbox: false,
          filter: false,
          group: false,
          optionLabel: 'label',
          optionValue: 'value',
          labelStyle: 'DEFAULT',
          labelPosition: 'ABOVE',
          size: 'NORMAL',
          variant: 'OUTLINED',
        })
        .enablePresets()
        .build(),
    );

    // Select Button Configuration
    this.register(
      FormElementType.SELECT_BUTTON,
      DialogConfigurationBuilder.for(FormElementType.SELECT_BUTTON)
        .setTitle('Configure Select Button')
        .setDimensions('700px', '70vh')
        .addBasicTab()
        .addOptionsTab(2, false)
        .addBehaviorTab([
          { name: 'required', label: 'Required field', controlName: 'required' },
          { name: 'disabled', label: 'Disabled', controlName: 'disabled' },
          { name: 'multiple', label: 'Multiple selection', controlName: 'multiple' },
        ])
        .addAppearanceTab()
        .setDefaultValues({
          label: 'Select Button',
          required: false,
          disabled: false,
          multiple: false,
          optionLabel: 'label',
          optionValue: 'value',
          optionDisabled: 'disabled',
          size: 'NORMAL',
          variant: 'OUTLINED',
          labelStyle: 'DEFAULT',
          labelPosition: 'ABOVE',
        })
        .enablePresets()
        .build(),
    );
  }

  /**
   * Register a configuration for an element type
   */
  private register(elementType: FormElementType, config: IDialogConfiguration): void {
    DialogConfigurationRegistry.configs.set(elementType, config);
  }
}

// Convenience functions for easy access
export function getDialogConfig(elementType: FormElementType): IDialogConfiguration {
  const registry = new DialogConfigurationRegistry();
  return registry.getConfiguration(elementType);
}

export function hasDialogConfig(elementType: FormElementType): boolean {
  const registry = new DialogConfigurationRegistry();
  return registry.hasConfiguration(elementType);
}
