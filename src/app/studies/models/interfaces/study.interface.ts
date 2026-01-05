import { StudyStatus } from '../enums/study-status.enum';

export interface Study {
  id: string;
  title: string;
  shortTitle: string;
  protocolNumber: string;
  phase: string;
  studyType: string;
  status: StudyStatus;
  therapeuticAreas: string[];
  indication: string;
  sponsorName: string;
  principalInvestigator: string;
  plannedStartDate: Date;
  plannedEndDate: Date;
  plannedEnrollment: number;
  currentEnrollment: number;
  sites: number;
  completedSites: number;
  createdDate: Date;
  lastModified: Date;
  createdBy: string;
  budget?: number;
  estimatedDuration?: number;
  primaryEndpoint?: string;
  secondaryEndpoints?: string[];
  inclusionCriteria?: string[];
  exclusionCriteria?: string[];
  riskLevel: 'low' | 'medium' | 'high';
}
