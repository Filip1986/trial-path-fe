import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import {
  Multiselect,
  MultiselectOptions,
} from '../../../form-controls/form-elements/multiselect/multiselect.class';
import { IconMappingService } from '../../../core/services/icon-mapping.service';
import {
  MultiSelectDisplayModeEnum,
  LibInputTextComponent,
  LibMultiSelectComponent,
  InputTextConfig,
  FormComponentVariantEnum,
  FormLabelStyleEnum,
  FormLabelPositionEnum,
  FormComponentSizeEnum,
} from '@artificial-sense/ui-lib';
import { BaseDialogComponent } from '../../core/abstracts/base-dialog.component';
import { DialogSharedModule } from '../../dialog-shared.module';
import { Tabs, TabsModule, TabsStyle } from 'primeng/tabs';
import { SavePresetDialogComponent } from '../../shared/components/presets/save-preset-dialog/save-preset-dialog.component';
import { LoadPresetDialogComponent } from '../../shared/components/presets/load-preset-dialog/load-preset-dialog.component';
import { DialogWrapperComponent } from '../../shared/components/dialog-wrapper/dialog-wrapper.component';
import { OptionsManagerComponent } from '../../shared/components/options-manager/options-manager.component';
import { OptionFieldConfigs, OptionItem } from '../../../core/models/interfaces/options.interfaces';
import { FormElementType } from '../../../core/models/enums/form.enums';
import { IPresetConfiguration } from '../../../core/models/interfaces/preset.interfaces';
import { DialogConfigBuilder } from '../../core/builders/config-builders';
import { DropdownOption } from '../../core/models/dialog.types';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogConfirmationService } from '../../core/services/dialog-confirmation.service';

@Component({
  selector: 'app-enhanced-multiselect-dialog',
  templateUrl: './multiselect-dialog.component.html',
  styleUrls: ['./multiselect-dialog.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    SelectModule,
    CheckboxModule,
    DialogWrapperComponent,
    OptionsManagerComponent,
    LibInputTextComponent,
    LibMultiSelectComponent,
    DialogSharedModule,
    TabsModule,
    SavePresetDialogComponent,
    LoadPresetDialogComponent,
    ConfirmDialog
],
  providers: [Tabs, TabsStyle, ConfirmationService, DialogConfirmationService],
})
export class MultiselectDialogComponent extends BaseDialogComponent<Multiselect> {
  // Additional field configs for multiselect-specific options
  readonly optionLabelConfig: InputTextConfig;
  readonly optionValueConfig: InputTextConfig;
  readonly optionGroupLabelConfig: InputTextConfig;
  readonly optionGroupChildrenConfig: InputTextConfig;

  // Cached dropdown options
  readonly displayModes: DropdownOption<MultiSelectDisplayModeEnum>[] =
    this.configFactory.getEnumOptions(MultiSelectDisplayModeEnum);

  protected elementType: FormElementType = FormElementType.MULTISELECT;

  protected readonly FormComponentVariantEnum: typeof FormComponentVariantEnum =
    FormComponentVariantEnum;
  protected readonly FormLabelStyleEnum: typeof FormLabelStyleEnum = FormLabelStyleEnum;
  protected readonly FormLabelPositionEnum: typeof FormLabelPositionEnum = FormLabelPositionEnum;
  protected readonly FormComponentSizeEnum: typeof FormComponentSizeEnum = FormComponentSizeEnum;

