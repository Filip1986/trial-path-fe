export interface ParticipantDashboardCard {
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

export interface RecentParticipantActivity {
  id: string;
  type: 'enrollment' | 'status_change' | 'visit_completed' | 'screening' | 'withdrawal';
  message: string;
  timestamp: Date;
  participantId?: string;
  participantName?: string;
  studyId?: string;
  studyTitle?: string;
}

export interface ParticipantDetailTab {
  label: string;
  icon: string;
  id: string;
}

export interface ParticipantTimelineEvent {
  status: string;
  date: string;
  icon: string;
  color: string;
  title: string;
  description?: string;
}

export interface ParticipantMetric {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  description?: string;
}

export interface ParticipantMetrics {
  totalParticipants: number;
  activeParticipants: number;
  screeningParticipants: number;
  completedParticipants: number;
  withdrawnParticipants: number;
  averageAge: number;
  enrollmentRate: number;
  retentionRate: number;
  genderDistribution: {
    male: number;
    female: number;
    other: number;
  };
  statusDistribution: {
    [key: string]: number;
  };
  studyDistribution: {
    studyId: string;
    studyTitle: string;
    participantCount: number;
  }[];
}

export interface ParticipantEnrollmentData {
  date: string;
  enrolled: number;
  screened: number;
  withdrawn: number;
}

export interface ParticipantStatusData {
  status: string;
  count: number;
  percentage: number;
}

export interface ParticipantDemographicsData {
  category: string;
  subcategory: string;
  count: number;
  percentage: number;
}
