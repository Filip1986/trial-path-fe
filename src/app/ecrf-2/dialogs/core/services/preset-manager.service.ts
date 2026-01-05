import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastManagerService } from '../../../../core/services/toast-manager.service';
import { Preset, PresetService } from '../../shared/services/preset.service';
import { firstValueFrom } from 'rxjs';
import { OptionItem } from '../../../core/models/interfaces/options.interfaces';
import { FormElementType } from '../../../core/models/enums/form.enums';
import {
  IPresetConfiguration,
  IPresetSupport,
} from '../../../core/models/interfaces/preset.interfaces';

/**
 * Enhanced service for centralized preset management across all dialog components
 */
@Injectable({
  providedIn: 'root',
})
export class PresetManagerService {
  constructor(
    private presetService: PresetService,
    private fb: FormBuilder,
    private toastManager: ToastManagerService,
  ) {}

  /**
   * Save a configuration as a preset
   */
  async savePreset(
    elementType: FormElementType,
    config: IPresetConfiguration,
    name: string,
    description = '',
  ): Promise<Preset> {
    try {
      const preset: Preset = this.presetService.savePreset(name, elementType, config, description);
      this.toastManager.success(`Preset "${preset.name}" saved successfully`);
      return preset;
    } catch (error) {
      console.error('Error saving preset:', error);
      this.toastManager.error('Failed to save preset');
      throw error;
    }
  }

  /**
   * Load a preset configuration into a form using the component's apply method
   */
  loadPresetIntoComponent(preset: Preset, component: IPresetSupport): void {
    try {
      component.applyPresetConfiguration(preset.configuration);
      this.toastManager.success(`Preset "${preset.name}" loaded successfully`);
    } catch (error) {
      console.error('Error loading preset:', error);
      this.toastManager.error('Failed to load preset');
      throw error;
    }
  }

  /**
   * Load a preset configuration directly into a form (legacy support)
   */
  loadPresetIntoForm(preset: Preset, form: FormGroup): void {
    try {
      const configuration: any = preset.configuration;

      // Patch simple form values
      const patchValues: { [key: string]: any } = {};
      Object.keys(configuration).forEach((key: string): void => {
        const control = form.get(key);
        if (
          control &&
          !Array.isArray(configuration[key]) &&
          typeof configuration[key] !== 'object'
        ) {
          patchValues[key] = configuration[key];
        }
      });

      form.patchValue(patchValues);

      // Handle options array if present
      if (configuration.options && Array.isArray(configuration.options)) {
        this.applyOptionsToForm(configuration.options, form);
      }

      this.toastManager.success(`Preset "${preset.name}" loaded successfully`);
    } catch (error) {
      console.error('Error loading preset:', error);
      this.toastManager.error('Failed to load preset');
      throw error;
    }
  }

  /**
   * Delete a preset
   */
  deletePreset(presetId: string): boolean {
    try {
      const result: boolean = this.presetService.deletePreset(presetId);
      if (result) {
        this.toastManager.info('Preset deleted successfully');
      }
      return result;
    } catch (error) {
      console.error('Error deleting preset:', error);
      this.toastManager.error('Failed to delete preset');
      return false;
    }
  }

  /**
   * Get all presets for a specific element type
   */
  async getPresets(elementType: FormElementType): Promise<Preset[]> {
    return await firstValueFrom(this.presetService.getPresetsByType(elementType));
  }

  /**
   * Validate preset configuration before saving
   */
  validatePresetConfiguration(config: IPresetConfiguration, elementType: FormElementType): boolean {
    // Basic validation
    if (!config || typeof config !== 'object') {
      return false;
    }

    // Element-specific validation
    switch (elementType) {
      case FormElementType.RADIO:
      case FormElementType.SELECT:
      case FormElementType.MULTISELECT:
      case FormElementType.LIST_BOX:
      case FormElementType.SELECT_BUTTON:
        // Ensure options-based controls have valid options
        if (config.options && Array.isArray(config.options)) {
          return config.options.every(
            (option: any): any => option.label && option.value !== undefined,
          );
        }
        break;

      case FormElementType.CHECKBOX:
        // Validate checkbox-specific rules
        if (config['mode'] === 'group' && (!config.options || !Array.isArray(config.options))) {
          return false;
        }
        break;
    }

    return true;
  }

