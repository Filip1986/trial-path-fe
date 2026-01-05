import { Injectable } from '@angular/core';
import { DialogFactoryService } from './dialog-factory.service';

// Import dialog components
import { TextareaDialogComponent } from '../../../dialogs/element-dialogs/textarea-dialog/textarea-dialog.component';
import { CheckboxDialogComponent } from '../../../dialogs/element-dialogs/checkbox-dialog/checkbox-dialog.component';
import { RadioButtonDialogComponent } from '../../../dialogs/element-dialogs/radio-button-dialog/radio-button-dialog.component';
import { DatePickerDialogComponent } from '../../../dialogs/element-dialogs/date-picker-dialog/date-picker-dialog.component';
import { TimePickerDialogComponent } from '../../../dialogs/element-dialogs/time-picker-dialog/time-picker-dialog.component';
import { SelectDialogComponent } from '../../../dialogs/element-dialogs/select-dialog/select-dialog.component';
import { MultiselectDialogComponent } from '../../../dialogs/element-dialogs/multiselect-dialog/multiselect-dialog.component';
import { SelectButtonDialogComponent } from '../../../dialogs/element-dialogs/select-button-dialog/select-button-dialog.component';

// Import control types
import { InputTextDialogComponent } from '../../../dialogs/element-dialogs/input-text-dialog/input-text-dialog.component';
import { FormElementType } from '../../models/enums/form.enums';

/**
 * Enhanced form dialog service that uses the dialog factory pattern
 */
@Injectable({
  providedIn: 'root',
})
export class EnhancedFormDialogService {
  constructor(private dialogFactory: DialogFactoryService) {
    this.registerDialogs();
  }

  /**
   * Register all dialog components with the factory
   */
  private registerDialogs(): void {
    // Input Text
    this.dialogFactory.registerDialog({
      controlType: FormElementType.INPUT_TEXT,
      dialogComponent: InputTextDialogComponent,
      defaultConfig: { width: '700px' },
    });

    // TextArea
    this.dialogFactory.registerDialog({
      controlType: FormElementType.TEXT_AREA,
      dialogComponent: TextareaDialogComponent,
      defaultConfig: { width: '700px' },
    });

    // Checkbox
    this.dialogFactory.registerDialog({
      controlType: FormElementType.CHECKBOX,
      dialogComponent: CheckboxDialogComponent,
      defaultConfig: { width: '600px' },
    });

    // Radio Button
    this.dialogFactory.registerDialog({
      controlType: FormElementType.RADIO,
      dialogComponent: RadioButtonDialogComponent,
      defaultConfig: { width: '700px' },
    });

    // Date Picker
    this.dialogFactory.registerDialog({
      controlType: FormElementType.DATE_PICKER,
      dialogComponent: DatePickerDialogComponent,
      defaultConfig: { width: '700px' },
    });

    // Time Picker
    this.dialogFactory.registerDialog({
      controlType: FormElementType.TIME_PICKER,
      dialogComponent: TimePickerDialogComponent,
      defaultConfig: { width: '600px' },
    });

    // Select
    this.dialogFactory.registerDialog({
      controlType: FormElementType.SELECT,
      dialogComponent: SelectDialogComponent,
      defaultConfig: { width: '700px' },
    });

    // Multiselect
    this.dialogFactory.registerDialog({
      controlType: FormElementType.MULTISELECT,
      dialogComponent: MultiselectDialogComponent,
      defaultConfig: { width: '700px' },
    });

    // Select Button
    this.dialogFactory.registerDialog({
      controlType: FormElementType.SELECT_BUTTON,
      dialogComponent: SelectButtonDialogComponent,
      defaultConfig: { width: '700px' },
    });
  }
}
