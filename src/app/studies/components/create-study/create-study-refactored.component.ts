import {
  Component,
  OnInit,
  inject,
  DestroyRef,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  Type,
  AfterViewInit,
  ChangeDetectionStrategy,
  signal,
  WritableSignal,
} from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// PrimeNG Components
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { StepperModule } from 'primeng/stepper';
import { ProgressBarModule } from 'primeng/progressbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

// Step Components
import { BasicInformationStepComponent } from './steps/basic-information-step/basic-information-step.component';
import { StudyClassificationStepComponent } from './steps/study-classification-step/study-classification-step.component';
import { TimelineStepComponent } from './steps/timeline-step/timeline-step.component';
import { StudyDesignStepComponent } from './steps/study-design-step/study-design-step.component';
import { PopulationStepComponent } from './steps/population-step/population-step.component';

// Services and Interfaces
import { StepNavigationService } from './services/step-navigation.service';
import { IStepComponent } from './interfaces/step-component.interface';
import { IFormStep } from './interfaces/form-step.interface';
import { IStepNavigation } from './interfaces/step-navigation.interface';

@Component({
  selector: 'app-create-study-refactored',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    ToastModule,
    StepperModule,
    ProgressBarModule,
    ConfirmDialogModule
],
  providers: [MessageService, ConfirmationService, StepNavigationService],
  templateUrl: './create-study-refactored.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateStudyRefactoredComponent implements OnInit, AfterViewInit {
  @ViewChild('stepContainer', { read: ViewContainerRef }) stepContainer!: ViewContainerRef;

  studyForm!: FormGroup;
  saving: WritableSignal<boolean> = signal(false);
  autoSaving: WritableSignal<boolean> = signal(false);

  // Navigation state
  currentStep: WritableSignal<number> = signal(0);
  totalSteps: WritableSignal<number> = signal(0);
  currentStepLabel: WritableSignal<string> = signal('');
  progressPercentage: WritableSignal<number> = signal(0);
  canGoNext: WritableSignal<boolean> = signal(false);
  canGoPrevious: WritableSignal<boolean> = signal(false);
  canSubmit: WritableSignal<boolean> = signal(false);
  isLastStep: WritableSignal<boolean> = signal(false);

  // Step management
  formSteps: WritableSignal<IFormStep[]> = signal<IFormStep[]>([]);
  currentStepComponent: ComponentRef<IStepComponent> | null = null;

  // Step component mapping
  private stepComponents: Map<string, Type<IStepComponent>> = new Map([
    ['basic', BasicInformationStepComponent],
    ['classification', StudyClassificationStepComponent],
    ['timeline', TimelineStepComponent],
    ['design', StudyDesignStepComponent],
    ['population', PopulationStepComponent],
    // Add more step components as they are created
  ]);

  private autoSaveInterval: any;
  private readonly AUTO_SAVE_INTERVAL = 30000; // 30 seconds

  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly router: Router = inject(Router);
  private readonly messageService: MessageService = inject(MessageService);
  private readonly confirmationService: ConfirmationService = inject(ConfirmationService);
  private readonly stepNavigationService: StepNavigationService = inject(StepNavigationService);

  ngOnInit(): void {
    this.initializeForm();
    this.initializeSteps();
    this.setupNavigationSubscription();
    this.loadDraftData();
    this.startAutoSave();
  }

  ngAfterViewInit(): void {
    // Load the first step after view initialization
    setTimeout((): void => {
      this.loadCurrentStep();
    });
  }

  ngOnDestroy(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
    if (this.currentStepComponent) {
      this.currentStepComponent.destroy();
    }
  }

  private initializeForm(): void {
    this.studyForm = this.fb.group({
      // Basic Information
      title: ['', [Validators.required, Validators.minLength(10)]],
      shortTitle: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      objectives: ['', [Validators.required, Validators.minLength(10)]],

      // Study Classification
      studyType: ['', Validators.required],
      phase: ['', Validators.required],
      therapeuticArea: [[], Validators.required],
      indication: ['', Validators.required],
      keywords: [''],

      // Timeline
      plannedStartDate: ['', Validators.required],
      plannedEndDate: ['', Validators.required],
      enrollmentStartDate: ['', Validators.required],
      enrollmentEndDate: ['', Validators.required],

      // Study Design
      designType: ['', Validators.required],
      interventionModel: ['', Validators.required],
      primaryPurpose: ['', Validators.required],
      masking: ['', Validators.required],
      allocation: ['', Validators.required],

      // Population & Enrollment
      plannedEnrollment: ['', [Validators.required, Validators.min(1)]],
      minimumAge: ['', [Validators.required, Validators.min(0)]],
      maximumAge: ['', [Validators.required, Validators.min(0)]],
      healthyVolunteers: ['', Validators.required],
      genderBased: ['', Validators.required],

      // Add more form controls for additional steps...
    });
  }

  private initializeSteps(): void {
    this.formSteps.set([
      {
        id: 'basic',
        label: 'Basic Information',
        fields: ['title', 'shortTitle', 'description', 'objectives'],
        isValid: false,
        isCompleted: false,
        component: BasicInformationStepComponent,
      },
      {
        id: 'classification',
        label: 'Study Classification',
        fields: ['studyType', 'phase', 'therapeuticArea', 'indication'],
        isValid: false,
        isCompleted: false,
        component: StudyClassificationStepComponent,
      },
      {
        id: 'timeline',
        label: 'Timeline',
        fields: ['plannedStartDate', 'plannedEndDate', 'enrollmentStartDate', 'enrollmentEndDate'],
        isValid: false,
        isCompleted: false,
        component: TimelineStepComponent,
      },
      {
        id: 'design',
        label: 'Study Design',
        fields: ['designType', 'interventionModel', 'primaryPurpose', 'masking', 'allocation'],
        isValid: false,
        isCompleted: false,
        component: StudyDesignStepComponent,
      },
      {
        id: 'population',
        label: 'Population & Enrollment',
        fields: [
          'plannedEnrollment',
          'minimumAge',
          'maximumAge',
          'healthyVolunteers',
          'genderBased',
        ],
        isValid: false,
        isCompleted: false,
        component: PopulationStepComponent,
      },
      // Add more steps here as they are implemented...
    ]);

    this.stepNavigationService.initializeSteps(this.formSteps());
    this.totalSteps.set(this.formSteps().length);
  }

  private setupNavigationSubscription(): void {
    // Subscribe to navigation state changes
    this.stepNavigationService.navigationState$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((navState: IStepNavigation): void => {
        this.currentStep.set(navState.currentStep);
        this.canGoNext.set(navState.canGoNext);
        this.canGoPrevious.set(navState.canGoPrevious);
        this.canSubmit.set(navState.canSubmit);
        this.isLastStep.set(this.stepNavigationService.isLastStep());
        const idx: number = this.currentStep();
        this.currentStepLabel.set(this.formSteps()[idx]?.label || '');
        this.progressPercentage.set(this.stepNavigationService.getProgressPercentage());

        // Load the current step component
        this.loadCurrentStep();
      });

    // Subscribe to form steps changes
    this.stepNavigationService.formSteps$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((steps: IFormStep[]): void => {
        this.formSteps.set(steps);
      });
  }

  private loadCurrentStep(): void {
    if (!this.stepContainer) return;

    const currentStepData: IFormStep = this.formSteps()[this.currentStep()];
    if (!currentStepData) return;

    const componentClass: Type<IStepComponent> | undefined = this.stepComponents.get(
      currentStepData.id,
    );
    if (!componentClass) {
      // No component found for the current step id; skip loading.
      return;
    }

    // Clear previous component
    if (this.currentStepComponent) {
      this.currentStepComponent.destroy();
    }
    this.stepContainer.clear();

    // Create new component
    this.currentStepComponent = this.stepContainer.createComponent(componentClass);

    // Set component inputs
    this.currentStepComponent.instance.formGroup = this.studyForm;
    this.currentStepComponent.instance.stepId = currentStepData.id;
    this.currentStepComponent.instance.stepLabel = currentStepData.label;

    // Subscribe to component events
    this.currentStepComponent.instance.validationChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((validation): void => {
        this.stepNavigationService.updateStepValidation(
          validation.stepId,
          validation.isValid,
          validation.isCompleted,
        );
      });

    this.currentStepComponent.instance.dataChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data): void => {
        // Handle data changes if needed
        this.autoSave();
      });
  }

  // Navigation methods
  goToStep(stepIndex: number): void {
    if (stepIndex >= 0 && stepIndex < this.formSteps().length) {
      this.stepNavigationService.goToStep(stepIndex);
    }
  }

  nextStep(): void {
    if (this.currentStepComponent) {
      this.currentStepComponent.instance.markFieldsAsTouched();
    }

    if (this.canGoNext()) {
      this.stepNavigationService.nextStep();
    } else {
      this.showValidationMessage();
    }
  }

  previousStep(): void {
    this.stepNavigationService.previousStep();
  }

  // Form submission and saving
  async onSubmit(): Promise<void> {
    if (!this.studyForm.valid) {
      this.markAllFieldsAsTouched();
      this.showValidationMessage();
      return;
    }

    this.saving.set(true);

    try {
      const formData: any = this.studyForm.value;

      // TODO: Replace with actual API call
      await this.simulateApiCall(formData);

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Study created successfully!',
      });

      // Navigate to study list or detail page
      await this.router.navigate(['/studies']);
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to create study. Please try again.',
      });
    } finally {
      this.saving.set(false);
    }
  }

  private async simulateApiCall(data: any): Promise<void> {
    return new Promise((resolve): void => {
      setTimeout((): void => resolve(), 2000);
    });
  }

  // Auto-save functionality
  private startAutoSave(): void {
    this.autoSaveInterval = setInterval((): void => {
      if (this.studyForm.dirty && !this.autoSaving()) {
        this.autoSave();
      }
    }, this.AUTO_SAVE_INTERVAL);
  }

  private async autoSave(): Promise<void> {
    if (this.autoSaving() || this.saving()) return;

    this.autoSaving.set(true);

    try {
      const formData: any = this.studyForm.value;
      // TODO: Implement actual auto-save API call
      await this.simulateAutoSave(formData);

      this.studyForm.markAsPristine();
    } catch (error) {
      // Auto-save failed; could log to remote service if needed.
    } finally {
      this.autoSaving.set(false);
    }
  }

  private async simulateAutoSave(data: any): Promise<void> {
    return new Promise((resolve): void => {
      setTimeout((): void => resolve(), 1000);
    });
  }

  // Draft data management
  private loadDraftData(): void {
    // TODO: Load draft data from localStorage or API
    const draftKey = 'study-draft-data';
    const draftData: string | null = localStorage.getItem(draftKey);

    if (draftData) {
      try {
        const parsedData: any = JSON.parse(draftData);
        this.studyForm.patchValue(parsedData);
      } catch (error) {
        console.error('Failed to load draft data:', error);
      }
    }
  }

  saveDraft(): void {
    const draftKey = 'study-draft-data';
    const formData: any = this.studyForm.value;

    try {
      localStorage.setItem(draftKey, JSON.stringify(formData));
      this.messageService.add({
        severity: 'info',
        summary: 'Draft Saved',
        detail: 'Your progress has been saved as a draft.',
      });
    } catch (error) {
      console.error('Failed to save draft:', error);
      this.messageService.add({
        severity: 'warn',
        summary: 'Draft Save Failed',
        detail: 'Unable to save draft data.',
      });
    }
  }

  clearDraft(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to clear all draft data? This action cannot be undone.',
      header: 'Clear Draft',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: (): void => {
        localStorage.removeItem('study-draft-data');
        this.studyForm.reset();
        this.stepNavigationService.reset();
        this.messageService.add({
          severity: 'info',
          summary: 'Draft Cleared',
          detail: 'All draft data has been cleared.',
        });
      },
    });
  }

  // Utility methods
  private markAllFieldsAsTouched(): void {
    Object.keys(this.studyForm.controls).forEach((key: string): void => {
      const control = this.studyForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  private showValidationMessage(): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Validation Required',
      detail: 'Please complete all required fields before proceeding.',
    });
  }

  // Public getter methods for template
  getProgressPercentage(): number {
    return this.progressPercentage();
  }

  getCurrentStepLabel(): string {
    return this.currentStepLabel();
  }

  // Cancel and navigation
  onCancel(): void {
    if (this.studyForm.dirty) {
      this.confirmationService.confirm({
        message: 'You have unsaved changes. Are you sure you want to cancel?',
        header: 'Confirm Cancel',
        icon: 'pi pi-exclamation-triangle',
        acceptButtonStyleClass: 'p-button-danger',
        accept: (): void => {
          this.router.navigate(['/studies']);
        },
      });
    } else {
      void this.router.navigate(['/studies']);
    }
  }
}
