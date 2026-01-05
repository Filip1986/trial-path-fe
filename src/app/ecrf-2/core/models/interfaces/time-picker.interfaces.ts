import { BaseControlOptions } from './options.interfaces';
import { IFormControlOptions } from './form.interfaces';
import {
  FormLabelPositionType,
  FormLabelStyleType,
  TimePickerConfig,
  TimePickerHourFormatType,
} from '@artificial-sense/ui-lib';

export interface TimePickerFactoryOptions extends BaseControlOptions {
  hourFormat?: any;
  showSeconds?: boolean;
  stepMinute?: number;
  stepSecond?: number;
}

/**
 * Extended options interface for TimePicker to include UI library-specific config
 */
export interface TimePickerOptions extends IFormControlOptions {
  timePickerConfig?: Partial<TimePickerConfig>;
  labelStyle?: FormLabelStyleType;
  labelPosition?: FormLabelPositionType;
  hourFormat?: TimePickerHourFormatType;
  showSeconds?: boolean;
}
