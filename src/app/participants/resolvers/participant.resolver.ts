import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Participant } from '../models/interfaces/participant.interface';
import { ParticipantStatus } from '../models/enums/participant-status.enum';

export const participantResolver: ResolveFn<Participant> = (
  route: ActivatedRouteSnapshot,
): Observable<Participant> => {
  const participantId = route.params['id'];

  // Mock data - replace with actual service call
  const mockParticipant: Participant = {
    id: 1,
    participantId: 'P001',
    firstName: 'John',
    lastName: 'Doe',
    middleName: 'Michael',
    dateOfBirth: new Date('1985-03-15'),
    gender: 'Male',
    ethnicity: 'Hispanic or Latino',
    race: ['White', 'American Indian or Alaska Native'],
    email: 'john.doe@email.com',
    phone: '+1-555-123-4567',
    alternatePhone: '+1-555-987-6543',

    // Updated address structure - supporting both formats
    address: {
      street: '123 Main Street',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      country: 'United States',
    },

    // Keep individual fields for backward compatibility
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701',
    country: 'United States',

    height: 180, // cm
    weight: 75, // kg
    bloodType: 'O+',
    allergies: 'Penicillin, Shellfish',
    currentMedications: 'Lisinopril 10mg daily, Metformin 500mg twice daily',
    medicalHistory: ['Hypertension', 'Type 2 Diabetes'], // Array format

    // Study information
    studyId: 'STUDY-001',
    studyTitle: 'Phase II Clinical Trial for Hypertension Treatment', // Added studyTitle
    enrollmentDate: new Date('2024-01-15'),
    randomizationGroup: 'Treatment Group A',
    status: ParticipantStatus.ACTIVE,

    // Emergency contact - supporting both structures
    emergencyContactName: 'Jane Doe',
    emergencyContactPhone: '+1-555-111-2222',
    emergencyContactRelationship: 'Spouse',
    emergencyContact: {
      name: 'Jane Doe',
      phone: '+1-555-111-2222',
      relationship: 'Spouse',
    },

    maritalStatus: 'Married',
    educationLevel: "Bachelor's Degree",
    occupation: 'Software Engineer',
    insuranceProvider: 'Blue Cross Blue Shield',
    primaryPhysician: 'Dr. Smith',
    informedConsentSigned: true,
    eligibilityCriteriaMet: true,
    hipaaConsentSigned: true,
    willingStoUseContraception: true,

    // Visit tracking
    lastVisit: new Date('2024-06-15'), // Added lastVisit

    notes: 'Patient is compliant with medication regimen. No adverse events reported.',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-06-15'),
  };

  return of(mockParticipant);
};
