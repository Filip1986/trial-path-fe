/**
 * Common types for dialog dropdown options
 * These types provide consistent interfaces for all form element configuration dialogs
 */

import {
  FormLabelStyleEnum,
  FormLabelPositionEnum,
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  CheckboxModeEnum,
  RadioButtonModeEnum,
  DatePickerModeEnum,
  DatePickerViewEnum,
  DatePickerHourFormatEnum,
  TimePickerHourFormatEnum,
  InputNumberModeEnum,
  MultiSelectDisplayModeEnum,
  InputTextIconPositionEnum,
} from '@artificial-sense/ui-lib';

/**
 * Generic option interface for dropdowns
 */
export interface DropdownOption<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
}

/**
 * Label Style Options
 */
export type LabelStyleOption = DropdownOption<FormLabelStyleEnum>;

export const LABEL_STYLE_OPTIONS: LabelStyleOption[] = [
  { label: 'Default', value: FormLabelStyleEnum.DEFAULT },
];

/**
 * Label Position Options
 */
export type LabelPositionOption = DropdownOption<FormLabelPositionEnum>;

export const LABEL_POSITION_OPTIONS: LabelPositionOption[] = [
  { label: 'Above', value: FormLabelPositionEnum.ABOVE },
];

/**
 * Component Size Options
 */
export type ComponentSizeOption = DropdownOption<FormComponentSizeEnum>;

export const COMPONENT_SIZE_OPTIONS: ComponentSizeOption[] = [
  { label: 'Small', value: FormComponentSizeEnum.SMALL },
  { label: 'Normal', value: FormComponentSizeEnum.NORMAL },
  { label: 'Large', value: FormComponentSizeEnum.LARGE },
];

/**
 * Component Variant Options
 */
export type ComponentVariantOption = DropdownOption<FormComponentVariantEnum>;

export const COMPONENT_VARIANT_OPTIONS: ComponentVariantOption[] = [
  { label: 'Filled', value: FormComponentVariantEnum.FILLED },
  { label: 'Outlined', value: FormComponentVariantEnum.OUTLINED },
];

/**
 * Checkbox Mode Options
 */
export type CheckboxModeOption = DropdownOption<CheckboxModeEnum>;

export const CHECKBOX_MODE_OPTIONS: CheckboxModeOption[] = [
  { label: 'Binary', value: CheckboxModeEnum.BINARY },
  { label: 'Group', value: CheckboxModeEnum.GROUP },
];

/**
 * Radio Button Mode Options
 */
export type RadioButtonModeOption = DropdownOption<RadioButtonModeEnum>;

export const RADIO_BUTTON_MODE_OPTIONS: RadioButtonModeOption[] = [
  { label: 'Standard', value: RadioButtonModeEnum.STANDARD },
];

/**
 * Date Picker Mode Options
 */
export type DatePickerModeOption = DropdownOption<DatePickerModeEnum>;

export const DATE_PICKER_MODE_OPTIONS: DatePickerModeOption[] = [
  { label: 'Single', value: DatePickerModeEnum.SINGLE },
  { label: 'Multiple', value: DatePickerModeEnum.MULTIPLE },
  { label: 'Range', value: DatePickerModeEnum.RANGE },
];

/**
 * Date Picker View Options
 */
export type DatePickerViewOption = DropdownOption<DatePickerViewEnum>;

export const DATE_PICKER_VIEW_OPTIONS: DatePickerViewOption[] = [
  { label: 'Date', value: DatePickerViewEnum.DATE },
  { label: 'Month', value: DatePickerViewEnum.MONTH },
  { label: 'Year', value: DatePickerViewEnum.YEAR },
];

/**
 * Date Picker Hour Format Options
 */
export type DatePickerHourFormatOption = DropdownOption<DatePickerHourFormatEnum>;

export const DATE_PICKER_HOUR_FORMAT_OPTIONS: DatePickerHourFormatOption[] = [
  { label: '12 Hour', value: DatePickerHourFormatEnum.TWELVE },
  { label: '24 Hour', value: DatePickerHourFormatEnum.TWENTY_FOUR },
];

