import { Injectable } from '@angular/core';
import { InputTextConfig } from '@artificial-sense/ui-lib';
import { DialogConfigBuilder } from '../builders/config-builders';
import {
  // Import the new types
  DropdownOption,
  LabelStyleOption,
  LabelPositionOption,
  ComponentSizeOption,
  ComponentVariantOption,
  CheckboxModeOption,
  RadioButtonModeOption,
  DatePickerModeOption,
  DatePickerViewOption,
  DatePickerHourFormatOption,
  TimePickerHourFormatOption,
  InputNumberModeOption,
  MultiSelectDisplayModeOption,
  InputTextIconPositionOption,
  // Import the constants
  CommonDropdownOptions,
  DialogOptionFactories,
  enumToOptions,
  formatEnumLabel,
  CheckboxDialogOptions,
  RadioButtonDialogOptions,
  DatePickerDialogOptions,
  TimePickerDialogOptions,
  InputNumberDialogOptions,
  MultiselectDialogOptions,
  InputTextDialogOptions,
} from '../models/dialog.types';
import { FormElementType } from '@core/models/enums/form.enums';
import {
  IDialogFieldConfig,
  IDialogConfiguration,
  IDialogBehaviorOption,
} from '@core/models/interfaces/dialog.interfaces';
import { OptionFieldConfigs } from '@core/models/interfaces/options.interfaces';

@Injectable({
  providedIn: 'root',
})
export class DialogConfigFactory {
  // Get common basic fields configuration based on a control type
  getBasicFields(controlType: FormElementType): IDialogFieldConfig[] {
    const commonFields: IDialogFieldConfig[] = [
      {
        name: 'label',
        config: DialogConfigBuilder.createLabelConfig(),
      },
      {
        name: 'helperText',
        config: DialogConfigBuilder.createHelperTextConfig(),
      },
    ];

    // Add placeholder for controls that support it
    const withPlaceholder: IDialogFieldConfig[] = [...commonFields];
    withPlaceholder.splice(1, 0, {
      name: 'placeholder',
      config: DialogConfigBuilder.createPlaceholderConfig(),
    });

    switch (controlType) {
      case FormElementType.INPUT_TEXT:
      case FormElementType.TEXT_AREA:
      case FormElementType.INPUT_NUMBER:
      case FormElementType.DATE_PICKER:
      case FormElementType.TIME_PICKER:
      case FormElementType.SELECT:
      case FormElementType.MULTISELECT:
        return withPlaceholder;

      case FormElementType.RADIO:
        return [
          ...commonFields,
          {
            name: 'name',
            config: DialogConfigBuilder.createTextConfig('Group Name', 'Enter radio group name', {
              required: true,
              helperText: 'Unique identifier to group radio buttons together',
            }),
          },
        ];

      // Other control types just use common fields
      default:
        return commonFields;
    }
  }

  // Get behavior options for different control types
  getBehaviorOptions(controlType: FormElementType): IDialogBehaviorOption[] {
    // Common behavior options across all controls
    const commonOptions: IDialogBehaviorOption[] = [
      { name: 'required', label: 'Required field', controlName: 'required' },
      { name: 'disabled', label: 'Disabled', controlName: 'disabled' },
    ];

    switch (controlType) {
      case FormElementType.CHECKBOX:
        return [
          ...commonOptions,
          { name: 'indeterminate', label: 'Indeterminate', controlName: 'indeterminate' },
        ];

      case FormElementType.TEXT_AREA:
        return [
          ...commonOptions,
          { name: 'autoResize', label: 'Auto Resize', controlName: 'autoResize' },
        ];

      case FormElementType.INPUT_NUMBER:
        return [
          ...commonOptions,
          { name: 'useGrouping', label: 'Use thousand separators', controlName: 'useGrouping' },
        ];

      case FormElementType.SELECT:
        return [
          ...commonOptions,
          { name: 'filter', label: 'Enable filter', controlName: 'filter' },
          { name: 'showClear', label: 'Show clear button', controlName: 'showClear' },
          { name: 'group', label: 'Use grouped options', controlName: 'group' },
        ];

      case FormElementType.MULTISELECT:
        return [
          ...commonOptions,
          { name: 'filter', label: 'Enable Filter', controlName: 'filter' },
          { name: 'showToggleAll', label: 'Show Select All', controlName: 'showToggleAll' },
          { name: 'group', label: 'Use grouped options', controlName: 'group' },
        ];

      case FormElementType.DATE_PICKER:
        return [
          ...commonOptions,
          { name: 'showTime', label: 'Show time', controlName: 'showTime' },
          { name: 'showIcon', label: 'Show icon', controlName: 'showIcon' },
        ];

      // Default case just returns common options
      default:
        return commonOptions;
    }
  }

