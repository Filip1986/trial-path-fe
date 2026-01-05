import { ComponentType } from '../enums/component-types.enum';
import { FormElementType } from '../enums/form.enums';

export const FORM_ELEMENT_TO_COMPONENT_MAP: Partial<Record<FormElementType, ComponentType>> = {
  [FormElementType.INPUT_TEXT]: ComponentType.TEXT_INPUT,
  [FormElementType.TEXT_AREA]: ComponentType.TEXT_AREA,
  [FormElementType.CHECKBOX]: ComponentType.CHECKBOX,
  [FormElementType.RADIO]: ComponentType.RADIO,
  [FormElementType.DATE_PICKER]: ComponentType.DATE_PICKER,
  [FormElementType.TIME_PICKER]: ComponentType.TIME_PICKER,
  [FormElementType.INPUT_NUMBER]: ComponentType.NUMBER_INPUT,
  [FormElementType.SELECT]: ComponentType.DROPDOWN,
  [FormElementType.MULTISELECT]: ComponentType.MULTISELECT,
  [FormElementType.LIST_BOX]: ComponentType.LIST_BOX,
  [FormElementType.SELECT_BUTTON]: ComponentType.SELECT_BUTTON,
  [FormElementType.COLUMNS]: ComponentType.COLUMNS,
};
