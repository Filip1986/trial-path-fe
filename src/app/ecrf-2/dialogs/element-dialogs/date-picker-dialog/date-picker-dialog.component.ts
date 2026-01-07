import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FormControl, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { EcrfDatePickerClass } from '../../../form-controls/form-elements/date-picker';
import { IconMappingService } from '@core/services/icon-mapping.service';
import {
  LibDatePickerComponent,
  DatePickerModeEnum,
  DatePickerViewEnum,
  IconDisplayModeEnum,
  FormComponentVariantEnum,
  LibInputTextComponent,
  FormLabelStyleEnum,
  FormLabelPositionEnum,
  FormComponentSizeEnum,
} from '@artificial-sense/ui-lib';
import { BaseDialogComponent } from '@core/abstracts/base-dialog.component';
import { DialogSharedModule } from '../../dialog-shared.module';
import { Tabs, TabsModule, TabsStyle } from 'primeng/tabs';
import { SavePresetDialogComponent } from '../../shared/components/presets/save-preset-dialog/save-preset-dialog.component';
import { LoadPresetDialogComponent } from '../../shared/components/presets/load-preset-dialog/load-preset-dialog.component';
import {
  DatePickerHourFormatOption,
  DatePickerModeOption,
  DatePickerViewOption,
} from '@core/models/dialog.types';
import { DialogWrapperComponent } from '../../shared/components/dialog-wrapper/dialog-wrapper.component';
import { FormElementType } from '@core/models/enums/form.enums';
import { IPresetConfiguration } from '@core/models/interfaces/preset.interfaces';
import { IDatePickerOptions } from '@core/models/interfaces/date-picker.interfaces';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogConfirmationService } from '@core/services/dialog-confirmation.service';

@Component({
  selector: 'app-date-picker-dialog',
  templateUrl: './date-picker-dialog.component.html',
  styleUrls: ['./date-picker-dialog.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    SelectModule,
    CheckboxModule,
    DialogWrapperComponent,
    LibDatePickerComponent,
    DialogSharedModule,
    TabsModule,
    SavePresetDialogComponent,
    LoadPresetDialogComponent,
    LibInputTextComponent,
    ConfirmDialog
],
  providers: [Tabs, TabsStyle, ConfirmationService, DialogConfirmationService],
})
export class DatePickerDialogComponent extends BaseDialogComponent<EcrfDatePickerClass> {
  // Dropdown options - now coming from configFactory via getters
  readonly selectionModes: DatePickerModeOption[];
  readonly views: DatePickerViewOption[];
  readonly hourFormats: DatePickerHourFormatOption[];

  // Template constants
  readonly IconDisplayMode: typeof IconDisplayModeEnum = IconDisplayModeEnum;
  readonly InputVariant: typeof FormComponentVariantEnum = FormComponentVariantEnum;

  // Element type configuration
  protected elementType: FormElementType = FormElementType.DATE_PICKER;
  protected readonly FormComponentVariantEnum = FormComponentVariantEnum;
  protected readonly FormLabelStyleEnum = FormLabelStyleEnum;
  protected readonly FormLabelPositionEnum = FormLabelPositionEnum;
  protected readonly FormComponentSizeEnum = FormComponentSizeEnum;

