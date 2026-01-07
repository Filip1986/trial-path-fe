import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { ECRFListBoxClass } from '../../../form-controls/form-elements/listbox/listbox.class';
import { IconMappingService } from '@core/services/icon-mapping.service';
import {
  LibInputTextComponent,
  LibListboxComponent,
  FormLabelPositionEnum,
  FormLabelStyleEnum,
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  InputTextConfig,
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
import { IListBoxOptions } from '@core/models/interfaces/list-box.interfaces';
import { DialogConfigBuilder } from '@core/builders/config-builders';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogConfirmationService } from '@core/services/dialog-confirmation.service';

@Component({
  selector: 'app-listbox-dialog',
  templateUrl: './listbox-dialog.component.html',
  styleUrls: ['./listbox-dialog.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    SelectModule,
    CheckboxModule,
    DialogWrapperComponent,
    OptionsManagerComponent,
    LibInputTextComponent,
    LibListboxComponent,
    DialogSharedModule,
    TabsModule,
    SavePresetDialogComponent,
    LoadPresetDialogComponent,
    ConfirmDialog
],
  providers: [Tabs, TabsStyle, ConfirmationService, DialogConfirmationService],
})
export class ListBoxDialogComponent extends BaseDialogComponent<ECRFListBoxClass> {
  // ListBox-specific option field configs (unique to this component)
  readonly optionLabelConfig: InputTextConfig;
  readonly optionValueConfig: InputTextConfig;
  readonly optionGroupLabelConfig: InputTextConfig;
  readonly optionGroupChildrenConfig: InputTextConfig;

  protected elementType: FormElementType = FormElementType.LIST_BOX;
  protected readonly FormComponentVariantEnum = FormComponentVariantEnum;
  protected readonly FormLabelStyleEnum = FormLabelStyleEnum;
  protected readonly FormLabelPositionEnum: typeof FormLabelPositionEnum = FormLabelPositionEnum;
  protected readonly FormComponentSizeEnum: typeof FormComponentSizeEnum = FormComponentSizeEnum;

