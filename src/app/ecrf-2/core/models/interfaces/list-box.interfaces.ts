import { BaseControlOptions } from './options.interfaces';
import { IFormControlOptions } from './form.interfaces';
import { FormLabelPositionType, FormLabelStyleType, ListBoxConfig } from '@artificial-sense/ui-lib';

export interface ListBoxFactoryOptions extends BaseControlOptions {
  multiple?: boolean;
  checkbox?: boolean;
  filter?: boolean;
  listOptions?: any[];
  optionLabel?: string;
  optionValue?: string;
}

/**
 * Extended options interface for Listbox to include UI library-specific config
 */
export interface IListBoxOptions extends IFormControlOptions {
  listboxConfig?: Partial<ListBoxConfig>;
  labelStyle?: FormLabelStyleType;
  labelPosition?: FormLabelPositionType;
  multiple?: boolean;
  checkbox?: boolean;
  filter?: boolean;
  listOptions?: any[];
  optionLabel?: string;
  optionValue?: string;
}
