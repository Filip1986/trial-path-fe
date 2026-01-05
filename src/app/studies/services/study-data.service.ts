import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Study, StudyPhase, StudyType, StudyMetrics } from '../models/interfaces';
import { MOCK_STUDIES, MOCK_STUDY_METRICS } from '../data/mock';
import { STUDY_PHASE_OPTIONS, STUDY_TYPE_OPTIONS } from '../data/constants';

@Injectable({
  providedIn: 'root',
})
export class StudyDataService {
  getStudies(): Observable<Study[]> {
    return of(MOCK_STUDIES);
  }

  getStudyById(id: string): Observable<Study | undefined> {
    const study = MOCK_STUDIES.find((s) => s.id === id);
    return of(study);
  }

  getStudyTypes(): Observable<StudyType[]> {
    return of(STUDY_TYPE_OPTIONS);
  }

  getStudyPhases(): Observable<StudyPhase[]> {
    return of(STUDY_PHASE_OPTIONS);
  }

  getStudyMetrics(): Observable<StudyMetrics> {
    return of(MOCK_STUDY_METRICS);
  }
}