  constructor(private iconService: IconMappingService) {
    super();

    // Get the option field configs from the factory
    const optionConfigs: OptionFieldConfigs = this.configFactory.getOptionFieldConfigs();
    this.optionLabelConfig = optionConfigs.optionLabelConfig;
    this.optionValueConfig = optionConfigs.optionValueConfig;

    // Custom configs for group-specific fields
    this.optionGroupLabelConfig = DialogConfigBuilder.createTextConfig(
      'Group Label Field',
      'e.g. category',
      {
        helperText: 'Field to use as the group label',
        required: true,
      },
    );

    this.optionGroupChildrenConfig = DialogConfigBuilder.createTextConfig(
      'Group Children Field',
      'e.g. items',
      {
        helperText: 'Field containing the group items',
        required: true,
      },
    );

    // Enhanced validation is enabled by default in base class
    // Multiselect validation is already registered in DialogValidationService
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
      placeholder: this.form.value.placeholder,
      required: this.form.value.required,
      disabled: this.form.value.disabled,
      multiple: this.form.value.multiple,
      filter: this.form.value.filter,
      showToggleAll: this.form.value.showToggleAll,
      group: this.form.value.group,
      optionLabel: this.form.value.optionLabel,
      optionValue: this.form.value.optionValue,
      optionGroupLabel: this.form.value.optionGroupLabel,
      optionGroupChildren: this.form.value.optionGroupChildren,
      maxSelectedLabels: this.form.value.maxSelectedLabels,
      labelStyle: this.form.value.labelStyle,
      labelPosition: this.form.value.labelPosition,
      display: this.form.value.display,
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
    // Apply values (defaults come from registry config)
    this.form.patchValue({
      label: config['label'] || this.dialogConfiguration.defaultValues?.['label'],
      placeholder: config['placeholder'] || this.dialogConfiguration.defaultValues?.['placeholder'],
      required: config['required'] || this.dialogConfiguration.defaultValues?.['required'],
      disabled: config['disabled'] || this.dialogConfiguration.defaultValues?.['disabled'],
      multiple: config['multiple'] ?? this.dialogConfiguration.defaultValues?.['multiple'],
      filter: config['filter'] || this.dialogConfiguration.defaultValues?.['filter'],
      showToggleAll:
        config['showToggleAll'] ?? this.dialogConfiguration.defaultValues?.['showToggleAll'],
      group: config['group'] || this.dialogConfiguration.defaultValues?.['group'],
      optionLabel: config['optionLabel'] || this.dialogConfiguration.defaultValues?.['optionLabel'],
      optionValue: config['optionValue'] || this.dialogConfiguration.defaultValues?.['optionValue'],
      maxSelectedLabels: config['maxSelectedLabels'],
      labelStyle: config['labelStyle'] || this.dialogConfiguration.defaultValues?.['labelStyle'],
      labelPosition:
        config['labelPosition'] || this.dialogConfiguration.defaultValues?.['labelPosition'],
      display: config['display'] || this.dialogConfiguration.defaultValues?.['display'],
      size: config['size'] || this.dialogConfiguration.defaultValues?.['size'],
      variant: config['variant'] || this.dialogConfiguration.defaultValues?.['variant'],
      helperText: config['helperText'] || '',
    });

    // Handle group-specific fields
    if (config['group']) {
      this.form.patchValue({
        optionGroupLabel: config['optionGroupLabel'] || '',
        optionGroupChildren: config['optionGroupChildren'] || '',
      });
    }

    // Handle display mode and maxSelectedLabels relationship
    if (config['display'] === MultiSelectDisplayModeEnum.CHIP && !config['maxSelectedLabels']) {
      this.form.get('maxSelectedLabels')?.setValue(3); // Default for chip display mode
    }

    // Handle an option array using PresetManagerService
    const options: OptionItem[] = config.options || this.presetManager.createDefaultOptions(2);
    this.presetManager.applyOptionsToForm(options, this.form);

    // Apply preset-specific behaviors using PresetManagerService
    this.applyPresetBehaviors(config);

    this.hasUnsavedChanges = true;
  }

  /**
   * Override ngOnInit to add component-specific behavior
   */
  override ngOnInit(): void {
    super.ngOnInit(); // Call parent to get all the registry and validation setup
    this.setupDynamicBehavior(); // Add multiselect-specific behavior
  }

  /**
   * Override to add additional validation specific to multiselect
   */
  protected override onFormValueChange(): void {
    super.onFormValueChange(); // This handles enhanced validation
    // Add any multiselect-specific logic here if needed
  }

