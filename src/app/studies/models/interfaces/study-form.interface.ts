export interface CreateStudyData {
  // Basic Information
  title: string;
  shortTitle: string;
  description: string;
  objectives: string;

  // Study Classification
  studyType: string;
  phase: string;
  therapeuticArea: string[];
  indication: string;

  // Timeline
  plannedStartDate: Date | null;
  plannedEndDate: Date | null;
  enrollmentStartDate: Date | null;
  enrollmentEndDate: Date | null;

  // Study Design
  designType: string;
  interventionModel: string;
  primaryPurpose: string;
  masking: string;
  allocation: string;

  // Sample Size & Population
  plannedEnrollment: number | null;
  minimumAge: number | null;
  maximumAge: number | null;
  healthyVolunteers: boolean;
  genderBased: boolean;

  // Regulatory & Administrative
  protocolNumber: string;
  sponsorName: string;
  principalInvestigatorId: string;
  irbApprovalRequired: boolean;
  fdaIndRequired: boolean;
  gmpRequired: boolean;

  // Contact Information
  contactName: string;
  contactEmail: string;
  contactPhone: string;

  // Additional Settings
  isBlinded: boolean;
  allowDataExport: boolean;
  requireElectronicSignature: boolean;
  enableAuditTrail: boolean;
}
