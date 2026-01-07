import { IconMappingService } from '@core/services/icon-mapping.service';
import {
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  FormLabelPositionEnum,
  FormLabelPositionType,
  FormLabelStyleEnum,
  FormLabelStyleType,
  TimePickerConfig,
  TimePickerHourFormatEnum,
  TimePickerHourFormatType,
} from '@artificial-sense/ui-lib';
import { IFormControl } from '@core/models/interfaces/form.interfaces';
import { FormElementType } from '@core/models/enums/form.enums';
import { generateUniqueId } from '@core/utils/utils';
import { TimePickerOptions } from '@core/models/interfaces/time-picker.interfaces';

/**
 * Time picker form control class
 * Uses enum values instead of magic strings
 */
export class EcrfTimePickerClass implements IFormControl<TimePickerOptions, Date | null> {
  readonly id: string;
  readonly iconName: string;
  readonly type: FormElementType = FormElementType.TIME_PICKER;
  readonly title: string = 'Time Picker';

  // Additional properties to store UI configuration
  labelStyle: FormLabelStyleType = FormLabelStyleEnum.DEFAULT;
  labelPosition: FormLabelPositionType = FormLabelPositionEnum.ABOVE;
  hourFormat: TimePickerHourFormatType = TimePickerHourFormatEnum.TWELVE;
  placeholder?: string;
  showIcon = true;

  constructor(
    private iconService?: IconMappingService,
    public options?: TimePickerOptions,
    public value?: Date | null,
    id?: string,
  ) {
    // Assign a unique ID
    this.id = id || generateUniqueId(FormElementType.TIME_PICKER);

    // Use icon service to get the correct icon
    this.iconName = this.iconService?.getPrimeIcon(FormElementType.TIME_PICKER) || 'pi pi-clock';

    // Initialize additional properties from options if provided
    if (options?.timePickerConfig) {
      this.applyTimePickerConfig(options.timePickerConfig);
    }

    // Set specific options directly if provided
    if (options) {
      this.labelStyle = options.labelStyle || FormLabelStyleEnum.DEFAULT;
      this.labelPosition = options.labelPosition || FormLabelPositionEnum.ABOVE;
      this.hourFormat = options.hourFormat || TimePickerHourFormatEnum.TWELVE;
    }
  }

  /**
   * Convert this control to a TimePickerConfig for the UI library
   * @returns Configuration for a lib-time-picker component
   */
  toTimePickerConfig(): TimePickerConfig {
    return {
      label: this.options?.title || this.title,
      required: this.options?.required || false,
      disabled: this.options?.disabled || false,
      placeholder: this.placeholder || 'Select time',
      labelStyle: this.labelStyle,
      labelPosition: this.labelPosition,
      hourFormat: this.hourFormat,
      helperText: this.options?.helperText,
      variant: FormComponentVariantEnum.OUTLINED,
      size: FormComponentSizeEnum.NORMAL,
      // Include any additional configuration from options
      ...(this.options?.timePickerConfig || {}),
    };
  }

  /**
   * Apply time picker configuration settings to this control
   */
  private applyTimePickerConfig(config: Partial<TimePickerConfig>): void {
    if (config.labelStyle) this.labelStyle = config.labelStyle;
    if (config.labelPosition) this.labelPosition = config.labelPosition;
    if (config.hourFormat) this.hourFormat = config.hourFormat;
    if (config.placeholder) this.placeholder = config.placeholder;
  }
}
