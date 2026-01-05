import { BaseControlOptions } from './options.interfaces';
import { IFormControlOptions } from './form.interfaces';
import {
  FormComponentSizeType,
  FormComponentVariantType,
  FormLabelPositionType,
  FormLabelStyleType,
  MultiSelectConfig,
  MultiSelectDisplayModeEnum,
} from '@artificial-sense/ui-lib';

export interface MultiselectFactoryOptions extends BaseControlOptions {
  multiple?: boolean;
  checkbox?: boolean;
  filter?: boolean;
  selectOptions?: any[];
  optionLabel?: string;
  optionValue?: string;
  showToggleAll?: boolean;
  group?: boolean;
  optionGroupLabel?: string;
  optionGroupChildren?: string;
  maxSelectedLabels?: number;
  display?: any;
  size?: any;
  variant?: any;
}

/**
 * Extended options interface for MultiSelect to include UI library-specific config
 */
export interface MultiSelectOptions extends IFormControlOptions {
  multiSelectConfig?: Partial<MultiSelectConfig>;
  labelStyle?: FormLabelStyleType;
  labelPosition?: FormLabelPositionType;
  display?: MultiSelectDisplayModeEnum;
  multiple?: boolean;
  checkbox?: boolean;
  filter?: boolean;
  options?: any[];
  optionLabel?: string;
  optionValue?: string;
  showToggleAll?: boolean;
  maxSelectedLabels?: number;
  group?: boolean;
  optionGroupLabel?: string;
  optionGroupChildren?: string;
  size: FormComponentSizeType;
  variant: FormComponentVariantType;
  selectOptions?: any[];
}
