import { Component, OnInit, inject, DestroyRef, signal, WritableSignal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// PrimeNG Components
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { StepperModule } from 'primeng/stepper';
import { MenuItem } from 'primeng/api';
import { ProgressBarModule } from 'primeng/progressbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

import {
  DatePickerHourFormatEnum,
  DatePickerViewEnum,
  DEFAULT_SCROLL_HEIGHT,
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  FormLabelPositionEnum,
  FormLabelStyleEnum,
  IconDisplayModeEnum,
  InputNumberButtonLayoutEnum,
  LibCheckboxComponent,
  LibDatePickerComponent,
  LibInputNumberComponent,
  LibInputTextComponent,
  LibMultiSelectComponent,
  LibSelectComponent,
  LibTextareaComponent,
} from '@artificial-sense/ui-lib';
import { FormStep, StudyPhase, StudyType, TherapeuticArea } from '../../models/types';

@Component({
  selector: 'app-create-study',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    DividerModule,
    ToastModule,
    StepperModule,
    ProgressBarModule,
    ConfirmDialogModule,
    // UI-Lib Form Components
    LibInputTextComponent,
    LibTextareaComponent,
    LibSelectComponent,
    LibDatePickerComponent,
    LibInputNumberComponent,
    LibMultiSelectComponent,
    LibCheckboxComponent,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './create-study.component.html',
  styleUrls: ['./create-study.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateStudyComponent implements OnInit {
  studyForm!: FormGroup;
  saving: WritableSignal<boolean> = signal(false);
  autoSaving: WritableSignal<boolean> = signal(false);

  maskingTypes = [
    { label: 'None (Open Label)', value: 'none' },
    { label: 'Single (Participant)', value: 'single' },
    { label: 'Double (Participant, Investigator)', value: 'double' },
    { label: 'Triple (Participant, Investigator, Outcomes Assessor)', value: 'triple' },
    {
      label: 'Quadruple (Participant, Investigator, Outcomes Assessor, Care Provider)',
      value: 'quadruple',
    },
  ];

  allocationTypes = [
    { label: 'Randomized', value: 'randomized' },
    { label: 'Non-Randomized', value: 'non_randomized' },
    { label: 'Not Applicable', value: 'not_applicable' },
  ];

  // Add missing investigators property
  investigators = [
    { label: 'Dr. Sarah Johnson', value: 'sarah.johnson@example.com' },
    { label: 'Dr. Michael Chen', value: 'michael.chen@example.com' },
    { label: 'Dr. Emily Rodriguez', value: 'emily.rodriguez@example.com' },
    { label: 'Dr. David Thompson', value: 'david.thompson@example.com' },
    { label: 'Dr. Lisa Anderson', value: 'lisa.anderson@example.com' },
    { label: 'Dr. James Wilson', value: 'james.wilson@example.com' },
    { label: 'Dr. Maria Garcia', value: 'maria.garcia@example.com' },
    { label: 'Dr. Robert Brown', value: 'robert.brown@example.com' },
  ];

  // Step management
  currentStep: WritableSignal<number> = signal(0);
  steps: MenuItem[] = [];
  formSteps: FormStep[] = [
    {
      id: 'basic',
      label: 'Basic Information',
      fields: ['title', 'shortTitle', 'description', 'objectives'],
      isValid: false,
      isCompleted: false,
    },
    {
      id: 'classification',
      label: 'Study Classification',
      fields: ['studyType', 'phase', 'therapeuticArea', 'indication'],
      isValid: false,
      isCompleted: false,
    },
    {
      id: 'timeline',
      label: 'Timeline',
      fields: ['plannedStartDate', 'plannedEndDate', 'enrollmentStartDate', 'enrollmentEndDate'],
      isValid: false,
      isCompleted: false,
    },
    {
      id: 'design',
      label: 'Study Design',
      fields: ['designType', 'interventionModel', 'primaryPurpose', 'masking', 'allocation'],
      isValid: false,
      isCompleted: false,
    },
    {
      id: 'population',
      label: 'Population & Sample',
      fields: ['plannedEnrollment', 'minimumAge', 'maximumAge', 'healthyVolunteers', 'genderBased'],
      isValid: false,
      isCompleted: false,
    },
    {
      id: 'regulatory',
      label: 'Regulatory & Admin',
      fields: [
        'protocolNumber',
        'sponsorName',
        'principalInvestigatorId',
        'irbApprovalRequired',
        'fdaIndRequired',
        'gmpRequired',
      ],
      isValid: false,
      isCompleted: false,
    },
    {
      id: 'contact',
      label: 'Contact Information',
      fields: ['contactName', 'contactEmail', 'contactPhone'],
      isValid: false,
      isCompleted: false,
    },
    {
      id: 'settings',
      label: 'Additional Settings',
      fields: ['isBlinded', 'allowDataExport', 'requireElectronicSignature', 'enableAuditTrail'],
      isValid: false,
      isCompleted: false,
    },
    {
      id: 'review',
      label: 'Review & Submit',
      fields: [],
      isValid: true,
      isCompleted: false,
    },
  ];

  // Form data options
  studyTypes: StudyType[] = [
    { label: 'Interventional', value: 'interventional' },
    { label: 'Observational', value: 'observational' },
    { label: 'Expanded Access', value: 'expanded_access' },
  ];

  studyPhases: StudyPhase[] = [
    { label: 'Early Phase 1', value: 'early_phase_1' },
    { label: 'Phase 1', value: 'phase_1' },
    { label: 'Phase 1/Phase 2', value: 'phase_1_2' },
    { label: 'Phase 2', value: 'phase_2' },
    { label: 'Phase 2/Phase 3', value: 'phase_2_3' },
    { label: 'Phase 3', value: 'phase_3' },
    { label: 'Phase 4', value: 'phase_4' },
    { label: 'Not Applicable', value: 'not_applicable' },
  ];

  therapeuticAreas: TherapeuticArea[] = [
    { label: 'Oncology', value: 'oncology' },
    { label: 'Cardiology', value: 'cardiology' },
    { label: 'Neurology', value: 'neurology' },
    { label: 'Infectious Diseases', value: 'infectious_diseases' },
    { label: 'Immunology', value: 'immunology' },
    { label: 'Endocrinology', value: 'endocrinology' },
    { label: 'Respiratory', value: 'respiratory' },
    { label: 'Gastroenterology', value: 'gastroenterology' },
  ];

  designTypes = [
    { label: 'Parallel Assignment', value: 'parallel' },
    { label: 'Crossover Assignment', value: 'crossover' },
    { label: 'Factorial Assignment', value: 'factorial' },
    { label: 'Single Group Assignment', value: 'single_group' },
  ];

  interventionModels = [
    { label: 'Single Group', value: 'single_group' },
    { label: 'Parallel Assignment', value: 'parallel' },
    { label: 'Crossover Assignment', value: 'crossover' },
    { label: 'Factorial Assignment', value: 'factorial' },
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
      label: 'Quadruple (Participant, Investigator, Outcomes Assessor, Care Provider)',
      value: 'quadruple',
    },
  ];

  allocationOptions = [
    { label: 'Randomized', value: 'randomized' },
    { label: 'Non-Randomized', value: 'non_randomized' },
    { label: 'Not Applicable', value: 'not_applicable' },
  ];

  // Enum references for template
  FormComponentVariantEnum = FormComponentVariantEnum;
  FormLabelPositionEnum = FormLabelPositionEnum;
  FormComponentSizeEnum = FormComponentSizeEnum;
  FormLabelStyleEnum = FormLabelStyleEnum;
  IconDisplayModeEnum = IconDisplayModeEnum;
  DatePickerViewEnum = DatePickerViewEnum;
  DatePickerHourFormatEnum = DatePickerHourFormatEnum;
  DEFAULT_SCROLL_HEIGHT = DEFAULT_SCROLL_HEIGHT;
  protected readonly InputNumberButtonLayoutEnum = InputNumberButtonLayoutEnum;
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private autoSaveInterval: any;
  private readonly AUTO_SAVE_INTERVAL = 30000; // 30 seconds

  constructor(private confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.initializeSteps();
    this.setupFormValidation();
    this.loadDraftData();
    this.startAutoSave();
  }

  ngOnDestroy(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
  }

  // Step navigation methods
  goToStep(stepIndex: number): void {
    if (stepIndex >= 0 && stepIndex < this.formSteps.length) {
      this.currentStep.set(stepIndex);
    }
  }

  nextStep(): void {
    if (this.canProceedToNext()) {
      this.currentStep.update((s) => s + 1);
    } else {
      this.markCurrentStepFieldsAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields before proceeding.',
        life: 5000,
      });
    }
  }

  previousStep(): void {
    if (this.currentStep() > 0) {
      this.currentStep.update((s) => s - 1);
    }
  }

  canProceedToNext(): boolean {
    const currentFormStep = this.formSteps[this.currentStep()];
    return currentFormStep.isValid;
  }

  canProceedToPrevious(): boolean {
    return this.currentStep() > 0;
  }

  isLastStep(): boolean {
    return this.currentStep() === this.formSteps.length - 1;
  }

  isCurrentStep(stepId: string): boolean {
    return this.formSteps[this.currentStep()].id === stepId;
  }

  getProgressPercentage(): number {
    const completedSteps = this.formSteps.filter((step) => step.isCompleted).length;
    return Math.round((completedSteps / (this.formSteps.length - 1)) * 100); // -1 to exclude review step
  }

  // Form submission methods
  saveDraft(isAutoSave = false): void {
    if (!isAutoSave) {
      this.saving.set(true);
    } else {
      this.autoSaving.set(true);
    }

    // Save to localStorage (in real app, save to API)
    const formData = this.studyForm.value;
    localStorage.setItem('study-draft', JSON.stringify(formData));

    setTimeout(() => {
      if (!isAutoSave) {
        this.saving.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Draft Saved',
          detail: 'Your study draft has been saved successfully.',
          life: 3000,
        });
      } else {
        this.autoSaving.set(false);
      }
      this.studyForm.markAsPristine();
    }, 1000);
  }

  createStudy(): void {
    if (this.studyForm.valid) {
      this.saving.set(true);

      // Simulate API call
      setTimeout(() => {
        this.saving.set(false);
        localStorage.removeItem('study-draft'); // Clear draft after successful creation

        this.messageService.add({
          severity: 'success',
          summary: 'Study Created',
          detail: 'Your study has been created successfully.',
          life: 5000,
        });

        // Navigate to study details or list
        this.router.navigate(['/studies']);
      }, 2000);
    } else {
      this.markAllFieldsAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please correct all errors before submitting.',
        life: 5000,
      });
    }
  }

  onCancel(): void {
    if (this.studyForm.dirty) {
      this.confirmationService.confirm({
        message: 'You have unsaved changes. Do you want to save as draft before leaving?',
        header: 'Unsaved Changes',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Save Draft',
        rejectLabel: 'Discard',
        accept: () => {
          this.saveDraft();
          setTimeout(() => this.router.navigate(['/studies']), 1000);
        },
        reject: () => {
          localStorage.removeItem('study-draft');
          this.router.navigate(['/studies']);
        },
      });
    } else {
      this.router.navigate(['/studies']);
    }
  }

  // Utility methods for review step
  getFormStepData(stepId: string): any {
    const step = this.formSteps.find((s) => s.id === stepId);
    if (!step) return {};

    const stepData: any = {};
    step.fields.forEach((fieldName: any) => {
      stepData[fieldName] = this.studyForm.get(fieldName)?.value;
    });
    return stepData;
  }

  getFieldDisplayValue(fieldName: string, value: any): string {
    // Convert form values to display-friendly strings
    switch (fieldName) {
      case 'studyType':
        return this.studyTypes.find((t) => t.value === value)?.label || value;
      case 'phase':
        return this.studyPhases.find((p) => p.value === value)?.label || value;
      case 'therapeuticArea':
        return Array.isArray(value)
          ? value
              .map((v) => this.therapeuticAreas.find((t) => t.value === v)?.label || v)
              .join(', ')
          : value;
      case 'plannedStartDate':
      case 'plannedEndDate':
      case 'enrollmentStartDate':
      case 'enrollmentEndDate':
        return value ? new Date(value).toLocaleDateString() : '';
      default:
        return value?.toString() || '';
    }
  }

  private initializeForm(): void {
    this.studyForm = this.fb.group({
      // Basic Information
      title: ['', [Validators.required, Validators.minLength(10)]],
      shortTitle: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(50)]],
      objectives: ['', [Validators.required, Validators.minLength(20)]],

      // Study Classification
      studyType: ['', Validators.required],
      phase: ['', Validators.required],
      therapeuticArea: [[], Validators.required],
      indication: ['', Validators.required],

      // Timeline
      plannedStartDate: [null, Validators.required],
      plannedEndDate: [null, Validators.required],
      enrollmentStartDate: [null],
      enrollmentEndDate: [null],

      // Study Design
      designType: [''],
      interventionModel: [''],
      primaryPurpose: [''],
      masking: [''],
      allocation: [''],

      // Sample Size & Population
      plannedEnrollment: [null, [Validators.required, Validators.min(1)]],
      minimumAge: [null, [Validators.min(0), Validators.max(120)]],
      maximumAge: [null, [Validators.min(0), Validators.max(120)]],
      healthyVolunteers: [false],
      genderBased: [false],

      // Regulatory & Administrative
      protocolNumber: ['', Validators.required],
      sponsorName: ['', Validators.required],
      principalInvestigatorId: ['', Validators.required],
      irbApprovalRequired: [false],
      fdaIndRequired: [false],
      gmpRequired: [false],

      // Contact Information
      contactName: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactPhone: ['', Validators.required],

      // Additional Settings
      isBlinded: [false],
      allowDataExport: [true],
      requireElectronicSignature: [false],
      enableAuditTrail: [true],
    });
  }

  private initializeSteps(): void {
    this.steps = this.formSteps.map((step, index) => ({
      label: step.label,
      command: () => this.goToStep(index),
    }));
  }

  private setupFormValidation(): void {
    // Setup cross-field validation
    this.studyForm
      .get('plannedEndDate')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.validateDateRanges());

    this.studyForm
      .get('plannedStartDate')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.validateDateRanges());

    this.studyForm
      .get('maximumAge')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.validateAgeRanges());

    this.studyForm
      .get('minimumAge')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.validateAgeRanges());

    // Watch for form changes to update step validation
    this.studyForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateStepValidation());
  }

  private startAutoSave(): void {
    this.autoSaveInterval = setInterval(() => {
      if (this.studyForm.dirty && !this.saving()) {
        this.saveDraft(true);
      }
    }, this.AUTO_SAVE_INTERVAL);
  }

  private loadDraftData(): void {
    // Load any existing draft data from localStorage or API
    const draftData = localStorage.getItem('study-draft');
    if (draftData) {
      try {
        const parsedData = JSON.parse(draftData);
        this.studyForm.patchValue(parsedData);
        this.messageService.add({
          severity: 'info',
          summary: 'Draft Loaded',
          detail: 'Your previous draft has been loaded.',
          life: 3000,
        });
      } catch (error) {
        console.error('Error loading draft data:', error);
      }
    }
  }

  private updateStepValidation(): void {
    this.formSteps.forEach((step, index) => {
      if (step.id === 'review') {
        step.isValid = this.studyForm.valid;
        return;
      }

      const stepFields = step.fields;
      const stepValid = stepFields.every((fieldName: any) => {
        const control = this.studyForm.get(fieldName);
        return control ? control.valid : true;
      });

      step.isValid = stepValid;

      // Mark as completed if valid and has values
      const hasValues = stepFields.some((fieldName: any) => {
        const control = this.studyForm.get(fieldName);
        const value = control?.value;
        return (
          value &&
          value !== '' &&
          value !== null &&
          (Array.isArray(value) ? value.length > 0 : true)
        );
      });

      step.isCompleted = stepValid && hasValues;
    });
  }

  private validateDateRanges(): void {
    const startDate = this.studyForm.get('plannedStartDate')?.value;
    const endDate = this.studyForm.get('plannedEndDate')?.value;

    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      this.studyForm.get('plannedEndDate')?.setErrors({ dateRange: true });
    } else {
      const endDateControl = this.studyForm.get('plannedEndDate');
      if (endDateControl?.hasError('dateRange')) {
        endDateControl.setErrors(null);
      }
    }
  }

  private validateAgeRanges(): void {
    const minAge = this.studyForm.get('minimumAge')?.value;
    const maxAge = this.studyForm.get('maximumAge')?.value;

    if (minAge && maxAge && minAge >= maxAge) {
      this.studyForm.get('maximumAge')?.setErrors({ ageRange: true });
    } else {
      const maxAgeControl = this.studyForm.get('maximumAge');
      if (maxAgeControl?.hasError('ageRange')) {
        maxAgeControl.setErrors(null);
      }
    }
  }

  private markCurrentStepFieldsAsTouched(): void {
    const currentFormStep = this.formSteps[this.currentStep()];
    currentFormStep.fields.forEach((fieldName: any) => {
      this.studyForm.get(fieldName)?.markAsTouched();
    });
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.studyForm.controls).forEach((key) => {
      this.studyForm.get(key)?.markAsTouched();
    });
  }
}
