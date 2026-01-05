import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { StudyApiService } from './study-api.service';
import { Study } from '../models/interfaces/study.interface';
import { StudyMetrics } from '../models/interfaces/study-metrics.interface';
import { StudyFilters } from '../models/interfaces/study-filters.interface';

@Injectable({
  providedIn: 'root',
})
export class StudyStateService {
  private studiesSubject = new BehaviorSubject<Study[]>([]);
  // Selectors
  studies$ = this.studiesSubject.asObservable();
  metrics$: Observable<StudyMetrics> = this.studies$.pipe(
    map((studies) => this.calculateMetrics(studies)),
  );
  private selectedStudySubject = new BehaviorSubject<Study | null>(null);
  selectedStudy$ = this.selectedStudySubject.asObservable();
  private filtersSubject = new BehaviorSubject<StudyFilters>({});
  filters$ = this.filtersSubject.asObservable();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  private errorSubject = new BehaviorSubject<string | null>(null);
  error$ = this.errorSubject.asObservable();

  constructor(private studyApiService: StudyApiService) {}

  // Actions
  loadStudies(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.studyApiService
      .getStudies()
      .pipe(
        tap((studies) => {
          this.studiesSubject.next(studies);
          this.loadingSubject.next(false);
        }),
        catchError((error) => {
          this.errorSubject.next('Failed to load studies');
          this.loadingSubject.next(false);
          return [];
        }),
      )
      .subscribe();
  }

  selectStudy(studyId: string): void {
    const studies = this.studiesSubject.value;
    const study = studies.find((s) => s.id === studyId);
    this.selectedStudySubject.next(study || null);
  }

  // Enhanced method to set initial filters (for query parameters)
  setInitialFilters(filters: Partial<StudyFilters>): void {
    const currentFilters = this.filtersSubject.value;
    const newFilters = { ...currentFilters, ...filters };
    this.filtersSubject.next(newFilters);
  }

  // Method to update specific filter with immediate effect
  updateStatusFilterImmediate(status: string): void {
    const currentFilters = this.filtersSubject.value;
    this.filtersSubject.next({
      ...currentFilters,
      status,
    });
  }

  // Method to check if filters are applied from navigation
  getActiveFilters(): StudyFilters {
    return this.filtersSubject.value;
  }

  updateFilters(filters: StudyFilters): void {
    this.filtersSubject.next(filters);
  }

  clearFilters(): void {
    this.filtersSubject.next({});
  }

  addStudy(study: Study): void {
    const currentStudies = this.studiesSubject.value;
    this.studiesSubject.next([study, ...currentStudies]);
  }

  updateStudy(updatedStudy: Study): void {
    const currentStudies = this.studiesSubject.value;
    const updatedStudies = currentStudies.map((study) =>
      study.id === updatedStudy.id ? updatedStudy : study,
    );
    this.studiesSubject.next(updatedStudies);
  }

  removeStudy(studyId: string): void {
    const currentStudies = this.studiesSubject.value;
    const filteredStudies = currentStudies.filter((study) => study.id !== studyId);
    this.studiesSubject.next(filteredStudies);
  }

  private calculateMetrics(studies: Study[]): StudyMetrics {
    return {
      totalStudies: studies.length,
      activeStudies: studies.filter((s) => s.status === 'active' || s.status === 'recruiting')
        .length,
      completedStudies: studies.filter((s) => s.status === 'completed').length,
      totalParticipants: studies.reduce((sum, study) => sum + study.currentEnrollment, 0),
      averageEnrollmentRate: this.calculateAverageEnrollmentRate(studies),
    };
  }

  private calculateAverageEnrollmentRate(studies: Study[]): number {
    if (studies.length === 0) return 0;

    const totalRate = studies.reduce((sum, study) => {
      const rate =
        study.plannedEnrollment > 0 ? (study.currentEnrollment / study.plannedEnrollment) * 100 : 0;
      return sum + rate;
    }, 0);

    return Math.round(totalRate / studies.length);
  }
}
