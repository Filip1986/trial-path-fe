import { BaseControlOptions, OptionItem } from './options.interfaces';
import { IFormControlOptions } from './form.interfaces';
import {
  CheckboxConfig,
  CheckboxModeEnum,
  FormComponentSizeType,
  FormComponentVariantType,
  FormLabelPositionType,
  FormLabelStyleType,
} from '@artificial-sense/ui-lib';

export interface CheckboxFactoryOptions extends BaseControlOptions {
  checkboxConfig?: any;
  mode?: any;
  size?: any;
  variant?: any;
}

/**
 * Extended options interface for Checkbox to include UI library-specific config
 */
export interface ICheckboxOptions extends IFormControlOptions {
  checkboxConfig?: Partial<CheckboxConfig>;
  mode?: CheckboxModeEnum;
  size?: FormComponentSizeType;
  variant?: FormComponentVariantType;
  labelPosition?: FormLabelPositionType;
  labelStyle?: FormLabelStyleType;
  groupTitle?: string;
  options?: OptionItem[];
}