  constructor(private iconService: IconMappingService) {
    super();

    // Initialize option field configs from configFactory
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
    // ListBox validation rules are already registered in DialogValidationService
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
    // Just mark form as changed and trigger validation
    this.hasUnsavedChanges = true;

    // Trigger enhanced validation after options change
    setTimeout((): void => {
      this.performEnhancedValidation();
      this.cdr.markForCheck();
    }, 0);
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
      checkbox: this.form.value.checkbox,
      filter: this.form.value.filter,
      group: this.form.value.group,
      optionLabel: this.form.value.optionLabel,
      optionValue: this.form.value.optionValue,
      optionGroupLabel: this.form.value.optionGroupLabel,
      optionGroupChildren: this.form.value.optionGroupChildren,
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
    // Use registry defaults when config values are missing
    this.form.patchValue({
      label: config['label'] || this.dialogConfiguration.defaultValues?.['label'],
      required: config['required'] || this.dialogConfiguration.defaultValues?.['required'],
      disabled: config['disabled'] || this.dialogConfiguration.defaultValues?.['disabled'],
      multiple: config['multiple'] || this.dialogConfiguration.defaultValues?.['multiple'],
      checkbox: config['checkbox'] || this.dialogConfiguration.defaultValues?.['checkbox'],
      filter: config['filter'] || this.dialogConfiguration.defaultValues?.['filter'],
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

    // Handle group-specific fields
    if (config['group']) {
      this.form.patchValue({
        optionGroupLabel: config['optionGroupLabel'] || '',
        optionGroupChildren: config['optionGroupChildren'] || '',
      });
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
    this.setupDynamicBehavior(); // Add listbox-specific behavior
  }

  /**
   * Override to add additional validation specific to listbox
   */
  protected override onFormValueChange(): void {
    super.onFormValueChange(); // This handles enhanced validation
    // Add any listbox-specific validation logic here if needed
  }

  protected patchFormValues(): void {
    if (!this.control) return;

    // Use registry defaults as fallbacks
    this.form.patchValue({
      label: this.control.options?.title || this.dialogConfiguration.defaultValues?.['label'],
      required: this.control.options?.required || false,
      disabled: this.control.options?.disabled || false,
      multiple: this.control.multiple || this.dialogConfiguration.defaultValues?.['multiple'],
      checkbox: this.control.checkbox || this.dialogConfiguration.defaultValues?.['checkbox'],
      filter: this.control.filter || this.dialogConfiguration.defaultValues?.['filter'],
      optionLabel:
        this.control.optionLabel || this.dialogConfiguration.defaultValues?.['optionLabel'],
      optionValue:
        this.control.optionValue || this.dialogConfiguration.defaultValues?.['optionValue'],
      helperText: this.control.options?.helperText || '',
      labelStyle: this.control.labelStyle || this.dialogConfiguration.defaultValues?.['labelStyle'],
      labelPosition:
        this.control.labelPosition || this.dialogConfiguration.defaultValues?.['labelPosition'],
    });

    // Handle existing options using PresetManagerService
    if (this.control.listOptions && Array.isArray(this.control.listOptions)) {
      this.presetManager.applyOptionsToForm(this.control.listOptions, this.form);
    } else {
      // Add default options if none exist
      const options: OptionItem[] = this.presetManager.createDefaultOptions(2);
      this.presetManager.applyOptionsToForm(options, this.form);
    }
  }

  protected buildResult(): ECRFListBoxClass {
    const formValues: any = this.form.value;

    // Create an option object
    const options: IListBoxOptions = {
      name: this.sanitizeName(formValues.label),
      title: formValues.label,
      required: formValues.required,
      disabled: formValues.disabled,
      readonly: false,
      helperText: formValues.helperText,
      multiple: formValues.multiple,
      checkbox: formValues.checkbox,
      filter: formValues.filter,
      optionLabel: formValues.optionLabel || 'label',
      optionValue: formValues.optionValue || 'value',
      labelStyle: formValues.labelStyle,
      labelPosition: formValues.labelPosition,
      listOptions: this.presetManager.extractOptionsFromForm(this.form),
    };

    if (this.control) {
      // Update the existing listbox
      Object.assign(this.control, {
        options,
        multiple: formValues.multiple,
        checkbox: formValues.checkbox,
        filter: formValues.filter,
        group: formValues.group,
        listOptions: this.presetManager.extractOptionsFromForm(this.form),
        optionLabel: formValues.optionLabel || 'label',
        optionValue: formValues.optionValue || 'value',
        optionGroupLabel: formValues.optionGroupLabel,
        optionGroupChildren: formValues.optionGroupChildren,
        labelStyle: formValues.labelStyle,
        labelPosition: formValues.labelPosition,
        size: formValues.size,
        variant: formValues.variant,
      });
      return this.control;
    } else {
      // Create a new listbox
      const listBox = new ECRFListBoxClass(this.iconService, options);
      Object.assign(listBox, {
        group: formValues.group,
        optionGroupLabel: formValues.optionGroupLabel,
        optionGroupChildren: formValues.optionGroupChildren,
        size: formValues.size,
        variant: formValues.variant,
      });
      return listBox;
    }
  }

  /**
   * Get tab-specific field names for validation
   */
  protected override getOptionsTabFields(): string[] {
    return ['options', 'optionLabel', 'optionValue', 'optionGroupLabel', 'optionGroupChildren'];
  }

  /**
   * Set up dynamic form behavior specific to the listbox
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

    // Handle checkbox dependency on multiple selection
    this.presetManager.setupFieldDependency(
      this.form,
      'multiple',
      ['checkbox'],
      (isMultiple: boolean): boolean => isMultiple,
    );

    // Handle checkbox behavior updates for behavior options
    this.form.get('multiple')?.valueChanges.subscribe((isMultiple: boolean): void => {
      this.updateCheckboxBehaviorOption(isMultiple);
    });
  }

  /**
   * Update the checkbox behavior option based on multiple selection
   */
  private updateCheckboxBehaviorOption(isMultiple: boolean): void {
    const checkboxOption = this.behaviorOptions.find((o) => o.name === 'checkbox');

    if (checkboxOption) {
      checkboxOption.disabled = !isMultiple;
    }

    // If multiple is disabled, also disable the checkbox
    if (!isMultiple) {
      this.form.get('checkbox')?.setValue(false);
    }
  }
}
