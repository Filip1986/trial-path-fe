import { Component } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import {
  LibDatePickerComponent,
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  FormLabelPositionEnum,
  FormLabelStyleEnum,
  DatePickerViewEnum,
  DatePickerHourFormatEnum,
} from '@artificial-sense/ui-lib';
import { StepBaseComponent } from '../../shared/step-base.component';
import { StepHeaderComponent } from '../../shared/step-header.component';

@Component({
  selector: 'app-timeline-step',
  standalone: true,
  imports: [ReactiveFormsModule, LibDatePickerComponent, StepHeaderComponent],
  templateUrl: './timeline-step.component.html',
})
export class TimelineStepComponent extends StepBaseComponent {
  // Required fields for this step
  requiredFields = [
    'plannedStartDate',
    'plannedEndDate',
    'enrollmentStartDate',
    'enrollmentEndDate',
  ];

  // Form component enums for template
  readonly FormComponentVariantEnum = FormComponentVariantEnum;
  readonly FormLabelPositionEnum = FormLabelPositionEnum;
  readonly FormComponentSizeEnum = FormComponentSizeEnum;
  readonly FormLabelStyleEnum = FormLabelStyleEnum;
  readonly DatePickerViewEnum = DatePickerViewEnum;
  readonly DatePickerHourFormatEnum = DatePickerHourFormatEnum;

  constructor() {
    super();
    this.stepId = 'timeline';
    this.stepLabel = 'Timeline';
  }

  override validateStep(): boolean {
    const isBasicValidationPassed = super.validateStep();
    if (!isBasicValidationPassed) return false;

    // Additional date range validations
    return this.validateDateRanges();
  }

  private validateDateRanges(): boolean {
    if (!this.formGroup) return true;

    const startDate = this.formGroup.get('plannedStartDate')?.value;
    const endDate = this.formGroup.get('plannedEndDate')?.value;
    const enrollmentStart = this.formGroup.get('enrollmentStartDate')?.value;
    const enrollmentEnd = this.formGroup.get('enrollmentEndDate')?.value;

    let isValid = true;

    // Clear previous custom errors
    this.clearDateErrors();

    // Validate planned dates
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      this.formGroup.get('plannedEndDate')?.setErrors({ dateRange: true });
      isValid = false;
    }

    // Validate enrollment dates
    if (enrollmentStart && enrollmentEnd && new Date(enrollmentStart) >= new Date(enrollmentEnd)) {
      this.formGroup.get('enrollmentEndDate')?.setErrors({ enrollmentDateRange: true });
      isValid = false;
    }

    // Validate enrollment within study period
    if (startDate && enrollmentStart && new Date(enrollmentStart) < new Date(startDate)) {
      this.formGroup.get('enrollmentStartDate')?.setErrors({ enrollmentBeforeStudy: true });
      isValid = false;
    }

    if (endDate && enrollmentEnd && new Date(enrollmentEnd) > new Date(endDate)) {
      this.formGroup.get('enrollmentEndDate')?.setErrors({ enrollmentAfterStudy: true });
      isValid = false;
    }

    return isValid;
  }

  private clearDateErrors(): void {
    const dateFields = [
      'plannedStartDate',
      'plannedEndDate',
      'enrollmentStartDate',
      'enrollmentEndDate',
    ];

    dateFields.forEach((fieldName) => {
      const control = this.formGroup.get(fieldName);
      if (control?.errors) {
        const errors = { ...control.errors };
        delete errors['dateRange'];
        delete errors['enrollmentDateRange'];
        delete errors['enrollmentBeforeStudy'];
        delete errors['enrollmentAfterStudy'];

        if (Object.keys(errors).length === 0) {
          control.setErrors(null);
        } else {
          control.setErrors(errors);
        }
      }
    });
  }
}
