import {
  FormComponentSizeType,
  FormComponentVariantType,
  FormLabelPositionType,
  FormLabelStyleType,
  TextareaConfig,
} from '@artificial-sense/ui-lib';
import { BaseControlOptions } from './options.interfaces';
import { IFormControlOptions } from './form.interfaces';

export interface TextAreaFactoryOptions extends BaseControlOptions {
  placeholder?: string;
  rows?: number;
  cols?: number;
  autoResize?: boolean;
  maxLength?: number;
  minLength?: number;
  size: FormComponentSizeType;
  variant: FormComponentVariantType;
  labelStyle?: FormLabelStyleType;
  labelPosition?: FormLabelPositionType;
}

/**
 * Extended options interface for TextArea to include UI library-specific config
 */
export interface ITextAreaOptions extends IFormControlOptions {
  textareaConfig?: Partial<TextareaConfig>;
  labelStyle?: FormLabelStyleType;
  labelPosition?: FormLabelPositionType;
  rows?: number;
  cols?: number;
  autoResize?: boolean;
  size: FormComponentSizeType;
  variant: FormComponentVariantType;
}
