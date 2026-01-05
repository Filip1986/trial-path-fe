import {
  FormLabelPositionEnum,
  FormLabelStyleEnum,
  InputTextConfig,
  InputTextIconPositionEnum,
  InputTextTypeEnum,
} from '@artificial-sense/ui-lib';
import { BaseControlOptions } from './options.interfaces';
import { IFormControlOptions } from './form.interfaces';
import { FormArray } from '@angular/forms';

/**
 * Type-specific options interfaces
 */
export interface InputTextFactoryOptions extends BaseControlOptions {
  placeholder?: string;
  inputType?: InputTextTypeEnum;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
}

/**
 * Extended options interface for TextInput to include UI library-specific config
 */
export interface ITextInputOptions extends IFormControlOptions {
  inputConfig?: Partial<InputTextConfig>;
  labelStyle?: FormLabelStyleEnum;
  labelPosition?: FormLabelPositionEnum;
  iconClass?: string;
  iconPosition?: InputTextIconPositionEnum;
  customValidationRules?: FormArray;
}
