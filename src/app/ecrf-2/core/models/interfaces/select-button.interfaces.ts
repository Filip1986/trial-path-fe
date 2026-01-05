import { BaseControlOptions } from './options.interfaces';
import { IFormControlOptions } from './form.interfaces';
import {
  FormComponentSizeType,
  FormComponentVariantType,
  FormLabelPositionType,
  FormLabelStyleType,
  SelectButtonConfig,
  SelectButtonOptionType,
} from '@artificial-sense/ui-lib';

export interface SelectButtonFactoryOptions extends BaseControlOptions {
  multiple?: boolean;
  selectButtonOptions?: any[];
  selectOptions?: any[];
  optionLabel?: string;
  optionValue?: string;
  optionDisabled?: string;
  size?: any;
}

/**
 * Extended options interface for SelectButton to include UI library-specific config
 */
export interface ISelectButtonOptions extends IFormControlOptions {
  selectButtonConfig?: Partial<SelectButtonConfig>;
  options?: SelectButtonOptionType[];
  optionLabel?: string;
  optionValue?: string;
  optionDisabled?: string;
  multiple?: boolean;
  size?: FormComponentSizeType;
  ariaLabelledBy?: string;
  errorMessage?: string;
  successMessage?: string;
  containerClass?: string;
  variant?: FormComponentVariantType;
  labelStyle?: FormLabelStyleType;
  labelPosition?: FormLabelPositionType;
}
