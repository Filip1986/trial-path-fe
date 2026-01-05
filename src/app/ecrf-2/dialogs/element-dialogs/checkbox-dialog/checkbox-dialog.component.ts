import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { ECRFCheckboxClass } from '../../../form-controls/form-elements/checkbox/checkbox.class';
import { IconMappingService } from '../../../core/services/icon-mapping.service';
import {
  LibCheckboxComponent,
  CheckboxModeEnum,
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  LibInputTextComponent,
  FormLabelStyleEnum,
  FormLabelPositionEnum,
  InputTextConfig,
} from '@artificial-sense/ui-lib';
import { BaseDialogComponent } from '../../core/abstracts/base-dialog.component';
import { DialogSharedModule } from '../../dialog-shared.module';
import { Tabs, TabsModule, TabsStyle } from 'primeng/tabs';
import { SavePresetDialogComponent } from '../../shared/components/presets/save-preset-dialog/save-preset-dialog.component';
import { LoadPresetDialogComponent } from '../../shared/components/presets/load-preset-dialog/load-preset-dialog.component';
import { DialogWrapperComponent } from '../../shared/components/dialog-wrapper/dialog-wrapper.component';
import { OptionsManagerComponent } from '../../shared/components/options-manager/options-manager.component';
import { OptionItem } from '../../../core/models/interfaces/options.interfaces';
import { FormElementType } from '../../../core/models/enums/form.enums';
import { IPresetConfiguration } from '../../../core/models/interfaces/preset.interfaces';
import { ICheckboxOptions } from '../../../core/models/interfaces/checkbox.interfaces';
import { DropdownOption } from '../../core/models/dialog.types';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogConfirmationService } from '../../core/services/dialog-confirmation.service';

@Component({
  selector: 'app-checkbox-dialog',
  templateUrl: './checkbox-dialog.component.html',
  styleUrls: ['./checkbox-dialog.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    SelectModule,
    CheckboxModule,
    DialogWrapperComponent,
    LibInputTextComponent,
    LibCheckboxComponent,
    DialogSharedModule,
    TabsModule,
    OptionsManagerComponent,
    SavePresetDialogComponent,
    LoadPresetDialogComponent,
    ConfirmDialog
],
  providers: [Tabs, TabsStyle, ConfirmationService, DialogConfirmationService],
})
export class CheckboxDialogComponent extends BaseDialogComponent<ECRFCheckboxClass> {
  // Checkbox-specific field configs
  readonly groupTitleConfig: InputTextConfig;

  // Cached dropdown options
  readonly modes: DropdownOption<CheckboxModeEnum>[] =
    this.configFactory.getEnumOptions(CheckboxModeEnum);

  // Element type configuration
  protected elementType: FormElementType = FormElementType.CHECKBOX;

  // Template constants
  protected readonly CheckboxModeEnum: typeof CheckboxModeEnum = CheckboxModeEnum;
  protected readonly FormComponentVariantEnum: typeof FormComponentVariantEnum =
    FormComponentVariantEnum;
  protected readonly FormComponentSizeEnum: typeof FormComponentSizeEnum = FormComponentSizeEnum;
  protected readonly FormLabelStyleEnum: typeof FormLabelStyleEnum = FormLabelStyleEnum;
  protected readonly FormLabelPositionEnum: typeof FormLabelPositionEnum = FormLabelPositionEnum;

  constructor(private iconService: IconMappingService) {
    super();

    // Initialize checkbox-specific configs
    this.groupTitleConfig = this.configFactory.getCheckboxDialogConfig().groupTitleConfig;

    // Enhanced validation is enabled by default in base class
    // Checkbox validation is already registered in DialogValidationService
  }

  // Helper method to get FormControl from the form
  getControl(name: string): FormControl {
    return this.form.get(name) as FormControl;
  }

  /**
   * Check if options are defined
   */
  hasOptions(): boolean {
    const options: any = this.form.get('options')?.value;
    return options && Array.isArray(options) && options.length > 0;
  }

  /**
   * Get current options from the form
   */
  getOptions(): OptionItem[] {
    return this.presetManager.extractOptionsFromForm(this.form);
  }

  /**
   * Handle options change from the options manager
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
      helperText: this.form.value.helperText,
      required: this.form.value.required,
      disabled: this.form.value.disabled,
      mode: this.form.value.mode,
      size: this.form.value.size,
      variant: this.form.value.variant,
      indeterminate: this.form.value.indeterminate,
      labelStyle: this.form.value.labelStyle,
      labelPosition: this.form.value.labelPosition,
      groupTitle: this.form.value.groupTitle,
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
      helperText: config['helperText'] || '',
      required: config['required'] || this.dialogConfiguration.defaultValues?.['required'],
      disabled: config['disabled'] || this.dialogConfiguration.defaultValues?.['disabled'],
      mode: config['mode'] || this.dialogConfiguration.defaultValues?.['mode'],
      size: config['size'] || this.dialogConfiguration.defaultValues?.['size'],
      variant: config['variant'] || this.dialogConfiguration.defaultValues?.['variant'],
      indeterminate:
        config['indeterminate'] || this.dialogConfiguration.defaultValues?.['indeterminate'],
      labelStyle: config['labelStyle'] || this.dialogConfiguration.defaultValues?.['labelStyle'],
      labelPosition:
        config['labelPosition'] || this.dialogConfiguration.defaultValues?.['labelPosition'],
      groupTitle: config['groupTitle'] || '',
    });

    // Handle options for GROUP mode
    if (config['mode'] === CheckboxModeEnum.GROUP) {
      const options: OptionItem[] = config.options || this.presetManager.createDefaultOptions(1);
      this.presetManager.applyOptionsToForm(options, this.form);
    }

    // Apply preset-specific behaviors using PresetManagerService
    this.applyPresetBehaviors(config);

    this.hasUnsavedChanges = true;
  }

  /**
   * Override ngOnInit to add component-specific behavior
   */
  override ngOnInit(): void {
    super.ngOnInit(); // Call parent to get all validation and registry setup
    this.setupDynamicBehavior(); // Add checkbox-specific behavior
  }

