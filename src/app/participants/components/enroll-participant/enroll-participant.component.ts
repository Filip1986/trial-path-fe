import {
  Component,
  OnInit,
  inject,
  DestroyRef,
  signal,
  computed,
  Signal,
  WritableSignal,
} from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { forkJoin, startWith } from 'rxjs';

// PrimeNG and UI components (same as before)
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ParticipantDataService } from '../../services/participant-data.service';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import {
  DatePickerHourFormatEnum,
  DatePickerViewEnum,
  DEFAULT_SCROLL_HEIGHT,
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  FormLabelPositionEnum,
  FormLabelStyleEnum,
  IconDisplayModeEnum,
  LibCheckboxComponent,
  LibDatePickerComponent,
  LibInputNumberComponent,
  LibInputTextComponent,
  LibSelectComponent,
  LibTextareaComponent,
} from '@artificial-sense/ui-lib';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Study } from '../../../studies/models/interfaces/study.interface';
import {
  BloodType,
  Country,
  DropdownOption,
  EducationLevel,
  Ethnicity,
  Gender,
  MaritalStatus,
  Race,
  RandomizationGroup,
  Relationship,
} from '../../models/interfaces';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressBarModule } from 'primeng/progressbar';

interface ParticipantFormValue {
  demographics: {
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: string;
    gender: string;
    ethnicity?: string;
    race?: string;
  };
  contact: {
    phone: string;
    email: string;
    address?: string;
  };
  // Add other form sections as needed
}

@Component({
  selector: 'app-enroll-participant',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    DividerModule,
    ToastModule,
    ConfirmDialogModule,
    ProgressBarModule,
    LibInputTextComponent,
    LibTextareaComponent,
    LibSelectComponent,
    LibDatePickerComponent,
    LibInputNumberComponent,
    LibCheckboxComponent
],
  providers: [MessageService, ConfirmationService],
  templateUrl: './enroll-participant.component.html',
  styleUrls: ['./enroll-participant.component.scss'],
})
export class EnrollParticipantComponent implements OnInit {
  // Wizard state
  currentStep: WritableSignal<number> = signal(0);
  totalSteps: WritableSignal<number> = signal(5);
  completedSteps: WritableSignal<boolean[]> = signal<boolean[]>([
    false,
    false,
    false,
    false,
    false,
  ]);

  participantForm!: FormGroup;
  // UI/process state
  saving: WritableSignal<boolean> = signal(false);
  loading: WritableSignal<boolean> = signal(true);

  // Form options - now loaded from service
  genders: WritableSignal<DropdownOption[]> = signal<Gender[]>([]);
  ethnicities: WritableSignal<DropdownOption[]> = signal<Ethnicity[]>([]);
  races: WritableSignal<DropdownOption[]> = signal<Race[]>([]);
  bloodTypes: WritableSignal<DropdownOption[]> = signal<BloodType[]>([]);
  maritalStatuses: WritableSignal<DropdownOption[]> = signal<MaritalStatus[]>([]);
  educationLevels: WritableSignal<DropdownOption[]> = signal<EducationLevel[]>([]);
  randomizationGroups: WritableSignal<DropdownOption[]> = signal<RandomizationGroup[]>([]);
  relationships: WritableSignal<DropdownOption[]> = signal<Relationship[]>([]);
  countries: WritableSignal<DropdownOption[]> = signal<Country[]>([]);
  studies: WritableSignal<Study[]> = signal<Study[]>([]);

  // Signal reflecting form value changes for computed derivations
  private formValueSignal!: Signal<ParticipantFormValue>;

  protected readonly FormComponentVariantEnum: typeof FormComponentVariantEnum =
    FormComponentVariantEnum;
  protected readonly FormLabelPositionEnum: typeof FormLabelPositionEnum = FormLabelPositionEnum;
  protected readonly FormComponentSizeEnum: typeof FormComponentSizeEnum = FormComponentSizeEnum;
  protected readonly FormLabelStyleEnum: typeof FormLabelStyleEnum = FormLabelStyleEnum;
  protected readonly DEFAULT_SCROLL_HEIGHT = DEFAULT_SCROLL_HEIGHT;
  protected readonly IconDisplayModeEnum: typeof IconDisplayModeEnum = IconDisplayModeEnum;
  protected readonly DatePickerViewEnum: typeof DatePickerViewEnum = DatePickerViewEnum;
  protected readonly DatePickerHourFormatEnum: typeof DatePickerHourFormatEnum =
    DatePickerHourFormatEnum;
  private destroyRef: DestroyRef = inject(DestroyRef);
  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  private participantDataService: ParticipantDataService = inject(ParticipantDataService);

