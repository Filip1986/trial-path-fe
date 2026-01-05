import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import {
  ToggleStudiesFilter,
  SetStudiesFilterOpen,
  SetStudiesFilters,
  ClearStudiesFilters,
  UpdateStudiesSearchFilter,
  UpdateStudiesStatusFilter,
  UpdateStudiesPhaseFilter,
  UpdateStudiesTherapeuticAreasFilter,
} from './studies.actions';

// Import your existing StudyFilters interface
interface StudyFilters {
  search?: string;
  status?: string;
  phase?: string;
  therapeuticAreas?: string[];
}

export interface StudiesStateModel {
  filterOpen: boolean;
  filters: StudyFilters;
}

@State<StudiesStateModel>({
  name: 'studies',
  defaults: {
    filterOpen: true, // Default to open
    filters: {
      search: '',
      status: '',
      phase: '',
      therapeuticAreas: [],
    },
  },
})
@Injectable()
export class StudiesState {
  // Selectors
  @Selector()
  static isFilterOpen(state: StudiesStateModel): boolean {
    return state.filterOpen;
  }

  @Selector()
  static getFilters(state: StudiesStateModel): StudyFilters {
    return state.filters;
  }

  @Selector()
  static getSearchFilter(state: StudiesStateModel): string {
    return state.filters.search || '';
  }

  @Selector()
  static getStatusFilter(state: StudiesStateModel): string {
    return state.filters.status || '';
  }

  @Selector()
  static getPhaseFilter(state: StudiesStateModel): string {
    return state.filters.phase || '';
  }

  @Selector()
  static getTherapeuticAreasFilter(state: StudiesStateModel): string[] {
    return state.filters.therapeuticAreas || [];
  }

  @Selector()
  static hasActiveFilters(state: StudiesStateModel): boolean {
    const filters = state.filters;
    return !!(
      filters.search ||
      filters.status ||
      filters.phase ||
      (filters.therapeuticAreas && filters.therapeuticAreas.length > 0)
    );
  }

  @Selector()
  static getFilterState(state: StudiesStateModel) {
    return {
      filterOpen: state.filterOpen,
      filters: state.filters,
      hasActiveFilters: !!(
        state.filters.search ||
        state.filters.status ||
        state.filters.phase ||
        (state.filters.therapeuticAreas && state.filters.therapeuticAreas.length > 0)
      ),
    };
  }

  // Action handlers
  @Action(ToggleStudiesFilter)
  toggleFilter(ctx: StateContext<StudiesStateModel>): void {
    const state = ctx.getState();
    ctx.patchState({
      filterOpen: !state.filterOpen,
    });
  }

  @Action(SetStudiesFilterOpen)
  setFilterOpen(ctx: StateContext<StudiesStateModel>, action: SetStudiesFilterOpen): void {
    ctx.patchState({
      filterOpen: action.payload,
    });
  }

  @Action(SetStudiesFilters)
  setFilters(ctx: StateContext<StudiesStateModel>, action: SetStudiesFilters): void {
    ctx.patchState({
      filters: { ...action.payload },
    });
  }

  @Action(ClearStudiesFilters)
  clearFilters(ctx: StateContext<StudiesStateModel>): void {
    ctx.patchState({
      filters: {
        search: '',
        status: '',
        phase: '',
        therapeuticAreas: [],
      },
    });
  }

  @Action(UpdateStudiesSearchFilter)
  updateSearchFilter(
    ctx: StateContext<StudiesStateModel>,
    action: UpdateStudiesSearchFilter,
  ): void {
    const state = ctx.getState();
    ctx.patchState({
      filters: {
        ...state.filters,
        search: action.payload,
      },
    });
  }

  @Action(UpdateStudiesStatusFilter)
  updateStatusFilter(
    ctx: StateContext<StudiesStateModel>,
    action: UpdateStudiesStatusFilter,
  ): void {
    const state = ctx.getState();
    ctx.patchState({
      filters: {
        ...state.filters,
        status: action.payload,
      },
    });
  }

  @Action(UpdateStudiesPhaseFilter)
  updatePhaseFilter(ctx: StateContext<StudiesStateModel>, action: UpdateStudiesPhaseFilter): void {
    const state = ctx.getState();
    ctx.patchState({
      filters: {
        ...state.filters,
        phase: action.payload,
      },
    });
  }

  @Action(UpdateStudiesTherapeuticAreasFilter)
  updateTherapeuticAreasFilter(
    ctx: StateContext<StudiesStateModel>,
    action: UpdateStudiesTherapeuticAreasFilter,
  ): void {
    const state = ctx.getState();
    ctx.patchState({
      filters: {
        ...state.filters,
        therapeuticAreas: [...action.payload],
      },
    });
  }
}
