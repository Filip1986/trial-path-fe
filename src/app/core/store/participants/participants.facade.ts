import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ParticipantsState } from './participants.state';
import {
  ClearParticipantsFilters,
  SetParticipantsFilterOpen,
  SetParticipantsFilters,
  ToggleParticipantsFilter,
  UpdateParticipantsGenderFilter,
  UpdateParticipantsSearchFilter,
  UpdateParticipantsStatusFilter,
  UpdateParticipantsStudyFilter,
} from './participants.actions';

// Import your existing ParticipantFilters interface
interface ParticipantFilters {
  search?: string;
  study?: string;
  status?: string;
  gender?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ParticipantsFacade {
  // Observables
  filterOpen$: Observable<boolean>;
  filters$: Observable<ParticipantFilters>;
  searchFilter$: Observable<string>;
  studyFilter$: Observable<string>;
  statusFilter$: Observable<string>;
  genderFilter$: Observable<string>;
  hasActiveFilters$: Observable<boolean>;
  filterState$: Observable<any>;

  constructor(private store: Store) {
    this.filterOpen$ = this.store.select(ParticipantsState.isFilterOpen);
    this.filters$ = this.store.select(ParticipantsState.getFilters);
    this.searchFilter$ = this.store.select(ParticipantsState.getSearchFilter);
    this.studyFilter$ = this.store.select(ParticipantsState.getStudyFilter);
    this.statusFilter$ = this.store.select(ParticipantsState.getStatusFilter);
    this.genderFilter$ = this.store.select(ParticipantsState.getGenderFilter);
    this.hasActiveFilters$ = this.store.select(ParticipantsState.hasActiveFilters);
    this.filterState$ = this.store.select(ParticipantsState.getFilterState);
  }

  // Filter visibility methods
  toggleFilter(): void {
    this.store.dispatch(new ToggleParticipantsFilter());
  }

  setFilterOpen(isOpen: boolean): void {
    this.store.dispatch(new SetParticipantsFilterOpen(isOpen));
  }

  openFilter(): void {
    this.setFilterOpen(true);
  }

  closeFilter(): void {
    this.setFilterOpen(false);
  }

  // Filter value methods
  setFilters(filters: ParticipantFilters): void {
    this.store.dispatch(new SetParticipantsFilters(filters));
  }

  clearFilters(): void {
    this.store.dispatch(new ClearParticipantsFilters());
  }

  updateSearchFilter(search: string): void {
    this.store.dispatch(new UpdateParticipantsSearchFilter(search));
  }

  updateStudyFilter(study: string): void {
    this.store.dispatch(new UpdateParticipantsStudyFilter(study));
  }

  updateStatusFilter(status: string): void {
    this.store.dispatch(new UpdateParticipantsStatusFilter(status));
  }

  updateGenderFilter(gender: string): void {
    this.store.dispatch(new UpdateParticipantsGenderFilter(gender));
  }

  // Snapshot methods (use sparingly)
  getCurrentFilterState(): boolean {
    return this.store.selectSnapshot(ParticipantsState.isFilterOpen);
  }

  getCurrentFilters(): ParticipantFilters {
    return this.store.selectSnapshot(ParticipantsState.getFilters);
  }

  getCurrentSearchFilter(): string {
    return this.store.selectSnapshot(ParticipantsState.getSearchFilter);
  }

  hasActiveFiltersSnapshot(): boolean {
    return this.store.selectSnapshot(ParticipantsState.hasActiveFilters);
  }
}