  /**
   * Override to add additional validation specific to checkbox
   */
  protected override onFormValueChange(): void {
    super.onFormValueChange(); // This handles enhanced validation
    // Add any checkbox-specific logic here if needed
  }

  /**
   * Patch form values from the existing control
   */
  protected patchFormValues(): void {
    if (!this.control) return;

    this.form.patchValue({
      label: this.control.options?.title || this.dialogConfiguration.defaultValues?.['label'],
      required: this.control.options?.required || false,
      disabled: this.control.options?.disabled || false,
      mode: this.control.mode || this.dialogConfiguration.defaultValues?.['mode'],
      size: this.control.size || this.dialogConfiguration.defaultValues?.['size'],
      variant: this.control.variant || this.dialogConfiguration.defaultValues?.['variant'],
      indeterminate:
        this.control.indeterminate || this.dialogConfiguration.defaultValues?.['indeterminate'],
      helperText: this.control.options?.helperText || '',
      labelStyle: this.control.labelStyle || this.dialogConfiguration.defaultValues?.['labelStyle'],
      labelPosition:
        this.control.labelPosition || this.dialogConfiguration.defaultValues?.['labelPosition'],
      groupTitle: this.control.options?.groupTitle || '',
    });

    // Handle options for GROUP mode
    if (this.control.mode === CheckboxModeEnum.GROUP) {
      const options: OptionItem[] =
        this.control.options?.options || this.presetManager.createDefaultOptions(1);
      this.presetManager.applyOptionsToForm(options, this.form);
    }
  }

  /**
   * Build a result object from form values
   */
  protected buildResult(): ECRFCheckboxClass {
    const formValues: any = this.form.value;
    const mode = formValues.mode as CheckboxModeEnum;

    const options: ICheckboxOptions = {
      name: this.sanitizeName(formValues.label),
      title: formValues.label,
      required: formValues.required,
      disabled: formValues.disabled,
      readonly: false,
      helperText: formValues.helperText,
      mode: mode,
      size: formValues.size,
      variant: formValues.variant,
      labelStyle: formValues.labelStyle,
      labelPosition: formValues.labelPosition,
    };

    // Add group-specific options
    if (mode === CheckboxModeEnum.GROUP) {
      options.groupTitle = formValues.groupTitle;
      options.options = this.presetManager.extractOptionsFromForm(this.form);
    }

    const initialValue: false | never[] = mode === CheckboxModeEnum.GROUP ? [] : false;

    if (this.control) {
      // Update existing checkbox
      Object.assign(this.control, {
        options,
        mode: formValues.mode,
        size: formValues.size,
        variant: formValues.variant,
        indeterminate: formValues.indeterminate,
        labelStyle: formValues.labelStyle,
        labelPosition: formValues.labelPosition,
      });

      // Reset value if mode changed
      if (this.control.mode !== mode) {
        this.control.value = initialValue;
      }

      return this.control;
    } else {
      // Create a new checkbox
      const checkbox = new ECRFCheckboxClass(this.iconService, options, initialValue);
      Object.assign(checkbox, {
        indeterminate: formValues.indeterminate,
      });
      return checkbox;
    }
  }

  /**
   * Get field names for option tab validation
   */
  protected override getOptionsTabFields(): string[] {
    return ['options', 'groupTitle'];
  }

  /**
   * Set up dynamic form behavior specific to checkbox
   */
  private setupDynamicBehavior(): void {
    // Use PresetManagerService to handle mode-dependent field enabling/disabling
    this.presetManager.setupFieldDependency(
      this.form,
      'mode',
      ['indeterminate'],
      (mode: any): boolean => mode === CheckboxModeEnum.BINARY,
    );

    // Handle options management for GROUP mode
    this.form.get('mode')?.valueChanges.subscribe((mode: any): void => {
      if (mode === CheckboxModeEnum.GROUP) {
        const optionsArray: AbstractControl<any, any> | null = this.form.get('options');
        if (!optionsArray?.value || optionsArray.value.length === 0) {
          this.presetManager.applyOptionsToForm(
            this.presetManager.createDefaultOptions(1),
            this.form,
          );
        }
      }

      // Trigger validation after mode change
      setTimeout((): void => {
        this.performEnhancedValidation();
        this.cdr.markForCheck();
      }, 0);
    });
  }
}
