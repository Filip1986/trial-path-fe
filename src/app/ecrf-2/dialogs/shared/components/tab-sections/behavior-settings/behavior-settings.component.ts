import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ConfigSectionComponent } from '../../config-section/config-section.component';
import { CheckboxModeEnum, CheckboxModeType, LibCheckboxComponent } from '@artificial-sense/ui-lib';
import { IDialogBehaviorOption } from '../../../../../core/models/interfaces/dialog.interfaces';

@Component({
  selector: 'app-behavior-settings',
  standalone: true,
  imports: [ConfigSectionComponent, LibCheckboxComponent, ReactiveFormsModule],
  templateUrl: './behavior-settings.component.html',
  styleUrl: './behavior-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BehaviorSettingsComponent {
  @Input() form!: FormGroup;
  @Input() options: IDialogBehaviorOption[] = [];

  protected checkboxMode: CheckboxModeType = CheckboxModeEnum.BINARY;

  // Helper method to get FormControl from the form
  getControl(name: string): FormControl {
    return this.form.get(name) as FormControl;
  }

  /**
   * Track by function for options
   */
  trackByOptionName(index: number, option: any): string {
    return option.name;
  }
}
