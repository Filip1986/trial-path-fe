import { Component } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import {
  LibSelectComponent,
  LibMultiSelectComponent,
  LibInputNumberComponent,
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  FormLabelPositionEnum,
  FormLabelStyleEnum,
  DEFAULT_SCROLL_HEIGHT,
} from '@artificial-sense/ui-lib';
import { StepBaseComponent } from '../../shared/step-base.component';

@Component({
  selector: 'app-study-design-step',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    LibSelectComponent,
    LibMultiSelectComponent,
    LibInputNumberComponent
],
  templateUrl: './study-design-step.component.html',
})
export class StudyDesignStepComponent extends StepBaseComponent {
  // Required fields for this step
  requiredFields = ['designType', 'interventionModel', 'primaryPurpose', 'masking', 'allocation'];

  // Form component enums for template
  readonly FormComponentVariantEnum = FormComponentVariantEnum;
  readonly FormLabelPositionEnum = FormLabelPositionEnum;
  readonly FormComponentSizeEnum = FormComponentSizeEnum;
  readonly FormLabelStyleEnum = FormLabelStyleEnum;
  readonly DEFAULT_SCROLL_HEIGHT = DEFAULT_SCROLL_HEIGHT;

  // Options data
  designTypes = [
    { label: 'Parallel Assignment', value: 'parallel' },
    { label: 'Crossover Assignment', value: 'crossover' },
    { label: 'Factorial Assignment', value: 'factorial' },
    { label: 'Single Group Assignment', value: 'single_group' },
  ];

  interventionModels = [
    { label: 'Single Group Assignment', value: 'single_group' },
    { label: 'Parallel Assignment', value: 'parallel' },
    { label: 'Crossover Assignment', value: 'crossover' },
    { label: 'Factorial Assignment', value: 'factorial' },
    { label: 'Sequential Assignment', value: 'sequential' },
  ];

  primaryPurposes = [
    { label: 'Treatment', value: 'treatment' },
    { label: 'Prevention', value: 'prevention' },
    { label: 'Diagnostic', value: 'diagnostic' },
    { label: 'Supportive Care', value: 'supportive_care' },
    { label: 'Screening', value: 'screening' },
    { label: 'Health Services Research', value: 'health_services_research' },
    { label: 'Basic Science', value: 'basic_science' },
    { label: 'Device Feasibility', value: 'device_feasibility' },
  ];

  maskingOptions = [
    { label: 'None (Open Label)', value: 'none' },
    { label: 'Single (Participant)', value: 'single' },
    { label: 'Double (Participant, Investigator)', value: 'double' },
    { label: 'Triple (Participant, Investigator, Outcomes Assessor)', value: 'triple' },
    {
      label: 'Quadruple (Participant, Care Provider, Investigator, Outcomes Assessor)',
      value: 'quadruple',
    },
  ];

  allocationOptions = [
    { label: 'Randomized', value: 'randomized' },
    { label: 'Non-Randomized', value: 'non_randomized' },
    { label: 'Not Applicable', value: 'not_applicable' },
  ];

  constructor() {
    super();
    this.stepId = 'design';
    this.stepLabel = 'Study Design';
  }
}