/**
 * Time Picker Hour Format Options
 */
export type TimePickerHourFormatOption = DropdownOption<TimePickerHourFormatEnum>;

export const TIME_PICKER_HOUR_FORMAT_OPTIONS: TimePickerHourFormatOption[] = [
  { label: '12 Hour', value: TimePickerHourFormatEnum.TWELVE },
  { label: '24 Hour', value: TimePickerHourFormatEnum.TWENTY_FOUR },
];

/**
 * Input Number Mode Options
 */
export type InputNumberModeOption = DropdownOption<InputNumberModeEnum>;

export const INPUT_NUMBER_MODE_OPTIONS: InputNumberModeOption[] = [
  { label: 'Decimal', value: InputNumberModeEnum.DECIMAL },
];

/**
 * Multi Select Display Mode Options
 */
export type MultiSelectDisplayModeOption = DropdownOption<MultiSelectDisplayModeEnum>;

export const MULTI_SELECT_DISPLAY_MODE_OPTIONS: MultiSelectDisplayModeOption[] = [
  { label: 'Comma Separated', value: MultiSelectDisplayModeEnum.COMMA },
  { label: 'Chip', value: MultiSelectDisplayModeEnum.CHIP },
];

/**
 * Input Text Icon Position Options
 */
export type InputTextIconPositionOption = DropdownOption<InputTextIconPositionEnum>;

export const INPUT_TEXT_ICON_POSITION_OPTIONS: InputTextIconPositionOption[] = [
  { label: 'Left', value: InputTextIconPositionEnum.LEFT },
  { label: 'Right', value: InputTextIconPositionEnum.RIGHT },
];

/**
 * Generic utility type for creating option arrays from enums
 */
export type EnumToOptions<T extends Record<string, string | number>> = {
  [K in keyof T]: DropdownOption<T[K]>;
}[keyof T][];

/**
 * Utility function to convert enum to dropdown options
 */
export function enumToOptions<T extends Record<string, string | number>>(
  enumObject: T,
  labelFormatter?: (value: string) => string,
): DropdownOption<T[keyof T]>[] {
  return Object.entries(enumObject).map(([key, value]) => ({
    label: labelFormatter ? labelFormatter(key) : formatEnumLabel(key),
    value: value as T[keyof T],
  }));
}

/**
 * Format enum key to human-readable label
 */