  // Updated methods using the new types

  /**
   * Get enum dropdown options with proper typing
   */
  getEnumOptions<T extends Record<string, string | number>>(
    enumType: T,
  ): DropdownOption<T[keyof T]>[] {
    return enumToOptions(enumType, formatEnumLabel);
  }

  /**
   * Get hour format options for date/time pickers
   */
  getHourFormatOptions(): DatePickerHourFormatOption[] {
    return CommonDropdownOptions.datePickerHourFormats;
  }

  /**
   * Get time picker hour format options
   */
  getTimePickerHourFormatOptions(): TimePickerHourFormatOption[] {
    return CommonDropdownOptions.timePickerHourFormats;
  }

  // Specific getter methods for common enums with proper typing
  getLabelStyleOptions(): LabelStyleOption[] {
    return CommonDropdownOptions.labelStyles;
  }

  getLabelPositionOptions(): LabelPositionOption[] {
    return CommonDropdownOptions.labelPositions;
  }

  getSizeOptions(): ComponentSizeOption[] {
    return CommonDropdownOptions.sizes;
  }

  getVariantOptions(): ComponentVariantOption[] {
    return CommonDropdownOptions.variants;
  }

  getCheckboxModeOptions(): CheckboxModeOption[] {
    return CommonDropdownOptions.checkboxModes;
  }

  getRadioButtonModeOptions(): RadioButtonModeOption[] {
    return CommonDropdownOptions.radioButtonModes;
  }

  getDatePickerModeOptions(): DatePickerModeOption[] {
    return CommonDropdownOptions.datePickerModes;
  }

  getDatePickerViewOptions(): DatePickerViewOption[] {
    return CommonDropdownOptions.datePickerViews;
  }

  getInputNumberModeOptions(): InputNumberModeOption[] {
    return CommonDropdownOptions.inputNumberModes;
  }

  getMultiSelectDisplayModeOptions(): MultiSelectDisplayModeOption[] {
    return CommonDropdownOptions.multiSelectDisplayModes;
  }

  getInputTextIconPositionOptions(): InputTextIconPositionOption[] {
    return CommonDropdownOptions.inputTextIconPositions;
  }

  // Get validation configuration objects
  getValidationConfigs(type: 'text' | 'number' | 'date') {
    switch (type) {
      case 'text':
        return {
          minLengthConfig: DialogConfigBuilder.createNumberConfig('Minimum Length', 0, undefined, {
            helperText: 'Minimum number of characters required',
          }),
          maxLengthConfig: DialogConfigBuilder.createNumberConfig('Maximum Length', 0, undefined, {
            helperText: 'Maximum number of characters allowed',
          }),
        };

      case 'number':
        return {
          minConfig: DialogConfigBuilder.createNumberConfig('Minimum Value', undefined, undefined, {
            helperText: 'Minimum allowed value',
          }),
          maxConfig: DialogConfigBuilder.createNumberConfig('Maximum Value', undefined, undefined, {
            helperText: 'Maximum allowed value',
          }),
          stepConfig: DialogConfigBuilder.createNumberConfig('Step', 0, undefined, {
            helperText: 'Increment/decrement step',
          }),
        };

      // Add other cases as needed
      default:
        return {};
    }
  }

