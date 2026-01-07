import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { ECRFSelectButtonClass } from '../../../form-controls/form-elements/select-button/select-button.class';
import { IconMappingService } from '@core/services/icon-mapping.service';
import {
  LibInputTextComponent,
  LibSelectButtonComponent,
  InputTextConfig,
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  FormLabelPositionEnum,
  FormLabelStyleEnum,
} from '@artificial-sense/ui-lib';
import { BaseDialogComponent } from '@core/abstracts/base-dialog.component';
import { DialogSharedModule } from '../../dialog-shared.module';
import { Tabs, TabsModule, TabsStyle } from 'primeng/tabs';
import { SavePresetDialogComponent } from '../../shared/components/presets/save-preset-dialog/save-preset-dialog.component';
import { LoadPresetDialogComponent } from '../../shared/components/presets/load-preset-dialog/load-preset-dialog.component';
import { DialogWrapperComponent } from '../../shared/components/dialog-wrapper/dialog-wrapper.component';
import { OptionsManagerComponent } from '../../shared/components/options-manager/options-manager.component';
import { OptionFieldConfigs, OptionItem } from '@core/models/interfaces/options.interfaces';
import { FormElementType } from '@core/models/enums/form.enums';
import { IPresetConfiguration } from '@core/models/interfaces/preset.interfaces';
import { ISelectButtonOptions } from '@core/models/interfaces/select-button.interfaces';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogConfirmationService } from '@core/services/dialog-confirmation.service';

@Component({
  selector: 'app-select-button-dialog',
  templateUrl: './select-button-dialog.component.html',
  styleUrls: ['./select-button-dialog.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    SelectModule,
    CheckboxModule,
    DialogWrapperComponent,
    OptionsManagerComponent,
    LibInputTextComponent,
    LibSelectButtonComponent,
    DialogSharedModule,
    TabsModule,
    SavePresetDialogComponent,
    LoadPresetDialogComponent,
    ConfirmDialog
],
  providers: [Tabs, TabsStyle, ConfirmationService, DialogConfirmationService],
})
export class SelectButtonDialogComponent extends BaseDialogComponent<ECRFSelectButtonClass> {
  // Additional field configs from configFactory - now using configFactory like input-text-dialog
  readonly optionLabelConfig: InputTextConfig;
  readonly optionValueConfig: InputTextConfig;
  readonly optionDisabledConfig: InputTextConfig;

  protected elementType: FormElementType = FormElementType.SELECT_BUTTON;

  // Template constants - same pattern as input-text-dialog
  protected readonly FormComponentVariantEnum: typeof FormComponentVariantEnum =
    FormComponentVariantEnum;
  protected readonly FormLabelStyleEnum: typeof FormLabelStyleEnum = FormLabelStyleEnum;
  protected readonly FormLabelPositionEnum: typeof FormLabelPositionEnum = FormLabelPositionEnum;
  protected readonly FormComponentSizeEnum: typeof FormComponentSizeEnum = FormComponentSizeEnum;

  constructor(private iconService: IconMappingService) {
    super();

    // Get the option field configs from configFactory - same as before
    const optionConfigs: OptionFieldConfigs = this.configFactory.getOptionFieldConfigs();
    this.optionLabelConfig = optionConfigs.optionLabelConfig;
    this.optionValueConfig = optionConfigs.optionValueConfig;
    this.optionDisabledConfig = optionConfigs.optionDisabledConfig;

    // Enhanced validation is enabled by default in base class
    // Select button validation should already be registered in DialogValidationService
    // If you need to disable it: this.enableEnhancedValidation = false;
  }

  // Helper method to get FormControl from the form
  getControl(name: string): FormControl {
    return this.form.get(name) as FormControl;
  }

  /**
   * Handle options changed event from the options manager
   */
  onOptionsChanged(options: OptionItem[]): void {
    // Options are automatically handled by the OptionsManagerComponent
    // Just mark form as changed
    this.hasUnsavedChanges = true;
  }

  /**
   * Implementation of PresetSupport interface - get the current configuration
   */
  getConfigurationForPreset(): IPresetConfiguration {
    return {
      label: this.form.value.label,
      required: this.form.value.required,
      disabled: this.form.value.disabled,
      multiple: this.form.value.multiple,
      optionLabel: this.form.value.optionLabel,
      optionValue: this.form.value.optionValue,
      optionDisabled: this.form.value.optionDisabled,
      helperText: this.form.value.helperText,
      size: this.form.value.size,
      variant: this.form.value.variant,
      labelStyle: this.form.value.labelStyle,
      labelPosition: this.form.value.labelPosition,
      options: this.presetManager.extractOptionsFromForm(this.form),
    };
  }

