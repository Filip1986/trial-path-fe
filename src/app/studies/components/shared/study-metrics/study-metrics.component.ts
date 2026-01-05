import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  InputSignal,
  Signal,
} from '@angular/core';

import { CardModule } from 'primeng/card';
import { StudyMetrics } from '../../../models/interfaces/study-metrics.interface';

@Component({
  selector: 'app-study-metrics',
  standalone: true,
  imports: [CardModule],
  templateUrl: './study-metrics.component.html',
  styleUrls: ['./study-metrics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudyMetricsComponent {
  // Inputs as signals
  metrics: InputSignal<StudyMetrics | null> = input<StudyMetrics | null>(null);
  showSecondaryMetrics: InputSignal<boolean> = input<boolean>(false);

  // Base field signals for convenience
  totalStudies: Signal<number> = computed((): number => this.metrics()?.totalStudies ?? 0);
  activeStudies: Signal<number> = computed((): number => this.metrics()?.activeStudies ?? 0);
  completedStudies: Signal<number> = computed((): number => this.metrics()?.completedStudies ?? 0);
  totalParticipants: Signal<number> = computed(
    (): number => this.metrics()?.totalParticipants ?? 0,
  );
  averageEnrollmentRate: Signal<number> = computed(
    (): number => this.metrics()?.averageEnrollmentRate ?? 0,
  );

  // Derived/computed signals
  activeStudiesPercentage: Signal<number> = computed((): number => {
    const total: number = this.totalStudies();
    const active: number = this.activeStudies();
    if (total === 0) return 0;
    return Math.round((active / total) * 100);
  });

  enrollmentColor: Signal<string> = computed(() => {
    const rate: number = this.averageEnrollmentRate();
    if (rate >= 85) return '#10b981'; // green
    if (rate >= 70) return '#f59e0b'; // yellow
    if (rate >= 50) return '#f97316'; // orange
    return '#ef4444'; // red
  });

  enrollmentStatus: Signal<string> = computed(() => {
    const rate: number = this.averageEnrollmentRate();
    if (rate >= 85) return 'Excellent';
    if (rate >= 70) return 'Good';
    if (rate >= 50) return 'Needs Attention';
    return 'Critical';
  });

  planningStudiesCount: Signal<number> = computed((): number => {
    const total: number = this.totalStudies();
    const active: number = this.activeStudies();
    const completed: number = this.completedStudies();
    return Math.max(0, total - active - completed);
  });

  recruitmentRate: Signal<string> = computed((): string => {
    const participants: number = this.totalParticipants();
    const active: number = this.activeStudies() || 1; // avoid divide by zero
    const avgPerStudy: number = Math.round(participants / active);
    return `${avgPerStudy}`;
  });

  // Utility
  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  formattedTotalParticipants: Signal<string> = computed((): string =>
    this.formatNumber(this.totalParticipants()),
  );
}
