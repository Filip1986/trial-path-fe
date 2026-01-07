import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import {
  FormLabelStyleEnum,
  FormLabelPositionEnum,
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  CheckboxModeEnum,
  DatePickerModeEnum,
  DatePickerViewEnum,
  DatePickerHourFormatEnum,
  MultiSelectDisplayModeEnum,
  InputTextIconPositionEnum,
  RadioButtonModeEnum,
  InputNumberModeEnum,
  TimePickerHourFormatEnum,
} from '@artificial-sense/ui-lib';
import { ConfigurationValidators } from '../validators/configuration-validators';
import { FormElementType } from '@core/models/enums/form.enums';

@Injectable({
  providedIn: 'root',
})
export class DialogFormBuilder {
  constructor(private fb: FormBuilder) {}

  /**
   * Build a form for the Text Input dialog
   */
  buildTextInputForm(): FormGroup {
    return this.fb.group(
      {
        label: ['', [Validators.required]],
        placeholder: [''],
        required: [false],
        disabled: [false],
        minLength: [null, [Validators.min(0)]],
        maxLength: [null, [Validators.min(0)]],
        helperText: [''],
        labelStyle: [FormLabelStyleEnum.DEFAULT],
        labelPosition: [FormLabelPositionEnum.ABOVE],
        iconClass: [''],
        iconPosition: [InputTextIconPositionEnum.LEFT],
        customValidationRules: this.fb.array([]),
      },
      {
        validators: [ConfigurationValidators.lengthRange()],
      },
    );
  }

  /**
   * Build a form for the Textarea dialog
   */
  buildTextareaForm(): FormGroup {
    return this.fb.group(
      {
        label: ['', [Validators.required]],
        placeholder: [''],
        required: [false],
        disabled: [false],
        rows: [3, [Validators.min(1), Validators.max(50)]],
        cols: [30, [Validators.min(1), Validators.max(200)]],
        autoResize: [false],
        minLength: [null, [Validators.min(0)]],
        maxLength: [null, [Validators.min(0)]],
        helperText: [''],
        labelStyle: [FormLabelStyleEnum.DEFAULT],
        labelPosition: [FormLabelPositionEnum.ABOVE],
      },
      {
        validators: [ConfigurationValidators.lengthRange()],
      },
    );
  }

  /**
   * Build a form for the Checkbox dialog
   */
  buildCheckboxForm(): FormGroup {
    return this.fb.group({
      label: ['', [Validators.required]],
      required: [false],
      disabled: [false],
      mode: [CheckboxModeEnum.BINARY],
      size: [FormComponentSizeEnum.NORMAL],
      variant: [FormComponentVariantEnum.OUTLINED],
      indeterminate: [false],
      helperText: [''],
      labelStyle: [FormLabelStyleEnum.DEFAULT],
      labelPosition: [FormLabelPositionEnum.ABOVE],
      groupTitle: [''],
      options: this.fb.array([]),
    });
  }

  /**
   * Build a form for Radio Button dialog
   */
  buildRadioButtonForm(): FormGroup {
    return this.fb.group(
      {
        label: ['', [Validators.required]],
        name: ['', [Validators.required]],
        required: [false],
        disabled: [false],
        mode: [RadioButtonModeEnum.STANDARD],
        size: [null], // null means normal size
        variant: [FormComponentVariantEnum.OUTLINED],
        helperText: [''],
        labelStyle: [FormLabelStyleEnum.DEFAULT],
        labelPosition: [FormLabelPositionEnum.ABOVE],
        options: this.fb.array([]), // Initialize the option form array here
      },
      {
        validators: [ConfigurationValidators.uniqueOptionValues()],
      },
    );
  }

  /**
   * Build a form for the Date Picker dialog
   */
  buildDatePickerForm(): FormGroup {
    return this.fb.group({
      label: ['', [Validators.required]],
      placeholder: [''],
      required: [false],
      disabled: [false],
      selectionMode: [DatePickerModeEnum.SINGLE],
      view: [DatePickerViewEnum.DATE],
      dateFormat: ['mm/dd/yy'],
      showTime: [false],
      hourFormat: [DatePickerHourFormatEnum.TWENTY_FOUR],
      labelStyle: [FormLabelStyleEnum.DEFAULT],
      labelPosition: [FormLabelPositionEnum.ABOVE],
      helperText: [''],
      showIcon: [true],
      // Validation fields
      minDate: [null],
      maxDate: [null],
    });
  }

  /**
   * Build a form for Time Picker dialog
   */
  buildTimePickerForm(): FormGroup {
    return this.fb.group({
      label: ['', [Validators.required]],
      placeholder: [''],
      required: [false],
      disabled: [false],
      format: [TimePickerHourFormatEnum.TWELVE],
      showSeconds: [false],
      stepMinute: [1, [Validators.min(1), Validators.max(60)]],
      stepSecond: [1, [Validators.min(1), Validators.max(60)]],
      labelStyle: [FormLabelStyleEnum.DEFAULT],
      labelPosition: [FormLabelPositionEnum.ABOVE],
      helperText: [''],
      showIcon: [true],
      size: [FormComponentSizeEnum.NORMAL],
    });
  }

