// regulatory-step.component.ts
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';

export interface RegulatoryStepData {
  irbApprovalRequired: boolean;
  irbApprovalNumber?: string;
  irbApprovalDate?: Date;
  irbExpirationDate?: Date;
  fdaIndRequired: boolean;
  fdaIndNumber?: string;
  gmpCompliance: boolean;
  regulatoryNotes: string;
  consentFormVersion: string;
  protocolVersion: string;
}

@Component({
  selector: 'app-regulatory-step',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    CheckboxModule,
    TextareaModule,
    DatePickerModule,
    InputTextModule,
    DividerModule,
    MessageModule
],
  templateUrl: 'regulatory-step.component.html',
  styleUrls: ['./regulatory-step.component.scss'],
})
export class RegulatoryStepComponent implements OnInit {
  @Input() initialData?: Partial<RegulatoryStepData>;
  @Output() formDataChange = new EventEmitter<RegulatoryStepData>();
  @Output() nextStep = new EventEmitter<void>();
  @Output() previousStep = new EventEmitter<void>();

  regulatoryForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();

    // Watch for form changes
    this.regulatoryForm.valueChanges.subscribe((value) => {
      if (this.regulatoryForm.valid) {
        this.formDataChange.emit(value);
      }
    });

    // Set initial data if provided
    if (this.initialData) {
      this.regulatoryForm.patchValue(this.initialData);
    }
  }

  private initializeForm(): void {
    this.regulatoryForm = this.fb.group({
      irbApprovalRequired: [false],
      irbApprovalNumber: [''],
      irbApprovalDate: [null],
      irbExpirationDate: [null],
      fdaIndRequired: [false],
      fdaIndNumber: [''],
      gmpCompliance: [false, Validators.requiredTrue],
      regulatoryNotes: [''],
      consentFormVersion: ['', Validators.required],
      protocolVersion: ['', Validators.required],
    });

    // Add conditional validators
    this.regulatoryForm.get('irbApprovalRequired')?.valueChanges.subscribe((required) => {
      const irbNumberControl = this.regulatoryForm.get('irbApprovalNumber');
      const irbDateControl = this.regulatoryForm.get('irbApprovalDate');
      const irbExpirationControl = this.regulatoryForm.get('irbExpirationDate');

      if (required) {
        irbNumberControl?.setValidators([Validators.required]);
        irbDateControl?.setValidators([Validators.required]);
        irbExpirationControl?.setValidators([Validators.required]);
      } else {
        irbNumberControl?.clearValidators();
        irbDateControl?.clearValidators();
        irbExpirationControl?.clearValidators();
      }

      irbNumberControl?.updateValueAndValidity();
      irbDateControl?.updateValueAndValidity();
      irbExpirationControl?.updateValueAndValidity();
    });

    this.regulatoryForm.get('fdaIndRequired')?.valueChanges.subscribe((required) => {
      const fdaIndControl = this.regulatoryForm.get('fdaIndNumber');

      if (required) {
        fdaIndControl?.setValidators([Validators.required]);
      } else {
        fdaIndControl?.clearValidators();
      }

      fdaIndControl?.updateValueAndValidity();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.regulatoryForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onNext(): void {
    if (this.regulatoryForm.valid) {
      this.nextStep.emit();
    } else {
      this.markAllFieldsTouched();
    }
  }

  onPrevious(): void {
    this.previousStep.emit();
  }

  private markAllFieldsTouched(): void {
    Object.keys(this.regulatoryForm.controls).forEach((key) => {
      this.regulatoryForm.get(key)?.markAsTouched();
    });
  }
}
