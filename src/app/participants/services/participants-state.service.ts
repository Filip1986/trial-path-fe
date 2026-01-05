import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { ParticipantDataService } from './participant-data.service';
import { Participant } from '../models/interfaces';
import { ParticipantMetrics } from '../models/interfaces/participant-dashboard.interface';
import { ParticipantStatus } from '../models/enums/participant-status.enum';

@Injectable({
  providedIn: 'root',
})
export class ParticipantStateService {
  private participantDataService = inject(ParticipantDataService);

  // State subjects
  private participantsSubject = new BehaviorSubject<Participant[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  private metricsSubject = new BehaviorSubject<ParticipantMetrics | null>(null);

  // Public observables
  readonly participants$ = this.participantsSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();
  readonly metrics$ = this.metricsSubject.asObservable();

  // Computed observables
  readonly activeParticipants$ = this.participants$.pipe(
    map((participants) => participants.filter((p) => p.status === ParticipantStatus.ACTIVE)),
  );

  readonly screeningParticipants$ = this.participants$.pipe(
    map((participants) => participants.filter((p) => p.status === ParticipantStatus.SCREENING)),
  );

  readonly completedParticipants$ = this.participants$.pipe(
    map((participants) => participants.filter((p) => p.status === ParticipantStatus.COMPLETED)),
  );

  readonly withdrawnParticipants$ = this.participants$.pipe(
    map((participants) => participants.filter((p) => p.status === ParticipantStatus.WITHDRAWN)),
  );

  // Getters for current state
  get participants(): Participant[] {
    return this.participantsSubject.value;
  }

  get loading(): boolean {
    return this.loadingSubject.value;
  }

  get error(): string | null {
    return this.errorSubject.value;
  }

  get metrics(): ParticipantMetrics | null {
    return this.metricsSubject.value;
  }

  /**
   * Load all participants
   */
  loadParticipants(): void {
    this.setLoading(true);
    this.clearError();

    this.participantDataService
      .getParticipants()
      .pipe(
        catchError((error) => {
          this.setError('Failed to load participants: ' + error.message);
          return [];
        }),
        finalize(() => this.setLoading(false)),
      )
      .subscribe((participants) => {
        this.participantsSubject.next(participants);
      });
  }

  /**
   * Load participant metrics
   */
  loadMetrics(): void {
    combineLatest([this.participants$, this.participantDataService.getStudies()])
      .pipe(map(([participants, studies]) => this.calculateMetrics(participants, studies)))
      .subscribe((metrics) => {
        this.metricsSubject.next(metrics);
      });
  }

  /**
   * Get participant by ID
   */
  getParticipantById(id: string): Observable<Participant | undefined> {
    return this.participants$.pipe(
      map((participants) => participants.find((p) => p.participantId === id)),
    );
  }

  /**
   * Get participants by study ID
   */
  getParticipantsByStudy(studyId: string): Observable<Participant[]> {
    return this.participants$.pipe(
      map((participants) => participants.filter((p) => p.studyId === studyId)),
    );
  }

  /**
   * Add new participant
   */
  addParticipant(participant: Participant): void {
    const currentParticipants = this.participants;
    const updatedParticipants = [...currentParticipants, participant];
    this.participantsSubject.next(updatedParticipants);
    this.loadMetrics(); // Recalculate metrics
  }

  /**
   * Update existing participant
   */
  updateParticipant(updatedParticipant: Participant): void {
    const currentParticipants = this.participants;
    const index = currentParticipants.findIndex((p) => p.id === updatedParticipant.id);

    if (index > -1) {
      const updatedParticipants = [...currentParticipants];
      updatedParticipants[index] = { ...updatedParticipant, updatedAt: new Date() };
      this.participantsSubject.next(updatedParticipants);
      this.loadMetrics(); // Recalculate metrics
    }
  }

  /**
   * Delete participant
   */
  deleteParticipant(participantId: number): void {
    const currentParticipants = this.participants;
    const updatedParticipants = currentParticipants.filter((p) => p.id !== participantId);
    this.participantsSubject.next(updatedParticipants);
    this.loadMetrics(); // Recalculate metrics
  }

  /**
   * Filter participants
   */
  filterParticipants(filters: {
    search?: string;
    study?: string;
    status?: ParticipantStatus;
    gender?: string;
  }): Observable<Participant[]> {
    return this.participants$.pipe(
      map((participants) => {
        let filtered = participants;

        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.firstName.toLowerCase().includes(searchTerm) ||
              p.lastName.toLowerCase().includes(searchTerm) ||
              p.participantId.toLowerCase().includes(searchTerm) ||
              p.email.toLowerCase().includes(searchTerm),
          );
        }

        if (filters.study) {
          filtered = filtered.filter((p) => p.studyId === filters.study);
        }

        if (filters.status) {
          filtered = filtered.filter((p) => p.status === filters.status);
        }

        if (filters.gender) {
          filtered = filtered.filter((p) => p.gender === filters.gender);
        }

        return filtered;
      }),
    );
  }

  /**
   * Calculate participant metrics
   */
  private calculateMetrics(participants: Participant[], studies: any[]): ParticipantMetrics {
    const totalParticipants = participants.length;
    const activeParticipants = participants.filter(
      (p) => p.status === ParticipantStatus.ACTIVE,
    ).length;
    const screeningParticipants = participants.filter(
      (p) => p.status === ParticipantStatus.SCREENING,
    ).length;
    const completedParticipants = participants.filter(
      (p) => p.status === ParticipantStatus.COMPLETED,
    ).length;
    const withdrawnParticipants = participants.filter(
      (p) => p.status === ParticipantStatus.WITHDRAWN,
    ).length;

    // Calculate average age
    const today = new Date();
    const ages = participants.map((p) => {
      const birthDate = new Date(p.dateOfBirth);
      return today.getFullYear() - birthDate.getFullYear();
    });
    const averageAge =
      ages.length > 0 ? Math.round(ages.reduce((sum, age) => sum + age, 0) / ages.length) : 0;

    // Calculate enrollment rate (participants enrolled in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentEnrollments = participants.filter(
      (p) => new Date(p.enrollmentDate) >= thirtyDaysAgo,
    ).length;
    const enrollmentRate = Math.round((recentEnrollments / 30) * 100) / 100; // per day

    // Calculate retention rate
    const eligibleForCompletion = participants.filter(
      (p) => p.status === ParticipantStatus.ACTIVE || p.status === ParticipantStatus.COMPLETED,
    ).length;
    const retentionRate =
      eligibleForCompletion > 0
        ? Math.round(
            ((eligibleForCompletion - withdrawnParticipants) / eligibleForCompletion) * 100,
          )
        : 100;

    // Gender distribution
    const genderDistribution = {
      male: participants.filter((p) => p.gender === 'male').length,
      female: participants.filter((p) => p.gender === 'female').length,
      other: participants.filter((p) => p.gender !== 'male' && p.gender !== 'female').length,
    };

    // Status distribution
    const statusDistribution = {
      [ParticipantStatus.ACTIVE]: activeParticipants,
      [ParticipantStatus.SCREENING]: screeningParticipants,
      [ParticipantStatus.COMPLETED]: completedParticipants,
      [ParticipantStatus.WITHDRAWN]: withdrawnParticipants,
    };

    // Study distribution
    const studyDistribution = studies
      .map((study) => ({
        studyId: study.id,
        studyTitle: study.title,
        participantCount: participants.filter((p) => p.studyId === study.id).length,
      }))
      .filter((item) => item.participantCount > 0);

    return {
      totalParticipants,
      activeParticipants,
      screeningParticipants,
      completedParticipants,
      withdrawnParticipants,
      averageAge,
      enrollmentRate,
      retentionRate,
      genderDistribution,
      statusDistribution,
      studyDistribution,
    };
  }

  /**
   * Refresh all data
   */
  refresh(): void {
    this.loadParticipants();
  }

  /**
   * Reset state
   */
  reset(): void {
    this.participantsSubject.next([]);
    this.metricsSubject.next(null);
    this.clearError();
    this.setLoading(false);
  }

  // Private helper methods
  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  private setError(error: string): void {
    this.errorSubject.next(error);
  }

  private clearError(): void {
    this.errorSubject.next(null);
  }
}
