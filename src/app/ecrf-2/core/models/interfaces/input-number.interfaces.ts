import {
  FormComponentSizeType,
  FormComponentVariantType,
  FormLabelPositionType,
  FormLabelStyleType,
  InputNumberButtonLayoutType,
  InputNumberConfig,
  InputNumberModeEnum,
} from '@artificial-sense/ui-lib';
import { BaseControlOptions } from './options.interfaces';
import { IFormControlOptions } from './form.interfaces';

export interface InputNumberFactoryOptions extends BaseControlOptions {
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  currency?: string;
  mode?: InputNumberModeEnum;
}

/**
 * Extended options interface for InputNumber to include UI library-specific config
 */
export interface InputNumberOptions extends IFormControlOptions {
  inputNumberConfig?: Partial<InputNumberConfig>;
  mode?: InputNumberModeEnum;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  currency?: string;
  locale?: string;
  minFractionDigits?: number;
  maxFractionDigits?: number;
  showButtons?: boolean;
  buttonLayout?: InputNumberButtonLayoutType;
  useGrouping?: boolean;
  size?: FormComponentSizeType;
  variant?: FormComponentVariantType;
  labelStyle?: FormLabelStyleType;
  labelPosition?: FormLabelPositionType;
}
