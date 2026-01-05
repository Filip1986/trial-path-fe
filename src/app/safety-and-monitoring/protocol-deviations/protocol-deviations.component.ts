import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  WritableSignal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

// UI-lib imports
import {
  LibInputTextComponent,
  LibTextareaComponent,
  LibSelectComponent,
  LibDatePickerComponent,
  LibCheckboxComponent,
  LibRadioButtonComponent,
  FormComponentVariantEnum,
  FormLabelPositionEnum,
  FormComponentSizeEnum,
  FormLabelStyleEnum,
  RadioButtonModeEnum,
  IconDisplayModeEnum,
  DatePickerViewEnum,
  DatePickerHourFormatEnum,
} from '@artificial-sense/ui-lib';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface ProtocolDeviation {
  id?: string;
  deviationType: string;
  subjectId: string;
  description: string;
  protocolSection: string;
  dateOccurred: Date | null;
  dateDiscovered: Date | null;
  discoveredBy: string;
  severity: string;
  impact: string;
  rootCause: string;
  correctiveActions: string;
  preventiveActions: string;
  status: string;
  reportedToSponsor: boolean;
  reportedToIrb: boolean;
  reportedToRegulatory: boolean;
  reportingDate: Date | null;
  reportingComments: string;
  reviewedBy: string;
  reviewDate: Date | null;
  approvalRequired: boolean;
  followUpRequired: boolean;
  followUpDate: Date | null;
  resolutionNotes: string;
}

