import { IconMappingService } from '@core/services/icon-mapping.service';
import {
  DatePickerConfig,
  DatePickerModeEnum,
  DatePickerViewEnum,
  IconDisplayModeEnum,
  DatePickerHourFormatEnum,
  FormLabelStyleEnum,
  FormLabelPositionEnum,
  FormComponentVariantEnum,
  FormComponentSizeEnum,
} from '@artificial-sense/ui-lib';
import { IFormControl } from '@core/models/interfaces/form.interfaces';
import { FormElementType } from '@core/models/enums/form.enums';
import { generateUniqueId } from '@core/utils/utils';
import { IDatePickerOptions } from '@core/models/interfaces/date-picker.interfaces';

/**
 * Date picker form control class
 * Uses enum values instead of magic strings
 */
export class EcrfDatePickerClass implements IFormControl<IDatePickerOptions, Date | Date[] | null> {
  readonly id: string;
  readonly iconName: string;
  readonly type: FormElementType = FormElementType.DATE_PICKER;
  readonly title: string = 'Date Picker';

  // Additional properties to store UI configuration
  labelStyle: FormLabelStyleEnum = FormLabelStyleEnum.DEFAULT;
  labelPosition: FormLabelPositionEnum = FormLabelPositionEnum.ABOVE;
  selectionMode: DatePickerModeEnum = DatePickerModeEnum.SINGLE;
  view: DatePickerViewEnum = DatePickerViewEnum.DATE;
  dateFormat = 'mm/dd/yy';
  showTime = false;
  hourFormat: DatePickerHourFormatEnum = DatePickerHourFormatEnum.TWENTY_FOUR;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  showIcon = true;

  constructor(
    private iconService?: IconMappingService,
    public options?: IDatePickerOptions,
    public value?: Date | Date[] | null,
    id?: string,
  ) {
    // Assign a unique ID
    this.id = id || generateUniqueId(FormElementType.DATE_PICKER);

    // Use icon service to get the correct icon
    this.iconName = this.iconService?.getPrimeIcon(FormElementType.DATE_PICKER) || 'pi pi-calendar';

    // Ensure the value is an array if selection mode is MULTIPLE
    if (
      options?.selectionMode === DatePickerModeEnum.MULTIPLE &&
      value !== undefined &&
      !Array.isArray(value)
    ) {
      this.value = value ? [value] : [];
    } else {
      this.value = value;
    }

    // Initialize additional properties from options if provided
    if (options?.datePickerConfig) {
      this.applyDatePickerConfig(options.datePickerConfig);
    }

    // Set specific options directly if provided
    if (options) {
      this.labelStyle = options.labelStyle || FormLabelStyleEnum.DEFAULT;
      this.labelPosition = options.labelPosition || FormLabelPositionEnum.ABOVE;
      this.selectionMode = options.selectionMode || DatePickerModeEnum.SINGLE;
      this.view = options.view || DatePickerViewEnum.DATE;
      this.dateFormat = options.dateFormat || 'mm/dd/yy';
      this.showTime = options.showTime || false;
      this.hourFormat = options.hourFormat || DatePickerHourFormatEnum.TWENTY_FOUR;
      this.minDate = options.minDate;
      this.maxDate = options.maxDate;
    }
  }

  /**
   * Convert this control to a DatePickerConfig for the UI library
   * @returns Configuration for a lib-date-picker component
   */
  toDatePickerConfig(): DatePickerConfig {
    return {
      label: this.options?.title || this.title,
      required: this.options?.required || false,
      disabled: this.options?.disabled || false,
      placeholder: this.placeholder || 'Select a date',
      selectionMode: this.selectionMode,
      view: this.view,
      labelStyle: this.labelStyle,
      labelPosition: this.labelPosition,
      dateFormat: this.dateFormat,
      showTime: this.showTime,
      hourFormat: this.hourFormat,
      minDate: this.minDate,
      maxDate: this.maxDate,
      showIcon: this.showIcon,
      helperText: this.options?.helperText,
      iconDisplay: IconDisplayModeEnum.BUTTON,
      variant: FormComponentVariantEnum.OUTLINED,
      numberOfMonths: 1,
      size: this.options?.size || FormComponentSizeEnum.NORMAL,
      // Include any additional configuration from options
      ...(this.options?.datePickerConfig || {}),
    };
  }

  /**
   * Apply date picker configuration settings to this control
   */
  private applyDatePickerConfig(config: Partial<DatePickerConfig>): void {
    if (config.labelStyle) this.labelStyle = config.labelStyle;
    if (config.labelPosition) this.labelPosition = config.labelPosition;
    if (config.selectionMode) this.selectionMode = config.selectionMode;
    if (config.view) this.view = config.view;
    if (config.dateFormat) this.dateFormat = config.dateFormat;
    if (config.showTime !== undefined) this.showTime = config.showTime;
    if (config.hourFormat) this.hourFormat = config.hourFormat;
    if (config.minDate) this.minDate = config.minDate;
    if (config.maxDate) this.maxDate = config.maxDate;
    if (config.placeholder) this.placeholder = config.placeholder;
    if (config.showIcon !== undefined) this.showIcon = config.showIcon;
  }
}
