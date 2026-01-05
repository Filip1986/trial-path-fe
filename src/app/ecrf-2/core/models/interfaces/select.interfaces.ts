import { BaseControlOptions } from './options.interfaces';
import { IFormControlOptions } from './form.interfaces';
import {
  FormComponentSizeType,
  FormComponentVariantType,
  FormLabelPositionType,
  FormLabelStyleType,
  SelectConfig,
} from '@artificial-sense/ui-lib';

export interface SelectFactoryOptions extends BaseControlOptions {
  filter?: boolean;
  showClear?: boolean;
  selectOptions?: any[];
  optionLabel?: string;
  optionValue?: string;
  group?: boolean;
  optionGroupLabel?: string;
  optionGroupChildren?: string;
  size?: any;
  variant?: any;
}

/**
 * Extended options interface for Select to include UI library-specific config
 */
export interface ISelectOptions extends IFormControlOptions {
  selectConfig?: Partial<SelectConfig>;
  labelStyle?: FormLabelStyleType;
  labelPosition?: FormLabelPositionType;
  size?: FormComponentSizeType;
  variant?: FormComponentVariantType;
  optionLabel?: string;
  optionValue?: string;
  filter?: boolean;
  showClear?: boolean;
  group?: boolean;
  optionGroupLabel?: string;
  optionGroupChildren?: string;
  selectOptions?: any[]; // Add this to SelectOptions
}
