import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
// Replace the PrimeNG Select with your UI lib's Select component
import {
  LibSelectComponent,
  FormLabelStyleEnum,
  FormLabelPositionEnum,
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  DEFAULT_SCROLL_HEIGHT,
} from '@artificial-sense/ui-lib';
import { ConfigSectionComponent } from '../../config-section/config-section.component';
import { FormFieldWrapperDirective } from '../../../directives/form-field-wrapper/form-field-wrapper.component';

@Component({
  selector: 'app-appearance-settings',
  standalone: true,
  imports: [
    LibSelectComponent,
    ConfigSectionComponent,
    FormFieldWrapperDirective,
    ReactiveFormsModule
],
  templateUrl: './appearance-settings.component.html',
  styleUrl: './appearance-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppearanceSettingsComponent {
  @Input() form!: FormGroup;
  @Input() labelStyleOptions: any[] = [];
  @Input() labelPositionOptions: any[] = [];
  @Input() sizeOptions: any[] = [];
  @Input() variantOptions: any[] = [];

  @Input() showLabelStyle = true;
  @Input() showLabelPosition = true;
  @Input() showSize = true;
  @Input() showVariant = true;

  // Add enum references for use in the template
  protected readonly FormLabelStyleEnum: typeof FormLabelStyleEnum = FormLabelStyleEnum;
  protected readonly FormLabelPositionEnum: typeof FormLabelPositionEnum = FormLabelPositionEnum;
  protected readonly FormComponentSizeEnum: typeof FormComponentSizeEnum = FormComponentSizeEnum;
  protected readonly FormComponentVariantEnum: typeof FormComponentVariantEnum =
    FormComponentVariantEnum;
  protected readonly DEFAULT_SCROLL_HEIGHT = DEFAULT_SCROLL_HEIGHT;

  // Helper method to get FormControl from the form
  getControl(name: string): FormControl {
    return this.form.get(name) as FormControl;
  }
}
