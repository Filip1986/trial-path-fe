// Base interface for all form controls
import {
  CheckboxConfig,
  DatePickerConfig,
  InputTextConfig,
  MultiSelectConfig,
  RadioButtonConfig,
  TextareaConfig,
} from '@artificial-sense/ui-lib';
import { FormElementType } from '../enums/form.enums';
import { IValidationRule } from './validation.interfaces';

export interface IFormControl<
  TOptions extends IFormControlOptions = IFormControlOptions,
  TValue = string | number | boolean | Date | Date[] | null,
> {
  readonly id: string;
  iconName: string;
  type: FormElementType;
  title: string;
  value?: TValue;
  options?: TOptions;
  isClone?: boolean;

  // Make these optional and type-specific
  toInputTextConfig?: () => InputTextConfig;
  toTextareaConfig?: () => TextareaConfig;
  toCheckboxConfig?: () => CheckboxConfig;
  toRadioButtonConfig?: () => RadioButtonConfig;
  toDatePickerConfig?: () => DatePickerConfig;
  toMultiSelectConfig?: () => MultiSelectConfig;
  toListBoxConfig?: () => any;
  toInputNumberConfig?: () => any;
}

// Standard options for form controls
export interface IFormControlOptions {
  name: string;
  title: string;
  required: boolean;
  readonly?: boolean;
  disabled?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  helperText?: string;
  validations?: IValidationRule[];
}
// Form container interface
export interface IFormContainer<TControl extends IFormControl = IFormControl> {
  controls: TControl[];
}

// Main form interface
export interface IForm {
  id?: string; // Add an ID property
  title: string;
  description?: string; // Add a description field
  container: IFormContainer;
  version?: string; // Add versioning
  createdAt?: Date; // Add timestamps
  updatedAt?: Date;
  status?: 'draft' | 'published' | 'archived'; // Add a status field
}

export interface SavedFormMetadata {
  id: string;
  title: string;
  updatedAt: Date;
  status?: 'draft' | 'published' | 'archived';
}
