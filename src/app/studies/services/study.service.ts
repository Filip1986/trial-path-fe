import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { Study, StudyFilters, StudyMetrics } from '../models/interfaces';
import { StudyDataService } from './study-data.service';

@Injectable({
  providedIn: 'root',
})
export class StudyService {
  constructor(private dataService: StudyDataService) {}

  getStudies(filters?: StudyFilters): Observable<Study[]> {
    return this.dataService.getStudies().pipe(
      map((studies) => {
        if (!filters) return studies;

        return studies.filter((study) => {
          // Apply filtering logic here
          return true; // Implement your filtering logic
        });
      }),
      delay(300),
    );
  }

  getStudyStats(): Observable<StudyMetrics> {
    return this.dataService.getStudies().pipe(
      map((studies) => ({
        totalStudies: studies.length,
        activeStudies: studies.filter((s) => s.status === 'active').length,
        completedStudies: studies.filter((s) => s.status === 'completed').length,
        totalParticipants: studies.reduce((sum, s) => sum + s.currentEnrollment, 0),
        averageEnrollmentRate: 0, // Calculate as needed
      })),
    );
  }

  createStudy(studyData: Partial<Study>): Observable<Study> {
    // Implementation for creating study
    return of({} as Study).pipe(delay(1000));
  }
}