export function formatEnumLabel(enumKey: string): string {
  return enumKey
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Collection of all common dropdown options for easy import
 */
export const CommonDropdownOptions = {
  labelStyles: LABEL_STYLE_OPTIONS,
  labelPositions: LABEL_POSITION_OPTIONS,
  sizes: COMPONENT_SIZE_OPTIONS,
  variants: COMPONENT_VARIANT_OPTIONS,
  checkboxModes: CHECKBOX_MODE_OPTIONS,
  radioButtonModes: RADIO_BUTTON_MODE_OPTIONS,
  datePickerModes: DATE_PICKER_MODE_OPTIONS,
  datePickerViews: DATE_PICKER_VIEW_OPTIONS,
  datePickerHourFormats: DATE_PICKER_HOUR_FORMAT_OPTIONS,
  timePickerHourFormats: TIME_PICKER_HOUR_FORMAT_OPTIONS,
  inputNumberModes: INPUT_NUMBER_MODE_OPTIONS,
  multiSelectDisplayModes: MULTI_SELECT_DISPLAY_MODE_OPTIONS,
  inputTextIconPositions: INPUT_TEXT_ICON_POSITION_OPTIONS,
} as const;

/**
 * Type helpers for specific component configurations
 */
export interface CommonDialogOptions {
  labelStyles: LabelStyleOption[];
  labelPositions: LabelPositionOption[];
  sizes: ComponentSizeOption[];
  variants: ComponentVariantOption[];
}

/**
 * Extended options for specific dialog types
 */
export interface CheckboxDialogOptions extends CommonDialogOptions {
  modes: CheckboxModeOption[];
}

export interface RadioButtonDialogOptions extends CommonDialogOptions {
  modes: RadioButtonModeOption[];
}

export interface DatePickerDialogOptions extends CommonDialogOptions {
  selectionModes: DatePickerModeOption[];
  views: DatePickerViewOption[];
  hourFormats: DatePickerHourFormatOption[];
}

export interface TimePickerDialogOptions
  extends Pick<CommonDialogOptions, 'labelStyles' | 'labelPositions'> {
  hourFormats: TimePickerHourFormatOption[];
}

export interface InputNumberDialogOptions extends CommonDialogOptions {
  modes: InputNumberModeOption[];
}

export interface MultiselectDialogOptions extends CommonDialogOptions {
  displayModes: MultiSelectDisplayModeOption[];
}

export interface InputTextDialogOptions extends CommonDialogOptions {
  iconPositions: InputTextIconPositionOption[];
}

/**
 * Factory function to create common dialog options
 */
export function createCommonDialogOptions(): CommonDialogOptions {
  return {
    labelStyles: [...LABEL_STYLE_OPTIONS],
    labelPositions: [...LABEL_POSITION_OPTIONS],
    sizes: [...COMPONENT_SIZE_OPTIONS],
    variants: [...COMPONENT_VARIANT_OPTIONS],
  };
}

/**
 * Factory functions for specific dialog options
 */
export const DialogOptionFactories = {
  checkbox: (): CheckboxDialogOptions => ({
    ...createCommonDialogOptions(),
    modes: [...CHECKBOX_MODE_OPTIONS],
  }),

  radioButton: (): RadioButtonDialogOptions => ({
    ...createCommonDialogOptions(),
    modes: [...RADIO_BUTTON_MODE_OPTIONS],
  }),

  datePicker: (): DatePickerDialogOptions => ({
    ...createCommonDialogOptions(),
    selectionModes: [...DATE_PICKER_MODE_OPTIONS],
    views: [...DATE_PICKER_VIEW_OPTIONS],
    hourFormats: [...DATE_PICKER_HOUR_FORMAT_OPTIONS],
  }),

  timePicker: (): TimePickerDialogOptions => ({
    labelStyles: [...LABEL_STYLE_OPTIONS],
    labelPositions: [...LABEL_POSITION_OPTIONS],
    hourFormats: [...TIME_PICKER_HOUR_FORMAT_OPTIONS],
  }),

  inputNumber: (): InputNumberDialogOptions => ({
    ...createCommonDialogOptions(),
    modes: [...INPUT_NUMBER_MODE_OPTIONS],
  }),

  multiselect: (): MultiselectDialogOptions => ({
    ...createCommonDialogOptions(),
    displayModes: [...MULTI_SELECT_DISPLAY_MODE_OPTIONS],
  }),

  inputText: (): InputTextDialogOptions => ({
    ...createCommonDialogOptions(),
    iconPositions: [...INPUT_TEXT_ICON_POSITION_OPTIONS],
  }),
};

/**
 * Re-export individual option arrays for backward compatibility
 */
export {
  LABEL_STYLE_OPTIONS as labelStyles,
  LABEL_POSITION_OPTIONS as labelPositions,
  COMPONENT_SIZE_OPTIONS as sizes,
  COMPONENT_VARIANT_OPTIONS as variants,
  CHECKBOX_MODE_OPTIONS as checkboxModes,
  RADIO_BUTTON_MODE_OPTIONS as radioButtonModes,
  DATE_PICKER_MODE_OPTIONS as datePickerModes,
  DATE_PICKER_VIEW_OPTIONS as datePickerViews,
  DATE_PICKER_HOUR_FORMAT_OPTIONS as datePickerHourFormats,
  TIME_PICKER_HOUR_FORMAT_OPTIONS as timePickerHourFormats,
  INPUT_NUMBER_MODE_OPTIONS as inputNumberModes,
  MULTI_SELECT_DISPLAY_MODE_OPTIONS as multiSelectDisplayModes,
  INPUT_TEXT_ICON_POSITION_OPTIONS as inputTextIconPositions,
};
