import { Component, OnInit, signal, WritableSignal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { RatingModule } from 'primeng/rating';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

import {
  LibInputTextComponent,
  InputTextConfig,
  InputTextTypeEnum,
  LibTextareaComponent,
  TextareaConfig,
  LibSelectComponent,
  LibCheckboxComponent,
  CheckboxConfig,
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  FormLabelPositionEnum,
  FormLabelStyleEnum,
  SelectConfig,
  DEFAULT_SCROLL_HEIGHT,
} from '@artificial-sense/ui-lib';
import { TextareaModule } from 'primeng/textarea';

interface SiteVisit {
  id: string;
  siteId: string;
  siteName: string;
  visitDate: Date;
  visitType: 'routine' | 'initiation' | 'close_out' | 'for_cause';
  monitorName: string;
  monitorId: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  visitDuration: number; // in hours
  participantsReviewed: number;
  sourceDataVerified: number;
  protocolDeviations: number;
  overallRating: number; // 1-5 scale
  findings: string;
  actionItems: ActionItem[];
  followUpRequired: boolean;
  followUpDate?: Date;
  createdDate: Date;
  lastModified: Date;
}

interface ActionItem {
  id: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string;
  dueDate: Date;
  status: 'open' | 'in_progress' | 'completed';
  comments: string;
}

interface Site {
  id: string;
  name: string;
  location: string;
  principalInvestigator: string;
  studyId: string;
}

interface Monitor {
  id: string;
  name: string;
  title: string;
  certification: string;
}

@Component({
  selector: 'app-site-visits',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    DividerModule,
    ToastModule,
    TableModule,
    TagModule,
    DialogModule,
    DatePickerModule,
    SelectModule,
    TextareaModule,
    CheckboxModule,
    RatingModule,
    FileUploadModule,
    ConfirmDialogModule,
    LibInputTextComponent,
    LibTextareaComponent,
    LibSelectComponent,
    LibCheckboxComponent,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './site-visits.component.html',
  styleUrls: ['./site-visits.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteVisitsComponent implements OnInit {
  // Forms
  siteVisitForm!: FormGroup;
  actionItemForm!: FormGroup;

  // Data
  siteVisits: WritableSignal<SiteVisit[]> = signal<SiteVisit[]>([]);
  sites: WritableSignal<Site[]> = signal<Site[]>([]);
  monitors: WritableSignal<Monitor[]> = signal<Monitor[]>([]);
  selectedVisit: SiteVisit | null = null; // kept as class due to template usage

  // UI State
  showVisitDialog = false; // kept as class due to two-way binding in template
  showActionItemDialog = false; // kept as class due to two-way binding in template
  isEditing = false;
  loading: WritableSignal<boolean> = signal(false);
  saveStatus: WritableSignal<'idle' | 'saving' | 'success' | 'error'> = signal('idle');

  // Form configurations
  siteConfig: SelectConfig = {
    id: 'siteId',
    label: 'Clinical Site',
    placeholder: 'Select a clinical site',
    required: true,
    options: [],
    variant: FormComponentVariantEnum.OUTLINED,
    labelPosition: FormLabelPositionEnum.ABOVE,
    labelStyle: FormLabelStyleEnum.DEFAULT,
    size: FormComponentSizeEnum.NORMAL,
    disabled: false,
    scrollHeight: DEFAULT_SCROLL_HEIGHT,
  };

  visitTypeConfig: SelectConfig = {
    id: 'visitType',
    label: 'Visit Type',
    placeholder: 'Select visit type',
    required: true,
    options: [
      { label: 'Routine Monitoring', value: 'routine' },
      { label: 'Site Initiation', value: 'initiation' },
      { label: 'Close Out Visit', value: 'close_out' },
      { label: 'For Cause', value: 'for_cause' },
    ],
    variant: FormComponentVariantEnum.OUTLINED,
    labelPosition: FormLabelPositionEnum.ABOVE,
    labelStyle: FormLabelStyleEnum.DEFAULT,
    size: FormComponentSizeEnum.NORMAL,
    disabled: false,
    scrollHeight: DEFAULT_SCROLL_HEIGHT,
  };

  monitorConfig: SelectConfig = {
    id: 'monitorId',
    label: 'Monitor',
    placeholder: 'Select monitor',
    required: true,
    options: [],
    variant: FormComponentVariantEnum.OUTLINED,
    labelPosition: FormLabelPositionEnum.ABOVE,
    labelStyle: FormLabelStyleEnum.DEFAULT,
    size: FormComponentSizeEnum.NORMAL,
    disabled: false,
    scrollHeight: DEFAULT_SCROLL_HEIGHT,
  };

  statusConfig: SelectConfig = {
    id: 'status',
    label: 'Visit Status',
    placeholder: 'Select status',
    required: true,
    options: [
      { label: 'Scheduled', value: 'scheduled' },
      { label: 'In Progress', value: 'in_progress' },
      { label: 'Completed', value: 'completed' },
      { label: 'Cancelled', value: 'cancelled' },
    ],
    variant: FormComponentVariantEnum.OUTLINED,
    labelPosition: FormLabelPositionEnum.ABOVE,
    labelStyle: FormLabelStyleEnum.DEFAULT,
    size: FormComponentSizeEnum.NORMAL,
    disabled: false,
    scrollHeight: DEFAULT_SCROLL_HEIGHT,
  };

  priorityConfig: SelectConfig = {
    id: 'priority',
    label: 'Priority',
    placeholder: 'Select priority',
    required: true,
    options: [
      { label: 'Low', value: 'low' },
      { label: 'Medium', value: 'medium' },
      { label: 'High', value: 'high' },
      { label: 'Critical', value: 'critical' },
    ],
    variant: FormComponentVariantEnum.OUTLINED,
    labelPosition: FormLabelPositionEnum.ABOVE,
    labelStyle: FormLabelStyleEnum.DEFAULT,
    size: FormComponentSizeEnum.NORMAL,
    disabled: false,
    scrollHeight: DEFAULT_SCROLL_HEIGHT,
  };

  actionStatusConfig: SelectConfig = {
    id: 'actionStatus',
    label: 'Status',
    placeholder: 'Select status',
    required: true,
    options: [
      { label: 'Open', value: 'open' },
      { label: 'In Progress', value: 'in_progress' },
      { label: 'Completed', value: 'completed' },
    ],
    variant: FormComponentVariantEnum.OUTLINED,
    labelPosition: FormLabelPositionEnum.ABOVE,
    labelStyle: FormLabelStyleEnum.DEFAULT,
    size: FormComponentSizeEnum.NORMAL,
    disabled: false,
    scrollHeight: DEFAULT_SCROLL_HEIGHT,
  };

  visitDurationConfig: InputTextConfig = {
    id: 'visitDuration',
    label: 'Visit Duration (hours)',
    placeholder: 'Enter duration in hours',
    required: true,
    type: InputTextTypeEnum.NUMBER,
    variant: FormComponentVariantEnum.OUTLINED,
    labelPosition: FormLabelPositionEnum.ABOVE,
    labelStyle: FormLabelStyleEnum.DEFAULT,
    size: FormComponentSizeEnum.NORMAL,
    disabled: false,
    helperText: 'Total time spent on site',
    autofocus: false,
  };

  participantsReviewedConfig: InputTextConfig = {
    id: 'participantsReviewed',
    label: 'Participants Reviewed',
    placeholder: 'Number of participants',
    required: true,
    type: InputTextTypeEnum.NUMBER,
    variant: FormComponentVariantEnum.OUTLINED,
    labelPosition: FormLabelPositionEnum.ABOVE,
    labelStyle: FormLabelStyleEnum.DEFAULT,
    size: FormComponentSizeEnum.NORMAL,
    disabled: false,
    helperText: 'Total participants reviewed during visit',
    autofocus: false,
  };

  sourceDataVerifiedConfig: InputTextConfig = {
    id: 'sourceDataVerified',
    label: 'Source Data Verified (%)',
    placeholder: 'Percentage verified',
    required: true,
    type: InputTextTypeEnum.NUMBER,
    variant: FormComponentVariantEnum.OUTLINED,
    labelPosition: FormLabelPositionEnum.ABOVE,
    labelStyle: FormLabelStyleEnum.DEFAULT,
    size: FormComponentSizeEnum.NORMAL,
    disabled: false,
    helperText: 'Percentage of source data verified',
    autofocus: false,
  };

  protocolDeviationsConfig: InputTextConfig = {
    id: 'protocolDeviations',
    label: 'Protocol Deviations Found',
    placeholder: 'Number of deviations',
    required: true,
    type: InputTextTypeEnum.NUMBER,
    variant: FormComponentVariantEnum.OUTLINED,
    labelPosition: FormLabelPositionEnum.ABOVE,
    labelStyle: FormLabelStyleEnum.DEFAULT,
    size: FormComponentSizeEnum.NORMAL,
    disabled: false,
    helperText: 'Total protocol deviations identified',
    autofocus: false,
  };

  findingsConfig: TextareaConfig = {
    id: 'findings',
    label: 'Visit Findings & Observations',
    placeholder:
      'Describe key findings, observations, and any issues identified during the visit...',
    required: true,
    rows: 6,
    variant: FormComponentVariantEnum.OUTLINED,
    labelPosition: FormLabelPositionEnum.ABOVE,
    labelStyle: FormLabelStyleEnum.DEFAULT,
    size: FormComponentSizeEnum.NORMAL,
    disabled: false,
    helperText: 'Detailed summary of visit findings',
    autofocus: false,
  };

  followUpRequiredConfig: CheckboxConfig = {
    id: 'followUpRequired',
    label: 'Follow-up Required',
    variant: FormComponentVariantEnum.OUTLINED,
    labelPosition: FormLabelPositionEnum.ABOVE,
    labelStyle: FormLabelStyleEnum.DEFAULT,
    size: FormComponentSizeEnum.NORMAL,
    disabled: false,
    required: false,
    helperText: 'Check if follow-up visit or action is required',
  };

  actionDescriptionConfig: TextareaConfig = {
    id: 'actionDescription',
    label: 'Action Item Description',
    placeholder: 'Describe the action required...',
    required: true,
    rows: 4,
    variant: FormComponentVariantEnum.OUTLINED,
    labelPosition: FormLabelPositionEnum.ABOVE,
    labelStyle: FormLabelStyleEnum.DEFAULT,
    size: FormComponentSizeEnum.NORMAL,
    disabled: false,
    autofocus: false,
  };

  assignedToConfig: InputTextConfig = {
    id: 'assignedTo',
    label: 'Assigned To',
    placeholder: 'Enter person responsible',
    required: true,
    variant: FormComponentVariantEnum.OUTLINED,
    labelPosition: FormLabelPositionEnum.ABOVE,
    labelStyle: FormLabelStyleEnum.DEFAULT,
    size: FormComponentSizeEnum.NORMAL,
    disabled: false,
    autofocus: false,
  };

  actionCommentsConfig: TextareaConfig = {
    id: 'actionComments',
    label: 'Comments',
    placeholder: 'Additional comments or updates...',
    required: false,
    rows: 3,
    variant: FormComponentVariantEnum.OUTLINED,
    labelPosition: FormLabelPositionEnum.ABOVE,
    labelStyle: FormLabelStyleEnum.DEFAULT,
    size: FormComponentSizeEnum.NORMAL,
    disabled: false,
    autofocus: false,
  };

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.loadMockData();
    this.updateDropdownOptions();
  }

  initializeForms(): void {
    this.siteVisitForm = this.fb.group({
      siteId: ['', Validators.required],
      visitDate: [new Date(), Validators.required],
      visitType: ['', Validators.required],
      monitorId: ['', Validators.required],
      status: ['scheduled', Validators.required],
      visitDuration: ['', [Validators.required, Validators.min(0)]],
      participantsReviewed: ['', [Validators.required, Validators.min(0)]],
      sourceDataVerified: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      protocolDeviations: ['', [Validators.required, Validators.min(0)]],
      overallRating: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      findings: ['', Validators.required],
      followUpRequired: [false],
      followUpDate: [''],
    });

    this.actionItemForm = this.fb.group({
      actionDescription: ['', Validators.required],
      priority: ['medium', Validators.required],
      assignedTo: ['', Validators.required],
      dueDate: [new Date(), Validators.required],
      actionStatus: ['open', Validators.required],
      actionComments: [''],
    });
  }

  loadMockData(): void {
    this.sites.set([
      {
        id: '1',
        name: 'Memorial Healthcare Center',
        location: 'New York, NY',
        principalInvestigator: 'Dr. Smith',
        studyId: 'STUDY-001',
      },
      {
        id: '2',
        name: 'Pacific Medical Research',
        location: 'San Francisco, CA',
        principalInvestigator: 'Dr. Johnson',
        studyId: 'STUDY-001',
      },
      {
        id: '3',
        name: 'Atlanta Research Institute',
        location: 'Atlanta, GA',
        principalInvestigator: 'Dr. Williams',
        studyId: 'STUDY-002',
      },
    ]);

    this.monitors.set([
      { id: '1', name: 'Sarah Chen', title: 'Senior CRA', certification: 'SOCRA Certified' },
      { id: '2', name: 'Michael Rodriguez', title: 'CRA II', certification: 'ACRP Certified' },
      {
        id: '3',
        name: 'Emily Davis',
        title: 'Lead Monitor',
        certification: 'SOCRA & ACRP Certified',
      },
    ]);

    this.siteVisits.set([
      {
        id: '1',
        siteId: '1',
        siteName: 'Memorial Healthcare Center',
        visitDate: new Date('2025-06-15'),
        visitType: 'routine',
        monitorName: 'Sarah Chen',
        monitorId: '1',
        status: 'completed',
        visitDuration: 8,
        participantsReviewed: 15,
        sourceDataVerified: 95,
        protocolDeviations: 2,
        overallRating: 4,
        findings:
          'Site demonstrates excellent compliance with protocol requirements. Source documents are well-maintained and readily available. Minor deviations related to lab timing were identified and addressed.',
        actionItems: [
          {
            id: '1',
            description: 'Retrain staff on lab collection timing requirements',
            priority: 'medium',
            assignedTo: 'Site Coordinator',
            dueDate: new Date('2025-07-01'),
            status: 'open',
            comments: 'Training materials provided during visit',
          },
        ],
        followUpRequired: true,
        followUpDate: new Date('2025-09-15'),
        createdDate: new Date('2025-06-15'),
        lastModified: new Date('2025-06-15'),
      },
      {
        id: '2',
        siteId: '2',
        siteName: 'Pacific Medical Research',
        visitDate: new Date('2025-06-10'),
        visitType: 'initiation',
        monitorName: 'Michael Rodriguez',
        monitorId: '2',
        status: 'completed',
        visitDuration: 12,
        participantsReviewed: 0,
        sourceDataVerified: 100,
        protocolDeviations: 0,
        overallRating: 5,
        findings:
          'Successful site initiation visit. All regulatory documents are in order. Site staff demonstrated comprehensive understanding of protocol requirements. Ready to begin enrollment.',
        actionItems: [],
        followUpRequired: false,
        createdDate: new Date('2025-06-10'),
        lastModified: new Date('2025-06-10'),
      },
    ]);
  }

  updateDropdownOptions(): void {
    this.siteConfig.options = this.sites().map((site: Site) => ({
      label: `${site.name} - ${site.location}`,
      value: site.id,
    }));

    this.monitorConfig.options = this.monitors().map((monitor: Monitor) => ({
      label: `${monitor.name} (${monitor.title})`,
      value: monitor.id,
    }));
  }

  openNewVisitDialog(): void {
    this.selectedVisit = null;
    this.isEditing = false;
    this.showVisitDialog = true;
    this.siteVisitForm.reset({
      status: 'scheduled',
      visitDate: new Date(),
      overallRating: 3,
      followUpRequired: false,
    });
  }

  openEditVisitDialog(visit: SiteVisit): void {
    this.selectedVisit = visit;
    this.isEditing = true;
    this.showVisitDialog = true;
    this.siteVisitForm.patchValue({
      siteId: visit.siteId,
      visitDate: visit.visitDate,
      visitType: visit.visitType,
      monitorId: visit.monitorId,
      status: visit.status,
      visitDuration: visit.visitDuration,
      participantsReviewed: visit.participantsReviewed,
      sourceDataVerified: visit.sourceDataVerified,
      protocolDeviations: visit.protocolDeviations,
      overallRating: visit.overallRating,
      findings: visit.findings,
      followUpRequired: visit.followUpRequired,
      followUpDate: visit.followUpDate,
    });
  }

  openActionItemDialog(visit: SiteVisit): void {
    this.selectedVisit = visit;
    this.showActionItemDialog = true;
    this.actionItemForm.reset({
      priority: 'medium',
      actionStatus: 'open',
      dueDate: new Date(),
    });
  }

  onSaveVisit(): void {
    if (this.siteVisitForm.valid) {
      this.loading.set(true);
      this.saveStatus.set('saving');

      const formValue: any = this.siteVisitForm.value;
      const selectedSite: Site | undefined = this.sites().find(
        (s: Site): boolean => s.id === formValue.siteId,
      );
      const selectedMonitor: Monitor | undefined = this.monitors().find(
        (m: Monitor): boolean => m.id === formValue.monitorId,
      );

      const visitData: SiteVisit = {
        ...formValue,
        id: this.isEditing ? this.selectedVisit?.id : this.generateId(),
        siteName: selectedSite?.name || '',
        monitorName: selectedMonitor?.name || '',
        actionItems: this.isEditing ? this.selectedVisit?.actionItems : [],
        createdDate: this.isEditing ? this.selectedVisit?.createdDate : new Date(),
        lastModified: new Date(),
      };

      // Simulate API call
      setTimeout((): void => {
        if (this.isEditing) {
          const current: SiteVisit[] = [...this.siteVisits()];
          const index: number = current.findIndex((v: SiteVisit): boolean => v.id === visitData.id);
          if (index !== -1) {
            current[index] = visitData;
            this.siteVisits.set(current);
          }
        } else {
          this.siteVisits.set([visitData, ...this.siteVisits()]);
        }

        this.loading.set(false);
        this.saveStatus.set('success');
        this.showVisitDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Site visit ${this.isEditing ? 'updated' : 'created'} successfully`,
        });

        setTimeout((): void => {
          this.saveStatus.set('idle');
        }, 2000);
      }, 1000);
    } else {
      this.markFormGroupTouched(this.siteVisitForm);
    }
  }

  onSaveActionItem(): void {
    if (this.actionItemForm.valid && this.selectedVisit) {
      const formValue: any = this.actionItemForm.value;
      const actionItem: ActionItem = {
        id: this.generateId(),
        description: formValue.actionDescription,
        priority: formValue.priority,
        assignedTo: formValue.assignedTo,
        dueDate: formValue.dueDate,
        status: formValue.actionStatus,
        comments: formValue.actionComments || '',
      };

      this.selectedVisit.actionItems.push(actionItem);
      this.showActionItemDialog = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Action item added successfully',
      });
    } else {
      this.markFormGroupTouched(this.actionItemForm);
    }
  }

  deleteVisit(visit: SiteVisit): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the visit to ${visit.siteName}?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: (): void => {
        this.siteVisits.set(this.siteVisits().filter((v: SiteVisit): boolean => v.id !== visit.id));
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Site visit deleted successfully',
        });
      },
    });
  }

  deleteActionItem(actionItem: ActionItem): void {
    if (this.selectedVisit) {
      this.selectedVisit.actionItems = this.selectedVisit.actionItems.filter(
        (a: ActionItem): boolean => a.id !== actionItem.id,
      );
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Action item deleted successfully',
      });
    }
  }

  getStatusSeverity(
    status: string,
  ): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'info';
      case 'scheduled':
        return 'warn';
      case 'cancelled':
        return 'danger';
      default:
        return 'info';
    }
  }

  getPrioritySeverity(
    priority: string,
  ): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (priority) {
      case 'critical':
        return 'danger';
      case 'high':
        return 'warn';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'info';
    }
  }

  getActionStatusSeverity(
    status: string,
  ): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'info';
      case 'open':
        return 'warn';
      default:
        return 'info';
    }
  }

  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key: string): void => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
