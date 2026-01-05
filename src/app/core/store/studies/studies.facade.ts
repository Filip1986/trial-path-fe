import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { StudiesState } from './studies.state';
import {
  ClearStudiesFilters,
  SetStudiesFilterOpen,
  SetStudiesFilters,
  ToggleStudiesFilter,
  UpdateStudiesPhaseFilter,
  UpdateStudiesSearchFilter,
  UpdateStudiesStatusFilter,
  UpdateStudiesTherapeuticAreasFilter,
} from './studies.actions';

// Import your existing StudyFilters interface
interface StudyFilters {
  search?: string;
  status?: string;
  phase?: string;
  therapeuticAreas?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class StudiesFacade {
  // Observables
  filterOpen$;
  filters$;
  searchFilter$;
  statusFilter$;
  phaseFilter$;
  therapeuticAreasFilter$;
  hasActiveFilters$;
  filterState$;

  constructor(private store: Store) {
    this.filterOpen$ = this.store.select(StudiesState.isFilterOpen);
    this.filters$ = this.store.select(StudiesState.getFilters);
    this.searchFilter$ = this.store.select(StudiesState.getSearchFilter);
    this.statusFilter$ = this.store.select(StudiesState.getStatusFilter);
    this.phaseFilter$ = this.store.select(StudiesState.getPhaseFilter);
    this.therapeuticAreasFilter$ = this.store.select(StudiesState.getTherapeuticAreasFilter);
    this.hasActiveFilters$ = this.store.select(StudiesState.hasActiveFilters);
    this.filterState$ = this.store.select(StudiesState.getFilterState);
  }

  // Filter visibility methods
  toggleFilter(): void {
    this.store.dispatch(new ToggleStudiesFilter());
  }

  setFilterOpen(isOpen: boolean): void {
    this.store.dispatch(new SetStudiesFilterOpen(isOpen));
  }

  openFilter(): void {
    this.setFilterOpen(true);
  }

  closeFilter(): void {
    this.setFilterOpen(false);
  }

  // Filter value methods
  setFilters(filters: StudyFilters): void {
    this.store.dispatch(new SetStudiesFilters(filters));
  }

  clearFilters(): void {
    this.store.dispatch(new ClearStudiesFilters());
  }

  updateSearchFilter(search: string): void {
    this.store.dispatch(new UpdateStudiesSearchFilter(search));
  }

  updateStatusFilter(status: string): void {
    this.store.dispatch(new UpdateStudiesStatusFilter(status));
  }

  updatePhaseFilter(phase: string): void {
    this.store.dispatch(new UpdateStudiesPhaseFilter(phase));
  }

  updateTherapeuticAreasFilter(therapeuticAreas: string[]): void {
    this.store.dispatch(new UpdateStudiesTherapeuticAreasFilter(therapeuticAreas));
  }

  // Snapshot methods (use sparingly)
  getCurrentFilterState(): boolean {
    return this.store.selectSnapshot(StudiesState.isFilterOpen);
  }

  getCurrentFilters(): StudyFilters {
    return this.store.selectSnapshot(StudiesState.getFilters);
  }

  getCurrentSearchFilter(): string {
    return this.store.selectSnapshot(StudiesState.getSearchFilter);
  }

  hasActiveFiltersSnapshot(): boolean {
    return this.store.selectSnapshot(StudiesState.hasActiveFilters);
  }
}
