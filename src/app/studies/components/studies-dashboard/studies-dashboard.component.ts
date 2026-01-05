import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
  computed,
  Signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { StudyStateService } from '../../services/study-state.service';
import { StudyStatus } from '../../models/enums';
import { Study } from '../../models/interfaces/study.interface';
import { DashboardCard, RecentActivity } from '../../models/interfaces/dashboard.interface';
import { StatusSeverity } from '../../models/types';
import { StudyMetrics } from '../../models/interfaces/study-metrics.interface';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-studies-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    SkeletonModule,
    TagModule,
    ProgressBarModule,
    ChartModule,
    TableModule,
    TooltipModule,
    DialogModule,
    MessageModule,
  ],
  templateUrl: './studies-dashboard.component.html',
  styleUrls: ['./studies-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudiesDashboardComponent implements OnInit {
  private studyStateService: StudyStateService = inject(StudyStateService);

  // Signals from store
  readonly studies: Signal<Study[] | null> = toSignal(this.studyStateService.studies$, {
    initialValue: null,
  });
  readonly loading: Signal<boolean | null> = toSignal(this.studyStateService.loading$, {
    initialValue: null,
  });
  readonly error: Signal<string | null> = toSignal<string | null>(this.studyStateService.error$, {
    initialValue: null,
  });
  readonly metrics: Signal<StudyMetrics | null> = toSignal<StudyMetrics | null>(
    this.studyStateService.metrics$,
    {
      initialValue: null,
    },
  );

  // Derived dashboard data as signals
  readonly recentStudies: Signal<Study[]> = computed((): Study[] => {
    const studies: Study[] = this.studies() ?? [];
    return [...studies]
      .sort(
        (a: Study, b: Study): number =>
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime(),
      )
      .slice(0, 4);
  });

  readonly urgentStudies: Signal<Study[]> = computed((): Study[] => {
    const studies: Study[] = this.studies() ?? [];
    return studies
      .filter((study: Study): boolean => {
        const enrollmentRate: number =
          study.plannedEnrollment > 0
            ? (study.currentEnrollment / study.plannedEnrollment) * 100
            : 0;
        const isLowEnrollment: boolean =
          enrollmentRate < 50 && study.status === StudyStatus.RECRUITING;
        const daysToEnd: number = Math.ceil(
          (new Date(study.plannedEndDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24),
        );
        const isApproachingDeadline: boolean = daysToEnd > 0 && daysToEnd < 30;
        return isLowEnrollment || isApproachingDeadline;
      })
      .slice(0, 3);
  });

  readonly recentActivities: Signal<RecentActivity[]> = computed((): RecentActivity[] => {
    const studies: Study[] = this.studies() ?? [];
    const activities: RecentActivity[] = [];
    const now = new Date();
    studies.slice(0, 8).forEach((study: Study, index: number): void => {
      const daysAgo: number = Math.floor(Math.random() * 7) + 1;
      const activityDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      if (index % 3 === 0) {
        activities.push({
          id: `activity-${index}`,
          type: 'enrollment',
          message: `New participant enrolled`,
          timestamp: activityDate,
          studyId: study.id,
          studyTitle: study.shortTitle,
        });
      } else if (index % 3 === 1) {
        activities.push({
          id: `activity-${index}`,
          type: 'status_change',
          message: `Status updated to ${study.status}`,
          timestamp: activityDate,
          studyId: study.id,
          studyTitle: study.shortTitle,
        });
      } else {
        activities.push({
          id: `activity-${index}`,
          type: 'milestone',
          message: `Reached 50% enrollment target`,
          timestamp: activityDate,
          studyId: study.id,
          studyTitle: study.shortTitle,
        });
      }
    });
    return activities.sort(
      (a: RecentActivity, b: RecentActivity): number =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  });

  // Chart data as signals
  readonly enrollmentChartData: Signal<any> = computed(() => {
    const enrollmentData = (this.studies() ?? [])
      .filter(
        (s: Study): boolean =>
          s.status === StudyStatus.RECRUITING || s.status === StudyStatus.ACTIVE,
      )
      .slice(0, 6)
      .map((study) => ({
        label: study.shortTitle,
        planned: study.plannedEnrollment,
        current: study.currentEnrollment,
      }));
    return {
      labels: enrollmentData.map((d): string => d.label),
      datasets: [
        {
          label: 'Current Enrollment',
          data: enrollmentData.map((d): number => d.current),
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          borderWidth: 1,
        },
        {
          label: 'Planned Enrollment',
          data: enrollmentData.map((d): number => d.planned),
          backgroundColor: '#FFA726',
          borderColor: '#FF9800',
          borderWidth: 1,
        },
      ],
    };
  });

  readonly statusChartData: Signal<any> = computed(() => {
    const counts: Record<string, number> = (this.studies() ?? []).reduce(
      (acc: Record<string, number>, study: Study): Record<string, number> => {
        acc[study.status] = (acc[study.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    return {
      labels: Object.keys(counts).map(
        (status: string): string =>
          status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
      ),
      datasets: [
        {
          data: Object.values(counts),
          backgroundColor: [
            '#4CAF50',
            '#2196F3',
            '#FF9800',
            '#9E9E9E',
            '#F44336',
            '#FF5722',
            '#795548',
          ],
          borderColor: '#fff',
          borderWidth: 2,
        },
      ],
    };
  });

  // Chart options (static)
  enrollmentChartOptions: any = {};
  statusChartOptions: any = {};

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.setupChartOptions();
    this.loadDashboardData();
  }

  getMetricCards(metrics: StudyMetrics): DashboardCard[] {
    return [
      {
        title: 'Total Studies',
        value: metrics.totalStudies,
        subtitle: 'All registered studies',
        icon: 'pi pi-file-o',
        severity: 'info',
        trend: {
          value: 12,
          direction: 'up',
        },
      },
      {
        title: 'Active Studies',
        value: metrics.activeStudies,
        subtitle: 'Currently running',
        icon: 'pi pi-play-circle',
        severity: 'success',
        trend: {
          value: 8,
          direction: 'up',
        },
      },
      {
        title: 'Total Participants',
        value: metrics.totalParticipants,
        subtitle: 'Enrolled across all studies',
        icon: 'pi pi-users',
        severity: 'primary',
        trend: {
          value: 15,
          direction: 'up',
        },
      },
      {
        title: 'Avg. Enrollment',
        value: `${metrics.averageEnrollmentRate}%`,
        subtitle: 'Enrollment rate',
        icon: 'pi pi-chart-line',
        severity: metrics.averageEnrollmentRate >= 70 ? 'success' : 'warning',
        trend: {
          value: 5,
          direction: metrics.averageEnrollmentRate >= 70 ? 'up' : 'down',
        },
      },
    ];
  }

  // Navigation methods
  viewAllStudies(): void {
    void this.router.navigate(['/studies/list2']);
  }

  viewActiveStudies(): void {
    // Navigate to all studies with active status pre-selected
    void this.router.navigate(['/studies/list2'], {
      queryParams: { status: 'active' },
    });
  }

  onMetricCardClick(cardType: string): void {
    switch (cardType) {
      case 'total':
        this.viewAllStudies();
        break;
      case 'active':
        this.viewActiveStudies();
        break;
      default:
        this.viewAllStudies();
        break;
    }
  }

  createNewStudy(): void {
    this.router.navigate(['/studies/create']);
  }

  viewStudy(study: Study): void {
    this.router.navigate(['/studies', study.id]);
  }

  editStudy(study: Study): void {
    this.router.navigate(['/studies', study.id, 'edit']);
  }

  viewStudyFromActivity(activity: RecentActivity): void {
    if (activity.studyId) {
      this.router.navigate(['/studies', activity.studyId]);
    }
  }

  getActivityIcon(type: RecentActivity['type']): string {
    const iconMap = {
      enrollment: 'pi pi-user-plus',
      status_change: 'pi pi-refresh',
      study_created: 'pi pi-file-plus',
      milestone: 'pi pi-star',
    };
    return iconMap[type] || 'pi pi-info-circle';
  }

  getActivitySeverity(type: RecentActivity['type']): string {
    const severityMap = {
      enrollment: 'success',
      status_change: 'info',
      study_created: 'primary',
      milestone: 'warning',
    };
    return severityMap[type] || 'info';
  }

  getEnrollmentProgress(study: Study): number {
    return study.plannedEnrollment > 0
      ? Math.round((study.currentEnrollment / study.plannedEnrollment) * 100)
      : 0;
  }

  getStatusSeverity(status: StudyStatus): StatusSeverity {
    const severityMap: Record<StudyStatus, StatusSeverity> = {
      [StudyStatus.RECRUITING]: 'success',
      [StudyStatus.ACTIVE]: 'success',
      [StudyStatus.PLANNING]: 'info',
      [StudyStatus.COMPLETED]: 'secondary',
      [StudyStatus.SUSPENDED]: 'warn',
      [StudyStatus.CANCELLED]: 'danger',
      [StudyStatus.DRAFT]: 'warn',
    };
    return severityMap[status] || 'info';
  }

  /**
   * Format large numbers with K/M suffixes
   */
  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  }

  getDaysRemaining(endDate: Date): number {
    const now = new Date();
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - now.getTime()) / (1000 * 3600 * 24));
  }

  private loadDashboardData(): void {
    this.studyStateService.loadStudies();
  }

  createStudy(): void {
    void this.router.navigate(['/studies/create']);
  }

  private setupChartOptions(): void {
    this.enrollmentChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0,0,0,0.1)',
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
    };

    this.statusChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
        },
        tooltip: {
          callbacks: {
            label: (context: any): string => {
              const label: any = context.label || '';
              const value: any = context.parsed || 0;
              const total: any = context.dataset.data.reduce(
                (a: number, b: number): number => a + b,
                0,
              );
              const percentage: string = ((value / total) * 100).toFixed(1);
              return `${label}: ${value} (${percentage}%)`;
            },
          },
        },
      },
    };
  }
}
