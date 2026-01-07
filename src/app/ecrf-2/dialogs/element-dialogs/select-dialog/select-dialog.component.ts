import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { ECRFSelectClass } from '../../../form-controls/form-elements/select/select.class';
import { IconMappingService } from '@core/services/icon-mapping.service';
import {
  LibInputTextComponent,
  LibSelectComponent,
  InputTextConfig,
  FormLabelStyleEnum,
  FormLabelPositionEnum,
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  DEFAULT_SCROLL_HEIGHT,
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
import { ISelectOptions } from '@core/models/interfaces/select.interfaces';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogConfirmationService } from '@core/services/dialog-confirmation.service';

@Component({
  selector: 'app-select-dialog',
  templateUrl: './select-dialog.component.html',
  styleUrls: ['./select-dialog.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    SelectModule,
    CheckboxModule,
    DialogWrapperComponent,
    OptionsManagerComponent,
    LibInputTextComponent,
    LibSelectComponent,
    DialogSharedModule,
    TabsModule,
    SavePresetDialogComponent,
    LoadPresetDialogComponent,
    ConfirmDialog
],
  providers: [Tabs, TabsStyle, ConfirmationService, DialogConfirmationService],
})
export class SelectDialogComponent extends BaseDialogComponent<ECRFSelectClass> {
  // Option field configs - now using configFactory from base class
  readonly optionLabelConfig: InputTextConfig;
  readonly optionValueConfig: InputTextConfig;

  // Element type configuration
  protected elementType: FormElementType = FormElementType.SELECT;

  // Template constants - same as input-text-dialog
  protected readonly FormComponentVariantEnum: typeof FormComponentVariantEnum =
    FormComponentVariantEnum;
  protected readonly FormLabelStyleEnum: typeof FormLabelStyleEnum = FormLabelStyleEnum;
  protected readonly FormLabelPositionEnum: typeof FormLabelPositionEnum = FormLabelPositionEnum;
  protected readonly FormComponentSizeEnum: typeof FormComponentSizeEnum = FormComponentSizeEnum;
  protected readonly DEFAULT_SCROLL_HEIGHT = DEFAULT_SCROLL_HEIGHT;

  constructor(private iconService: IconMappingService) {
    super();

    // Get the option field configs from the factory - same pattern as input-text-dialog
    const optionConfigs: OptionFieldConfigs = this.configFactory.getOptionFieldConfigs();
    this.optionLabelConfig = optionConfigs.optionLabelConfig;
    this.optionValueConfig = optionConfigs.optionValueConfig;

    // Enhanced validation is enabled by default in base class
    // Select validation is already registered in DialogValidationService
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
    // Just mark form as changed - same as before
    this.hasUnsavedChanges = true;
  }

  /**
   * Implementation of PresetSupport interface - get the current configuration
   */
  getConfigurationForPreset(): IPresetConfiguration {
    return {
      label: this.form.value.label,
      placeholder: this.form.value.placeholder,
      required: this.form.value.required,
      disabled: this.form.value.disabled,
      filter: this.form.value.filter,
      showClear: this.form.value.showClear,
      group: this.form.value.group,
      optionLabel: this.form.value.optionLabel,
      optionValue: this.form.value.optionValue,
      labelStyle: this.form.value.labelStyle,
      labelPosition: this.form.value.labelPosition,
      size: this.form.value.size,
      variant: this.form.value.variant,
      helperText: this.form.value.helperText,
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
      placeholder: config['placeholder'] || this.dialogConfiguration.defaultValues?.['placeholder'],
      required: config['required'] || this.dialogConfiguration.defaultValues?.['required'],
      disabled: config['disabled'] || this.dialogConfiguration.defaultValues?.['disabled'],
      filter: config['filter'] || this.dialogConfiguration.defaultValues?.['filter'],
      showClear: config['showClear'] || this.dialogConfiguration.defaultValues?.['showClear'],
      group: config['group'] || this.dialogConfiguration.defaultValues?.['group'],
      optionLabel: config['optionLabel'] || this.dialogConfiguration.defaultValues?.['optionLabel'],
      optionValue: config['optionValue'] || this.dialogConfiguration.defaultValues?.['optionValue'],
      labelStyle: config['labelStyle'] || this.dialogConfiguration.defaultValues?.['labelStyle'],
      labelPosition:
        config['labelPosition'] || this.dialogConfiguration.defaultValues?.['labelPosition'],
      size: config['size'] || this.dialogConfiguration.defaultValues?.['size'],
      variant: config['variant'] || this.dialogConfiguration.defaultValues?.['variant'],
      helperText: config['helperText'] || '',
    });

