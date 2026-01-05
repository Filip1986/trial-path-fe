import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
  signal,
  WritableSignal,
} from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  LibInputTextComponent,
  LibTextareaComponent,
  LibSelectComponent,
  LibDatePickerComponent,
  LibInputNumberComponent,
  LibCheckboxComponent,
  LibMultiSelectComponent,
  FormLabelStyleEnum,
  FormLabelPositionEnum,
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  InputTextTypeEnum,
  CheckboxModeEnum,
} from '@artificial-sense/ui-lib';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { StudyFormData } from '../../models/types';

@Component({
  selector: 'app-study-form-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    LibInputTextComponent,
    LibTextareaComponent,
    LibSelectComponent,
    LibDatePickerComponent,
    LibInputNumberComponent,
    LibCheckboxComponent,
    LibMultiSelectComponent,
    CardModule,
    ButtonModule,
    DividerModule,
    ToastModule,
    ProgressSpinnerModule
],
  providers: [MessageService],
  templateUrl: './study-form-page.component.html',
  styleUrls: ['./study-form-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudyFormPageComponent implements OnInit {
  studyForm!: FormGroup;
  isSubmitting: WritableSignal<boolean> = signal(false);
  isLoading: WritableSignal<boolean> = signal(false);
  // Form component configurations
  readonly FormLabelStyleEnum: typeof FormLabelStyleEnum = FormLabelStyleEnum;
  readonly FormLabelPositionEnum = FormLabelPositionEnum;
  readonly FormComponentSizeEnum = FormComponentSizeEnum;
  readonly FormComponentVariantEnum = FormComponentVariantEnum;
  readonly InputTextTypeEnum = InputTextTypeEnum;
  readonly CheckboxModeEnum = CheckboxModeEnum;
  // Dropdown options
  readonly studyPhaseOptions = [
    { label: 'Preclinical', value: 'preclinical' },
    { label: 'Phase I', value: 'phase1' },
    { label: 'Phase II', value: 'phase2' },
    { label: 'Phase III', value: 'phase3' },
    { label: 'Phase IV', value: 'phase4' },
  ];
  readonly studyTypeOptions = [
    { label: 'Interventional', value: 'interventional' },
    { label: 'Observational', value: 'observational' },
    { label: 'Expanded Access', value: 'expanded_access' },
  ];
  readonly controlTypeOptions = [
    { label: 'Placebo Control', value: 'placebo' },
    { label: 'Active Control', value: 'active' },
    { label: 'No Control', value: 'none' },
    { label: 'Historical Control', value: 'historical' },
  ];
  readonly ageRangeOptions = [
    { label: 'Pediatric (0-17)', value: 'pediatric' },
    { label: 'Adult (18-64)', value: 'adult' },
    { label: 'Elderly (65+)', value: 'elderly' },
    { label: 'All Ages', value: 'all' },
  ];
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  get principalInvestigator() {
    return this.studyForm.get('principalInvestigator');
  }

  get studyType() {
    return this.studyForm.get('studyType');
  }

  get startDate() {
    return this.studyForm.get('startDate');
  }

  get endDate() {
    return this.studyForm.get('endDate');
  }

  get ageRange() {
    return this.studyForm.get('ageRange');
  }

  get randomized() {
    return this.studyForm.get('randomized');
  }

  get protocolNumber() {
    return this.studyForm.get('protocolNumber');
  }

  get contactEmail() {
    return this.studyForm.get('contactEmail');
  }

  get contactPhone() {
    return this.studyForm.get('contactPhone');
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  onSubmit(): void {
    if (this.studyForm.valid) {
      this.isSubmitting.set(true);

      const formData: StudyFormData = this.studyForm.value;

      // Simulate API call
      setTimeout(() => {
        console.log('Study Form Data:', formData);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Study has been created successfully!',
        });
        this.isSubmitting.set(false);

        // Navigate to studies list or study details
        // this.router.navigate(['/studies']);
      }, 2000);
    } else {
      this.markFormGroupTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Form Error',
        detail: 'Please correct the errors in the form.',
      });
    }
  }

  onCancel(): void {
    void this.router.navigate(['/studies']);
  }

  onReset(): void {
    this.studyForm.reset();
    this.messageService.add({
      severity: 'info',
      summary: 'Form Reset',
      detail: 'Form has been reset to default values.',
    });
  }

  private initializeForm(): void {
    this.studyForm = this.fb.group({
      // Study Information
      studyTitle: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      studyDescription: ['', [Validators.required, Validators.minLength(50)]],
      principalInvestigator: ['', [Validators.required]],
      studyPhase: ['', [Validators.required]],
      studyType: ['', [Validators.required]],

      // Timeline
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      expectedDuration: [null, [Validators.required, Validators.min(1)]],

      // Participant Information
      targetEnrollment: [null, [Validators.required, Validators.min(1)]],
      ageRange: [[], [Validators.required]],
      inclusionCriteria: ['', [Validators.required]],
      exclusionCriteria: ['', [Validators.required]],

      // Study Design
      randomized: [false],
      blinded: [false],
      controlType: ['', [Validators.required]],
      primaryEndpoint: ['', [Validators.required]],
      secondaryEndpoints: [''],

      // Regulatory
      protocolNumber: ['', [Validators.required, Validators.pattern(/^[A-Z0-9-]+$/)]],
      irbApproval: [false, [Validators.requiredTrue]],
      fdaRegulated: [false],
      goodClinicalPractice: [false, [Validators.requiredTrue]],

      // Contact Information
      contactPerson: ['', [Validators.required]],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactPhone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]+$/)]],

      // Additional Notes
      specialRequirements: [''],
      notes: [''],
    });

    // Add custom validator for end date
    this.studyForm.get('endDate')?.addValidators(this.endDateValidator.bind(this));
  }

  private endDateValidator(control: any) {
    const startDate = this.studyForm?.get('startDate')?.value;
    const endDate = control.value;

    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      return { endDateInvalid: true };
    }
    return null;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.studyForm.controls).forEach((key: string): void => {
      const control = this.studyForm.get(key);
      control?.markAsTouched();
    });
  }
}
