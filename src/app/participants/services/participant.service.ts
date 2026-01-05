import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Participant, ParticipantFilters, ParticipantStats } from '../models/interfaces';
import { ParticipantDataService } from './participant-data.service';
import { MOCK_PARTICIPANTS } from '../data/mock';
import { ScreeningParticipant } from '../models/interfaces/screening-participant.interface';

@Injectable({
  providedIn: 'root',
})
export class ParticipantService {
  constructor(private dataService: ParticipantDataService) {}

  /**
   * Get all participants with optional filtering
   */
  getParticipants(filters?: ParticipantFilters): Observable<Participant[]> {
    return this.dataService.getParticipants().pipe(
      map((participants) => {
        if (!filters) return participants;

        return participants.filter((participant) => {
          // Search filter
          const matchesSearch =
            !filters.search ||
            `${participant.firstName} ${participant.lastName}`
              .toLowerCase()
              .includes(filters.search.toLowerCase()) ||
            participant.participantId.toLowerCase().includes(filters.search.toLowerCase()) ||
            participant.email.toLowerCase().includes(filters.search.toLowerCase());

          // Study filter
          const matchesStudy = !filters.study || participant.studyId === filters.study;

          // Status filter
          const matchesStatus = !filters.status || participant.status === filters.status;

          return matchesSearch && matchesStudy && matchesStatus;
        });
      }),
      delay(300), // Simulate API delay
    );
  }

  /**
   * Get participant statistics
   */
  getParticipantStats(): Observable<ParticipantStats> {
    return this.dataService.getParticipants().pipe(
      map((participants) => ({
        total: participants.length,
        active: participants.filter((p) => p.status === 'active').length,
        screening: participants.filter((p) => p.status === 'screening').length,
        completed: participants.filter((p) => p.status === 'completed').length,
      })),
    );
  }

  getScreeningParticipants(): Observable<ScreeningParticipant[]> {
    return this.dataService.getScreeningParticipants().pipe(
      map((participants) =>
        participants.filter((participant) => participant.status === 'screening'),
      ),
      delay(300), // Simulate API delay
    );
  }

  /**
   * Create a new participant
   */
  createParticipant(participantData: Partial<Participant>): Observable<Participant> {
    // Simulate API call
    const newParticipant: Participant = {
      id: Math.max(...MOCK_PARTICIPANTS.map((p) => p.id)) + 1,
      participantId: `PART-${String(Date.now()).slice(-3).padStart(3, '0')}`,
      firstName: '',
      lastName: '',
      dateOfBirth: new Date(),
      gender: '',
      ethnicity: '',
      race: [],
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      studyId: '',
      enrollmentDate: new Date(),
      status: 'screening' as any,
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelationship: '',
      informedConsentSigned: false,
      eligibilityCriteriaMet: false,
      hipaaConsentSigned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...participantData,
    };

    return of(newParticipant).pipe(delay(1000));
  }

  /**
   * Update an existing participant
   */
  updateParticipant(id: number, updates: Partial<Participant>): Observable<Participant> {
    return this.dataService.getParticipantById(id).pipe(
      map((participant) => {
        if (!participant) {
          throw new Error('Participant not found');
        }
        return { ...participant, ...updates, updatedAt: new Date() };
      }),
      delay(500),
    );
  }

  /**
   * Delete a participant
   */
  deleteParticipant(id: number): Observable<boolean> {
    return of(true).pipe(delay(500));
  }
}
