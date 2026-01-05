import { InputTextFactoryOptions } from '../interfaces/input-text.interfaces';
import { TextAreaFactoryOptions } from '../interfaces/text-area.interfaces';
import { CheckboxFactoryOptions } from '../interfaces/checkbox.interfaces';
import { IRadioFactoryOptions } from '../interfaces/radio.interfaces';
import { IDatePickerFactoryOptions } from '../interfaces/date-picker.interfaces';
import { ColumnsFactoryOptions } from '../interfaces/columns.interfaces';
import { ListBoxFactoryOptions } from '../interfaces/list-box.interfaces';
import { InputNumberFactoryOptions } from '../interfaces/input-number.interfaces';
import { MultiselectFactoryOptions } from '../interfaces/multiselect.interfaces';
import { TimePickerFactoryOptions } from '../interfaces/time-picker.interfaces';
import { SelectFactoryOptions } from '../interfaces/select.interfaces';
import { SelectButtonFactoryOptions } from '../interfaces/select-button.interfaces';
import { IFormControl } from '../interfaces/form.interfaces';

/**
 * Union type for all control-specific options
 */
export type ControlFactoryOptions =
  | InputTextFactoryOptions
  | TextAreaFactoryOptions
  | CheckboxFactoryOptions
  | IRadioFactoryOptions
  | IDatePickerFactoryOptions
  | ColumnsFactoryOptions
  | ListBoxFactoryOptions
  | InputNumberFactoryOptions
  | MultiselectFactoryOptions
  | TimePickerFactoryOptions
  | SelectFactoryOptions
  | SelectButtonFactoryOptions;

/**
 * Control builder function type
 */
export type ControlBuilder<T extends IFormControl> = (options: ControlFactoryOptions) => T;
