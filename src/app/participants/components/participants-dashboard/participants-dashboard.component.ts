import {
  Component,
  OnInit,
  inject,
  DestroyRef,
  signal,
  WritableSignal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ChartModule } from 'primeng/chart';
import { SkeletonModule } from 'primeng/skeleton';

// Interfaces
interface ParticipantMetrics {
  totalParticipants: number;
  activeParticipants: number;
  screeningParticipants: number;
  completedParticipants: number;
  averageEnrollmentRate: number;
  monthlyEnrollmentTrend: number;
}

interface DashboardCard {
  title: string;
  value: number | string;
  subtitle: string;
  icon: string;
  severity: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

interface RecentParticipant {
  id: string;
  participantId: string;
  firstName: string;
  lastName: string;
  studyTitle: string;
  status: 'screening' | 'enrolled' | 'active' | 'completed' | 'withdrawn';
  enrollmentDate: Date;
}

interface RecentActivity {
  id: string;
  type: 'enrollment' | 'status_change' | 'screening' | 'visit';
  participantId: string;
  participantName: string;
  description: string;
  timestamp: Date;
  studyId?: string;
}

@Component({
  selector: 'app-participants-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TableModule,
    TagModule,
    ChartModule,
    SkeletonModule,
  ],
  templateUrl: './participants-dashboard.component.html',
  styleUrls: ['./participants-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantsDashboardComponent implements OnInit {
  loading: WritableSignal<boolean> = signal(true);

  // Data properties
  metrics: WritableSignal<ParticipantMetrics> = signal<ParticipantMetrics>({
    totalParticipants: 0,
    activeParticipants: 0,
    screeningParticipants: 0,
    completedParticipants: 0,
    averageEnrollmentRate: 0,
    monthlyEnrollmentTrend: 0,
  });

  metricCards: WritableSignal<DashboardCard[]> = signal<DashboardCard[]>([]);
  recentParticipants: WritableSignal<RecentParticipant[]> = signal<RecentParticipant[]>([]);
  recentActivity: WritableSignal<RecentActivity[]> = signal<RecentActivity[]>([]);

  // Chart data
  enrollmentChartData: WritableSignal<any> = signal<any>(null);
  statusChartData: WritableSignal<any> = signal<any>(null);
  chartOptions: WritableSignal<any> = signal<any>(null);
  doughnutChartOptions: WritableSignal<any> = signal<any>(null);

  private router: Router = inject(Router);

  ngOnInit(): void {
    this.initializeComponent();
    this.setupChartOptions();
    this.loadDashboardData();
  }

  private initializeComponent(): void {
    this.loading.set(true);
  }

  private setupChartOptions(): void {
    // Chart options setup similar to studies dashboard
    this.chartOptions.set({
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: '#495057',
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#495057',
          },
          grid: {
            color: 'rgba(160, 167, 181, .3)',
          },
        },
        y: {
          ticks: {
            color: '#495057',
          },
          grid: {
            color: 'rgba(160, 167, 181, .3)',
          },
        },
      },
    });

