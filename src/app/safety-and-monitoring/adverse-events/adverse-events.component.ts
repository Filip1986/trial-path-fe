import {
  Component,
  OnInit,
  inject,
  signal,
  WritableSignal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG Components
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PanelModule } from 'primeng/panel';

// Shared Components
import {
  FilterField,
  FilterValues,
  TableFiltersComponent,
} from '../../shared/table-filters/table-filters.component';

interface AdverseEvent {
  id: string;
  reportId: string;
  participantId: string;
  participantName: string;
  studyId: string;
  studyTitle: string;
  eventTerm: string;
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening' | 'fatal';
  seriousness: 'serious' | 'non-serious';
  outcome: 'recovered' | 'recovering' | 'not-recovered' | 'fatal' | 'unknown';
  startDate: Date;
  endDate?: Date;
  reportedDate: Date;
  reportedBy: string;
  description: string;
  treatmentRequired: boolean;
  relatedToStudyDrug: 'related' | 'possibly-related' | 'unlikely' | 'not-related' | 'unknown';
  actionTaken: string;
  followUpRequired: boolean;
  status: 'open' | 'under-review' | 'resolved' | 'closed';
  reporterType: 'investigator' | 'participant' | 'healthcare-provider' | 'other';
  medicallySignificant: boolean;
  expectedEvent: boolean;
  dechallenge?: boolean;
  rechallenge?: boolean;
  concomitantMeds: string[];
  labAbnormalities?: string;
  lastUpdated: Date;
  updatedBy: string;
}

interface AdverseEventStats {
  total: number;
  open: number;
  serious: number;
  studyDrugRelated: number;
  lastReportDate: Date | null;
}

