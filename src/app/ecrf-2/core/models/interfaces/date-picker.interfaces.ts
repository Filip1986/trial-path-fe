import {
  DatePickerConfig,
  DatePickerHourFormatType,
  DatePickerModeEnum,
  DatePickerViewEnum,
  FormComponentSizeType,
  FormLabelPositionEnum,
  FormLabelStyleEnum,
} from '@artificial-sense/ui-lib';
import { BaseControlOptions } from './options.interfaces';
import { IFormControlOptions } from './form.interfaces';

export interface IDatePickerFactoryOptions extends BaseControlOptions {
  dateFormat?: string;
  showTime?: boolean;
  selectionMode?: any;
  view?: any;
  minDate?: Date;
  maxDate?: Date;
  size: FormComponentSizeType;
}

/**
 * Extended options interface for DatePicker to include UI library-specific config
 */
export interface IDatePickerOptions extends IFormControlOptions {
  datePickerConfig?: Partial<DatePickerConfig>;
  labelStyle?: FormLabelStyleEnum;
  labelPosition?: FormLabelPositionEnum;
  selectionMode?: DatePickerModeEnum;
  view?: DatePickerViewEnum;
  dateFormat?: string;
  showTime?: boolean;
  hourFormat?: DatePickerHourFormatType;
  minDate?: Date;
  maxDate?: Date;
  size: FormComponentSizeType;
}
