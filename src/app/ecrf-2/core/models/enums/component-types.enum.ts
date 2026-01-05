/**
 * Enum of component names used in the dynamic component registry
 * This eliminates magic strings when registering and retrieving components
 */
export enum ComponentType {
  // Container Components
  FORM_CONTAINER = 'FormContainer',
  COLUMNS = 'Columns',

  // Form Control Components
  TEXT_INPUT = 'TextInput',
  TEXT_AREA = 'TextArea',
  CHECKBOX = 'Checkbox',
  RADIO = 'Radio',
  DATE_PICKER = 'DatePicker',
  TIME_PICKER = 'TimePicker',
  NUMBER_INPUT = 'NumberInput',
  DROPDOWN = 'Dropdown',
  MULTISELECT = 'MultiSelect',
  LIST_BOX = 'ListBox',
  SELECT_BUTTON = 'SelectButton',

  // Dialog Components
  TEXT_INPUT_DIALOG = 'TextInputDialog',
  TEXTAREA_DIALOG = 'TextAreaDialog',
  CHECKBOX_DIALOG = 'CheckboxDialog',
  RADIO_DIALOG = 'RadioDialog',
  DATE_PICKER_DIALOG = 'DatePickerDialog',
  TIME_PICKER_DIALOG = 'TimePickerDialog',
  INPUT_NUMBER_DIALOG = 'InputNumberDialog',
  MULTISELECT_DIALOG = 'MultiselectDialog',
  SELECT_DIALOG = 'SelectDialog',
  SELECT_BUTTON_DIALOG = 'SelectButtonDialog',
  LIST_BOX_DIALOG = 'ListBoxDialog',

  // Preview Components
  PREVIEW_TEXT_INPUT = 'PreviewTextInput',
  PREVIEW_TEXTAREA = 'PreviewTextarea',
  PREVIEW_CHECKBOX = 'PreviewCheckbox',
  PREVIEW_RADIO = 'PreviewRadio',
  PREVIEW_DATE_PICKER = 'PreviewDatePicker',
  PREVIEW_TIME_PICKER = 'PreviewTimePicker',
  PREVIEW_INPUT_NUMBER = 'PreviewInputNumber',
  PREVIEW_MULTISELECT = 'PreviewMultiselect',
  PREVIEW_SELECT = 'PreviewSelect',
  PREVIEW_SELECT_BUTTON = 'PreviewSelectButton',
  PREVIEW_LIST_BOX = 'PreviewListBox',
  PREVIEW_COLUMNS = 'PreviewColumns',

  // Special Components
  FORM_PREVIEW = 'FormPreview',
  RADIO_GROUP = 'RadioGroup',
}
