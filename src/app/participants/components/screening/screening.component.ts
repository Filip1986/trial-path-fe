import {
  Component,
  OnInit,
  inject,
  signal,
  WritableSignal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

// Import the reusable table filters component
import {
  FilterField,
  FilterValues,
  TableFiltersComponent,
} from '../../../shared/table-filters/table-filters.component';

// Import the shared table skeleton component
import {
  TableSkeletonComponent,
  TableSkeletonConfig,
} from '../../../shared/table-skeleton/table-skeleton.component';

// Import screening-specific skeleton config
import { SKELETON_PRESETS } from '../../../shared/models/consts/skeleton.const';

import { ParticipantService } from '../../services/participant.service';
import {
  ScreeningParticipant,
  ScreeningStatusEnum,
} from '../../models/interfaces/screening-participant.interface';
import { StatusSeverity } from '../../../studies/models/types';

@Component({
  selector: 'app-screening',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    CardModule,
    ButtonModule,
    TagModule,
    ToolbarModule,
    InputTextModule,
    SelectModule,
    DialogModule,
    PanelModule,
    DividerModule,
    CheckboxModule,
    ToastModule,
    ConfirmDialogModule,
    TableFiltersComponent,
    TableSkeletonComponent, // Use shared skeleton instead of individual skeleton
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './screening.component.html',
  styleUrls: ['./screening.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScreeningComponent implements OnInit {
  screeningParticipants: WritableSignal<ScreeningParticipant[]> = signal<ScreeningParticipant[]>(
    [],
  );
  filteredParticipants: WritableSignal<ScreeningParticipant[]> = signal<ScreeningParticipant[]>([]);
  // Keep these as class properties due to two-way bindings in the template
  selectedParticipant: ScreeningParticipant | null = null;
  showEligibilityDialog = false;

  // Loading state as signal
  loading: WritableSignal<boolean> = signal(true);

  // Use the shared skeleton configuration instead of custom skeleton rows
  skeletonConfig: TableSkeletonConfig = {
    ...SKELETON_PRESETS.SCREENING_TABLE,
    // Override specific properties if needed for this component
    rowCount: 8,
    columnCount: 4,
    showHeader: true,
    showFilters: true,
    showPagination: true,
    showActions: true,
    showAvatar: true,
    showStatus: true,
    headerHeight: '48px',
    rowHeight: '60px',
  };

  // Filter configuration for the reusable component
  filterFields: FilterField[] = [
    {
      key: 'search',
      label: 'Search Participants',
      icon: 'pi pi-search',
      type: 'text',
      placeholder: 'Search by name, ID, email...',
    },
    {
      key: 'study',
      label: 'Study',
      icon: 'pi pi-bookmark',
      type: 'dropdown',
      placeholder: 'Filter by Study',
      showClear: true,
      options: [
        { label: 'Phase III Cardiovascular Drug Trial', value: '1' },
        { label: 'Oncology Immunotherapy Study', value: '2' },
        { label: 'Phase II Diabetes Trial', value: '3' },
        { label: 'Neurological Research Study', value: '4' },
      ],
    },
    {
      key: 'status',
      label: 'Screening Status',
      icon: 'pi pi-flag',
      type: 'dropdown',
      placeholder: 'Filter by Status',
      showClear: true,
      options: [
        { label: 'Pending Review', value: 'pending' },
        { label: 'Under Review', value: 'under_review' },
        { label: 'Eligible', value: 'eligible' },
        { label: 'Ineligible', value: 'ineligible' },
        { label: 'Enrolled', value: 'enrolled' },
        { label: 'Declined', value: 'declined' },
      ],
    },
    {
      key: 'consent',
      label: 'Consent Status',
      icon: 'pi pi-check-circle',
      type: 'dropdown',
      placeholder: 'Filter by Consent',
      showClear: true,
      options: [
        { label: 'Not Obtained', value: 'not_obtained' },
        { label: 'Obtained', value: 'obtained' },
        { label: 'Pending', value: 'pending' },
      ],
    },
  ];

  filterValues: WritableSignal<FilterValues> = signal<FilterValues>({
    search: '',
    study: '',
    status: '',
    consent: '',
  });

  private router: Router = inject(Router);
  private messageService: MessageService = inject(MessageService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private participantService: ParticipantService = inject(ParticipantService);

  ngOnInit(): void {
    this.loadScreeningData();
  }

  /**
   * Load screening data with simulated delay
   */
  async loadScreeningData(): Promise<void> {
    try {
      this.loading.set(true);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Load data from service - FIX: Handle Observable properly
      this.participantService.getScreeningParticipants().subscribe({
        next: (participants: ScreeningParticipant[]): void => {
          this.screeningParticipants.set(participants);
          this.filteredParticipants.set([...participants]);
          this.loading.set(false);
        },
        error: (error): void => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load screening data',
          });
          this.loading.set(false);
        },
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load screening data',
      });
      this.loading.set(false);
    }
  }

  /**
   * Handle filter changes from the table filters component
   */
  onFilterChange(filterValues: FilterValues): void {
    this.filterValues.set(filterValues);
    this.applyFilters();
  }

  /**
   * Handle clearing all filters
   */
  onClearFilters(): void {
    this.filterValues.set({
      search: '',
      study: '',
      status: '',
      consent: '',
    });
    this.filteredParticipants.set([...this.screeningParticipants()]);
  }

  /**
   * Apply filters to the participant list
   */
  private applyFilters(): void {
    const values: FilterValues = this.filterValues();
    const filtered: ScreeningParticipant[] = this.screeningParticipants().filter(
      (participant: ScreeningParticipant): boolean => {
        // Search filter
        if (values['search']) {
          const searchTerm: any = values['search'].toLowerCase();
          const matchesSearch: boolean =
            participant.firstName.toLowerCase().includes(searchTerm) ||
            participant.lastName.toLowerCase().includes(searchTerm) ||
            participant.participantId.toLowerCase().includes(searchTerm) ||
            participant.email.toLowerCase().includes(searchTerm);

          if (!matchesSearch) return false;
        }

        // Study filter
        if (values['study'] && participant.studyId !== values['study']) {
          return false;
        }

        // Status filter
        if (values['status'] && participant.screeningStatus !== values['status']) {
          return false;
        }

        // Consent filter
        return !(values['consent'] && participant.consentStatus !== values['consent']);
      },
    );
    this.filteredParticipants.set(filtered);
  }

  /**
   * Navigation methods
   */
  navigateToAddScreening(): void {
    void this.router.navigate(['/participants/screening/add']);
  }

  exportScreeningData(): void {
    // Implement export functionality
    this.messageService.add({
      severity: 'info',
      summary: 'Export',
      detail: 'Export functionality coming soon',
    });
  }

  importScreeningData(): void {
    // Implement import functionality
    this.messageService.add({
      severity: 'info',
      summary: 'Import',
      detail: 'Import functionality coming soon',
    });
  }

  /**
   * Participant actions
   */
  viewParticipant(participant: ScreeningParticipant): void {
    void this.router.navigate(['/participants', participant.id]);
  }

  editScreening(participant: ScreeningParticipant): void {
    void this.router.navigate(['/participants/screening', participant.id, 'edit']);
  }

  checkEligibility(participant: ScreeningParticipant): void {
    this.selectedParticipant = participant;
    this.showEligibilityDialog = true;
  }

  approveParticipant(participant: ScreeningParticipant): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to approve ${participant.firstName} ${participant.lastName} for enrollment?`,
      header: 'Confirm Approval',
      icon: 'pi pi-check-circle',
      acceptButtonStyleClass: 'p-button-success',
      accept: (): void => {
        // Implement approval logic
        this.messageService.add({
          severity: 'success',
          summary: 'Approved',
          detail: `${participant.firstName} ${participant.lastName} has been approved for enrollment`,
        });
      },
    });
  }

  rejectParticipant(participant: ScreeningParticipant): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to reject ${participant.firstName} ${participant.lastName}?`,
      header: 'Confirm Rejection',
      icon: 'pi pi-times-circle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: (): void => {
        // Implement rejection logic
        this.messageService.add({
          severity: 'warn',
          summary: 'Rejected',
          detail: `${participant.firstName} ${participant.lastName} has been rejected`,
        });
      },
    });
  }

  /**
   * Utility methods for UI
   */
  getStatusSeverity(status: ScreeningStatusEnum): StatusSeverity {
    const severityMap = {
      [ScreeningStatusEnum.PENDING]: 'info',
      [ScreeningStatusEnum.IN_REVIEW]: 'warn', // FIX: Add missing IN_REVIEW mapping
      [ScreeningStatusEnum.UNDER_REVIEW]: 'warn',
      [ScreeningStatusEnum.ELIGIBLE]: 'success',
      [ScreeningStatusEnum.INELIGIBLE]: 'danger',
      [ScreeningStatusEnum.ENROLLED]: 'success',
      [ScreeningStatusEnum.DECLINED]: 'secondary',
      [ScreeningStatusEnum.SCREENING]: 'info', // FIX: Add missing SCREENING mapping
      [ScreeningStatusEnum.WITHDRAWN]: 'secondary', // FIX: Add missing WITHDRAWN mapping
    } as const;
    return severityMap[status] || 'info';
  }

  getConsentIcon(status: string): string {
    const iconMap: Record<string, string> = {
      // FIX: Add proper typing
      obtained: 'pi pi-check-circle',
      pending: 'pi pi-clock',
      not_obtained: 'pi pi-times-circle',
    };
    return iconMap[status] || 'pi pi-question-circle';
  }

  getConsentSeverity(status: string): string {
    const severityMap: Record<string, string> = {
      // FIX: Add proper typing
      obtained: 'success',
      pending: 'warning',
      not_obtained: 'danger',
    };
    return severityMap[status] || 'info';
  }

  calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age: number = today.getFullYear() - birthDate.getFullYear();
    const monthDiff: number = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }
}
