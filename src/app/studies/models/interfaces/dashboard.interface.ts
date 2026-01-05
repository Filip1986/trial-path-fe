export interface DashboardCard {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  severity: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
}

export interface RecentActivity {
  id: string;
  type: 'enrollment' | 'status_change' | 'study_created' | 'milestone';
  message: string;
  timestamp: Date;
  studyId?: string;
  studyTitle?: string;
}

export interface StudyDetailTab {
  label: string;
  icon: string;
  id: string;
}

export interface TimelineEvent {
  status: string;
  date: string;
  icon: string;
  color: string;
  title: string;
  description?: string;
}

export interface StudyMetric {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  description?: string;
}
