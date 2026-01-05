import { FormGroup } from '@angular/forms';
import { EventEmitter } from '@angular/core';

export interface IStepComponent {
  // Form data
  formGroup: FormGroup;
  stepId: string;
  stepLabel: string;

  // Validation
  isValid: boolean;
  isCompleted: boolean;
  requiredFields: string[];

  // Events
  validationChange: EventEmitter<{ stepId: string; isValid: boolean; isCompleted: boolean }>;
  dataChange: EventEmitter<{ stepId: string; data: any }>;

  // Methods
  validateStep(): boolean;
  markFieldsAsTouched(): void;
  getStepData(): any;
  resetStep(): void;
}
