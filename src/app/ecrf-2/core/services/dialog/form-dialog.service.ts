import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Import all dialog components
import { TextareaDialogComponent } from '../../../dialogs/element-dialogs/textarea-dialog/textarea-dialog.component';
import { CheckboxDialogComponent } from '../../../dialogs/element-dialogs/checkbox-dialog/checkbox-dialog.component';
import { RadioButtonDialogComponent } from '../../../dialogs/element-dialogs/radio-button-dialog/radio-button-dialog.component';
import { DatePickerDialogComponent } from '../../../dialogs/element-dialogs/date-picker-dialog/date-picker-dialog.component';
import { ListBoxDialogComponent } from '../../../dialogs/element-dialogs/listbox-dialog/listbox-dialog.component';
import { InputNumberDialogComponent } from '../../../dialogs/element-dialogs/input-number-dialog/input-number-dialog.component';
import { MultiselectDialogComponent } from '../../../dialogs/element-dialogs/multiselect-dialog/multiselect-dialog.component';
import { TimePickerDialogComponent } from '../../../dialogs/element-dialogs/time-picker-dialog/time-picker-dialog.component';
import { SelectDialogComponent } from '../../../dialogs/element-dialogs/select-dialog/select-dialog.component';
import { SelectButtonDialogComponent } from '../../../dialogs/element-dialogs/select-button-dialog/select-button-dialog.component';

// Import control types
import { ECRFTextAreaClass } from '../../../form-controls/form-elements/textarea/textarea.class';
import { ECRFCheckboxClass } from '../../../form-controls/form-elements/checkbox/checkbox.class';
import { ECRFRadioButtonClass } from '../../../form-controls/form-elements/radio-button/radio-button.class';
import { EcrfDatePickerClass } from '../../../form-controls/form-elements/date-picker';
import { ECRFListBoxClass } from '../../../form-controls/form-elements/listbox/listbox.class';
import { ECRFInputNumberClass } from '../../../form-controls/form-elements/input-number/input-number.class';
import { Multiselect } from '../../../form-controls/form-elements/multiselect/multiselect.class';
import { EcrfTimePickerClass } from '../../../form-controls/form-elements/time-picker';
import { ECRFSelectClass } from '../../../form-controls/form-elements/select/select.class';
import { ECRFSelectButtonClass } from '../../../form-controls/form-elements/select-button/select-button.class';
import { BaseDialogService } from './base-dialog.service';
import { ECRFInputTextClass } from '../../../form-controls/form-elements/input-text/ecrf-input-text.class';
import { IDialogComponent } from '../../models/interfaces/dialog.interfaces';
import { InputTextDialogComponent } from '../../../dialogs/element-dialogs/input-text-dialog/input-text-dialog.component';

/**
 * Service for managing form element configuration dialogs
 * Extends the base dialog service for form-specific functionality
 */
@Injectable({
  providedIn: 'root',
})
export class FormDialogService extends BaseDialogService {
  /**
   * Open a dialog to configure an input text element
   */
  openTextInputDialog(textInput?: ECRFInputTextClass): Observable<ECRFInputTextClass> {
    return this.openFormControlDialog(InputTextDialogComponent, textInput);
  }

  /**
   * Open a dialog to configure a textarea element
   */
  openTextareaDialog(textArea?: ECRFTextAreaClass): Observable<ECRFTextAreaClass> {
    return this.openFormControlDialog(TextareaDialogComponent, textArea);
  }

  /**
   * Open a dialog to configure a checkbox element
   */
  openCheckboxDialog(checkbox?: ECRFCheckboxClass): Observable<ECRFCheckboxClass> {
    return this.openFormControlDialog(CheckboxDialogComponent, checkbox);
  }

  /**
   * Open a dialog to configure a radio button element
   */
  openRadioButtonDialog(radioButton?: ECRFRadioButtonClass): Observable<ECRFRadioButtonClass> {
    return this.openFormControlDialog(RadioButtonDialogComponent, radioButton);
  }

  /**
   * Open a dialog to configure a date picker element
   */
  openDatePickerDialog(datePicker?: EcrfDatePickerClass): Observable<EcrfDatePickerClass> {
    return this.openFormControlDialog(DatePickerDialogComponent, datePicker);
  }

  /**
   * Open a dialog to configure a listBox element
   */
  openListBoxDialog(listBox?: ECRFListBoxClass): Observable<ECRFListBoxClass> {
    return this.openFormControlDialog(ListBoxDialogComponent, listBox);
  }

  /**
   * Open a dialog to configure an input number element
   */
  openInputNumberDialog(inputNumber?: ECRFInputNumberClass): Observable<ECRFInputNumberClass> {
    return this.openFormControlDialog(InputNumberDialogComponent, inputNumber);
  }

  /**
   * Open a dialog to configure a multiselect element
   */
  openMultiselectDialog(multiselect?: Multiselect): Observable<Multiselect> {
    return this.openFormControlDialog(MultiselectDialogComponent, multiselect);
  }

  /**
   * Open a dialog to configure a time picker element
   */
  openTimePickerDialog(timePicker?: EcrfTimePickerClass): Observable<EcrfTimePickerClass> {
    return this.openFormControlDialog(TimePickerDialogComponent, timePicker);
  }

  /**
   * Open a dialog to configure a select element
   */
  openSelectDialog(select?: ECRFSelectClass): Observable<ECRFSelectClass> {
    return this.openFormControlDialog(SelectDialogComponent, select);
  }

  /**
   * Open a dialog to configure a select button element
   */
  openSelectButtonDialog(selectButton?: ECRFSelectButtonClass): Observable<ECRFSelectButtonClass> {
    return this.openFormControlDialog(SelectButtonDialogComponent, selectButton);
  }

  /**
   * Generic method to open a form control dialog
   *
   * @param dialogComponent The dialog component type
   * @param control Optional existing control to edit
   * @returns Observable that emits when the dialog is saved
   */
  private openFormControlDialog<TDialog extends IDialogComponent<any, TControl>, TControl>(
    dialogComponent: new (...args: any[]) => TDialog,
    control?: TControl,
  ): Observable<TControl> {
    return this.createObservableDialog<TDialog, TControl>(
      dialogComponent,
      undefined,
      (instance: TDialog): void => {
        if (control && 'control' in instance && typeof instance === 'object') {
          (instance as any).control = control;
        }
      },
    );
  }
}
