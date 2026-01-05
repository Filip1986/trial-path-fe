import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { AccordionModule } from 'primeng/accordion';
import { FormFieldWrapperDirective } from '../../../directives/form-field-wrapper/form-field-wrapper.component';
import { LibInputTextComponent } from '@artificial-sense/ui-lib';
import { ConfigSectionComponent } from '../../config-section/config-section.component';
import { CustomValidationSettingsComponent } from '../custom-validation-settings/custom-validation-settings.component';

@Component({
  selector: 'app-validation-settings',
  standalone: true,
  imports: [
    DatePickerModule,
    AccordionModule,
    FormFieldWrapperDirective,
    LibInputTextComponent,
    ConfigSectionComponent,
    ReactiveFormsModule,
    CustomValidationSettingsComponent
],
  templateUrl: './validation-settings.component.html',
  styleUrl: './validation-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidationSettingsComponent {
  @Input() form!: FormGroup;
  @Input() type: 'text' | 'number' | 'date' = 'text';
  @Input() showPattern = false;
  @Input() elementType?: string; // Pass through element type for custom validation

  // Config objects - these can be overridden with @Input()
  @Input() minLengthConfig: any = {
    label: 'Minimum Length',
    placeholder: '0',
    helperText: 'Minimum number of characters required',
    type: 'number',
    min: 0,
  };

  @Input() maxLengthConfig: any = {
    label: 'Maximum Length',
    placeholder: '255',
    helperText: 'Maximum number of characters allowed',
    type: 'number',
    min: 0,
  };

  @Input() patternConfig: any = {
    label: 'Validation Pattern',
    placeholder: 'e.g. ^[a-zA-Z]+$',
    helperText: 'Regular expression pattern for validation',
  };

  @Input() minConfig: any = {
    label: 'Minimum Value',
    placeholder: '',
    helperText: 'Minimum allowed value',
    type: 'number',
  };

  @Input() maxConfig: any = {
    label: 'Maximum Value',
    placeholder: '',
    helperText: 'Maximum allowed value',
    type: 'number',
  };

  // Helper method to get FormControl from the form
  getControl(name: string): FormControl {
    return this.form.get(name) as FormControl;
  }

  /**
   * Check if custom validation rules exist
   */
  hasCustomValidationRules(): boolean {
    const rules = this.form.get('customValidationRules')?.value;
    return rules && Array.isArray(rules) && rules.length > 0;
  }

  /**
   * Get count of active custom validation rules
   */
  getCustomValidationRuleCount(): number {
    const rules = this.form.get('customValidationRules')?.value;
    if (!rules || !Array.isArray(rules)) return 0;
    return rules.filter((rule: any) => rule.enabled).length;
  }
}
