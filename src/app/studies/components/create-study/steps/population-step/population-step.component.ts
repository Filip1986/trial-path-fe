import { Component } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import {
  LibInputNumberComponent,
  LibSelectComponent,
  LibCheckboxComponent,
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  FormLabelPositionEnum,
  FormLabelStyleEnum,
  DEFAULT_SCROLL_HEIGHT,
} from '@artificial-sense/ui-lib';
import { StepBaseComponent } from '../../shared/step-base.component';

@Component({
  selector: 'app-population-step',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    LibInputNumberComponent,
    LibSelectComponent,
    LibCheckboxComponent
],
  templateUrl: './population-step.component.html',
})
export class PopulationStepComponent extends StepBaseComponent {
  // Required fields for this step
  requiredFields = [
    'plannedEnrollment',
    'minimumAge',
    'maximumAge',
    'healthyVolunteers',
    'genderBased',
  ];

  // Form component enums for template
  readonly FormComponentVariantEnum = FormComponentVariantEnum;
  readonly FormLabelPositionEnum = FormLabelPositionEnum;
  readonly FormComponentSizeEnum = FormComponentSizeEnum;
  readonly FormLabelStyleEnum = FormLabelStyleEnum;
  readonly DEFAULT_SCROLL_HEIGHT = DEFAULT_SCROLL_HEIGHT;

  // Options data
  ageUnits = [
    { label: 'Years', value: 'years' },
    { label: 'Months', value: 'months' },
    { label: 'Days', value: 'days' },
  ];

  healthyVolunteerOptions = [
    { label: 'Accepts Healthy Volunteers', value: 'yes' },
    { label: 'No Healthy Volunteers', value: 'no' },
  ];

  genderOptions = [
    { label: 'All', value: 'all' },
    { label: 'Female', value: 'female' },
    { label: 'Male', value: 'male' },
  ];

  constructor() {
    super();
    this.stepId = 'population';
    this.stepLabel = 'Population & Enrollment';
  }
}
