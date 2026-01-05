import { BaseControlOptions } from './options.interfaces';
import { IFormControlOptions } from './form.interfaces';
import {
  FormComponentSizeType,
  FormComponentVariantType,
  FormLabelPositionType,
  FormLabelStyleType,
  RadioButtonConfig,
  RadioButtonModeEnum,
} from '@artificial-sense/ui-lib';

export interface IRadioFactoryOptions extends BaseControlOptions {
  radioOptions?: Array<{ label: string; value: any }>;
  mode?: any;
  size?: any;
  variant?: any;
}

/**
 * Extended options interface for RadioButton to include UI library-specific config
 */
export interface IRadioButtonOptions extends IFormControlOptions {
  radioButtonConfig?: Partial<RadioButtonConfig>;
  mode?: RadioButtonModeEnum;
  size: FormComponentSizeType;
  variant?: FormComponentVariantType;
  labelStyle?: FormLabelStyleType;
  labelPosition?: FormLabelPositionType;
  radioOptions?: Array<{ label: string; value: any }>;
}