    this.doughnutChartOptions.set({
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: '#495057',
          },
        },
      },
    });
  }

  private loadDashboardData(): void {
    // Simulate API call - replace with actual service calls
    setTimeout((): void => {
      this.metrics.set({
        totalParticipants: 156,
        activeParticipants: 89,
        screeningParticipants: 23,
        completedParticipants: 44,
        averageEnrollmentRate: 78,
        monthlyEnrollmentTrend: 12,
      });

      this.metricCards.set(this.getMetricCards(this.metrics()));
      this.setupChartData();
      this.loadRecentData();

      this.loading.set(false);
    }, 1500);
  }

  private getMetricCards(metrics: ParticipantMetrics): DashboardCard[] {
    return [
      {
        title: 'Total Participants',
        value: metrics.totalParticipants,
        subtitle: 'All enrolled participants',
        icon: 'pi pi-users',
        severity: 'info',
        trend: {
          value: 15,
          direction: 'up',
        },
      },
      {
        title: 'Active Participants',
        value: metrics.activeParticipants,
        subtitle: 'Currently participating',
        icon: 'pi pi-check-circle',
        severity: 'success',
        trend: {
          value: 8,
          direction: 'up',
        },
      },
      {
        title: 'In Screening',
        value: metrics.screeningParticipants,
        subtitle: 'Under evaluation',
        icon: 'pi pi-search',
        severity: 'warning',
        trend: {
          value: 3,
          direction: 'up',
        },
      },
      {
        title: 'Enrollment Rate',
        value: `${metrics.averageEnrollmentRate}%`,
        subtitle: 'Monthly average',
        icon: 'pi pi-chart-line',
        severity: metrics.averageEnrollmentRate >= 70 ? 'success' : 'warning',
        trend: {
          value: metrics.monthlyEnrollmentTrend,
          direction: metrics.monthlyEnrollmentTrend > 0 ? 'up' : 'down',
        },
      },
    ];
  }

  private setupChartData(): void {
    // Enrollment trends chart
    this.enrollmentChartData.set({
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Enrollments',
          data: [12, 19, 15, 25, 22, 30],
          fill: false,
          borderColor: '#42A5F5',
          tension: 0.4,
        },
        {
          label: 'Screening',
          data: [8, 12, 10, 15, 18, 20],
          fill: false,
          borderColor: '#FFA726',
          tension: 0.4,
        },
      ],
    });

    // Status distribution chart
    this.statusChartData.set({
      labels: ['Active', 'Screening', 'Completed', 'Withdrawn'],
      datasets: [
        {
          data: [89, 23, 44, 12],
          backgroundColor: ['#42A5F5', '#FFA726', '#66BB6A', '#EF5350'],
          hoverBackgroundColor: ['#64B5F6', '#FFB74D', '#81C784', '#F44336'],
        },
      ],
    });
  }

  private loadRecentData(): void {
    // Load recent participants
    this.recentParticipants.set([
      {
        id: '1',
        participantId: 'P001',
        firstName: 'John',
        lastName: 'Doe',
        studyTitle: 'Cardiovascular Health Study',
        status: 'active',
        enrollmentDate: new Date(2024, 5, 15),
      },
      {
        id: '2',
        participantId: 'P002',
        firstName: 'Jane',
        lastName: 'Smith',
        studyTitle: 'Diabetes Prevention Trial',
        status: 'screening',
        enrollmentDate: new Date(2024, 5, 20),
      },
      // Add more mock data as needed
    ]);

    // Load recent activity
    this.recentActivity.set([
      {
        id: '1',
        type: 'enrollment',
        participantId: 'P003',
        participantName: 'Alice Johnson',
        description: 'New participant enrolled',
        timestamp: new Date(2024, 5, 25, 14, 30),
        studyId: 'study-1',
      },
      {
        id: '2',
        type: 'status_change',
        participantId: 'P001',
        participantName: 'John Doe',
        description: 'Status changed to Active',
        timestamp: new Date(2024, 5, 25, 10, 15),
        studyId: 'study-1',
      },
      // Add more mock data as needed
    ]);
  }

  enrollParticipant(): void {
    void this.router.navigate(['/participants/enroll']);
  }

  viewParticipant(participant: RecentParticipant): void {
    void this.router.navigate(['/participants', participant.id]);
  }

  editParticipant(participant: RecentParticipant): void {
    void this.router.navigate(['/participants', participant.id, 'edit']);
  }

  viewParticipantFromActivity(activity: RecentActivity): void {
    if (activity.participantId) {
      // Navigate to participant details - you might need to resolve the full participant ID
      void this.router.navigate(['/participants', activity.participantId]);
    }
  }

  // Utility methods
  getStatusSeverity(
    status: string,
  ): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
    const severityMap: {
      [key: string]: 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast';
    } = {
      active: 'success',
      screening: 'warn',
      enrolled: 'info',
      completed: 'secondary',
      withdrawn: 'danger',
    };
    return severityMap[status] || 'info';
  }
  getActivityIcon(type: RecentActivity['type']): string {
    const iconMap = {
      enrollment: 'pi pi-user-plus',
      status_change: 'pi pi-refresh',
      screening: 'pi pi-search',
      visit: 'pi pi-calendar',
    };
    return iconMap[type] || 'pi pi-info-circle';
  }

  getActivitySeverity(type: RecentActivity['type']): string {
    const severityMap = {
      enrollment: 'success',
      status_change: 'info',
      screening: 'warning',
      visit: 'primary',
    };
    return severityMap[type] || 'info';
  }
}