  /**
   * Apply group-specific validators and settings
   */
  applyGroupSettings(isGroup: boolean, form: FormGroup): void {
    const optionGroupLabelCtrl: AbstractControl<any, any> | null = form.get('optionGroupLabel');
    const optionGroupChildrenCtrl: AbstractControl<any, any> | null =
      form.get('optionGroupChildren');

    if (!optionGroupLabelCtrl || !optionGroupChildrenCtrl) return;

    if (isGroup) {
      optionGroupLabelCtrl.setValidators([Validators.required]);
      optionGroupChildrenCtrl.setValidators([Validators.required]);
    } else {
      optionGroupLabelCtrl.clearValidators();
      optionGroupChildrenCtrl.clearValidators();
    }

    optionGroupLabelCtrl.updateValueAndValidity();
    optionGroupChildrenCtrl.updateValueAndValidity();
  }

  /**
   * Create default options for option-based controls
   */
  createDefaultOptions(count = 2): OptionItem[] {
    const options: OptionItem[] = [];
    for (let i = 0; i < count; i++) {
      options.push({
        label: `Option ${i + 1}`,
        value: `option${i + 1}`,
        disabled: false,
      });
    }
    return options;
  }

  /**
   * Apply an array of options to a form's options FormArray
   */
  applyOptionsToForm(options: OptionItem[], form: FormGroup, arrayName = 'options'): void {
    const optionsArray = form.get(arrayName) as FormArray;
    if (!optionsArray) return;

    // Clear existing options
    while (optionsArray.length) {
      optionsArray.removeAt(0);
    }

    // Add options from the preset
    options.forEach((option: OptionItem): void => {
      optionsArray.push(
        this.fb.group({
          label: [option.label, Validators.required],
          value: [option.value, Validators.required],
          disabled: [option.disabled || false],
          group: [option.group || ''],
        }),
      );
    });
  }

  /**
   * Extract options from a form's options FormArray
   */
  extractOptionsFromForm(form: FormGroup, arrayName = 'options'): OptionItem[] {
    const optionsArray = form.get(arrayName) as FormArray;
    return optionsArray ? optionsArray.value : [];
  }

  /**
   * Handle dynamic field dependencies (e.g., enable/disable fields based on other fields)
   */
  setupFieldDependency(
    form: FormGroup,
    triggerField: string,
    targetFields: string[],
    condition: (value: any) => boolean,
  ): void {
    form.get(triggerField)?.valueChanges.subscribe((value: any): void => {
      const shouldEnable: boolean = condition(value);

      targetFields.forEach((fieldName: string): void => {
        const control: AbstractControl<any, any> | null = form.get(fieldName);
        if (control) {
          if (shouldEnable) {
            control.enable();
          } else {
            control.disable();
            if (!shouldEnable) {
              control.reset();
            }
          }
        }
      });
    });
  }

  /**
   * Apply preset-specific form behaviors (e.g., validators, field states)
   */
  applyPresetBehaviors(
    form: FormGroup,
    elementType: FormElementType,
    config: IPresetConfiguration,
  ): void {
    switch (elementType) {
      case FormElementType.CHECKBOX:
        this.applyCheckboxBehaviors(form, config);
        break;

      case FormElementType.MULTISELECT:
      case FormElementType.SELECT:
      case FormElementType.LIST_BOX:
        this.applyOptionsBehaviors(form, config);
        break;

      case FormElementType.DATE_PICKER:
        this.applyDatePickerBehaviors(form, config);
        break;
    }
  }

  /**
   * Apply checkbox-specific behaviors when loading preset
   */
  private applyCheckboxBehaviors(form: FormGroup, config: IPresetConfiguration): void {
    if (config['mode'] === 'group') {
      // Ensure options exist
      if (!config.options || !Array.isArray(config.options) || config.options.length === 0) {
        this.applyOptionsToForm(this.createDefaultOptions(1), form);
      }

      // Disable indeterminate for group mode
      const indeterminateCtrl: AbstractControl<any, any> | null = form.get('indeterminate');
      if (indeterminateCtrl) {
        indeterminateCtrl.setValue(false);
        indeterminateCtrl.disable();
      }
    } else {
      // Enable indeterminate for binary mode
      const indeterminateCtrl: AbstractControl<any, any> | null = form.get('indeterminate');
      if (indeterminateCtrl) {
        indeterminateCtrl.enable();
      }
    }
  }

  /**
   * Apply behaviors for option-based controls
   */
  private applyOptionsBehaviors(form: FormGroup, config: IPresetConfiguration): void {
    if (config['group']) {
      this.applyGroupSettings(true, form);
    }
  }

  /**
   * Apply date-picker-specific behaviors
   */
  private applyDatePickerBehaviors(form: FormGroup, config: IPresetConfiguration): void {
    const hourFormatCtrl: AbstractControl<any, any> | null = form.get('hourFormat');
    if (hourFormatCtrl) {
      if (config['showTime']) {
        hourFormatCtrl.enable();
      } else {
        hourFormatCtrl.disable();
      }
    }
  }
}
