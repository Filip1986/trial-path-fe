import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import {
  ToggleParticipantsFilter,
  SetParticipantsFilterOpen,
  SetParticipantsFilters,
  ClearParticipantsFilters,
  UpdateParticipantsSearchFilter,
  UpdateParticipantsStudyFilter,
  UpdateParticipantsStatusFilter,
  UpdateParticipantsGenderFilter,
} from './participants.actions';

// Import your existing ParticipantFilters interface
interface ParticipantFilters {
  search?: string;
  study?: string;
  status?: string;
  gender?: string;
}

export interface ParticipantsStateModel {
  filterOpen: boolean;
  filters: ParticipantFilters;
}

@State<ParticipantsStateModel>({
  name: 'participants',
  defaults: {
    filterOpen: true, // Default to open
    filters: {
      search: '',
      study: '',
      status: '',
      gender: '',
    },
  },
})
@Injectable()
export class ParticipantsState {
  // Selectors
  @Selector()
  static isFilterOpen(state: ParticipantsStateModel): boolean {
    return state.filterOpen;
  }

  @Selector()
  static getFilters(state: ParticipantsStateModel): ParticipantFilters {
    return state.filters;
  }

  @Selector()
  static getSearchFilter(state: ParticipantsStateModel): string {
    return state.filters.search || '';
  }

  @Selector()
  static getStudyFilter(state: ParticipantsStateModel): string {
    return state.filters.study || '';
  }

  @Selector()
  static getStatusFilter(state: ParticipantsStateModel): string {
    return state.filters.status || '';
  }

  @Selector()
  static getGenderFilter(state: ParticipantsStateModel): string {
    return state.filters.gender || '';
  }

  @Selector()
  static hasActiveFilters(state: ParticipantsStateModel): boolean {
    const filters = state.filters;
    return !!(filters.search || filters.study || filters.status || filters.gender);
  }

  @Selector()
  static getFilterState(state: ParticipantsStateModel) {
    return {
      filterOpen: state.filterOpen,
      filters: state.filters,
      hasActiveFilters: !!(
        state.filters.search ||
        state.filters.study ||
        state.filters.status ||
        state.filters.gender
      ),
    };
  }

  // Action handlers
  @Action(ToggleParticipantsFilter)
  toggleFilter(ctx: StateContext<ParticipantsStateModel>): void {
    const state = ctx.getState();
    ctx.patchState({
      filterOpen: !state.filterOpen,
    });
  }

  @Action(SetParticipantsFilterOpen)
  setFilterOpen(
    ctx: StateContext<ParticipantsStateModel>,
    action: SetParticipantsFilterOpen,
  ): void {
    ctx.patchState({
      filterOpen: action.payload,
    });
  }

  @Action(SetParticipantsFilters)
  setFilters(ctx: StateContext<ParticipantsStateModel>, action: SetParticipantsFilters): void {
    ctx.patchState({
      filters: { ...action.payload },
    });
  }

  @Action(ClearParticipantsFilters)
  clearFilters(ctx: StateContext<ParticipantsStateModel>): void {
    ctx.patchState({
      filters: {
        search: '',
        study: '',
        status: '',
        gender: '',
      },
    });
  }

  @Action(UpdateParticipantsSearchFilter)
  updateSearchFilter(
    ctx: StateContext<ParticipantsStateModel>,
    action: UpdateParticipantsSearchFilter,
  ): void {
    const state = ctx.getState();
    ctx.patchState({
      filters: {
        ...state.filters,
        search: action.payload,
      },
    });
  }

  @Action(UpdateParticipantsStudyFilter)
  updateStudyFilter(
    ctx: StateContext<ParticipantsStateModel>,
    action: UpdateParticipantsStudyFilter,
  ): void {
    const state = ctx.getState();
    ctx.patchState({
      filters: {
        ...state.filters,
        study: action.payload,
      },
    });
  }

  @Action(UpdateParticipantsStatusFilter)
  updateStatusFilter(
    ctx: StateContext<ParticipantsStateModel>,
    action: UpdateParticipantsStatusFilter,
  ): void {
    const state = ctx.getState();
    ctx.patchState({
      filters: {
        ...state.filters,
        status: action.payload,
      },
    });
  }

  @Action(UpdateParticipantsGenderFilter)
  updateGenderFilter(
    ctx: StateContext<ParticipantsStateModel>,
    action: UpdateParticipantsGenderFilter,
  ): void {
    const state = ctx.getState();
    ctx.patchState({
      filters: {
        ...state.filters,
        gender: action.payload,
      },
    });
  }
}
