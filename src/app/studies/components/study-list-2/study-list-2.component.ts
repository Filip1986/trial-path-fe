import {
  Component,
  OnInit,
  inject,
  DestroyRef,
  ChangeDetectionStrategy,
  signal,
  WritableSignal,
  computed,
  Signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

// PrimeNG Components
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePickerModule } from 'primeng/datepicker';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';

// Shared Components
import { FilterField, FilterValues } from '../../../shared/table-filters/table-filters.component';
import { EnhancedTableComponent } from '../../../shared/enhanced-table/enhanced-table.component';
import { TableColumn, TableConfig, TableMetric } from '../../../shared/enhanced-table/models';

// Models and Constants
import { MOCK_STUDY_METRICS, mockStudies } from '../../data/mock';
import {
  STUDY_FILTER_FIELDS,
  STUDY_PHASE_OPTIONS,
  STUDY_TABLE_COLUMNS,
  THERAPEUTIC_AREA_OPTIONS,
} from '../../models/constants';
import { StudyStatus } from '../../models/enums';
import { Study } from '../../models/interfaces/study.interface';
import { StudyMetrics } from '../../models/interfaces/study-metrics.interface';
import { StudiesFacade } from '../../../core/store/studies/studies.facade';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StudyFilters } from '../../models/interfaces/study-filters.interface';

