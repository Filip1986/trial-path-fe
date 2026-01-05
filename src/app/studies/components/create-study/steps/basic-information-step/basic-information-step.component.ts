import { Component } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import {
  LibInputTextComponent,
  LibTextareaComponent,
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  FormLabelPositionEnum,
  FormLabelStyleEnum,
} from '@artificial-sense/ui-lib';
import { StepBaseComponent } from '../../shared/step-base.component';

@Component({
  selector: 'app-basic-information-step',
  standalone: true,
  imports: [ReactiveFormsModule, LibInputTextComponent, LibTextareaComponent],
  templateUrl: './basic-information-step.component.html',
})
export class BasicInformationStepComponent extends StepBaseComponent {
  // Required fields for this step
  requiredFields = ['title', 'shortTitle', 'description', 'objectives'];

  // Form component enums for template
  readonly FormComponentVariantEnum = FormComponentVariantEnum;
  readonly FormLabelPositionEnum = FormLabelPositionEnum;
  readonly FormComponentSizeEnum = FormComponentSizeEnum;
  readonly FormLabelStyleEnum = FormLabelStyleEnum;

  constructor() {
    super();
    this.stepId = 'basic';
    this.stepLabel = 'Basic Information';
  }
}