  /**
   * Implementation of PresetSupport interface - apply preset configuration
   */
  applyPresetConfiguration(config: IPresetConfiguration): void {
    // Apply values using registry defaults when config values are missing - same pattern as input-text-dialog
    this.form.patchValue({
      label: config['label'] || this.dialogConfiguration.defaultValues?.['label'],
      required: config['required'] || this.dialogConfiguration.defaultValues?.['required'],
      disabled: config['disabled'] || this.dialogConfiguration.defaultValues?.['disabled'],
      multiple: config['multiple'] || this.dialogConfiguration.defaultValues?.['multiple'],
      optionLabel: config['optionLabel'] || this.dialogConfiguration.defaultValues?.['optionLabel'],
      optionValue: config['optionValue'] || this.dialogConfiguration.defaultValues?.['optionValue'],
      optionDisabled:
        config['optionDisabled'] || this.dialogConfiguration.defaultValues?.['optionDisabled'],
      helperText: config['helperText'] || '',
      size: config['size'] || this.dialogConfiguration.defaultValues?.['size'],
      variant: config['variant'] || this.dialogConfiguration.defaultValues?.['variant'],
      labelStyle: config['labelStyle'] || this.dialogConfiguration.defaultValues?.['labelStyle'],
      labelPosition:
        config['labelPosition'] || this.dialogConfiguration.defaultValues?.['labelPosition'],
    });

    // Handle an option array using PresetManagerService
    const options: OptionItem[] = config.options || this.presetManager.createDefaultOptions(2);
    this.presetManager.applyOptionsToForm(options, this.form);

    // Apply preset-specific behaviors using PresetManagerService
    this.applyPresetBehaviors(config);

    this.hasUnsavedChanges = true;
  }

  /**
   * Override ngOnInit to add component-specific behavior - same pattern as input-text-dialog
   */
  override ngOnInit(): void {
    super.ngOnInit(); // Call parent to get all the registry and validation setup
    this.setupDynamicBehavior(); // Add select-button specific behavior
  }

  /**
   * Override to add additional validation specific to select button - same pattern as input-text-dialog
   */
  protected override onFormValueChange(): void {
    super.onFormValueChange(); // This handles enhanced validation
    // Add any select-button specific logic here if needed
  }

  protected patchFormValues(): void {
    if (!this.control) return;

    // Patch all basic values using registry defaults as fallbacks - same pattern as input-text-dialog
    this.form.patchValue({
      label: this.control.options?.title || this.dialogConfiguration.defaultValues?.['label'],
      required: this.control.options?.required || false,
      disabled: this.control.options?.disabled || false,
      multiple: this.control.multiple || this.dialogConfiguration.defaultValues?.['multiple'],
      optionLabel:
        this.control.optionLabel || this.dialogConfiguration.defaultValues?.['optionLabel'],
      optionValue:
        this.control.optionValue || this.dialogConfiguration.defaultValues?.['optionValue'],
      optionDisabled:
        this.control.optionDisabled || this.dialogConfiguration.defaultValues?.['optionDisabled'],
      helperText: this.control.options?.helperText || '',
      size: this.control.size || this.dialogConfiguration.defaultValues?.['size'],
      variant: this.control.variant || this.dialogConfiguration.defaultValues?.['variant'],
      labelStyle: this.control.labelStyle || this.dialogConfiguration.defaultValues?.['labelStyle'],
      labelPosition:
        this.control.labelPosition || this.dialogConfiguration.defaultValues?.['labelPosition'],
    });

    // Handle existing options using PresetManagerService
    if (this.control.selectButtonOptions && Array.isArray(this.control.selectButtonOptions)) {
      // Convert SelectButtonOptionType to OptionItem format for the form
      const options: OptionItem[] = this.control.selectButtonOptions.map((option: any) => ({
        label: option.label || '',
        value: option.value,
        disabled: option.disabled || false,
        group: option.group || '',
      }));
      this.presetManager.applyOptionsToForm(options, this.form);
    } else {
      // Add default options if none exist
      const options: OptionItem[] = this.presetManager.createDefaultOptions(2);
      this.presetManager.applyOptionsToForm(options, this.form);
    }
  }

  protected buildResult(): ECRFSelectButtonClass {
    const formValues: any = this.form.value;

    // Create an option object
    const options: ISelectButtonOptions = {
      name: this.sanitizeName(formValues.label),
      title: formValues.label,
      required: formValues.required,
      disabled: formValues.disabled,
      readonly: false,
      helperText: formValues.helperText,
      multiple: formValues.multiple,
      optionLabel: formValues.optionLabel || 'label',
      optionValue: formValues.optionValue || 'value',
      optionDisabled: formValues.optionDisabled || 'disabled',
      size: formValues.size,
      variant: formValues.variant,
      labelStyle: formValues.labelStyle,
      labelPosition: formValues.labelPosition,
      options: this.presetManager.extractOptionsFromForm(this.form),
    };

    if (this.control) {
      // Update the existing select button
      Object.assign(this.control, {
        options,
        multiple: formValues.multiple,
        optionLabel: formValues.optionLabel || 'label',
        optionValue: formValues.optionValue || 'value',
        optionDisabled: formValues.optionDisabled || 'disabled',
        size: formValues.size,
        variant: formValues.variant,
        labelStyle: formValues.labelStyle,
        labelPosition: formValues.labelPosition,
        selectButtonOptions: this.presetManager.extractOptionsFromForm(this.form),
      });
      return this.control;
    } else {
      // Create a new select button
      const selectButton = new ECRFSelectButtonClass(this.iconService, options);
      Object.assign(selectButton, {
        selectButtonOptions: this.presetManager.extractOptionsFromForm(this.form),
      });
      return selectButton;
    }
  }

  /**
   * Set up dynamic form behavior specific to select button
   */
  private setupDynamicBehavior(): void {
    // For select button, there's minimal dynamic behavior needed
    // The form validators handle most validation
    // The multiple selection doesn't typically require special field dependencies
    // You could add any select-button-specific dynamic behavior here if needed,
    // For example, if certain options should be enabled/disabled based on multiple selection
  }
}