@Component({
  selector: 'app-protocol-deviations',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    LibInputTextComponent,
    LibTextareaComponent,
    LibSelectComponent,
    LibDatePickerComponent,
    LibCheckboxComponent,
    LibRadioButtonComponent,
    ButtonModule,
    DividerModule,
    ToastModule
],
  providers: [MessageService],
  templateUrl: './protocol-deviations.component.html',
  styleUrls: ['./protocol-deviations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProtocolDeviationsComponent implements OnInit, OnDestroy {
  protocolDeviationForm!: FormGroup;
  isSubmitting: WritableSignal<boolean> = signal(false);
  // Form Options
  deviationTypes = [
    { label: 'Inclusion/Exclusion Criteria', value: 'inclusion_exclusion' },
    { label: 'Informed Consent', value: 'informed_consent' },
    { label: 'Protocol Procedure', value: 'protocol_procedure' },
    { label: 'Dosing/Administration', value: 'dosing_administration' },
    { label: 'Visit Window', value: 'visit_window' },
    { label: 'Concomitant Medication', value: 'concomitant_medication' },
    { label: 'Laboratory/Assessment', value: 'laboratory_assessment' },
    { label: 'Randomization', value: 'randomization' },
    { label: 'Study Drug Management', value: 'study_drug_management' },
    { label: 'Other', value: 'other' },
  ];
  protocolSections = [
    { label: 'Section 3 - Study Objectives', value: 'section_3' },
    { label: 'Section 4 - Study Design', value: 'section_4' },
    { label: 'Section 5 - Selection Criteria', value: 'section_5' },
    { label: 'Section 6 - Treatment/Intervention', value: 'section_6' },
    { label: 'Section 7 - Assessment Schedule', value: 'section_7' },
    { label: 'Section 8 - Safety Monitoring', value: 'section_8' },
    { label: 'Section 9 - Statistical Methods', value: 'section_9' },
    { label: 'Section 10 - Data Management', value: 'section_10' },
    { label: 'Appendices', value: 'appendices' },
    { label: 'Other', value: 'other' },
  ];
  severityLevels = [
    { label: 'Minor - No impact on safety or study integrity', value: 'minor' },
    { label: 'Moderate - Minimal impact on safety or study integrity', value: 'moderate' },
    { label: 'Major - Significant impact on safety or study integrity', value: 'major' },
    { label: 'Critical - Serious impact on safety or study integrity', value: 'critical' },
  ];
  impactLevels = [
    { label: 'No Impact', value: 'no_impact' },
    { label: 'Minimal Impact', value: 'minimal_impact' },
    { label: 'Moderate Impact', value: 'moderate_impact' },
    { label: 'Significant Impact', value: 'significant_impact' },
    { label: 'Critical Impact', value: 'critical_impact' },
  ];
  statusOptions = [
    { label: 'Open', value: 'open' },
    { label: 'Under Review', value: 'under_review' },
    { label: 'Pending Approval', value: 'pending_approval' },
    { label: 'Resolved', value: 'resolved' },
    { label: 'Closed', value: 'closed' },
  ];
  protected readonly FormLabelStyleEnum: typeof FormLabelStyleEnum = FormLabelStyleEnum;
  protected readonly FormComponentSizeEnum: typeof FormComponentSizeEnum = FormComponentSizeEnum;
  protected readonly FormLabelPositionEnum: typeof FormLabelPositionEnum = FormLabelPositionEnum;
  protected readonly FormComponentVariantEnum: typeof FormComponentVariantEnum =
    FormComponentVariantEnum;
  protected readonly IconDisplayModeEnum: typeof IconDisplayModeEnum = IconDisplayModeEnum;
  protected readonly DatePickerViewEnum: typeof DatePickerViewEnum = DatePickerViewEnum;
  protected readonly DatePickerHourFormatEnum: typeof DatePickerHourFormatEnum =
    DatePickerHourFormatEnum;
  protected readonly RadioButtonModeEnum: typeof RadioButtonModeEnum = RadioButtonModeEnum;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setupFormValidation();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.protocolDeviationForm.valid) {
      this.isSubmitting.set(true);

      // Simulate API call
      setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Protocol deviation report saved successfully!',
        });
        this.isSubmitting.set(false);
        // You can reset form or navigate here
      }, 2000);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields correctly.',
      });
    }
  }

  saveDraft(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Draft Saved',
      detail: 'Protocol deviation report saved as draft.',
    });
  }

  resetForm(): void {
    this.protocolDeviationForm.reset();
    this.protocolDeviationForm.patchValue({ status: 'open' });
    this.messageService.add({
      severity: 'info',
      summary: 'Form Reset',
      detail: 'Form has been reset to default values.',
    });
  }

  private initializeForm(): void {
    this.protocolDeviationForm = this.fb.group({
      deviationType: ['', Validators.required],
      subjectId: ['', Validators.required],
      description: ['', Validators.required],
      protocolSection: ['', Validators.required],
      dateOccurred: [null, Validators.required],
      dateDiscovered: [null, Validators.required],
      discoveredBy: ['', Validators.required],
      severity: ['', Validators.required],
      impact: ['', Validators.required],
      rootCause: ['', Validators.required],
      correctiveActions: ['', Validators.required],
      preventiveActions: [''],
      status: ['open', Validators.required],
      reportedToSponsor: [false],
      reportedToIrb: [false],
      reportedToRegulatory: [false],
      reportingDate: [null],
      reportingComments: [''],
      reviewedBy: [''],
      reviewDate: [null],
      approvalRequired: [false],
      followUpRequired: [false],
      followUpDate: [null],
      resolutionNotes: [''],
    });
  }

  private setupFormValidation(): void {
    // Add custom validation logic here
    this.protocolDeviationForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((values: any): void => {
        // Custom validation logic can be added here
        this.validateDates(values);
      });
  }

  private validateDates(values: any): void {
    const dateOccurred: any = values.dateOccurred;
    const dateDiscovered: any = values.dateDiscovered;

    if (dateOccurred && dateDiscovered && dateOccurred > dateDiscovered) {
      this.protocolDeviationForm.get('dateDiscovered')?.setErrors({
        dateInvalid: 'Discovery date cannot be before occurrence date',
      });
    }
  }
}
