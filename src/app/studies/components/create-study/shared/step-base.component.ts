import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IStepComponent } from '../interfaces/step-component.interface';

@Component({
  template: '', // Abstract component
})
export abstract class StepBaseComponent implements IStepComponent, OnInit, OnDestroy {
  @Input() formGroup!: FormGroup;
  @Input() stepId!: string;
  @Input() stepLabel!: string;

  @Output() validationChange = new EventEmitter<{
    stepId: string;
    isValid: boolean;
    isCompleted: boolean;
  }>();
  @Output() dataChange = new EventEmitter<{ stepId: string; data: any }>();

  abstract requiredFields: string[];

  protected destroy$ = new Subject<void>();

  get isValid(): boolean {
    return this.validateStep();
  }

  get isCompleted(): boolean {
    return this.isValid && this.hasValues();
  }

  ngOnInit(): void {
    this.setupFormSubscription();
    this.emitInitialValidation();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  validateStep(): boolean {
    if (!this.formGroup) return false;

    return this.requiredFields.every((fieldName) => {
      const control = this.formGroup.get(fieldName);
      return control ? control.valid : true;
    });
  }

  markFieldsAsTouched(): void {
    if (!this.formGroup) return;

    this.requiredFields.forEach((fieldName) => {
      const control = this.formGroup.get(fieldName);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  getStepData(): any {
    if (!this.formGroup) return {};

    const stepData: any = {};
    this.requiredFields.forEach((fieldName) => {
      const control = this.formGroup.get(fieldName);
      if (control) {
        stepData[fieldName] = control.value;
      }
    });
    return stepData;
  }

  resetStep(): void {
    if (!this.formGroup) return;

    this.requiredFields.forEach((fieldName) => {
      const control = this.formGroup.get(fieldName);
      if (control) {
        control.reset();
        control.markAsUntouched();
        control.markAsPristine();
      }
    });
  }

  protected hasValues(): boolean {
    if (!this.formGroup) return false;

    return this.requiredFields.some((fieldName) => {
      const control = this.formGroup.get(fieldName);
      if (!control) return false;

      const value = control.value;
      return (
        value && value !== '' && value !== null && (Array.isArray(value) ? value.length > 0 : true)
      );
    });
  }

  private setupFormSubscription(): void {
    if (!this.formGroup) return;

    // Watch for changes in the required fields
    this.requiredFields.forEach((fieldName) => {
      const control = this.formGroup.get(fieldName);
      if (control) {
        control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
          this.emitValidationChange();
          this.emitDataChange();
        });

        control.statusChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
          this.emitValidationChange();
        });
      }
    });
  }

  private emitInitialValidation(): void {
    // Emit initial validation state
    setTimeout(() => {
      this.emitValidationChange();
    });
  }

  private emitValidationChange(): void {
    this.validationChange.emit({
      stepId: this.stepId,
      isValid: this.isValid,
      isCompleted: this.isCompleted,
    });
  }

  private emitDataChange(): void {
    this.dataChange.emit({
      stepId: this.stepId,
      data: this.getStepData(),
    });
  }
}
