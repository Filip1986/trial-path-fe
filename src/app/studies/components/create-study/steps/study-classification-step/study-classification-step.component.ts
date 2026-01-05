import { Component } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import {
  LibSelectComponent,
  LibMultiSelectComponent,
  LibInputTextComponent,
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  FormLabelPositionEnum,
  FormLabelStyleEnum,
  DEFAULT_SCROLL_HEIGHT,
} from '@artificial-sense/ui-lib';
import { StepBaseComponent } from '../../shared/step-base.component';

@Component({
  selector: 'app-study-classification-step',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    LibSelectComponent,
    LibMultiSelectComponent,
    LibInputTextComponent
],
  templateUrl: './study-classification-step.component.html',
})
export class StudyClassificationStepComponent extends StepBaseComponent {
  // Required fields for this step
  requiredFields = ['studyType', 'phase', 'therapeuticArea', 'indication'];

  // Form component enums for template
  readonly FormComponentVariantEnum = FormComponentVariantEnum;
  readonly FormLabelPositionEnum = FormLabelPositionEnum;
  readonly FormComponentSizeEnum = FormComponentSizeEnum;
  readonly FormLabelStyleEnum = FormLabelStyleEnum;
  readonly DEFAULT_SCROLL_HEIGHT = DEFAULT_SCROLL_HEIGHT;

  // Options data
  studyTypes = [
    { label: 'Interventional', value: 'interventional' },
    { label: 'Observational', value: 'observational' },
    { label: 'Expanded Access', value: 'expanded_access' },
  ];

  studyPhases = [
    { label: 'Early Phase 1', value: 'early_phase_1' },
    { label: 'Phase 1', value: 'phase_1' },
    { label: 'Phase 1/Phase 2', value: 'phase_1_2' },
    { label: 'Phase 2', value: 'phase_2' },
    { label: 'Phase 2/Phase 3', value: 'phase_2_3' },
    { label: 'Phase 3', value: 'phase_3' },
    { label: 'Phase 4', value: 'phase_4' },
    { label: 'Not Applicable', value: 'not_applicable' },
  ];

  therapeuticAreas = [
    { label: 'Oncology', value: 'oncology' },
    { label: 'Cardiology', value: 'cardiology' },
    { label: 'Neurology', value: 'neurology' },
    { label: 'Infectious Diseases', value: 'infectious_diseases' },
    { label: 'Immunology', value: 'immunology' },
    { label: 'Endocrinology', value: 'endocrinology' },
    { label: 'Respiratory', value: 'respiratory' },
    { label: 'Gastroenterology', value: 'gastroenterology' },
    { label: 'Dermatology', value: 'dermatology' },
    { label: 'Psychiatry', value: 'psychiatry' },
  ];

  constructor() {
    super();
    this.stepId = 'classification';
    this.stepLabel = 'Study Classification';
  }
}
