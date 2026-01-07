import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { EcrfTimePickerClass } from '../../../form-controls/form-elements/time-picker';
import { IconMappingService } from '@core/services/icon-mapping.service';
import {
  LibTimePickerComponent,
  FormComponentVariantEnum,
  LibInputTextComponent,
  FormComponentSizeEnum,
  FormLabelStyleEnum,
  FormLabelPositionEnum,
} from '@artificial-sense/ui-lib';
import { DialogSharedModule } from '../../dialog-shared.module';
import { Tabs, TabsModule, TabsStyle } from 'primeng/tabs';
import { LoadPresetDialogComponent } from '../../shared/components/presets/load-preset-dialog/load-preset-dialog.component';
import { SavePresetDialogComponent } from '../../shared/components/presets/save-preset-dialog/save-preset-dialog.component';
import { DialogWrapperComponent } from '../../shared/components/dialog-wrapper/dialog-wrapper.component';
import { FormElementType } from '@core/models/enums/form.enums';
import { IPresetConfiguration } from '@core/models/interfaces/preset.interfaces';
import { TimePickerOptions } from '@core/models/interfaces/time-picker.interfaces';
import { DialogConfigBuilder } from '@core/builders/config-builders';
import { IDialogFieldConfig } from '@core/models/interfaces/dialog.interfaces';
import { BaseDialogComponent } from '@core/abstracts/base-dialog.component';
import { TimePickerHourFormatOption } from '@core/models/dialog.types';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogConfirmationService } from '@core/services/dialog-confirmation.service';

@Component({
  selector: 'app-time-picker-dialog',
  templateUrl: './time-picker-dialog.component.html',
  styleUrls: ['./time-picker-dialog.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    SelectModule,
    CheckboxModule,
    DialogWrapperComponent,
    LibTimePickerComponent,
    DialogSharedModule,
    LibInputTextComponent,
    TabsModule,
    LoadPresetDialogComponent,
    SavePresetDialogComponent,
    ConfirmDialog
],
  providers: [Tabs, TabsStyle, ConfirmationService, DialogConfirmationService],
})
export class TimePickerDialogComponent extends BaseDialogComponent<EcrfTimePickerClass> {
  readonly formats: TimePickerHourFormatOption[] =
    this.configFactory.getTimePickerHourFormatOptions();

  // Time picker specific fields (these are unique to time picker)
  timePickerFields: IDialogFieldConfig[] = [
    {
      name: 'stepMinute',
      config: DialogConfigBuilder.createNumberConfig('Minute Step', 1, 60, {
        helperText: 'Increment/decrement step for minutes',
      }),
    },
    {
      name: 'stepSecond',
      config: DialogConfigBuilder.createNumberConfig('Second Step', 1, 60, {
        helperText: 'Increment/decrement step for seconds',
      }),
    },
  ];

  protected elementType: FormElementType = FormElementType.TIME_PICKER;
  protected readonly FormComponentVariantEnum: typeof FormComponentVariantEnum =
    FormComponentVariantEnum;
  protected readonly FormComponentSizeEnum: typeof FormComponentSizeEnum = FormComponentSizeEnum;
  protected readonly FormLabelStyleEnum: typeof FormLabelStyleEnum = FormLabelStyleEnum;
  protected readonly FormLabelPositionEnum: typeof FormLabelPositionEnum = FormLabelPositionEnum;

  constructor(private iconService: IconMappingService) {
    super();
    // Enhanced validation is enabled by default in base class
    // Time picker validation should be registered in DialogValidationService
  }

  // Helper method to get FormControl from the form
  getControl(name: string): FormControl {
    return this.form.get(name) as FormControl;
  }