    // Handle an options array using PresetManagerService
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
    super.ngOnInit(); // Call parent to get all validation and registry setup
    this.setupDynamicBehavior(); // Add select-specific behavior
  }

  /**
   * Override to add additional validation specific to select - same pattern as input-text-dialog
   */
  protected override onFormValueChange(): void {
    super.onFormValueChange(); // This handles enhanced validation
    // Add any select-specific logic here if needed
  }

  /**
   * Patch form values from the existing control - same pattern as input-text-dialog
   */
  protected patchFormValues(): void {
    if (!this.control) return;

    // Use registry defaults as fallbacks - same pattern as input-text-dialog
    this.form.patchValue({
      label: this.control.options?.title || this.dialogConfiguration.defaultValues?.['label'],
      placeholder:
        this.control.placeholder || this.dialogConfiguration.defaultValues?.['placeholder'],
      required: this.control.options?.required || false,
      disabled: this.control.options?.disabled || false,
      filter: this.control.filter || this.dialogConfiguration.defaultValues?.['filter'],
      showClear: this.control.showClear || this.dialogConfiguration.defaultValues?.['showClear'],
      group: this.control.group || this.dialogConfiguration.defaultValues?.['group'],
      optionLabel:
        this.control.optionLabel || this.dialogConfiguration.defaultValues?.['optionLabel'],
      optionValue:
        this.control.optionValue || this.dialogConfiguration.defaultValues?.['optionValue'],
      helperText: this.control.options?.helperText || '',
      labelStyle: this.control.labelStyle || this.dialogConfiguration.defaultValues?.['labelStyle'],
      labelPosition:
        this.control.labelPosition || this.dialogConfiguration.defaultValues?.['labelPosition'],
      size: this.control.size || this.dialogConfiguration.defaultValues?.['size'],
      variant: this.control.variant || this.dialogConfiguration.defaultValues?.['variant'],
    });

    // Handle existing options using PresetManagerService
    if (this.control.selectOptions && Array.isArray(this.control.selectOptions)) {
      this.presetManager.applyOptionsToForm(this.control.selectOptions, this.form);
    } else {
      // Add default options if none exist
      const options: OptionItem[] = this.presetManager.createDefaultOptions(2);
      this.presetManager.applyOptionsToForm(options, this.form);
    }
  }

  /**
   * Build a result object from form values - same pattern as input-text-dialog
   */
  protected buildResult(): ECRFSelectClass {
    const formValues: any = this.form.value;

    // Create an option object
    const options: ISelectOptions = {
      name: this.sanitizeName(formValues.label),
      title: formValues.label,
      required: formValues.required,
      disabled: formValues.disabled,
      readonly: false,
      helperText: formValues.helperText,
      labelStyle: formValues.labelStyle,
      labelPosition: formValues.labelPosition,
      size: formValues.size,
      variant: formValues.variant,
      filter: formValues.filter,
      showClear: formValues.showClear,
      group: formValues.group,
      optionLabel: formValues.optionLabel,
      optionValue: formValues.optionValue,
      selectOptions: this.presetManager.extractOptionsFromForm(this.form),
    };

    if (this.control) {
      // Update existing select
      Object.assign(this.control, {
        options,
        placeholder: formValues.placeholder,
        selectOptions: this.presetManager.extractOptionsFromForm(this.form),
        labelStyle: formValues.labelStyle,
        labelPosition: formValues.labelPosition,
        size: formValues.size,
        variant: formValues.variant,
        filter: formValues.filter,
        showClear: formValues.showClear,
        group: formValues.group,
        optionLabel: formValues.optionLabel,
        optionValue: formValues.optionValue,
      });
      return this.control;
    } else {
      // Create new select
      const select = new ECRFSelectClass(this.iconService, options);
      Object.assign(select, {
        placeholder: formValues.placeholder,
        selectOptions: this.presetManager.extractOptionsFromForm(this.form),
      });
      return select;
    }
  }

  /**
   * Get tab-specific field names for validation - following the pattern from input-text-dialog
   */
  protected getSelectOptionsTabFields(): string[] {
    return ['optionLabel', 'optionValue', 'optionGroupLabel', 'optionGroupChildren'];
  }

  /**
   * Override the base getOptionsTabFields to include select-specific fields
   */
  protected override getOptionsTabFields(): string[] {
    return ['options', ...this.getSelectOptionsTabFields()];
  }

  /**
   * Set up dynamic form behavior specific to select - same pattern as input-text-dialog
   */
  private setupDynamicBehavior(): void {
    // Use PresetManagerService to handle group-related field dependencies
    this.presetManager.setupFieldDependency(
      this.form,
      'group',
      ['optionLabel', 'optionValue'],
      (isGroup: boolean): boolean => isGroup,
    );

    // Handle group validation setup using PresetManagerService
    this.form.get('group')?.valueChanges.subscribe((isGroup: boolean): void => {
      this.presetManager.applyGroupSettings(isGroup, this.form);
    });
  }
}
