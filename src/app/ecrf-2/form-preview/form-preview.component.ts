import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { PreviewColumnsComponent } from './form-layout/preview-columns/preview-columns.component';
import { PreviewTextareaComponent } from './form-elements/preview-textarea/preview-textarea.component';
import { PreviewCheckboxComponent } from './form-elements/preview-checkbox/preview-checkbox.component';
import { PreviewRadioButtonComponent } from './form-elements/preview-radio-button/preview-radio-button.component';
import {
  isCheckboxControl,
  isDatePickerControl,
  isInputNumberControl,
  isListBoxControl,
  isMultiSelectControl,
  isRadioButtonControl,
  isSelectButtonControl,
  isSelectControl,
  isTextAreaControl,
  isTextInputControl,
  isTimePickerControl,
} from '@core/utils/type-guards';
import { ECRFRadioButtonClass } from '../form-controls/form-elements/radio-button/radio-button.class';
import { PreviewDatePickerComponent } from './form-elements/preview-date-picker/preview-date-picker.component';
import { PreviewListboxComponent } from './form-elements/preview-listbox/preview-listbox.component';
import { PreviewInputNumberComponent } from './form-elements/preview-input-number/preview-input-number.component';
import { PreviewMultiselectComponent } from './form-elements/preview-multiselect/preview-multiselect.component';
import { PreviewTimePickerComponent } from './form-elements/preview-time-picker/preview-time-picker.component';
import { PreviewSelectComponent } from './form-elements/preview-select/preview-select.component';
import { PreviewSelectButtonComponent } from './form-elements/preview-select-button/preview-select-button.component';
import { PreviewInputTextComponent } from './form-elements/preview-input-text/preview-input-text.component';
import { IForm, IFormControl } from '@core/models/interfaces/form.interfaces';
import { FormElementType } from '@core/models/enums/form.enums';

@Component({
  selector: 'app-form-preview',
  templateUrl: './form-preview.component.html',
  styleUrls: ['./form-preview.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PreviewInputTextComponent,
    PreviewColumnsComponent,
    PreviewTextareaComponent,
    PreviewCheckboxComponent,
    PreviewRadioButtonComponent,
    PreviewDatePickerComponent,
    PreviewListboxComponent,
    PreviewInputNumberComponent,
    PreviewMultiselectComponent,
    PreviewTimePickerComponent,
    PreviewSelectComponent,
    PreviewSelectButtonComponent
],
})
export class FormPreviewComponent {
  @Input() form!: IForm;

  // Make type enums available to the template
  readonly FormElementType: typeof FormElementType = FormElementType;

  /**
   * TrackBy function for form controls to optimize rendering
   * @param index The index of the control
   * @param control The form control
   * @returns A unique identifier for the control
   */
  trackByControlId(index: number, control: IFormControl): string {
    return control.id || `preview-control-${index}`;
  }

  /**
   * Get the appropriate preview value for a control
   * @param control Form control to get value for
   * @returns Preview value based on a control type
   */
  getControlValue(control: IFormControl): any {
    console.log('getControlValue', control);
    // Return the control's value if it exists
    if (control.value !== undefined) {
      return control.value;
    }

    if (isTextInputControl(control)) {
      return 'Sample text';
    } else if (isTextAreaControl(control)) {
      return 'Sample text area content';
    } else if (isCheckboxControl(control)) {
      return false;
    } else if (isRadioButtonControl(control)) {
      // Return the first option's value if available
      const radioControl: ECRFRadioButtonClass = control;
      return radioControl.radioOptions?.length ? radioControl.radioOptions[0].value : null;
    } else if (isDatePickerControl(control)) {
      // Return the current date as a sample value
      return new Date();
    } else if (isInputNumberControl(control)) {
      return 42; // Example default value for number inputs
    } else if (isListBoxControl(control)) {
      return control.listOptions?.length ? control.listOptions[0] : null;
    } else if (isMultiSelectControl(control)) {
      console.log('multiselect');
      // Return the first few options as selected by default for preview
      return control.selectOptions?.length > 0
        ? control.selectOptions
            .slice(0, 2)
            .map((o) => (typeof o === 'object' ? o[control.optionValue || 'value'] || o : o))
        : [];
    } else if (isTimePickerControl(control)) {
      // Return the current time as a sample value
      return new Date();
    } else if (isSelectControl(control)) {
      // Return the first option's value if available
      // Use selectOptions array instead of options property
      return control.selectOptions?.length ? control.selectOptions[0].value : null;
    } else if (isSelectButtonControl(control)) {
      // Return the first option's value if available
      return control.selectButtonOptions?.length ? control.selectButtonOptions[0].value : null;
    } else {
      // Default value for other control types
      return '';
    }
  }
}
