import { IFormControlOptions } from './form.interfaces';
import { InputTextConfig } from '@artificial-sense/ui-lib';

export interface OptionItem {
  label: string;
  value: any;
  disabled?: boolean;
  group?: string;
}

/**
 * Base interface for all control-specific options
 */
export interface BaseControlOptions extends IFormControlOptions {
  id?: string;
  name: string;
}

export interface OptionFieldConfigs {
  optionLabelConfig: InputTextConfig;
  optionValueConfig: InputTextConfig;
  optionDisabledConfig: InputTextConfig;
}
