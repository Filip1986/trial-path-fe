import { Injectable } from '@angular/core';
import { Columns } from '../../form-controls/form-layout/columns/columns.class';
import { ECRFTextAreaClass } from '../../form-controls/form-elements/textarea/textarea.class';
import { ECRFCheckboxClass } from '../../form-controls/form-elements/checkbox/checkbox.class';
import { IconMappingService } from '../services/icon-mapping.service';
import { ECRFRadioButtonClass } from '../../form-controls/form-elements/radio-button/radio-button.class';
import { EcrfDatePickerClass } from '../../form-controls/form-elements/date-picker';
import { ECRFListBoxClass } from '../../form-controls/form-elements/listbox/listbox.class';
import { ECRFInputNumberClass } from '../../form-controls/form-elements/input-number/input-number.class';
import { Multiselect } from '../../form-controls/form-elements/multiselect/multiselect.class';
import { EcrfTimePickerClass } from '../../form-controls/form-elements/time-picker';
import { ECRFSelectClass } from '../../form-controls/form-elements/select/select.class';
import { ECRFSelectButtonClass } from '../../form-controls/form-elements/select-button/select-button.class';
import { ECRFInputTextClass } from '../../form-controls/form-elements/input-text/ecrf-input-text.class';
import { InputTextFactoryOptions } from '../models/interfaces/input-text.interfaces';
import { TextAreaFactoryOptions } from '../models/interfaces/text-area.interfaces';
import { CheckboxFactoryOptions } from '../models/interfaces/checkbox.interfaces';
import { IRadioFactoryOptions } from '../models/interfaces/radio.interfaces';
import { IDatePickerFactoryOptions } from '../models/interfaces/date-picker.interfaces';
import { ColumnsFactoryOptions } from '../models/interfaces/columns.interfaces';
import { ListBoxFactoryOptions } from '../models/interfaces/list-box.interfaces';
import { MultiselectFactoryOptions } from '../models/interfaces/multiselect.interfaces';
import { TimePickerFactoryOptions } from '../models/interfaces/time-picker.interfaces';
import { InputNumberFactoryOptions } from '../models/interfaces/input-number.interfaces';
import { SelectFactoryOptions } from '../models/interfaces/select.interfaces';
import { SelectButtonFactoryOptions } from '../models/interfaces/select-button.interfaces';
import { ControlBuilder, ControlFactoryOptions } from '../models/types/control.type';
import { IFormControl } from '../models/interfaces/form.interfaces';
import { FormElementType } from '../models/enums/form.enums';

/**
 * Factory service for creating form controls
 * This eliminates the need for magic strings when creating controls
 */
@Injectable({
  providedIn: 'root',
})
export class FormControlFactory {
  private readonly controlBuilders: Map<FormElementType, ControlBuilder<IFormControl>>;

  constructor(private iconService: IconMappingService) {
    this.controlBuilders = new Map<FormElementType, ControlBuilder<IFormControl>>([
      [FormElementType.INPUT_TEXT, this.createTextInput.bind(this)],
      [FormElementType.TEXT_AREA, this.createTextArea.bind(this)],
      [FormElementType.CHECKBOX, this.createCheckbox.bind(this)],
      [FormElementType.RADIO, this.createRadioButton.bind(this)],
      [FormElementType.DATE_PICKER, this.createDatePicker.bind(this)],
      [FormElementType.LIST_BOX, this.createListBox.bind(this)],
      [FormElementType.INPUT_NUMBER, this.createInputNumber.bind(this)],
      [FormElementType.MULTISELECT, this.createMultiselect.bind(this)],
      [FormElementType.TIME_PICKER, this.createTimePicker.bind(this)],
      [FormElementType.SELECT, this.createSelect.bind(this)],
      [FormElementType.SELECT_BUTTON, this.createSelectButton.bind(this)],
      [FormElementType.COLUMNS, this.createColumns.bind(this)],
    ]);
  }

  /**
   * Create a control of the specified type
   * @param type Form element type to create
   * @param options Configuration for the control
   * @returns A new form control instance
   */
  createControl(type: FormElementType, options: ControlFactoryOptions): IFormControl {
    const builder = this.controlBuilders.get(type);

    if (!builder) {
      // For placeholder types, create a TextInput with minimal configuration
      // if (this.isPlaceholderType(type)) {
      //   return this.createPlaceholderControl(type, options);
      // }

      console.warn(`Unknown control type: ${type}, defaulting to TextInput`);
      return this.createDefaultControl(options);
    }

    return builder(options);
  }

  /**
   * Create an input text control
   */
  private createTextInput(options: ControlFactoryOptions): ECRFInputTextClass {
    const textOptions = options as InputTextFactoryOptions;
    return new ECRFInputTextClass(this.iconService, {
      ...textOptions,
      maxLength: textOptions.maxLength,
      minLength: textOptions.minLength,
      pattern: textOptions.pattern,
    });
  }

  /**
   * Create a text area control
   */
  private createTextArea(options: ControlFactoryOptions): ECRFTextAreaClass {
    const textAreaOptions = options as TextAreaFactoryOptions;
    return new ECRFTextAreaClass(this.iconService, {
      ...textAreaOptions,
      rows: textAreaOptions.rows,
      cols: textAreaOptions.cols,
      autoResize: !!textAreaOptions.autoResize,
      maxLength: textAreaOptions.maxLength,
      minLength: textAreaOptions.minLength,
      size: textAreaOptions.size,
      labelStyle: textAreaOptions.labelStyle,
      labelPosition: textAreaOptions.labelPosition,
      variant: textAreaOptions.variant,
    });
  }

