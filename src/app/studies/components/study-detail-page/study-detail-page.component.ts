import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
  computed,
  Signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { DialogModule } from 'primeng/dialog';
import { ChartModule } from 'primeng/chart';
import { TabsModule } from 'primeng/tabs';
import { TimelineModule } from 'primeng/timeline';
import { DataViewModule } from 'primeng/dataview';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { StudyStateService } from '../../services/study-state.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Checkbox } from 'primeng/checkbox';
import { Study } from '../../models/interfaces/study.interface';
import {
  StudyDetailTab,
  StudyMetric,
  TimelineEvent,
} from '../../models/interfaces/dashboard.interface';
import { StudyStatus } from '../../models/enums';
import { StatusSeverity } from '../../models/types';

@Component({
  selector: 'app-study-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ProgressSpinnerModule,
    MessageModule,
    TagModule,
    ProgressBarModule,
    DividerModule,
    TableModule,
    TooltipModule,
    MenuModule,
    DialogModule,
    ChartModule,
    TabsModule,
    TimelineModule,
    DataViewModule,
    ConfirmDialogModule,
    ToastModule,
    Checkbox,
  ],
  providers: [ConfirmationService],
  templateUrl: './study-detail-page.component.html',
  styleUrls: ['./study-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudyDetailPageComponent implements OnInit {
  // Tab configuration
  tabs: StudyDetailTab[] = [
    { label: 'Overview', icon: 'pi pi-info-circle', id: 'overview' },
    { label: 'Timeline', icon: 'pi pi-calendar', id: 'timeline' },
    { label: 'Participants', icon: 'pi pi-users', id: 'participants' },
    { label: 'Documents', icon: 'pi pi-file', id: 'documents' },
    { label: 'Settings', icon: 'pi pi-cog', id: 'settings' },
  ];
  activeTabIndex = 0;
  // Chart data for enrollment progress
  // Chart options (static) and data as signal
  enrollmentChartOptions: any = {};
  readonly enrollmentChartData: Signal<any> = computed(() => {
    const study: Study | null = this.study();
    if (!study)
      return {
        labels: ['Enrolled', 'Remaining'],
        datasets: [{ data: [0, 0], backgroundColor: ['#22c55e', '#e5e7eb'], borderWidth: 0 }],
      };
    return {
      labels: ['Enrolled', 'Remaining'],
      datasets: [
        {
          data: [
            study.currentEnrollment,
            Math.max(0, study.plannedEnrollment - study.currentEnrollment),
          ],
          backgroundColor: ['#22c55e', '#e5e7eb'],
          borderWidth: 0,
        },
      ],
    };
  });

  private route: ActivatedRoute = inject(ActivatedRoute);
  // Signals
  readonly study: Signal<Study | null> = toSignal(
    this.route.data.pipe(map((data: Data) => data['study'])),
    { initialValue: null },
  );
  private router: Router = inject(Router);
  private studyStateService: StudyStateService = inject(StudyStateService);
  readonly loading: Signal<boolean | null> = toSignal(this.studyStateService.loading$, {
    initialValue: null,
  });
  readonly error: Signal<string | null> = toSignal(this.studyStateService.error$, {
    initialValue: null,
  });
  private messageService: MessageService = inject(MessageService);

  // Derived signals
  readonly studyMetrics: Signal<StudyMetric[]> = computed((): StudyMetric[] => {
    const s: Study | null = this.study();
    return s ? this.getStudyMetrics(s) : [];
  });

  readonly studyTimeline: Signal<TimelineEvent[]> = computed((): TimelineEvent[] => {
    const s: Study | null = this.study();
    return s ? this.getStudyTimeline(s) : [];
  });

  constructor(private confirmationService: ConfirmationService) {}

  public get getMenuItems() {
    return [
      {
        label: 'Duplicate',
        icon: 'pi pi-copy',
        command: (): void => {
          const s: Study | null = this.study();
          if (s) this.duplicateStudy(s);
        },
      },
      {
        label: 'Export',
        icon: 'pi pi-download',
        command: (): void => {
          const s: Study | null = this.study();
          if (s) this.exportStudy(s);
        },
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: (): void => {
          const s: Study | null = this.study();
          if (s) this.deleteStudy(s);
        },
      },
    ];
  }

  ngOnInit(): void {
    // setup static chart options; data is provided by enrollmentChartData signal
    this.enrollmentChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            font: { size: 12 },
          },
        },
      },
    };
  }

  // TypeScript
  getRiskLevelDisplay(riskLevel: string): string {
    return `${riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk`;
  }

  // Utility methods
  getStatusSeverity(status: StudyStatus): StatusSeverity {
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
      case StudyStatus.COMPLETED:
        return 'secondary';
      default:
        return 'info';
    }
  }

  getRiskLevelSeverity(riskLevel: string): StatusSeverity {
    switch (riskLevel.toLowerCase()) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warn';
      case 'high':
        return 'danger';
      default:
        return 'info';
    }
  }

  getEnrollmentProgress(current: number, planned: number): number {
    return planned > 0 ? Math.round((current / planned) * 100) : 0;
  }

  getProgressBarColor(percentage: number): string {
    if (percentage >= 80) return 'success';
    if (percentage >= 50) return 'info';
    if (percentage >= 25) return 'warning';
    return 'danger';
  }

  // Timeline data
  getStudyTimeline(study: Study): TimelineEvent[] {
    return [
      {
        status: 'Created',
        date: new Date(study.createdDate).toLocaleDateString(),
        icon: 'pi pi-plus',
        color: '#9C27B0',
        title: 'Study Created',
        description: `Study created by ${study.createdBy}`,
      },
      {
        status: 'Planning',
        date: new Date(study.plannedStartDate).toLocaleDateString(),
        icon: 'pi pi-calendar',
        color: '#673AB7',
        title: 'Planned Start Date',
        description: 'Study scheduled to begin',
      },
      {
        status: 'Active',
        date: study.status === StudyStatus.ACTIVE ? 'Current' : 'Pending',
        icon: 'pi pi-play',
        color: study.status === StudyStatus.ACTIVE ? '#4CAF50' : '#9E9E9E',
        title: 'Study Active',
        description:
          study.status === StudyStatus.ACTIVE
            ? 'Study is currently running'
            : 'Awaiting activation',
      },
      {
        status: 'Completion',
        date: new Date(study.plannedEndDate).toLocaleDateString(),
        icon: 'pi pi-check',
        color: study.status === StudyStatus.COMPLETED ? '#4CAF50' : '#9E9E9E',
        title: 'Planned End Date',
        description:
          study.status === StudyStatus.COMPLETED ? 'Study completed' : 'Planned completion',
      },
    ];
  }

  // Study metrics
  getStudyMetrics(study: Study): StudyMetric[] {
    return [
      {
        label: 'Enrollment Progress',
        value: `${study.currentEnrollment}/${study.plannedEnrollment}`,
        icon: 'pi pi-users',
        color: '#3B82F6',
        description: `${this.getEnrollmentProgress(study.currentEnrollment, study.plannedEnrollment)}% enrolled`,
      },
      {
        label: 'Duration',
        value: study.estimatedDuration ? `${study.estimatedDuration} months` : 'N/A',
        icon: 'pi pi-clock',
        color: '#8B5CF6',
        description: 'Estimated study duration',
      },
      {
        label: 'Sites',
        value: `${study.completedSites || 0}/${study.sites}`,
        icon: 'pi pi-map-marker',
        color: '#10B981',
        description: 'Active research sites',
      },
      {
        label: 'Risk Level',
        value: study.riskLevel.toUpperCase(),
        icon: 'pi pi-shield',
        color:
          study.riskLevel === 'high'
            ? '#EF4444'
            : study.riskLevel === 'medium'
              ? '#F59E0B'
              : '#10B981',
        description: 'Study risk assessment',
      },
    ];
  }

  // Action methods
  editStudy(study: Study): void {
    void this.router.navigate(['/studies', study.id, 'edit']);
  }

  duplicateStudy(study: Study): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to duplicate the study "${study.shortTitle}"?`,
      header: 'Confirm Duplication',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Implementation for duplicating study
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Study duplicated successfully',
        });
      },
    });
  }

  deleteStudy(study: Study): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the study "${study.shortTitle}"? This action cannot be undone.`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: (): void => {
        // Implementation for deleting study
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Study deleted successfully',
        });
        void this.router.navigate(['/studies']);
      },
    });
  }

  exportStudy(study: Study): void {
    // Implementation for exporting study data
    this.messageService.add({
      severity: 'info',
      summary: 'Export Started',
      detail: 'Study data export has been initiated',
    });
  }

  goBack(): void {
    void this.router.navigate(['/studies']);
  }

  onTabChange(event: any): void {
    this.activeTabIndex = event.index;
  }

  // Mock data for participants table (replace with actual service call)
  getParticipants(): any[] {
    return [
      {
        id: 'P001',
        name: 'John Doe',
        age: 45,
        gender: 'Male',
        enrollmentDate: '2024-01-15',
        status: 'Active',
        lastVisit: '2024-06-10',
      },
      {
        id: 'P002',
        name: 'Jane Smith',
        age: 38,
        gender: 'Female',
        enrollmentDate: '2024-01-20',
        status: 'Active',
        lastVisit: '2024-06-12',
      },
      {
        id: 'P003',
        name: 'Mike Johnson',
        age: 52,
        gender: 'Male',
        enrollmentDate: '2024-02-01',
        status: 'Completed',
        lastVisit: '2024-05-30',
      },
    ];
  }

  // Mock data for documents (replace with actual service call)
  getDocuments(): any[] {
    return [
      {
        name: 'Study Protocol',
        type: 'PDF',
        size: '2.4 MB',
        uploadDate: '2024-01-10',
        version: '1.2',
      },
      {
        name: 'Informed Consent Form',
        type: 'PDF',
        size: '856 KB',
        uploadDate: '2024-01-15',
        version: '1.0',
      },
      {
        name: 'Case Report Form',
        type: 'PDF',
        size: '1.1 MB',
        uploadDate: '2024-01-20',
        version: '2.1',
      },
    ];
  }
}
