import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewTextareaComponent } from '../../form-elements/preview-textarea/preview-textarea.component';
import { PreviewCheckboxComponent } from '../../form-elements/preview-checkbox/preview-checkbox.component';
import { PreviewRadioButtonComponent } from '../../form-elements/preview-radio-button/preview-radio-button.component';
import { PreviewDatePickerComponent } from '../../form-elements/preview-date-picker/preview-date-picker.component';
import { isColumnsControl } from '@core/utils/type-guards';
import { PreviewSelectComponent } from '../../form-elements/preview-select/preview-select.component';
import { PreviewInputTextComponent } from '../../form-elements/preview-input-text/preview-input-text.component';
import { IFormControl } from '@core/models/interfaces/form.interfaces';
import { FormElementType } from '@core/models/enums/form.enums';

@Component({
  selector: 'app-preview-columns',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    PreviewInputTextComponent,
    PreviewTextareaComponent,
    PreviewCheckboxComponent,
    PreviewRadioButtonComponent,
    PreviewDatePickerComponent,
    PreviewSelectComponent,
  ],
  templateUrl: './preview-columns.component.html',
  styleUrl: './preview-columns.component.scss',
})
export class PreviewColumnsComponent<T extends IFormControl> {
  @Input() control!: T;

  // Make type enums available to the template
  readonly FormElementType: typeof FormElementType = FormElementType;

  /**
   * TrackBy function for controls to optimize rendering
   * @param index The index of the control
   * @param control The form control
   * @returns A unique identifier for the control
   */
  trackByControlId(index: number, control: IFormControl): string {
    return control.id || `column-control-${index}`;
  }

  /**
   * TrackBy function for columns to optimize rendering
   * @param index Column index
   * @returns A unique identifier for the column
   */
  trackByColumnIndex(index: number): number {
    return index;
  }

  /**
   * Get a preview value for a control
   */
  getControlValue(control: IFormControl): any {
    // Return the control's value if it exists, otherwise a sample value based on type
    if (control.value !== undefined) {
      return control.value;
    }

    // Provide appropriate defaults based on a control type
    switch (control.type) {
      case FormElementType.INPUT_TEXT:
        return 'Sample text';
      case FormElementType.TEXT_AREA:
        return 'Sample text area content';
      case FormElementType.CHECKBOX:
        return false;
      default:
        return '';
    }
  }

  /**
   * Get the columns from the control if it's a Columns type
   */
  getColumns(): any[] {
    if (isColumnsControl(this.control)) {
      return this.control.columns || [];
    }
    return [];
  }

  /**
   * Get the CSS class for the column grid based on column count
   */
  getColumnsClass(): string {
    const columnCount: number = isColumnsControl(this.control) ? this.control.columns.length : 1;
    return `grid-cols-${columnCount || 1}`;
  }
}