  // Form state management
  formSections: { [key: string]: FormGroup } = {
    demographics: this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      middleName: [''],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      ethnicity: [''],
      race: [''],
      // ... other demographic fields
    }),

    contact: this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]],
      country: ['', Validators.required],
    }),

    medical: this.fb.group({
      height: ['', [Validators.required, Validators.min(1)]],
      weight: ['', [Validators.required, Validators.min(1)]],
      bloodType: [''],
      allergies: [''],
      currentMedications: [''],
      medicalHistory: [''],
    }),

    study: this.fb.group({
      studyId: ['', Validators.required],
      participantId: [''],
      enrollmentDate: [new Date(), Validators.required],
      randomizationGroup: [''],
    }),

    consent: this.fb.group({
      informedConsentSigned: [false, Validators.requiredTrue],
      eligibilityCriteriaMet: [false, Validators.requiredTrue],
      hipaaConsentSigned: [false, Validators.requiredTrue],
      willingStoUseContraception: [false],
    }),
  };

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    // create a signal tied to the form's value changes to drive computed values
    this.formValueSignal = toSignal(
      this.participantForm.valueChanges.pipe(startWith(this.participantForm.value)),
    );
    this.loadFormOptions();
  }

  private initializeForm(): void {
    this.participantForm = this.fb.group({
      // Basic Demographics
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      middleName: [''],
      dateOfBirth: [null, Validators.required],
      gender: ['', Validators.required],
      ethnicity: ['', Validators.required],
      race: [[], Validators.required],

      // Contact Information
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      alternatePhone: [''],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['US'],

      // Medical Information
      height: [null],
      weight: [null],
      bloodType: [''],
      allergies: [''],
      currentMedications: [''],
      medicalHistory: [''],

      // Study Assignment
      studyId: ['', Validators.required],
      participantId: [''],
      enrollmentDate: [new Date(), Validators.required],
      randomizationGroup: [''],

      // Emergency Contact
      emergencyContactName: ['', Validators.required],
      emergencyContactPhone: ['', Validators.required],
      emergencyContactRelationship: ['', Validators.required],

      // Additional Information
      maritalStatus: [''],
      educationLevel: [''],
      occupation: [''],
      insuranceProvider: [''],
      primaryPhysician: [''],

      // Consent & Eligibility
      informedConsentSigned: [false, Validators.requiredTrue],
      eligibilityCriteriaMet: [false, Validators.requiredTrue],
      hipaaConsentSigned: [false, Validators.requiredTrue],
      willingStoUseContraception: [false],

      // Administrative
      notes: [''],
    });

    // Generate participant ID automatically
    this.generateParticipantId();
  }

  private loadFormOptions(): void {
    // Load all form options concurrently
    forkJoin({
      genders: this.participantDataService.getGenders(),
      ethnicities: this.participantDataService.getEthnicities(),
      races: this.participantDataService.getRaces(),
      bloodTypes: this.participantDataService.getBloodTypes(),
      maritalStatuses: this.participantDataService.getMaritalStatuses(),
      educationLevels: this.participantDataService.getEducationLevels(),
      randomizationGroups: this.participantDataService.getRandomizationGroups(),
      relationships: this.participantDataService.getRelationships(),
      countries: this.participantDataService.getCountries(),
      studies: this.participantDataService.getActiveStudies(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data): void => {
          this.genders.set(data.genders);
          this.ethnicities.set(data.ethnicities);
          this.races.set(data.races);
          this.bloodTypes.set(data.bloodTypes);
          this.maritalStatuses.set(data.maritalStatuses);
          this.educationLevels.set(data.educationLevels);
          this.randomizationGroups.set(data.randomizationGroups);
          this.relationships.set(data.relationships);
          this.countries.set(data.countries);
          this.studies.set(data.studies);
          this.loading.set(false);
        },
        error: (error): void => {
          console.error('Error loading form options:', error);
          this.loading.set(false);
        },
      });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.participantForm.controls).forEach((key: string): void => {
      const control = this.participantForm.get(key);
      control?.markAsTouched();
    });
  }

  private generateParticipantId(): void {
    const timestamp: string = Date.now().toString().slice(-6);
    const randomNum: string = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    const participantId = `P${timestamp}${randomNum}`;
    this.participantForm.patchValue({ participantId });
  }

  // BMI calculation
  calculatedBMI: Signal<number | null> = computed<number | null>((): number | null => {
    // Touch the form value signal to react to changes
    this.formValueSignal?.();
    const height: any = this.formSections['medical'].get('height')?.value;
    const weight: any = this.formSections['medical'].get('weight')?.value;
    if (typeof height === 'number' && typeof weight === 'number') {
      const heightInM: number = height / 100; // Convert cm to meters
      return Math.round((weight / (heightInM * heightInM)) * 10) / 10;
    }
    return null;
  });

  // Age calculation
  calculatedAge: Signal<number | null> = computed<number | null>((): number | null => {
    this.formValueSignal?.();
    const birthDate: any = this.formSections['demographics'].get('dateOfBirth')?.value;
    if (birthDate) {
      const today = new Date();
      const birth = new Date(birthDate);
      let age: number = today.getFullYear() - birth.getFullYear();
      const monthDiff: number = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age;
    }
    return null;
  });

  // 3. IMPROVED FORM NAVIGATION & VALIDATION
  nextStep(): void {
    if (this.validateCurrentStep()) {
      this.completedSteps.update((arr: boolean[]): boolean[] => {
        const copy: boolean[] = [...arr];
        copy[this.currentStep()] = true;
        return copy;
      });
      if (this.currentStep() < this.totalSteps() - 1) {
        this.currentStep.update((s: number): number => s + 1);
      }
    } else {
      this.markCurrentStepTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please complete all required fields before proceeding.',
      });
    }
  }

  previousStep(): void {
    if (this.currentStep() > 0) {
      this.currentStep.update((s: number): number => s - 1);
    }
  }

  goToStep(step: number): void {
    // Only allow going to complete steps or the next step
    if (step <= this.currentStep() || this.completedSteps()[step - 1]) {
      this.currentStep.set(step);
    }
  }

  validateCurrentStep(): boolean {
    const currentFormSection: FormGroup<any> | null = this.getCurrentFormSection();
    return currentFormSection ? currentFormSection.valid : false;
  }

  private getCurrentFormSection(): FormGroup | null {
    const sections: FormGroup<any>[] = Object.values(this.formSections);
    return sections[this.currentStep()] || null;
  }

  private markCurrentStepTouched(): void {
    const currentSection: FormGroup<any> | null = this.getCurrentFormSection();
    if (currentSection) {
      Object.keys(currentSection.controls).forEach((key: string): void => {
        currentSection.get(key)?.markAsTouched();
      });
    }
  }

  public autoSaveForm(): void {
    const formData: any = this.getAllFormData();
    localStorage.setItem(
      'enrollParticipantDraft',
      JSON.stringify({
        ...formData,
        lastSaved: new Date().toISOString(),
      }),
    );

    this.messageService.add({
      severity: 'info',
      summary: 'Auto-saved',
      detail: 'Your progress has been saved.',
      life: 2000,
    });
  }

  // Load draft functionality
  loadDraft(): void {
    const draft: string | null = localStorage.getItem('enrollParticipantDraft');
    if (draft) {
      try {
        this.messageService.add({
          severity: 'success',
          summary: 'Draft Loaded',
          detail: 'Your previous work has been restored.',
        });
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }

  // Form data validation and submission
  onSubmit(): void {
    if (this.isFormCompletelyValid()) {
      this.saving.set(true);
    }
  }

  public isFormCompletelyValid(): boolean {
    return Object.values(this.formSections).every(
      (section: FormGroup<any>): boolean => section.valid,
    );
  }

  private getAllFormData(): any {
    const allData: any = {};
    Object.entries(this.formSections).forEach(([key, formGroup]): void => {
      allData[key] = formGroup.value;
    });
    return allData;
  }

  // 5. ENHANCED USER EXPERIENCE FEATURES

  // Real-time field validation with custom messages
  getFieldValidationMessage(sectionName: string, fieldName: string): string {
    const field = this.formSections[sectionName]?.get(fieldName);

    if (field?.invalid && field?.touched) {
      if (field.errors?.['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required.`;
      }
      if (field.errors?.['email']) {
        return 'Please enter a valid email address.';
      }
      if (field.errors?.['minlength']) {
        return `${this.getFieldDisplayName(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters.`;
      }
      if (field.errors?.['pattern']) {
        return `Please enter a valid ${this.getFieldDisplayName(fieldName).toLowerCase()}.`;
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      firstName: 'First Name',
      lastName: 'Last Name',
      dateOfBirth: 'Date of Birth',
      phone: 'Phone Number',
      email: 'Email Address',
      zipCode: 'ZIP Code',
      // Add more field mappings as needed
    };
    return displayNames[fieldName] || fieldName;
  }

  // Progress calculation
  overallProgress: Signal<number> = computed<number>((): number => {
    // Recompute when the form values change
    this.formValueSignal?.();
    const totalFields: number = Object.values(this.formSections).reduce(
      (total: number, section: FormGroup<any>): number => {
        return total + Object.keys(section.controls).length;
      },
      0,
    );

    const completedFields: number = Object.values(this.formSections).reduce(
      (completed: number, section: FormGroup<any>): number => {
        return (
          completed +
          Object.values(section.controls).filter(
            (control): any => control.valid || (control.value && !control.errors),
          ).length
        );
      },
      0,
    );

    return Math.round((completedFields / totalFields) * 100);
  });

  // Form reset with confirmation
  onReset(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to reset the form? All entered data will be lost.',
      header: 'Confirm Reset',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: (): void => {
        Object.values(this.formSections).forEach((section: FormGroup<any>): void =>
          section.reset(),
        );
        this.currentStep.set(0);
        this.completedSteps.set([false, false, false, false, false]);
        localStorage.removeItem('enrollParticipantDraft');

        this.messageService.add({
          severity: 'info',
          summary: 'Form Reset',
          detail: 'The form has been reset to its initial state.',
        });
      },
    });
  }
}