@Component({
  selector: 'app-study-list-2',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    ProgressBarModule,
    MenuModule,
    InputTextModule,
    SelectModule,
    MultiSelectModule,
    DatePickerModule,
    ProgressSpinnerModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
    CardModule,
    EnhancedTableComponent,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './study-list-2.component.html',
  styleUrls: ['./study-list-2.component.scss'],
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
export class StudyList2Component implements OnInit {
  // State properties as signals
  isInitialLoad: WritableSignal<boolean> = signal(true);
  dataFromCache: WritableSignal<boolean> = signal(false);
  showContent: WritableSignal<boolean> = signal(false);
  loading: WritableSignal<boolean> = signal(false);

  // State observables
  filterOpen$;
  searchFilter$;
  statusFilter$;
  phaseFilter$;
  hasActiveFilters$;

  // Data properties as signals
  studies: WritableSignal<Study[]> = signal<Study[]>([]);
  filterValuesSig: WritableSignal<FilterValues> = signal<FilterValues>({
    search: '',
    status: '',
    phase: '',
    therapeuticAreas: [],
  });
  filteredStudies: Signal<Study[]> = computed((): Study[] => {
    const s: Study[] = this.studies();
    const fv: FilterValues = this.filterValuesSig();
    return this.applyFilters(s, fv);
  });
  metrics: WritableSignal<StudyMetrics> = signal<StudyMetrics>(MOCK_STUDY_METRICS);
  tableMetrics: Signal<TableMetric[]> = computed((): TableMetric[] => [
    {
      title: 'Total Studies',
      subtitle: 'Registered studies',
      value: this.metrics().totalStudies,
      cardClass: 'bg-light-error',
    },
    {
      title: 'Active Studies',
      subtitle: 'Currently running',
      value: this.metrics().activeStudies,
      cardClass: 'bg-light-success',
    },
    {
      title: 'Total Participants',
      subtitle: 'Enrolled participants',
      value: this.metrics().totalParticipants,
      cardClass: 'bg-gray',
    },
    {
      title: 'Avg. Enrollment',
      subtitle: 'Enrollment rate',
      value: `${this.metrics().averageEnrollmentRate}%`,
      cardClass: 'bg-light-info',
    },
  ]);

  // Configuration from constants
  tableColumns: TableColumn[] = STUDY_TABLE_COLUMNS;
  filterFields: FilterField[] = STUDY_FILTER_FIELDS;

  // Table configuration
  tableConfig: TableConfig = {
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [10, 25, 50],
    sortField: 'lastModified',
    sortOrder: -1,
    globalFilterFields: [
      'shortTitle',
      'title',
      'indication',
      'principalInvestigator',
      'sponsorName',
    ],
    resizableColumns: true,
    responsiveLayout: 'scroll',
    showCurrentPageReport: true,
    currentPageReportTemplate: 'Showing {first} to {last} of {totalRecords} studies',
    emptyMessage: 'No studies found matching your criteria.',
  };

  // Filter values (deprecated in favor of signal)

  // Injected services
  private messageService: MessageService = inject(MessageService);

  constructor(
    private confirmationService: ConfirmationService,
    private studiesFacade: StudiesFacade,
    private route: ActivatedRoute,
    private router: Router,
    private destroyRef: DestroyRef,
  ) {
    this.studiesFacade = studiesFacade;

    this.filterOpen$ = this.studiesFacade.filterOpen$;
    this.searchFilter$ = this.studiesFacade.searchFilter$;
    this.statusFilter$ = this.studiesFacade.statusFilter$;
    this.phaseFilter$ = this.studiesFacade.phaseFilter$;
    this.hasActiveFilters$ = this.studiesFacade.hasActiveFilters$;
  }

  ngOnInit(): void {
    // Handle query parameters for pre-filtering
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params: Params): void => {
        if (params['status']) {
          // Pre-select the status filter
          this.preSelectStatusFilter(params['status']);
        }
        // Handle other query parameters if needed
      });

    // Listen to filter changes
    this.studiesFacade.filters$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((filters: StudyFilters): void => {
        this.loadStudies(filters);
      });

    this.loadStudies();
  }

  private preSelectStatusFilter(status: string): void {
    // Update the filter values to pre-select the status
    this.filterValuesSig.set({
      ...this.filterValuesSig(),
      status: status,
    });

    // If using NgRx or state management, dispatch the action
    this.studiesFacade?.updateStatusFilter(status);

    // Apply the filters immediately (computed will react)

    // Update the URL to remove query parameters after applying them
    // This keeps the URL clean for subsequent navigation
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      replaceUrl: true,
    });
  }

  // Data loading
  private loadStudies(filters?: any): void {
    this.loading.set(true);

    // Simulate API call
    setTimeout((): void => {
      this.studies.set(mockStudies);
      this.loading.set(false);
      this.isInitialLoad.set(false);
      this.showContent.set(true);
    }, 800);
  }

  // Event handlers
  onFilterChange(filterValues: FilterValues): void {
    this.filterValuesSig.set(filterValues);
  }

  onClearFilters(): void {
    this.filterValuesSig.set({
      search: '',
      status: '',
      phase: '',
      therapeuticAreas: [],
    });
  }
  // Navigation actions
  createNewStudy(): void {
    void this.router.navigate(['/studies/create']);
  }

  viewStudy(study: Study): void {
    void this.router.navigate(['/studies', study.id]);
  }

  editStudy(study: Study): void {
    void this.router.navigate(['/studies', study.id, 'edit']);
  }

  // Study actions
  duplicateStudy(study: Study): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to duplicate the study "${study.title}"?`,
      header: 'Duplicate Study',
      icon: 'pi pi-copy',
      acceptButtonStyleClass: 'p-button-info',
      accept: (): void => {
        // Handle duplication logic
        this.messageService.add({
          severity: 'success',
          summary: 'Study Duplicated',
          detail: `Study "${study.shortTitle}" has been duplicated successfully.`,
        });
      },
    });
  }

  exportStudy(study: Study): void {
    // Handle export logic
    this.messageService.add({
      severity: 'info',
      summary: 'Export Started',
      detail: `Export for study "${study.shortTitle}" has been initiated.`,
    });
  }

  archiveStudy(study: Study): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to archive the study "${study.title}"?`,
      header: 'Archive Study',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-warning',
      accept: (): void => {
        // Handle archive logic
        this.messageService.add({
          severity: 'warn',
          summary: 'Study Archived',
          detail: `Study "${study.shortTitle}" has been archived.`,
        });
      },
    });
  }

  // Action menu items
  getActionMenuItems = (study: Study): MenuItem[] => {
    return [
      {
        label: 'View Details',
        icon: 'pi pi-eye',
        command: (): void => this.viewStudy(study),
      },
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: (): void => this.editStudy(study),
      },
      {
        separator: true,
      },
      {
        label: 'Duplicate',
        icon: 'pi pi-copy',
        command: (): void => this.duplicateStudy(study),
      },
      {
        label: 'Export',
        icon: 'pi pi-download',
        command: (): void => this.exportStudy(study),
      },
      {
        separator: true,
      },
      {
        label: 'Archive',
        icon: 'pi pi-trash',
        command: (): void => this.archiveStudy(study),
      },
    ];
  };

  // Utility methods for labels and formatting
  getPhaseLabel(phase: string): string {
    const phaseOption = STUDY_PHASE_OPTIONS.find((p: any): boolean => p.value === phase);
    return phaseOption?.label || phase;
  }

  getTherapeuticAreasLabels(areas: string[]): string {
    return areas
      .map((area: string): string => {
        const areaOption = THERAPEUTIC_AREA_OPTIONS.find((a: any): boolean => a.value === area);
        return areaOption?.label || area;
      })
      .join(', ');
  }

  getStatusSeverity(
    status: string,
  ): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | undefined {
    switch (status) {
      case StudyStatus.ACTIVE:
      case StudyStatus.RECRUITING:
        return 'success';
      case StudyStatus.PLANNING:
        return 'info';
      case StudyStatus.SUSPENDED:
        return 'warn';
      case StudyStatus.CANCELLED:
        return 'danger';
      default:
        return 'secondary';
    }
  }

  getEnrollmentProgress(current: number, planned: number): number {
    return planned > 0 ? Math.round((current / planned) * 100) : 0;
  }

  getEnrollmentProgressColor(progress: number): string {
    if (progress >= 90) return '#10b981'; // green
    if (progress >= 70) return '#f59e0b'; // yellow
    if (progress >= 50) return '#f97316'; // orange
    return '#ef4444'; // red
  }

  // Filter application
  private applyFilters(studies: Study[], filterValues: FilterValues): Study[] {
    return studies.filter((study: Study): boolean => {
      // Search filter
      if (filterValues['search']) {
        const searchTerm: any = filterValues['search'].toLowerCase();
        const searchMatch: boolean =
          study.title.toLowerCase().includes(searchTerm) ||
          study.shortTitle.toLowerCase().includes(searchTerm) ||
          study.indication.toLowerCase().includes(searchTerm) ||
          study.principalInvestigator.toLowerCase().includes(searchTerm) ||
          study.sponsorName.toLowerCase().includes(searchTerm);

        if (!searchMatch) return false;
      }

      // Status filter - enhanced to handle 'active' mapping
      if (filterValues['status']) {
        const statusToMatch: any = filterValues['status'];

        // Map 'active' to include both 'active' and 'recruiting' studies
        if (statusToMatch === 'active') {
          const isActive: boolean = study.status === 'active' || study.status === 'recruiting';
          if (!isActive) return false;
        } else {
          if (study.status !== statusToMatch) return false;
        }
      }

      // Phase filter
      if (filterValues['phase'] && study.phase !== filterValues['phase']) {
        return false;
      }

      // Therapeutic areas filter
      if (filterValues['therapeuticAreas']?.length > 0) {
        const hasMatchingArea: boolean = study.therapeuticAreas.some((area: any): any =>
          filterValues['therapeuticAreas'].includes(area),
        );
        if (!hasMatchingArea) return false;
      }

      return true;
    });
  }
}