  // Get option field configs for select-type components
  getOptionFieldConfigs(): OptionFieldConfigs {
    return {
      optionLabelConfig: DialogConfigBuilder.createTextConfig('Option Label Field', 'e.g. name', {
        helperText: 'Field to use as the label for complex objects',
      }),
      optionValueConfig: DialogConfigBuilder.createTextConfig('Option Value Field', 'e.g. id', {
        helperText: 'Field to use as the value for complex objects',
      }),
      optionDisabledConfig: DialogConfigBuilder.createTextConfig(
        'Option Disabled Field',
        'e.g. disabled',
        { helperText: 'Field to use for disabling options' },
      ),
    };
  }

  getCheckboxDialogConfig(): { groupTitleConfig: InputTextConfig } {
    return {
      groupTitleConfig: DialogConfigBuilder.createTextConfig(
        'Group Title',
        'Enter title for the checkbox group',
        {
          helperText: 'Title displayed above the checkbox group',
        },
      ),
    };
  }

  // Get dialog config object
  getDialogConfig(controlType: FormElementType): IDialogConfiguration {
    const titleMap: Record<FormElementType, string> = {
      [FormElementType.INPUT_TEXT]: 'Configure Input Text',
      [FormElementType.TEXT_AREA]: 'Configure Text Area',
      [FormElementType.CHECKBOX]: 'Configure Checkbox',
      [FormElementType.RADIO]: 'Configure Radio Button',
      [FormElementType.DATE_PICKER]: 'Configure Date Picker',
      [FormElementType.TIME_PICKER]: 'Configure Time Picker',
      [FormElementType.INPUT_NUMBER]: 'Configure Number Input',
      [FormElementType.SELECT]: 'Configure Select',
      [FormElementType.MULTISELECT]: 'Configure Multiselect',
      [FormElementType.LIST_BOX]: 'Configure ListBox',
      [FormElementType.SELECT_BUTTON]: 'Configure Select Button',
      // [FormElementType.CALCULATED]: '',
      // [FormElementType.ATTACHMENT]: '',
      // [FormElementType.SIGNATURE]: '',
      // [FormElementType.TABLE]: '',
      // [FormElementType.SECTION]: '',
      [FormElementType.COLUMNS]: '',
      // [FormElementType.ROW]: '',
      // [FormElementType.COLUMN]: '',
      // [FormElementType.MEDICATION]: '',
      // [FormElementType.LAB_TEST]: '',
      // [FormElementType.VITAL_SIGN]: '',
    };

    return {
      title: titleMap[controlType] || `Configure ${controlType}`,
      showPreview: true,
      previewDebounceTime: 200,
      height: '70vh',
      width: '200px',
      elementType: controlType,
      enablePresets: true,
      tabs: [],
      defaultValues: {},
    };
  }

  /**
   * Get all options for a specific dialog type using the factory functions
   */
  getCheckboxDialogOptions(): CheckboxDialogOptions {
    return DialogOptionFactories.checkbox();
  }

  getRadioButtonDialogOptions(): RadioButtonDialogOptions {
    return DialogOptionFactories.radioButton();
  }

  getDatePickerDialogOptions(): DatePickerDialogOptions {
    return DialogOptionFactories.datePicker();
  }

  getTimePickerDialogOptions(): TimePickerDialogOptions {
    return DialogOptionFactories.timePicker();
  }

  getInputNumberDialogOptions(): InputNumberDialogOptions {
    return DialogOptionFactories.inputNumber();
  }

  getMultiselectDialogOptions(): MultiselectDialogOptions {
    return DialogOptionFactories.multiselect();
  }

  getInputTextDialogOptions(): InputTextDialogOptions {
    return DialogOptionFactories.inputText();
  }

  // Helper methods
  private formatEnumLabel(value: string): string {
    return formatEnumLabel(value);
  }
}