  protected patchFormValues(): void {
    if (!this.control) return;

    // Patch all basic values
    this.form.patchValue({
      label: this.control.options?.title || this.dialogConfiguration.defaultValues?.['label'],
      placeholder:
        this.control.placeholder || this.dialogConfiguration.defaultValues?.['placeholder'],
      required: this.control.options?.required || false,
      disabled: this.control.options?.disabled || false,
      multiple: this.control.multiple ?? this.dialogConfiguration.defaultValues?.['multiple'],
      filter: this.control.filter ?? this.dialogConfiguration.defaultValues?.['filter'],
      showToggleAll:
        this.control.showToggleAll ?? this.dialogConfiguration.defaultValues?.['showToggleAll'],
      group: this.control.group || this.dialogConfiguration.defaultValues?.['group'],
      optionLabel:
        this.control.optionLabel || this.dialogConfiguration.defaultValues?.['optionLabel'],
      optionValue:
        this.control.optionValue || this.dialogConfiguration.defaultValues?.['optionValue'],
      optionGroupLabel: this.control.optionGroupLabel || '',
      optionGroupChildren: this.control.optionGroupChildren || '',
      maxSelectedLabels: this.control.maxSelectedLabels,
      helperText: this.control.options?.helperText || '',
      labelStyle: this.control.labelStyle || this.dialogConfiguration.defaultValues?.['labelStyle'],
      labelPosition:
        this.control.labelPosition || this.dialogConfiguration.defaultValues?.['labelPosition'],
      display: this.control.display || this.dialogConfiguration.defaultValues?.['display'],
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

  protected buildResult(): Multiselect {
    const formValues: any = this.form.value;

    // Create an option object
    const options: MultiselectOptions = {
      name: this.sanitizeName(formValues.label),
      title: formValues.label,
      required: formValues.required,
      disabled: formValues.disabled,
      readonly: false,
      helperText: formValues.helperText,
      labelStyle: formValues.labelStyle,
      labelPosition: formValues.labelPosition,
      display: formValues.display,
      size: formValues.size,
      variant: formValues.variant,
      multiple: formValues.multiple,
      filter: formValues.filter,
      showToggleAll: formValues.showToggleAll,
      group: formValues.group,
      optionLabel: formValues.optionLabel,
      optionValue: formValues.optionValue,
      optionGroupLabel: formValues.optionGroupLabel,
      optionGroupChildren: formValues.optionGroupChildren,
      maxSelectedLabels: formValues.maxSelectedLabels,
      selectOptions: this.presetManager.extractOptionsFromForm(this.form),
    };

    if (this.control) {
      // Update existing multiselect
      Object.assign(this.control, {
        options,
        placeholder: formValues.placeholder,
        selectOptions: this.presetManager.extractOptionsFromForm(this.form),
        labelStyle: formValues.labelStyle,
        labelPosition: formValues.labelPosition,
        display: formValues.display,
        size: formValues.size,
        variant: formValues.variant,
        multiple: formValues.multiple,
        filter: formValues.filter,
        showToggleAll: formValues.showToggleAll,
        group: formValues.group,
        optionLabel: formValues.optionLabel,
        optionValue: formValues.optionValue,
        optionGroupLabel: formValues.optionGroupLabel,
        optionGroupChildren: formValues.optionGroupChildren,
        maxSelectedLabels: formValues.maxSelectedLabels,
      });
      return this.control;
    } else {
      // Create a new multiselect
      const multiselect = new Multiselect(this.iconService, options);
      Object.assign(multiselect, {
        placeholder: formValues.placeholder,
        selectOptions: this.presetManager.extractOptionsFromForm(this.form),
      });
      return multiselect;
    }
  }

  /**
   * Override to include option tab fields
   */
  protected override getOptionsTabFields(): string[] {
    return [
      'options',
      'optionLabel',
      'optionValue',
      'optionGroupLabel',
      'optionGroupChildren',
      'group',
    ];
  }

  /**
   * Override appearance tab fields to include display-specific fields
   */
  protected override getAppearanceTabFields(): string[] {
    return [...super.getAppearanceTabFields(), 'display', 'maxSelectedLabels'];
  }

  /**
   * Set up dynamic form behavior specific to multiselect
   */
  private setupDynamicBehavior(): void {
    // Use PresetManagerService to handle group-related field dependencies
    this.presetManager.setupFieldDependency(
      this.form,
      'group',
      ['optionGroupLabel', 'optionGroupChildren'],
      (isGroup: boolean): boolean => isGroup,
    );

    // Handle group validation setup using PresetManagerService
    this.form.get('group')?.valueChanges.subscribe((isGroup: boolean): void => {
      this.presetManager.applyGroupSettings(isGroup, this.form);
    });

    // When display mode changes to chip, suggest a reasonable maxSelectedLabels
    this.form.get('display')?.valueChanges.subscribe((displayMode: any): void => {
      if (
        displayMode === MultiSelectDisplayModeEnum.CHIP &&
        !this.form.get('maxSelectedLabels')?.value
      ) {
        this.form.get('maxSelectedLabels')?.setValue(3);
      }

      // Trigger enhanced validation after display mode changes
      setTimeout((): void => {
        this.performEnhancedValidation();
        this.cdr.markForCheck();
      }, 0);
    });
  }
}
