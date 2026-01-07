import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { ECRFInputTextClass } from '../../../form-controls/form-elements/input-text/ecrf-input-text.class';
import { IconMappingService } from '@core/services/icon-mapping.service';
import {
  LibInputTextComponent,
  FormLabelPositionEnum,
  FormLabelStyleEnum,
  FormComponentVariantEnum,
  FormComponentSizeEnum,
  IconSelectComponent,
  InputTextConfig,
} from '@artificial-sense/ui-lib';
import { DialogSharedModule } from '../../dialog-shared.module';
import { Tabs, TabsModule, TabsStyle } from 'primeng/tabs';
import { SavePresetDialogComponent } from '../../shared/components/presets/save-preset-dialog/save-preset-dialog.component';
import { LoadPresetDialogComponent } from '../../shared/components/presets/load-preset-dialog/load-preset-dialog.component';
import { DialogWrapperComponent } from '../../shared/components/dialog-wrapper/dialog-wrapper.component';
import { FormElementType } from '@core/models/enums/form.enums';
import { IPresetConfiguration } from '@core/models/interfaces/preset.interfaces';
import { ITextInputOptions } from '@core/models/interfaces/input-text.interfaces';
import { BaseDialogComponent } from '@core/abstracts/base-dialog.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogConfirmationService } from '@core/services/dialog-confirmation.service';

@Component({
  selector: 'app-enhanced-input-text-dialog',
  templateUrl: './input-text-dialog.component.html',
  styleUrls: ['./input-text-dialog.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DialogSharedModule,
    ReactiveFormsModule,
    SelectModule,
    CheckboxModule,
    DialogWrapperComponent,
    LibInputTextComponent,
    TabsModule,
    IconSelectComponent,
    SavePresetDialogComponent,
    LoadPresetDialogComponent,
    ConfirmDialogModule
],
  providers: [Tabs, TabsStyle, ConfirmationService, DialogConfirmationService],
})
export class InputTextDialogComponent extends BaseDialogComponent<ECRFInputTextClass> {
  // Validation configs - now using configFactory from base class
  readonly minLengthConfig: InputTextConfig | undefined =
    this.configFactory.getValidationConfigs('text').minLengthConfig;
  readonly maxLengthConfig: InputTextConfig | undefined =
    this.configFactory.getValidationConfigs('text').maxLengthConfig;

  // Element type configuration
  protected elementType: FormElementType = FormElementType.INPUT_TEXT;

  // Template constants
  protected readonly FormComponentVariantEnum: typeof FormComponentVariantEnum =
    FormComponentVariantEnum;
  protected readonly FormComponentSizeEnum: typeof FormComponentSizeEnum = FormComponentSizeEnum;
  protected readonly FormLabelStyleEnum: typeof FormLabelStyleEnum = FormLabelStyleEnum;
  protected readonly FormLabelPositionEnum: typeof FormLabelPositionEnum = FormLabelPositionEnum;

  constructor(private iconService: IconMappingService) {
    super();
    // Enhanced validation is enabled by default in base class
    // Set to false if you want to disable it for this specific dialog
    // this.enableEnhancedValidation = false;
  }

  // Helper method to get FormControl from the form
  getControl(name: string): FormControl {
    return this.form.get(name) as FormControl;
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
      minLength: this.form.value.minLength,
      maxLength: this.form.value.maxLength,
      helperText: this.form.value.helperText,
      labelStyle: this.form.value.labelStyle,
      labelPosition: this.form.value.labelPosition,
      iconClass: this.form.value.iconClass,
      iconPosition: this.form.value.iconPosition,
      customValidationRules: this.form.value.customValidationRules || [],
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
      minLength: config['minLength'] || null,
      maxLength: config['maxLength'] || null,
      helperText: config['helperText'] || '',
      labelStyle: config['labelStyle'] || this.dialogConfiguration.defaultValues?.['labelStyle'],
      labelPosition:
        config['labelPosition'] || this.dialogConfiguration.defaultValues?.['labelPosition'],
      iconClass: config['iconClass'] || '',
      iconPosition:
        config['iconPosition'] || this.dialogConfiguration.defaultValues?.['iconPosition'],
      customValidationRules: config['customValidationRules'] || [],
    });

    // Apply preset-specific behaviors using PresetManagerService
    this.applyPresetBehaviors(config);

    this.hasUnsavedChanges = true;
  }

  /**
   * Override ngOnInit to add component-specific behavior
   */
  override ngOnInit(): void {
    super.ngOnInit(); // Call parent to get all the registry and validation setup
    this.setupDynamicBehavior(); // Add input-text-specific behavior
  }

  /**
   * Override to include custom validation tab fields
   */
  protected override getCustomValidationTabFields(): string[] {
    return ['customValidationRules'];
  }

  /**
   * Override to add additional validation specific to textarea
   */
  protected override onFormValueChange(): void {
    super.onFormValueChange(); // This handles enhanced validation
    // Add any input-text specific logic here if needed
  }

  /**
   * Patch form values from the existing control
   */
  protected patchFormValues(): void {
    if (!this.control) return;

    this.form.patchValue({
      label: this.control.options?.title || this.dialogConfiguration.defaultValues?.['label'],
      placeholder:
        this.control.placeholder || this.dialogConfiguration.defaultValues?.['placeholder'],
      required: this.control.options?.required || false,
      disabled: this.control.options?.disabled || false,
      minLength: this.control.minLength,
      maxLength: this.control.maxLength,
      helperText: this.control.options?.helperText || '',
      labelStyle: this.control.labelStyle || this.dialogConfiguration.defaultValues?.['labelStyle'],
      labelPosition:
        this.control.labelPosition || this.dialogConfiguration.defaultValues?.['labelPosition'],
      iconClass: this.control.iconClass || '',
      iconPosition:
        this.control.iconPosition || this.dialogConfiguration.defaultValues?.['iconPosition'],
    });
  }

  /**
   * Build a result object from form values
   */
  protected buildResult(): ECRFInputTextClass {
    const formValues: any = this.form.value;

    // Create an option object
    const options: ITextInputOptions = {
      name: this.sanitizeName(formValues.label),
      title: formValues.label,
      required: formValues.required,
      disabled: formValues.disabled,
      readonly: false,
      helperText: formValues.helperText,
      labelStyle: formValues.labelStyle,
      labelPosition: formValues.labelPosition,
      iconClass: formValues.iconClass,
      iconPosition: formValues.iconPosition,
      customValidationRules: formValues.customValidationRules || [],
    };

    if (this.control) {
      // Update existing control
      Object.assign(this.control, {
        options,
        placeholder: formValues.placeholder,
        minLength: formValues.minLength,
        maxLength: formValues.maxLength,
        labelStyle: formValues.labelStyle,
        labelPosition: formValues.labelPosition,
        iconClass: formValues.iconClass,
        iconPosition: formValues.iconPosition,
        customValidationRules: formValues.customValidationRules || [],
      });
      return this.control;
    } else {
      // Create new control
      const control = new ECRFInputTextClass(this.iconService, options);
      Object.assign(control, {
        placeholder: formValues.placeholder,
        minLength: formValues.minLength,
        maxLength: formValues.maxLength,
        customValidationRules: formValues.customValidationRules || [],
      });
      return control;
    }
  }

  /**
   * Set up dynamic form behavior specific to input text
   */
  private setupDynamicBehavior(): void {
    // Icon position changes when no icon is selected
    this.presetManager.setupFieldDependency(
      this.form,
      'iconClass',
      ['iconPosition'],
      (iconClass: string): boolean => !!iconClass && iconClass.trim().length > 0,
    );
  }
}
