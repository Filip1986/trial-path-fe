import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  GENDERS,
  ETHNICITIES,
  RACES,
  BLOOD_TYPES,
  MARITAL_STATUSES,
  EDUCATION_LEVELS,
  RANDOMIZATION_GROUPS,
  RELATIONSHIPS,
  COUNTRIES,
  MOCK_PARTICIPANTS,
} from '../data/mock';
import { mockStudies } from '../../studies/data/mock/studies.mock';
import {
  BloodType,
  Country,
  EducationLevel,
  Ethnicity,
  Gender,
  MaritalStatus,
  Participant,
  Race,
  RandomizationGroup,
  Relationship,
} from '../models/interfaces';
import { Study } from '../../studies/models/interfaces/study.interface';
import { ScreeningParticipant } from '../models/interfaces/screening-participant.interface';
import { MOCK_SCREENING_PARTICIPANTS } from '../data/mock/screening-participants.mock';

@Injectable({
  providedIn: 'root',
})
export class ParticipantDataService {
  // Form Options
  getGenders(): Observable<Gender[]> {
    return of(GENDERS);
  }

  getEthnicities(): Observable<Ethnicity[]> {
    return of(ETHNICITIES);
  }

  getRaces(): Observable<Race[]> {
    return of(RACES);
  }

  getBloodTypes(): Observable<BloodType[]> {
    return of(BLOOD_TYPES);
  }

  getMaritalStatuses(): Observable<MaritalStatus[]> {
    return of(MARITAL_STATUSES);
  }

  getEducationLevels(): Observable<EducationLevel[]> {
    return of(EDUCATION_LEVELS);
  }

  getRandomizationGroups(): Observable<RandomizationGroup[]> {
    return of(RANDOMIZATION_GROUPS);
  }

  getRelationships(): Observable<Relationship[]> {
    return of(RELATIONSHIPS);
  }

  getCountries(): Observable<Country[]> {
    return of(COUNTRIES);
  }

  // Studies
  getStudies(): Observable<Study[]> {
    return of(mockStudies);
  }

  getActiveStudies(): Observable<Study[]> {
    const activeStudies = mockStudies.filter((study) => study.status === 'recruiting');
    return of(activeStudies);
  }

  // Participants
  getParticipants(): Observable<Participant[]> {
    return of(MOCK_PARTICIPANTS);
  }

  getScreeningParticipants(): Observable<ScreeningParticipant[]> {
    const screeningParticipants = MOCK_SCREENING_PARTICIPANTS.filter(
      (participant) => participant.screeningStatus === 'screening',
    );
    return of(screeningParticipants);
  }

  getParticipantById(id: number): Observable<Participant | undefined> {
    const participant = MOCK_PARTICIPANTS.find((p) => p.id === id);
    return of(participant);
  }

  getParticipantsByStudy(studyId: string): Observable<Participant[]> {
    const participants = MOCK_PARTICIPANTS.filter((p) => p.studyId === studyId);
    return of(participants);
  }
}
