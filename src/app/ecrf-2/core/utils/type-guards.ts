import { ECRFRadioButtonClass } from '../../form-controls/form-elements/radio-button/radio-button.class';
import { ECRFCheckboxClass } from '../../form-controls/form-elements/checkbox/checkbox.class';
import { ECRFTextAreaClass } from '../../form-controls/form-elements/textarea/textarea.class';
import { EcrfDatePickerClass } from '../../form-controls/form-elements/date-picker';
import { ECRFListBoxClass } from '../../form-controls/form-elements/listbox/listbox.class';
import { ECRFInputNumberClass } from '../../form-controls/form-elements/input-number/input-number.class';
import { Columns } from '../../form-controls/form-layout/columns/columns.class';
import { ECRFMultiSelectClass } from '../../form-controls/form-elements/multiselect/multiselect.class';
import { EcrfTimePickerClass } from '../../form-controls/form-elements/time-picker';
import { ECRFSelectClass } from '../../form-controls/form-elements/select/select.class';
import { ECRFSelectButtonClass } from '../../form-controls/form-elements/select-button/select-button.class';
import { ECRFInputTextClass } from '../../form-controls/form-elements/input-text/ecrf-input-text.class';
import { IFormControl } from '../models/interfaces/form.interfaces';
import { FormElementType } from '../models/enums/form.enums';

/**
 * Type guard utilities for safely checking element types
 * These replace unsafe string-based type checking
 */

/**
 * Base type guard that checks if a control is a specific type
 * Provides common validation logic to reduce duplication
 */
function isFormControlOfType<T extends IFormControl>(
  control: unknown,
  type: FormElementType,
  additionalChecks?: (ctrl: any) => boolean,
): control is T {
  return (
    control !== null &&
    control !== undefined &&
    typeof control === 'object' &&
    'type' in control &&
    (control as any).type === type &&
    (!additionalChecks || additionalChecks(control))
  );
}

/**
 * Enhanced type guard that ensures the control has a specific method
 */
function hasMethod<T extends IFormControl>(control: T, methodName: string): boolean {
  return methodName in control && typeof (control as any)[methodName] === 'function';
}

/**
 * Type guard for TextInput controls
 */
export function isTextInputControl(control: unknown): control is ECRFInputTextClass {
  return isFormControlOfType<ECRFInputTextClass>(
    control,
    FormElementType.INPUT_TEXT,
    (ctrl): boolean => hasMethod(ctrl, 'toInputTextConfig'),
  );
}

/**
 * Type guard for TextArea controls
 */
export function isTextAreaControl(control: unknown): control is ECRFTextAreaClass {
  return isFormControlOfType<ECRFTextAreaClass>(
    control,
    FormElementType.TEXT_AREA,
    (ctrl: any): boolean => hasMethod(ctrl, 'toTextareaConfig'),
  );
}

/**
 * Type guard for Checkbox controls
 */
export function isCheckboxControl(control: unknown): control is ECRFCheckboxClass {
  return isFormControlOfType<ECRFCheckboxClass>(
    control,
    FormElementType.CHECKBOX,
    (ctrl): boolean => hasMethod(ctrl, 'toCheckboxConfig'),
  );
}

/**
 * Type guard for RadioButton controls
 */
export function isRadioButtonControl(control: unknown): control is ECRFRadioButtonClass {
  return isFormControlOfType<ECRFRadioButtonClass>(
    control,
    FormElementType.RADIO,
    (ctrl): boolean => hasMethod(ctrl, 'toRadioButtonConfig'),
  );
}

/**
 * Type guard for DatePicker controls
 */
export function isDatePickerControl(control: unknown): control is EcrfDatePickerClass {
  return isFormControlOfType<EcrfDatePickerClass>(
    control,
    FormElementType.DATE_PICKER,
    (ctrl): boolean => hasMethod(ctrl, 'toDatePickerConfig'),
  );
}

/**
 * Type guard for ListBox controls
 */
export function isListBoxControl(control: unknown): control is ECRFListBoxClass {
  return isFormControlOfType<ECRFListBoxClass>(control, FormElementType.LIST_BOX, (ctrl): boolean =>
    hasMethod(ctrl, 'toListBoxConfig'),
  );
}

/**
 * Type guard for InputNumber controls
 */
export function isInputNumberControl(control: unknown): control is ECRFInputNumberClass {
  return isFormControlOfType<ECRFInputNumberClass>(
    control,
    FormElementType.INPUT_NUMBER,
    (ctrl): boolean => hasMethod(ctrl, 'toInputNumberConfig'),
  );
}

/**
 * Type guard for Columns controls
 */
export function isColumnsControl(control: unknown): control is Columns {
  return isFormControlOfType<Columns>(
    control,
    FormElementType.COLUMNS,
    (ctrl) => 'columns' in ctrl && Array.isArray(ctrl.columns),
  );
}

/**
 * Type guard for MultiSelect controls
 */
export function isMultiSelectControl(control: unknown): control is ECRFMultiSelectClass {
  return isFormControlOfType<ECRFMultiSelectClass>(
    control,
    FormElementType.MULTISELECT,
    (ctrl): boolean => hasMethod(ctrl, 'toMultiSelectConfig'),
  );
}

/**
 * Type guard for TimePicker controls
 */
export function isTimePickerControl(control: unknown): control is EcrfTimePickerClass {
  return isFormControlOfType<EcrfTimePickerClass>(
    control,
    FormElementType.TIME_PICKER,
    (ctrl): boolean => hasMethod(ctrl, 'toTimePickerConfig'),
  );
}

/**
 * Type guard for Select controls
 */
export function isSelectControl(control: unknown): control is ECRFSelectClass {
  return isFormControlOfType<ECRFSelectClass>(control, FormElementType.SELECT, (ctrl): boolean =>
    hasMethod(ctrl, 'toSelectConfig'),
  );
}

/**
 * Type guard for SelectButton controls
 */
export function isSelectButtonControl(control: unknown): control is ECRFSelectButtonClass {
  return isFormControlOfType<ECRFSelectButtonClass>(
    control,
    FormElementType.SELECT_BUTTON,
    (ctrl): boolean => hasMethod(ctrl, 'toSelectButtonConfig'),
  );
}
