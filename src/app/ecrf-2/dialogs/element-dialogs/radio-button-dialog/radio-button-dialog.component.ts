import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { ECRFRadioButtonClass } from '../../../form-controls/form-elements/radio-button/radio-button.class';
import { IconMappingService } from '../../../core/services/icon-mapping.service';
import {
  RadioButtonModeEnum,
  LibRadioButtonComponent,
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  FormLabelPositionEnum,
  FormLabelStyleEnum,
  LibInputTextComponent,
  LibSelectComponent,
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
import { IRadioButtonOptions } from '../../../core/models/interfaces/radio.interfaces';
import { DropdownOption } from '../../core/models/dialog.types';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogConfirmationService } from '../../core/services/dialog-confirmation.service';

@Component({
  selector: 'app-enhanced-radio-button-dialog',
  templateUrl: './radio-button-dialog.component.html',
  styleUrls: ['./radio-button-dialog.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    SelectModule,
    CheckboxModule,
    DialogWrapperComponent,
    OptionsManagerComponent,
    LibRadioButtonComponent,
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
export class RadioButtonDialogComponent extends BaseDialogComponent<ECRFRadioButtonClass> {
  // Dropdown options - now coming from parent via getters
  readonly modes: DropdownOption<RadioButtonModeEnum>[] =
    this.configFactory.getEnumOptions(RadioButtonModeEnum);

  protected elementType: FormElementType = FormElementType.RADIO;
  protected readonly FormComponentVariantEnum: typeof FormComponentVariantEnum =
    FormComponentVariantEnum;
  protected readonly FormComponentSizeEnum: typeof FormComponentSizeEnum = FormComponentSizeEnum;
  protected readonly FormLabelStyleEnum: typeof FormLabelStyleEnum = FormLabelStyleEnum;
  protected readonly FormLabelPositionEnum: typeof FormLabelPositionEnum = FormLabelPositionEnum;

  constructor(private iconService: IconMappingService) {
    super();
    // Enhanced validation is enabled by default in base class
    // Radio button validation is already registered in DialogValidationService
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
   * Track by function for options
   */
  trackByOptionValue(index: number, option: any): any {
    return option.value;
  }

  /**
   * Implementation of PresetSupport interface - get the current configuration
   */
  getConfigurationForPreset(): IPresetConfiguration {
    return {
      label: this.form.value.label,
      name: this.form.value.name,
      required: this.form.value.required,
      disabled: this.form.value.disabled,
      mode: this.form.value.mode,
      size: this.form.value.size,
      variant: this.form.value.variant,
      helperText: this.form.value.helperText,
      labelStyle: this.form.value.labelStyle,
      labelPosition: this.form.value.labelPosition,
      options: this.presetManager.extractOptionsFromForm(this.form),
    };
  }

  /**
   * Implementation of PresetSupport interface - apply preset configuration
   */
  applyPresetConfiguration(config: IPresetConfiguration): void {
    // Generate a default name if not provided
    const defaultName: string = this.createDefaultName();

    // Use registry defaults when config values are missing
    this.form.patchValue({
      label: config['label'] || this.dialogConfiguration.defaultValues?.['label'],
      name: config['name'] || defaultName,
      required: config['required'] || this.dialogConfiguration.defaultValues?.['required'],
      disabled: config['disabled'] || this.dialogConfiguration.defaultValues?.['disabled'],
      mode: config['mode'] || this.dialogConfiguration.defaultValues?.['mode'],
      size: config['size'] || this.dialogConfiguration.defaultValues?.['size'],
      variant: config['variant'] || this.dialogConfiguration.defaultValues?.['variant'],
      helperText: config['helperText'] || '',
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
   * Override ngOnInit to add component-specific behavior
   */
  override ngOnInit(): void {
    super.ngOnInit(); // Call parent to get all the registry and validation setup
    this.setupDynamicBehavior(); // Add radio-button specific behavior
  }

  /**
   * Override to add additional validation specific to the radio button
   */
  protected override onFormValueChange(): void {
    super.onFormValueChange(); // This handles enhanced validation
    // Add any radio-button specific logic here if needed
  }

  /**
   * Patch form values from the existing control
   */
  protected patchFormValues(): void {
    if (!this.control) return;

    // Use registry defaults as fallbacks
    this.form.patchValue({
      label: this.control.options?.title || this.dialogConfiguration.defaultValues?.['label'],
      name: this.control.name || this.dialogConfiguration.defaultValues?.['name'],
      required: this.control.options?.required || false,
      disabled: this.control.options?.disabled || false,
      mode: this.control.mode || this.dialogConfiguration.defaultValues?.['mode'],
      size: this.control.size || this.dialogConfiguration.defaultValues?.['size'],
      variant: this.control.variant || this.dialogConfiguration.defaultValues?.['variant'],
      helperText: this.control.options?.helperText || '',
      labelStyle: this.control.labelStyle || this.dialogConfiguration.defaultValues?.['labelStyle'],
      labelPosition:
        this.control.labelPosition || this.dialogConfiguration.defaultValues?.['labelPosition'],
    });

    // Handle existing options using PresetManagerService
    if (this.control.radioOptions && Array.isArray(this.control.radioOptions)) {
      this.presetManager.applyOptionsToForm(this.control.radioOptions, this.form);
    } else {
      // Add default options if none exist
      const options: OptionItem[] = this.presetManager.createDefaultOptions(2);
      this.presetManager.applyOptionsToForm(options, this.form);
    }
  }

  /**
   * Build a result object from form values
   */
  protected buildResult(): ECRFRadioButtonClass {
    const formValues: any = this.form.value;

    // Create an option object
    const options: IRadioButtonOptions = {
      name: this.sanitizeName(formValues.label),
      title: formValues.label,
      required: formValues.required,
      disabled: formValues.disabled,
      readonly: false,
      helperText: formValues.helperText,
      mode: formValues.mode,
      size: formValues.size,
      variant: formValues.variant,
      labelStyle: formValues.labelStyle,
      labelPosition: formValues.labelPosition,
      radioOptions: this.presetManager.extractOptionsFromForm(this.form),
    };

    if (this.control) {
      // Update the existing radio button
      Object.assign(this.control, {
        options,
        name: formValues.name,
        mode: formValues.mode,
        size: formValues.size,
        variant: formValues.variant,
        radioOptions: this.presetManager.extractOptionsFromForm(this.form),
        labelStyle: formValues.labelStyle,
        labelPosition: formValues.labelPosition,
      });
      return this.control;
    } else {
      // Create a new radio button
      const radioButton = new ECRFRadioButtonClass(this.iconService, options);
      Object.assign(radioButton, {
        name: formValues.name,
        radioOptions: this.presetManager.extractOptionsFromForm(this.form),
      });
      return radioButton;
    }
  }

  /**
   * Get tab-specific field names for validation - enhanced with proper field names
   */
  protected override getBasicTabFields(): string[] {
    return [...super.getBasicTabFields(), 'name']; // Add name field to basic tab
  }

  /**
   * Set up dynamic form behavior specific to the radio button
   */
  private setupDynamicBehavior(): void {
    // Use PresetManagerService to handle label -> name auto-generation
    this.presetManager.setupFieldDependency(this.form, 'label', [], (label: string): boolean => {
      this.updateNameFromLabel(label);
      return true;
    });
  }

  /**
   * Update the name field based on the label field (if not manually edited)
   */
  private updateNameFromLabel(label: string): void {
    const nameControl: AbstractControl<any, any> | null = this.form.get('name');
    if (nameControl && !nameControl.touched && !nameControl.dirty) {
      nameControl.setValue(this.sanitizeName(label));
    }
  }

  /**
   * Create a default unique name for a radio group
   */
  private createDefaultName(): string {
    return `radio-group-${Math.random().toString(36).substring(2, 9)}`;
  }
}
