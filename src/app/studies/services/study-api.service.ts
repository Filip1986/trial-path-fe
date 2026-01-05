import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { StudyStatus } from '../models/enums';
import { mockStudies } from '../data/mock';
import { Study } from '../models/interfaces/study.interface';
import { StudyFilters } from '../models/interfaces/study-filters.interface';

@Injectable({
  providedIn: 'root',
})
export class StudyApiService {
  getStudies(filters?: StudyFilters): Observable<Study[]> {
    // Simulate API call
    return of(mockStudies).pipe(delay(800));
  }

  getStudyById(id: string): Observable<Study | null> {
    const study = mockStudies.find((s: any) => s.id === id);
    return of(study || null).pipe(delay(300));
  }

  createStudy(studyData: Partial<Study>): Observable<Study> {
    const newStudy: Study = {
      id: Date.now().toString(),
      title: studyData.title || '',
      shortTitle: studyData.shortTitle || '',
      protocolNumber: studyData.protocolNumber || '',
      phase: studyData.phase || 'phase_1',
      studyType: studyData.studyType || '',
      status: studyData.status || StudyStatus.DRAFT,
      therapeuticAreas: studyData.therapeuticAreas || [],
      principalInvestigator: studyData.principalInvestigator || '',
      currentEnrollment: 0,
      sites: studyData.sites || 0,
      completedSites: 0,
      riskLevel: studyData.riskLevel || 'low',
      createdDate: new Date(),
      lastModified: new Date(),
      createdBy: 'current-user@example.com',
      indication: studyData.indication || '',
      sponsorName: studyData.sponsorName || '',
      plannedStartDate: studyData.plannedStartDate || new Date(),
      plannedEndDate: studyData.plannedEndDate || new Date(),
      plannedEnrollment: studyData.plannedEnrollment || 0,
    };

    mockStudies.push(newStudy);
    return of(newStudy).pipe(delay(500));
  }

  updateStudy(id: string, updates: Partial<Study>): Observable<Study | null> {
    const studyIndex = mockStudies.findIndex((s) => s.id === id);
    if (studyIndex === -1) {
      return of(null).pipe(delay(300));
    }

    mockStudies[studyIndex] = {
      ...mockStudies[studyIndex],
      ...updates,
      lastModified: new Date(),
    };

    return of(mockStudies[studyIndex]).pipe(delay(500));
  }

  deleteStudy(id: string): Observable<void> {
    const studyIndex = mockStudies.findIndex((s: any) => s.id === id);
    if (studyIndex !== -1) {
      mockStudies.splice(studyIndex, 1);
    }
    return of(void 0).pipe(delay(500));
  }
}
