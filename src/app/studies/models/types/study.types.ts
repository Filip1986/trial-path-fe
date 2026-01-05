export type StatusSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | undefined;

export type RiskLevel = 'low' | 'medium' | 'high';

export interface StudyType {
  label: string;
  value: string;
}

export interface StudyPhase {
  label: string;
  value: string;
}

export interface TherapeuticArea {
  label: string;
  value: string;
}

export interface FormStep {
  id: string;
  label: string;
  fields: string[];
  isValid: boolean;
  isCompleted: boolean;
}

export interface StudyFormData {
  // Study Information
  studyTitle: string;
  studyDescription: string;
  principalInvestigator: string;
  studyPhase: string;
  studyType: string;

  // Timeline
  startDate: Date | null;
  endDate: Date | null;
  expectedDuration: number | null;

  // Participant Information
  targetEnrollment: number | null;
  ageRange: string[];
  inclusionCriteria: string;
  exclusionCriteria: string;

  // Study Design
  randomized: boolean;
  blinded: boolean;
  controlType: string;
  primaryEndpoint: string;
  secondaryEndpoints: string;

  // Regulatory
  protocolNumber: string;
  irbApproval: boolean;
  fdaRegulated: boolean;
  goodClinicalPractice: boolean;

  // Contact Information
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;

  // Additional Notes
  specialRequirements: string;
  notes: string;
}
