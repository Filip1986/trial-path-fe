import { ParticipantStatus } from '../enums/participant-status.enum';

export type ScreeningStatus =
  | ScreeningStatusEnum.PENDING
  | ScreeningStatusEnum.IN_REVIEW
  | ScreeningStatusEnum.ELIGIBLE
  | ScreeningStatusEnum.INELIGIBLE
  | ScreeningStatusEnum.WITHDRAWN
  | ScreeningStatusEnum.SCREENING
  | ScreeningStatusEnum.UNDER_REVIEW
  | ScreeningStatusEnum.ENROLLED
  | ScreeningStatusEnum.DECLINED;

export enum ScreeningStatusEnum {
  PENDING = 'pending',
  IN_REVIEW = 'in_review',
  ELIGIBLE = 'eligible',
  INELIGIBLE = 'ineligible',
  WITHDRAWN = 'withdrawn',
  SCREENING = 'screening',
  UNDER_REVIEW = 'under_review',
  ENROLLED = 'enrolled',
  DECLINED = 'declined',
}

export type EligibilityCriteria = {
  ageRequirement: boolean;
  medicalHistory: boolean;
  consentObtained: boolean;
  screeningComplete: boolean;
};

export interface ScreeningParticipant {
  id: number;
  participantId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  ethnicity: string;
  race: string[];
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  height: number;
  weight: number;
  bloodType: string;
  studyId: string;
  enrollmentDate: Date;
  randomizationGroup: string;
  status: ParticipantStatus;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  maritalStatus: string;
  educationLevel: string;
  informedConsentSigned: boolean;
  eligibilityCriteriaMet: boolean;
  hipaaConsentSigned: boolean;
  createdAt: Date;
  updatedAt: Date;
  screeningStatus: ScreeningStatusEnum;
  studyTitle: string;
  eligibilityCriteria: EligibilityCriterion;
  consentStatus: string;
}

export interface EligibilityCriterion {
  id: string;
  criterion: string;
  type: 'inclusion' | 'exclusion';
  met: boolean | null;
  notes?: string;
  ageRequirement: number;
  medicalHistory: boolean;
  consentObtained: boolean;
  screeningComplete: boolean;
}

export interface Study {
  label: string;
  value: string;
}