  /**
   * Build a form for the Input Number dialog
   */
  buildInputNumberForm(): FormGroup {
    return this.fb.group(
      {
        label: ['', [Validators.required]],
        placeholder: [''],
        required: [false],
        disabled: [false],
        min: [null],
        max: [null],
        step: [1, [Validators.min(0)]],
        prefix: [''],
        suffix: [''],
        mode: [InputNumberModeEnum.DECIMAL],
        labelStyle: [FormLabelStyleEnum.DEFAULT],
        labelPosition: [FormLabelPositionEnum.ABOVE],
        helperText: [''],
        useGrouping: [true],
        minFractionDigits: [0, [Validators.min(0), Validators.max(20)]],
        maxFractionDigits: [2, [Validators.min(0), Validators.max(20)]],
      },
      {
        validators: [ConfigurationValidators.valueRange()],
      },
    );
  }

  /**
   * Build a form for Select dialog
   */
  buildSelectForm(): FormGroup {
    return this.fb.group(
      {
        label: ['', [Validators.required]],
        placeholder: [''],
        required: [false],
        disabled: [false],
        filter: [false],
        showClear: [false],
        group: [false],
        optionLabel: [''],
        optionValue: [''],
        labelStyle: [FormLabelStyleEnum.DEFAULT],
        labelPosition: [FormLabelPositionEnum.ABOVE],
        size: [FormComponentSizeEnum.NORMAL],
        variant: [FormComponentVariantEnum.OUTLINED],
        helperText: [''],
        options: this.fb.array([]),
      },
      {
        validators: [ConfigurationValidators.uniqueOptionValues()],
      },
    );
  }

  /**
   * Build a form for Multiselect dialog
   */
  buildMultiselectForm(): FormGroup {
    return this.fb.group(
      {
        label: ['', [Validators.required]],
        placeholder: [''],
        required: [false],
        disabled: [false],
        multiple: [true], // Always true for multiselect
        filter: [false],
        showToggleAll: [true],
        group: [false],
        optionLabel: [''],
        optionValue: [''],
        optionGroupLabel: [''],
        optionGroupChildren: [''],
        maxSelectedLabels: [null],
        labelStyle: [FormLabelStyleEnum.DEFAULT],
        labelPosition: [FormLabelPositionEnum.ABOVE],
        display: [MultiSelectDisplayModeEnum.COMMA],
        size: [FormComponentSizeEnum.NORMAL],
        variant: [FormComponentVariantEnum.OUTLINED],
        helperText: [''],
        options: this.fb.array([]),
      },
      {
        validators: [ConfigurationValidators.uniqueOptionValues()],
      },
    );
  }

  /**
   * Build a form for the Listbox dialog
   */
  buildListboxForm(): FormGroup {
    return this.fb.group(
      {
        label: ['', [Validators.required]],
        required: [false],
        disabled: [false],
        multiple: [false],
        checkbox: [false],
        filter: [false],
        group: [false],
        optionLabel: [''],
        optionValue: [''],
        optionGroupLabel: [''],
        optionGroupChildren: [''],
        labelStyle: [FormLabelStyleEnum.DEFAULT],
        labelPosition: [FormLabelPositionEnum.ABOVE],
        helperText: [''],
        options: this.fb.array([]),
      },
      {
        validators: [ConfigurationValidators.uniqueOptionValues()],
      },
    );
  }

  /**
   * Build a form for the Select Button dialog
   */
  buildSelectButtonForm(): FormGroup {
    return this.fb.group(
      {
        label: ['', [Validators.required]],
        required: [false],
        disabled: [false],
        multiple: [false],
        optionLabel: [''],
        optionValue: [''],
        optionDisabled: [''],
        helperText: [''],
        size: [FormComponentSizeEnum.NORMAL],
        variant: [FormComponentVariantEnum.OUTLINED],
        labelStyle: [FormLabelStyleEnum.DEFAULT],
        labelPosition: [FormLabelPositionEnum.ABOVE],
        options: this.fb.array([]),
      },
      {
        validators: [ConfigurationValidators.uniqueOptionValues()],
      },
    );
  }

  /**
   * Build form based on a form element type
   */
  buildForm(type: FormElementType): FormGroup {
    switch (type) {
      case FormElementType.INPUT_TEXT:
        return this.buildTextInputForm();
      case FormElementType.TEXT_AREA:
        return this.buildTextareaForm();
      case FormElementType.CHECKBOX:
        return this.buildCheckboxForm();
      case FormElementType.RADIO:
        return this.buildRadioButtonForm();
      case FormElementType.DATE_PICKER:
        return this.buildDatePickerForm();
      case FormElementType.TIME_PICKER:
        return this.buildTimePickerForm();
      case FormElementType.INPUT_NUMBER:
        return this.buildInputNumberForm();
      case FormElementType.SELECT:
        return this.buildSelectForm();
      case FormElementType.MULTISELECT:
        return this.buildMultiselectForm();
      case FormElementType.LIST_BOX:
        return this.buildListboxForm();
      case FormElementType.SELECT_BUTTON:
        return this.buildSelectButtonForm();
      default:
        // Return a basic form for unsupported types
        return this.fb.group({
          label: ['', [Validators.required]],
          required: [false],
          disabled: [false],
        });
    }
  }

  /**
   * Add default options to an option array
   */
  addDefaultOptions(form: FormGroup, count = 2): void {
    const optionsArray = form.get('options') as FormArray;

    // Clear existing options
    while (optionsArray.length) {
      optionsArray.removeAt(0);
    }

    // Add default options
    for (let i = 0; i < count; i++) {
      optionsArray.push(
        this.fb.group({
          label: [`Option ${i + 1}`, Validators.required],
          value: [`option${i + 1}`, Validators.required],
          disabled: [false],
          group: [''],
        }),
      );
    }
  }
}
