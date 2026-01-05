import {
  Component,
  computed,
  effect,
  inject,
  Signal,
  signal,
  WritableSignal,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

// Services
import { ParticipantService } from '../../services/participant.service';

// Models
import { Participant } from '../../models/interfaces';

// PrimeNG Components
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToolbarModule } from 'primeng/toolbar';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import {
  FilterField,
  FilterValues,
  TableFiltersComponent,
} from '../../../shared/table-filters/table-filters.component';
import { Router } from '@angular/router';
import { ParticipantsFacade } from '../../../core/store/participants/participants.facade';

@Component({
  selector: 'app-all-participants',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TagModule,
    ToolbarModule,
    InputGroupModule,
    InputGroupAddonModule,
    PanelModule,
    ToastModule,
    FormsModule,
    TableFiltersComponent,
    ProgressSpinnerModule,
  ],
  templateUrl: './all-participants.component.html',
  styleUrls: ['./all-participants.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('pageEnter', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateX(-10px)', // Reduced distance
        }),
        animate(
          '300ms ease-out', // Shorter duration
          style({
            opacity: 1,
            transform: 'translateX(0)',
          }),
        ),
      ]),
    ]),
  ],
})
export class AllParticipantsComponent {
  // State properties - matching study-list-2 pattern
  isInitialLoad = true;
  dataFromCache = false;
  showContent = false;
  loading = false;

  participants: Participant[] = [];
  filteredParticipants: Participant[] = [];

  // State observables
  filterOpen$;
  searchFilter$;
  studyFilter$;
  statusFilter$;
  hasActiveFilters$;

  // Filter configuration
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
        { label: 'Diabetes Prevention Trial', value: '3' },
        { label: 'Neurological Disorder Research', value: '4' },
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
        { label: 'Active', value: 'active' },
        { label: 'Screening', value: 'screening' },
        { label: 'Completed', value: 'completed' },
        { label: 'Withdrawn', value: 'withdrawn' },
      ],
    },
  ];

  filterValues: FilterValues = {
    search: '',
    study: '',
    status: '',
  };

  stats = {
    total: 0,
    active: 0,
    screening: 0,
    completed: 0,
  };

  // DI via inject for signal-safe access
  private readonly participantService: ParticipantService = inject(ParticipantService);
  private readonly router: Router = inject(Router);
  private readonly participantsFacade: ParticipantsFacade = inject(ParticipantsFacade);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  // Signals for data
  readonly participantsSig: Signal<Participant[] | undefined> = toSignal(
    this.participantService.getParticipants(),
  );

  readonly statsSig: Signal<
    { total: number; active: number; screening: number; completed: number } | undefined
  > = toSignal(this.participantService.getParticipantStats());

  // Local filter values as a signal
  readonly filterValuesSig: WritableSignal<FilterValues> = signal<FilterValues>({
    ...this.filterValues,
  });

  // Derived filtered participants
  readonly filteredParticipantsSig: Signal<Participant[]> = computed((): Participant[] =>
    this.applyFiltersPure(this.participantsSig() ?? [], this.filterValuesSig()),
  );

  constructor() {
    // Optional: map facade observables to fields if used in template
    this.filterOpen$ = this.participantsFacade?.filterOpen$;
    this.searchFilter$ = this.participantsFacade?.searchFilter$;
    this.studyFilter$ = this.participantsFacade?.studyFilter$;
    this.statusFilter$ = this.participantsFacade?.statusFilter$;
    this.hasActiveFilters$ = this.participantsFacade?.hasActiveFilters$;

    // Sync signals to existing fields so templates don't need changes
    effect((): void => {
      this.participants = this.participantsSig() ?? [];
      this.filteredParticipants = this.filteredParticipantsSig();
      this.stats = this.statsSig() ?? { total: 0, active: 0, screening: 0, completed: 0 };

      // Update loading/visibility flags after first data emission
      this.loading = false;
      this.isInitialLoad = false;
      this.showContent = true;

      // Ensure changes reflect in the view since template binds to plain fields
      this.cdr.markForCheck();
    });
  }

  /**
   * Export data functionality
   */
  exportData(): void {
    // Implement export functionality here
  }

  /**
   * Import participants functionality
   */
  importParticipants(): void {
    // Implement import functionality here
  }

  /**
   * Handle filter changes from the reusable component
   */
  onFilterChange(filterValues: FilterValues): void {
    this.filterValues = filterValues;
    this.filterValuesSig.set({ ...filterValues });
  }

  /**
   * Handle clear filters from the reusable component
   */
  onClearFilters(): void {
    const defaults: FilterValues = { search: '', study: '', status: '' };
    this.filterValues = defaults;
    this.filterValuesSig.set(defaults);
  }

  /**
   * Navigate to enroll participant page
   */
  navigateToEnroll(): void {
    void this.router.navigate(['/participants/enroll']);
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' {
    switch (status) {
      case 'active':
        return 'success';
      case 'screening':
        return 'info';
      case 'completed':
        return 'info';
      case 'withdrawn':
        return 'warn';
      case 'terminated':
        return 'danger';
      default:
        return 'info';
    }
  }

  /**
   * Calculate age from date of birth
   */
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

  viewParticipant(participant: Participant): void {
    void this.router.navigate(['/participants', participant.id]);
  }

  /**
   * Navigate to edit participant
   */
  editParticipant(participant: Participant): void {
    void this.router.navigate(['/participants', participant.id, 'edit']);
  }

  // Pure client-side filter application for performance
  private applyFiltersPure(participants: Participant[], filters: FilterValues): Participant[] {
    if (!participants?.length) return [];

    const search: any = (filters['search'] || '').toLowerCase().trim();
    const study: any = (filters['study'] || '').toString();
    const status: any = (filters['status'] || '').toString();

    return participants.filter((p: any): boolean => {
      // free-text search across common fields
      const matchesSearch: boolean =
        !search ||
        `${p?.name ?? p?.fullName ?? ''}`.toLowerCase().includes(search) ||
        `${p?.email ?? ''}`.toLowerCase().includes(search) ||
        `${p?.id ?? ''}`.toString().toLowerCase().includes(search);

      const matchesStudy: boolean = !study || `${p?.studyId ?? p?.study?.id ?? ''}` === study;
      const matchesStatus: boolean = !status || `${p?.status ?? ''}` === status;

      return matchesSearch && matchesStudy && matchesStatus;
    });
  }
}
