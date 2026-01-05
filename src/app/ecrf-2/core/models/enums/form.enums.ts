/**
 * Types of form elements supported in the eCRF builder
 * This enum provides a single source of truth for all element types
 */
export enum FormElementType {
  // Basic Controls
  INPUT_TEXT = 'InputText',
  TEXT_AREA = 'Textarea',
  INPUT_NUMBER = 'InputNumber',
  DATE_PICKER = 'DatePicker',
  TIME_PICKER = 'Time',
  CHECKBOX = 'CheckBox',
  RADIO = 'Radio',
  SELECT = 'Select',

  // Advanced Controls
  MULTISELECT = 'Multiselect',
  LIST_BOX = 'ListBox',
  SELECT_BUTTON = 'SelectButton',
  COLUMNS = 'Columns',
}