  constructor(private iconService: IconMappingService) {
    super();

    // Initialize dropdown options from configFactory
    this.selectionModes = this.configFactory.getEnumOptions(DatePickerModeEnum);
    this.views = this.configFactory.getEnumOptions(DatePickerViewEnum);
    this.hourFormats = this.configFactory.getHourFormatOptions();

    // Enhanced validation is enabled by default in base class
    // Date picker validation is already registered in DialogValidationService
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
      selectionMode: this.form.value.selectionMode,
      view: this.form.value.view,
      dateFormat: this.form.value.dateFormat,
      showTime: this.form.value.showTime,
      hourFormat: this.form.value.hourFormat,
      showIcon: this.form.value.showIcon,
      minDate: this.form.value.minDate,
      maxDate: this.form.value.maxDate,
      labelStyle: this.form.value.labelStyle,
      labelPosition: this.form.value.labelPosition,
      helperText: this.form.value.helperText,
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
      selectionMode:
        config['selectionMode'] || this.dialogConfiguration.defaultValues?.['selectionMode'],
      view: config['view'] || this.dialogConfiguration.defaultValues?.['view'],
      dateFormat: config['dateFormat'] || this.dialogConfiguration.defaultValues?.['dateFormat'],
      showTime: config['showTime'] || this.dialogConfiguration.defaultValues?.['showTime'],
      hourFormat: config['hourFormat'] || this.dialogConfiguration.defaultValues?.['hourFormat'],
      showIcon:
        config['showIcon'] !== undefined
          ? config['showIcon']
          : this.dialogConfiguration.defaultValues?.['showIcon'],
      minDate: config['minDate'] || null,
      maxDate: config['maxDate'] || null,
      labelStyle: config['labelStyle'] || this.dialogConfiguration.defaultValues?.['labelStyle'],
      labelPosition:
        config['labelPosition'] || this.dialogConfiguration.defaultValues?.['labelPosition'],
      helperText: config['helperText'] || '',
    });

    // Apply preset-specific behaviors using PresetManagerService
    this.applyPresetBehaviors(config);

    // Handle date range validation if dates are provided
    if (config['minDate'] && config['maxDate']) {
      this.validateDateRange();
    }

    this.hasUnsavedChanges = true;
  }

  /**
   * Override ngOnInit to add component-specific behavior
   */
  override ngOnInit(): void {
    super.ngOnInit(); // Call parent to get all validation and registry setup
    this.setupDynamicBehavior(); // Add date-picker specific behavior
  }

  /**
   * Override to add additional validation specific to date picker
   */
  protected override onFormValueChange(): void {
    super.onFormValueChange(); // This handles enhanced validation
    // Add any date-picker specific logic here if needed
  }

  /**
   * Patch form values from the existing control
   */
  protected patchFormValues(): void {
    if (!this.control) return;

    // Use registry defaults as fallbacks
    this.form.patchValue({
      label: this.control.options?.title || this.dialogConfiguration.defaultValues?.['label'],
      placeholder:
        this.control.placeholder || this.dialogConfiguration.defaultValues?.['placeholder'],
      required: this.control.options?.required || false,
      disabled: this.control.options?.disabled || false,
      selectionMode:
        this.control.selectionMode || this.dialogConfiguration.defaultValues?.['selectionMode'],
      view: this.control.view || this.dialogConfiguration.defaultValues?.['view'],
      dateFormat: this.control.dateFormat || this.dialogConfiguration.defaultValues?.['dateFormat'],
      showTime: this.control.showTime || this.dialogConfiguration.defaultValues?.['showTime'],
      hourFormat: this.control.hourFormat || this.dialogConfiguration.defaultValues?.['hourFormat'],
      labelStyle: this.control.labelStyle || this.dialogConfiguration.defaultValues?.['labelStyle'],
      labelPosition:
        this.control.labelPosition || this.dialogConfiguration.defaultValues?.['labelPosition'],
      helperText: this.control.options?.helperText || '',
      showIcon:
        this.control.showIcon !== undefined
          ? this.control.showIcon
          : this.dialogConfiguration.defaultValues?.['showIcon'],
      minDate: this.control.minDate || null,
      maxDate: this.control.maxDate || null,
    });
  }

  /**
   * Build a result object from form values
   */
  protected buildResult(): EcrfDatePickerClass {
    const formValues = this.form.value;

    // Create an option object
    const options: IDatePickerOptions = {
      name: this.sanitizeName(formValues.label),
      title: formValues.label,
      required: formValues.required,
      disabled: formValues.disabled,
      readonly: false,
      helperText: formValues.helperText,
      selectionMode: formValues.selectionMode,
      view: formValues.view,
      dateFormat: formValues.dateFormat,
      showTime: formValues.showTime,
      hourFormat: formValues.hourFormat,
      labelStyle: formValues.labelStyle,
      labelPosition: formValues.labelPosition,
      minDate: formValues.minDate,
      maxDate: formValues.maxDate,
      size: formValues.size,
    };

    if (this.control) {
      // Update existing date picker
      Object.assign(this.control, {
        options,
        placeholder: formValues.placeholder,
        selectionMode: formValues.selectionMode,
        view: formValues.view,
        dateFormat: formValues.dateFormat,
        showTime: formValues.showTime,
        hourFormat: formValues.hourFormat,
        labelStyle: formValues.labelStyle,
        labelPosition: formValues.labelPosition,
        showIcon: formValues.showIcon,
        minDate: formValues.minDate,
        maxDate: formValues.maxDate,
      });
      return this.control;
    } else {
      // Create a new date picker
      const datePicker = new EcrfDatePickerClass(this.iconService, options);
      Object.assign(datePicker, {
        placeholder: formValues.placeholder,
        showIcon: formValues.showIcon,
      });
      return datePicker;
    }
  }

  /**
   * Get field names for date selection tab validation
   */
  protected getDateSelectionTabFields(): string[] {
    return ['selectionMode', 'view', 'dateFormat', 'hourFormat'];
  }

  /**
   * Set up dynamic form behavior specific to the date picker
   */
  private setupDynamicBehavior(): void {
    // Use PresetManagerService to handle showTime -> hourFormat dependency
    this.presetManager.setupFieldDependency(
      this.form,
      'showTime',
      ['hourFormat'],
      (showTime: boolean): boolean => showTime,
    );

    // Set up date range validation
    this.setupDateRangeValidation();

    // Apply the current showTime value to update the enabled/disabled state of hourFormat
    const showTime = this.form.get('showTime')?.value;
    if (!showTime) {
      this.form.get('hourFormat')?.disable();
    }
  }

  /**
   * Set up date range validation using form value changes
   */
  private setupDateRangeValidation(): void {
    ['minDate', 'maxDate'].forEach((field: string): void => {
      this.form.get(field)?.valueChanges.subscribe((): void => {
        this.validateDateRange();
        // Trigger enhanced validation after date range changes
        setTimeout((): void => {
          this.performEnhancedValidation();
          this.cdr.markForCheck();
        }, 0);
      });
    });
  }

  /**
   * Validate that minDate is before maxDate
   */
  private validateDateRange(): void {
    const minDate: any = this.form.get('minDate')?.value;
    const maxDate: any = this.form.get('maxDate')?.value;

    if (minDate && maxDate && new Date(minDate) > new Date(maxDate)) {
      this.form.get('maxDate')?.setErrors({ minGreaterThanMax: true });
    } else {
      const errors: ValidationErrors | null | undefined = this.form.get('maxDate')?.errors;
      if (errors?.['minGreaterThanMax']) {
        delete errors['minGreaterThanMax'];
        this.form.get('maxDate')?.setErrors(Object.keys(errors).length ? errors : null);
      }
    }
  }
}