  /**
   * Create a checkbox control
   */
  private createCheckbox(options: ControlFactoryOptions): ECRFCheckboxClass {
    const checkboxOptions = options as CheckboxFactoryOptions;
    return new ECRFCheckboxClass(this.iconService, checkboxOptions);
  }

  /**
   * Create a radio button control
   */
  private createRadioButton(options: ControlFactoryOptions): ECRFRadioButtonClass {
    const radioOptions = options as IRadioFactoryOptions;
    return new ECRFRadioButtonClass(this.iconService, {
      ...radioOptions,
      size: radioOptions.size,
      radioOptions: radioOptions.radioOptions || [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
      ],
    });
  }

  /**
   * Create a date picker control
   */
  private createDatePicker(options: ControlFactoryOptions): EcrfDatePickerClass {
    const dateOptions = options as IDatePickerFactoryOptions;
    return new EcrfDatePickerClass(this.iconService, {
      ...dateOptions,
      dateFormat: dateOptions.dateFormat,
      showTime: dateOptions.showTime,
      size: dateOptions.size,
    });
  }

  /**
   * Create a listBox control
   */
  private createListBox(options: ControlFactoryOptions): ECRFListBoxClass {
    const listBoxOptions = options as ListBoxFactoryOptions;
    return new ECRFListBoxClass(this.iconService, {
      ...listBoxOptions,
      multiple: listBoxOptions.multiple,
      checkbox: listBoxOptions.checkbox,
      filter: listBoxOptions.filter,
      listOptions: listBoxOptions.listOptions || [],
      optionLabel: listBoxOptions.optionLabel,
      optionValue: listBoxOptions.optionValue,
    });
  }

  /**
   * Create an input number control
   */
  private createInputNumber(options: ControlFactoryOptions): ECRFInputNumberClass {
    const numberOptions = options as InputNumberFactoryOptions;
    return new ECRFInputNumberClass(this.iconService, numberOptions);
  }

  /**
   * Create a multiselect control
   */
  private createMultiselect(options: ControlFactoryOptions): Multiselect {
    const multiselectOptions = options as MultiselectFactoryOptions;
    return new Multiselect(this.iconService, {
      ...multiselectOptions,
      multiple: multiselectOptions.multiple ?? true,
      filter: multiselectOptions.filter ?? false,
      showToggleAll: multiselectOptions.showToggleAll ?? true,
      options: multiselectOptions.selectOptions || [],
      optionLabel: multiselectOptions.optionLabel,
      optionValue: multiselectOptions.optionValue,
      checkbox: multiselectOptions.checkbox ?? false,
      group: multiselectOptions.group ?? false,
      optionGroupLabel: multiselectOptions.optionGroupLabel,
      optionGroupChildren: multiselectOptions.optionGroupChildren,
      maxSelectedLabels: multiselectOptions.maxSelectedLabels,
      display: multiselectOptions.display,
      variant: multiselectOptions.variant,
      size: multiselectOptions.size,
    });
  }

  /**
   * Create a time picker control
   */
  private createTimePicker(options: ControlFactoryOptions): EcrfTimePickerClass {
    const timeOptions = options as TimePickerFactoryOptions;
    return new EcrfTimePickerClass(this.iconService, {
      ...timeOptions,
      hourFormat: timeOptions.hourFormat,
    });
  }

  /**
   * Create a select control
   */
  private createSelect(options: ControlFactoryOptions): ECRFSelectClass {
    const selectOptions = options as SelectFactoryOptions;
    return new ECRFSelectClass(this.iconService, {
      ...selectOptions,
      filter: selectOptions.filter ?? false,
      showClear: selectOptions.showClear ?? false,
      selectOptions: selectOptions.selectOptions || [],
      optionLabel: selectOptions.optionLabel,
      optionValue: selectOptions.optionValue,
      group: selectOptions.group,
      optionGroupLabel: selectOptions.optionGroupLabel,
      optionGroupChildren: selectOptions.optionGroupChildren,
    });
  }

  /**
   * Create a select button control
   */
  private createSelectButton(options: ControlFactoryOptions): ECRFSelectButtonClass {
    const selectButtonOptions = options as SelectButtonFactoryOptions;
    return new ECRFSelectButtonClass(this.iconService, {
      ...selectButtonOptions,
      multiple: selectButtonOptions.multiple ?? false,
      options: selectButtonOptions.selectButtonOptions ||
        selectButtonOptions.selectOptions || [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
        ],
      optionLabel: selectButtonOptions.optionLabel || 'label',
      optionValue: selectButtonOptions.optionValue || 'value',
      optionDisabled: selectButtonOptions.optionDisabled,
      size: selectButtonOptions.size,
    });
  }

  /**
   * Create a column control
   */
  private createColumns(options: ControlFactoryOptions): Columns {
    const columnsOptions = options as ColumnsFactoryOptions;
    return new Columns(columnsOptions.columnCount || 2, this.iconService);
  }

  /**
   * Create a default control when the type is not recognized
   */
  private createDefaultControl(options: ControlFactoryOptions): ECRFInputTextClass {
    return new ECRFInputTextClass(this.iconService, options);
  }
}
