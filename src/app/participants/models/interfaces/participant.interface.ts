import { ParticipantStatus } from '../enums/participant-status.enum';

export interface Participant {
  id: number;
  participantId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date;
  gender: string;
  ethnicity: string;
  race: string[];
  email: string;
  phone: string;
  alternatePhone?: string;

  // Address can be either a string or an object - updated to support both
  address:
    | string
    | {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
      };

  // Keep individual address fields for backward compatibility
  city: string;
  state: string;
  zipCode: string;
  country: string;

  height?: number; // cm
  weight?: number; // kg
  bloodType?: string;
  allergies?: string;
  currentMedications?: string;
  medicalHistory?: string | string[]; // Updated to support both string and array

  // Study-related fields
  studyId: string;
  studyTitle?: string; // Added missing studyTitle property
  enrollmentDate: Date;
  randomizationGroup?: string;
  status: ParticipantStatus;

  // Emergency contact - updated to support both flat structure and object
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };

  maritalStatus?: string;
  educationLevel?: string;
  occupation?: string;
  insuranceProvider?: string;
  primaryPhysician?: string;
  informedConsentSigned: boolean;
  eligibilityCriteriaMet: boolean;
  hipaaConsentSigned: boolean;
  willingStoUseContraception?: boolean;

  // Timeline and visit tracking
  lastVisit?: Date; // Added missing lastVisit property

  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ParticipantStats {
  total: number;
  active: number;
  screening: number;
  completed: number;
}

export interface ParticipantFilters {
  search?: string;
  study?: string;
  status?: string;
}