@Component({
  selector: 'app-adverse-events',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    CardModule,
    ButtonModule,
    TagModule,
    ToolbarModule,
    DialogModule,
    SelectModule,
    DatePickerModule,
    ToastModule,
    PanelModule,
    TableFiltersComponent,
  ],
  providers: [MessageService],
  templateUrl: './adverse-events.component.html',
  styleUrls: ['./adverse-events.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdverseEventsComponent implements OnInit {
  adverseEvents: WritableSignal<AdverseEvent[]> = signal<AdverseEvent[]>([]);
  filteredAdverseEvents: WritableSignal<AdverseEvent[]> = signal<AdverseEvent[]>([]);
  loading: WritableSignal<boolean> = signal(false);
  selectedEvent: WritableSignal<AdverseEvent | null> = signal<AdverseEvent | null>(null);
  showEventDialog: WritableSignal<boolean> = signal(false);

  // Filter configuration for adverse events
  filterFields: FilterField[] = [
    {
      key: 'search',
      label: 'Search Events',
      icon: 'pi pi-search',
      type: 'text',
      placeholder: 'Search by participant, study, event term...',
    },
    {
      key: 'severity',
      label: 'Severity',
      icon: 'pi pi-exclamation-triangle',
      type: 'dropdown',
      placeholder: 'Filter by Severity',
      showClear: true,
      options: [
        { label: 'Mild', value: 'mild' },
        { label: 'Moderate', value: 'moderate' },
        { label: 'Severe', value: 'severe' },
        { label: 'Life-threatening', value: 'life-threatening' },
        { label: 'Fatal', value: 'fatal' },
      ],
    },
    {
      key: 'seriousness',
      label: 'Seriousness',
      icon: 'pi pi-shield',
      type: 'dropdown',
      placeholder: 'Filter by Seriousness',
      showClear: true,
      options: [
        { label: 'Serious', value: 'serious' },
        { label: 'Non-serious', value: 'non-serious' },
      ],
    },
    {
      key: 'status',
      label: 'Status',
      icon: 'pi pi-circle',
      type: 'dropdown',
      placeholder: 'Filter by Status',
      showClear: true,
      options: [
        { label: 'Open', value: 'open' },
        { label: 'Under Review', value: 'under-review' },
        { label: 'Resolved', value: 'resolved' },
        { label: 'Closed', value: 'closed' },
      ],
    },
    {
      key: 'relatedToStudyDrug',
      label: 'Study Drug Relationship',
      icon: 'pi pi-link',
      type: 'dropdown',
      placeholder: 'Filter by Drug Relationship',
      showClear: true,
      options: [
        { label: 'Related', value: 'related' },
        { label: 'Possibly Related', value: 'possibly-related' },
        { label: 'Unlikely', value: 'unlikely' },
        { label: 'Not Related', value: 'not-related' },
        { label: 'Unknown', value: 'unknown' },
      ],
    },
    {
      key: 'study',
      label: 'Study',
      icon: 'pi pi-bookmark',
      type: 'dropdown',
      placeholder: 'Filter by Study',
      showClear: true,
      options: [
        { label: 'Phase III Cardiovascular Drug Trial', value: 'STUDY-001' },
        { label: 'Oncology Immunotherapy Study', value: 'STUDY-002' },
        { label: 'Diabetes Prevention Trial', value: 'STUDY-003' },
        { label: 'Neurological Disorder Research', value: 'STUDY-004' },
      ],
    },
  ];

  filterValues: WritableSignal<FilterValues> = signal<FilterValues>({
    search: '',
    severity: '',
    seriousness: '',
    status: '',
    relatedToStudyDrug: '',
    study: '',
  });

  stats: WritableSignal<AdverseEventStats> = signal<AdverseEventStats>({
    total: 0,
    open: 0,
    serious: 0,
    studyDrugRelated: 0,
    lastReportDate: null,
  });

  private router: Router = inject(Router);
  private messageService: MessageService = inject(MessageService);

  ngOnInit(): void {
    this.loadAdverseEvents();
  }

  /**
   * Load adverse events data (mock data for example)
   */
  loadAdverseEvents(): void {
    this.loading.set(true);

    // Simulate API call
    setTimeout((): void => {
      const data: AdverseEvent[] = this.generateMockAdverseEvents();
      this.adverseEvents.set(data);
      this.filteredAdverseEvents.set([...data]);
      this.calculateStats();
      this.loading.set(false);
    }, 1000);
  }

  /**
   * Handle filter changes from the table filters component
   */
  onFilterChange(filterValues: FilterValues): void {
    this.filterValues.set(filterValues);
    this.applyFilters();
  }

  /**
   * Handle clear filters action
   */
  onClearFilters(): void {
    this.filterValues.set({
      search: '',
      severity: '',
      seriousness: '',
      status: '',
      relatedToStudyDrug: '',
      study: '',
    });
    this.filteredAdverseEvents.set([...this.adverseEvents()]);
    this.calculateStats();
  }

  /**
   * View adverse event details
   */
  viewEventDetails(event: AdverseEvent): void {
    this.selectedEvent.set(event);
    this.showEventDialog.set(true);
  }

  /**
   * Get severity tag severity for PrimeNG
   */
  getSeverityTagSeverity(
    severity: string,
  ): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
    switch (severity) {
      case 'mild':
        return 'success';
      case 'moderate':
        return 'warn';
      case 'severe':
        return 'danger';
      case 'life-threatening':
        return 'danger';
      case 'fatal':
        return 'danger';
      default:
        return 'info';
    }
  }

  /**
   * Get status tag severity for PrimeNG
   */
  getStatusTagSeverity(
    status: string,
  ): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
    switch (status) {
      case 'open':
        return 'warn';
      case 'under-review':
        return 'info';
      case 'resolved':
        return 'success';
      case 'closed':
        return 'success';
      default:
        return 'info';
    }
  }

  /**
   * Export adverse events data
   */
  exportData(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Export Started',
      detail: 'Adverse events data export has been initiated.',
    });
  }

  /**
   * Create new adverse event report
   */
  createNewReport(): void {
    void this.router.navigate(['/safety/adverse-events/new']);
  }

  /**
   * Apply all active filters to the adverse events list
   */
  private applyFilters(): void {
    let filtered: AdverseEvent[] = [...this.adverseEvents()];

    const values: FilterValues = this.filterValues();
    // Apply search filter
    if (values['search']?.trim()) {
      const searchTerm: any = values['search'].toLowerCase().trim();
      filtered = filtered.filter(
        (event: AdverseEvent): boolean =>
          event.participantName.toLowerCase().includes(searchTerm) ||
          event.participantId.toLowerCase().includes(searchTerm) ||
          event.studyTitle.toLowerCase().includes(searchTerm) ||
          event.eventTerm.toLowerCase().includes(searchTerm) ||
          event.description.toLowerCase().includes(searchTerm) ||
          event.reportedBy.toLowerCase().includes(searchTerm),
      );
    }

    // Apply severity filter
    if (values['severity']) {
      filtered = filtered.filter(
        (event: AdverseEvent): boolean => event.severity === values['severity'],
      );
    }

    // Apply seriousness filter
    if (values['seriousness']) {
      filtered = filtered.filter(
        (event: AdverseEvent): boolean => event.seriousness === values['seriousness'],
      );
    }

    // Apply status filter
    if (values['status']) {
      filtered = filtered.filter(
        (event: AdverseEvent): boolean => event.status === values['status'],
      );
    }

    // Apply study drug relationship filter
    if (values['relatedToStudyDrug']) {
      filtered = filtered.filter(
        (event: AdverseEvent): boolean => event.relatedToStudyDrug === values['relatedToStudyDrug'],
      );
    }

    // Apply study filter
    if (values['study']) {
      filtered = filtered.filter(
        (event: AdverseEvent): boolean => event.studyId === values['study'],
      );
    }

    this.filteredAdverseEvents.set(filtered);
    this.calculateStats();
  }

  /**
   * Calculate statistics for the filtered adverse events
   */
  private calculateStats(): void {
    const events: AdverseEvent[] = this.filteredAdverseEvents();

    this.stats.set({
      total: events.length,
      open: events.filter((e: AdverseEvent): boolean => e.status === 'open').length,
      serious: events.filter((e: AdverseEvent): boolean => e.seriousness === 'serious').length,
      studyDrugRelated: events.filter(
        (e: AdverseEvent): boolean => e.relatedToStudyDrug === 'related',
      ).length,
      lastReportDate:
        events.length > 0
          ? new Date(Math.max(...events.map((e: AdverseEvent): number => e.reportedDate.getTime())))
          : null,
    });
  }

  /**
   * Generate mock adverse events data
   */
  private generateMockAdverseEvents(): AdverseEvent[] {
    return [
      {
        id: 'AE-001',
        reportId: 'SAE-2025-001',
        participantId: 'PT-001',
        participantName: 'John Smith',
        studyId: 'STUDY-001',
        studyTitle: 'Phase III Cardiovascular Drug Trial',
        eventTerm: 'Chest Pain',
        severity: 'moderate',
        seriousness: 'serious',
        outcome: 'recovered',
        startDate: new Date('2025-06-10'),
        endDate: new Date('2025-06-15'),
        reportedDate: new Date('2025-06-11'),
        reportedBy: 'Dr. Sarah Johnson',
        description: 'Patient experienced chest pain 2 hours after drug administration.',
        treatmentRequired: true,
        relatedToStudyDrug: 'possibly-related',
        actionTaken: 'Study drug temporarily discontinued, pain medication administered',
        followUpRequired: true,
        status: 'under-review',
        reporterType: 'investigator',
        medicallySignificant: true,
        expectedEvent: false,
        dechallenge: true,
        concomitantMeds: ['Aspirin 81mg', 'Lisinopril 10mg'],
        labAbnormalities: 'Elevated troponin levels',
        lastUpdated: new Date('2025-06-16'),
        updatedBy: 'Dr. Sarah Johnson',
      },
      {
        id: 'AE-002',
        reportId: 'AE-2025-002',
        participantId: 'PT-015',
        participantName: 'Maria Garcia',
        studyId: 'STUDY-002',
        studyTitle: 'Oncology Immunotherapy Study',
        eventTerm: 'Nausea',
        severity: 'mild',
        seriousness: 'non-serious',
        outcome: 'recovered',
        startDate: new Date('2025-06-12'),
        endDate: new Date('2025-06-13'),
        reportedDate: new Date('2025-06-12'),
        reportedBy: 'Nurse Emily Davis',
        description: 'Mild nausea reported 1 hour post-infusion.',
        treatmentRequired: false,
        relatedToStudyDrug: 'related',
        actionTaken: 'Anti-emetic administered',
        followUpRequired: false,
        status: 'resolved',
        reporterType: 'healthcare-provider',
        medicallySignificant: false,
        expectedEvent: true,
        concomitantMeds: ['Ondansetron 4mg'],
        lastUpdated: new Date('2025-06-13'),
        updatedBy: 'Nurse Emily Davis',
      },
      {
        id: 'AE-003',
        reportId: 'SAE-2025-003',
        participantId: 'PT-032',
        participantName: 'Robert Chen',
        studyId: 'STUDY-001',
        studyTitle: 'Phase III Cardiovascular Drug Trial',
        eventTerm: 'Hypotension',
        severity: 'severe',
        seriousness: 'serious',
        outcome: 'recovering',
        startDate: new Date('2025-06-14'),
        reportedDate: new Date('2025-06-14'),
        reportedBy: 'Dr. Michael Rodriguez',
        description: 'Severe hypotension requiring hospitalization.',
        treatmentRequired: true,
        relatedToStudyDrug: 'related',
        actionTaken: 'Study drug discontinued, IV fluids, vasopressor support',
        followUpRequired: true,
        status: 'open',
        reporterType: 'investigator',
        medicallySignificant: true,
        expectedEvent: false,
        dechallenge: true,
        concomitantMeds: ['Metoprolol 50mg'],
        labAbnormalities: 'Low blood pressure readings',
        lastUpdated: new Date('2025-06-18'),
        updatedBy: 'Dr. Michael Rodriguez',
      },
    ];
  }
}
