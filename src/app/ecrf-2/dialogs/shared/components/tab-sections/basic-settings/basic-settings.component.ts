import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LibInputTextComponent } from '@artificial-sense/ui-lib';
import { ConfigSectionComponent } from '../../config-section/config-section.component';
import { FormFieldWrapperDirective } from '../../../directives/form-field-wrapper/form-field-wrapper.component';
import { IDialogFieldConfig } from '@core/models/interfaces/dialog.interfaces';

@Component({
  selector: 'app-basic-settings',
  standalone: true,
  imports: [
    ConfigSectionComponent,
    FormFieldWrapperDirective,
    LibInputTextComponent,
    ReactiveFormsModule
],
  templateUrl: './basic-settings.component.html',
  styleUrl: './basic-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicSettingsComponent {
  @Input() form!: FormGroup;
  @Input() fields: IDialogFieldConfig[] = [];

  // Helper method to get FormControl from the form
  getControl(name: string): FormControl {
    return this.form.get(name) as FormControl;
  }

  /**
   * Track by function for fields
   */
  trackByFieldName(index: number, field: IDialogFieldConfig): string {
    return field.name;
  }
}