  /**
   * Track by function for timePickerFields
   */
  trackByFieldName(index: number, field: IDialogFieldConfig): string {
    return field.name;
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
      format: this.form.value.format,
      showSeconds: this.form.value.showSeconds,
      stepMinute: this.form.value.stepMinute,
      stepSecond: this.form.value.stepSecond,
      labelStyle: this.form.value.labelStyle,
      labelPosition: this.form.value.labelPosition,
      helperText: this.form.value.helperText,
      showIcon: this.form.value.showIcon,
      size: this.form.value.size,
    };
  }

  /**
   * Implementation of PresetSupport interface - apply preset configuration
   */
  applyPresetConfiguration(config: IPresetConfiguration): void {
    // Apply values using registry defaults when config values are missing
    this.form.patchValue({
      label: config['label'] || this.dialogConfiguration.defaultValues?.['label'],
      placeholder: config['placeholder'] || this.dialogConfiguration.defaultValues?.['placeholder'],
      required: config['required'] || this.dialogConfiguration.defaultValues?.['required'],
      disabled: config['disabled'] || this.dialogConfiguration.defaultValues?.['disabled'],
      format: config['format'] || this.dialogConfiguration.defaultValues?.['format'],
      showSeconds: config['showSeconds'] || this.dialogConfiguration.defaultValues?.['showSeconds'],
      stepMinute: config['stepMinute'] || this.dialogConfiguration.defaultValues?.['stepMinute'],
      stepSecond: config['stepSecond'] || this.dialogConfiguration.defaultValues?.['stepSecond'],
      labelStyle: config['labelStyle'] || this.dialogConfiguration.defaultValues?.['labelStyle'],
      labelPosition:
        config['labelPosition'] || this.dialogConfiguration.defaultValues?.['labelPosition'],
      helperText: config['helperText'] || '',
      showIcon:
        config['showIcon'] !== undefined
          ? config['showIcon']
          : this.dialogConfiguration.defaultValues?.['showIcon'],
      size: config['size'] || this.dialogConfiguration.defaultValues?.['size'],
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
    this.setupDynamicBehavior(); // Add time-picker specific behavior
  }

  /**
   * Override to add additional validation specific to time picker
   */
  protected override onFormValueChange(): void {
    super.onFormValueChange(); // This handles enhanced validation
    // Add any time-picker specific logic here if needed
  }

  protected patchFormValues(): void {
    if (!this.control) return;

    this.form.patchValue({
      label: this.control.options?.title || this.dialogConfiguration.defaultValues?.['label'],
      placeholder:
        this.control.placeholder || this.dialogConfiguration.defaultValues?.['placeholder'],
      required: this.control.options?.required || false,
      disabled: this.control.options?.disabled || false,
      format: this.control.hourFormat || this.dialogConfiguration.defaultValues?.['format'],
      showSeconds:
        this.control.options?.showSeconds ||
        this.dialogConfiguration.defaultValues?.['showSeconds'],
      labelStyle: this.control.labelStyle || this.dialogConfiguration.defaultValues?.['labelStyle'],
      labelPosition:
        this.control.labelPosition || this.dialogConfiguration.defaultValues?.['labelPosition'],
      helperText: this.control.options?.helperText || '',
      showIcon:
        this.control.showIcon !== undefined
          ? this.control.showIcon
          : this.dialogConfiguration.defaultValues?.['showIcon'],
    });
  }

  protected buildResult(): EcrfTimePickerClass {
    const formValues: any = this.form.value;

    // Create an option object
    const options: TimePickerOptions = {
      name: this.sanitizeName(formValues.label),
      title: formValues.label,
      required: formValues.required,
      disabled: formValues.disabled,
      readonly: false,
      helperText: formValues.helperText,
      hourFormat: formValues.format,
      showSeconds: formValues.showSeconds,
      labelStyle: formValues.labelStyle,
      labelPosition: formValues.labelPosition,
    };

    if (this.control) {
      // Update the existing time picker
      Object.assign(this.control, {
        options,
        placeholder: formValues.placeholder,
        hourFormat: formValues.format,
        labelStyle: formValues.labelStyle,
        labelPosition: formValues.labelPosition,
        showIcon: formValues.showIcon,
        stepMinute: formValues.stepMinute,
        stepSecond: formValues.stepSecond,
        size: formValues.size,
      });
      return this.control;
    } else {
      // Create a new time picker
      const timePicker = new EcrfTimePickerClass(this.iconService, options);
      Object.assign(timePicker, {
        placeholder: formValues.placeholder,
        showIcon: formValues.showIcon,
        stepMinute: formValues.stepMinute,
        stepSecond: formValues.stepSecond,
        size: formValues.size,
      });
      return timePicker;
    }
  }

  /**
   * Get field names for time settings tab validation
   */
  protected getTimeSettingsTabFields(): string[] {
    return ['format', 'stepMinute', 'stepSecond'];
  }

  /**
   * Set up dynamic form behavior specific to time picker
   */
  private setupDynamicBehavior(): void {
    // Use PresetManagerService to handle showSeconds -> stepSecond dependency
    this.presetManager.setupFieldDependency(
      this.form,
      'showSeconds',
      ['stepSecond'],
      (showSeconds: boolean): boolean => showSeconds,
    );

    // Apply the current showSeconds value to update the enabled/disabled state of stepSecond
    const showSeconds = this.form.get('showSeconds')?.value;
    if (!showSeconds) {
      this.form.get('stepSecond')?.disable();
    }

    // Add validation for step values
    this.setupStepValidation();
  }

  /**
   * Set up step validation to ensure valid ranges
   */
  private setupStepValidation(): void {
    ['stepMinute', 'stepSecond'].forEach((field: string): void => {
      this.form.get(field)?.valueChanges.subscribe((value: number): void => {
        const control = this.form.get(field);
        if (control && value !== null && value !== undefined) {
          // Ensure step values are within valid range
          if (value < 1 || value > 60) {
            control.setErrors({ range: { min: 1, max: 60 } });
          } else if (control.errors?.['range']) {
            // Remove range error if value is now valid
            const errors = { ...control.errors };
            delete errors['range'];
            control.setErrors(Object.keys(errors).length ? errors : null);
          }
        }

        // Trigger enhanced validation after step changes
        setTimeout((): void => {
          this.performEnhancedValidation();
          this.cdr.markForCheck();
        }, 0);
      });
    });
  }
}
