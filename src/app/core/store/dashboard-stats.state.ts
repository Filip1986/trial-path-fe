import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import {
  SetDashboardStats,
  UpdateActiveUsers,
  UpdatePendingUpdates,
  UpdateReports,
  UpdateUserCount,
} from './dashboard-stats.actions';

export interface DashboardStateModel {
  userCount: number;
  activeUsers: number;
  reports: number;
  pendingUpdates: number;
}

@State<DashboardStateModel>({
  name: 'dashboard',
  defaults: {
    userCount: 0,
    activeUsers: 0,
    reports: 0,
    pendingUpdates: 0,
  },
})
@Injectable()
export class DashboardState {
  @Selector()
  static getStats(state: DashboardStateModel): DashboardStateModel {
    return state;
  }

  @Action(SetDashboardStats)
  setDashboardStats(ctx: StateContext<DashboardStateModel>, action: SetDashboardStats): void {
    ctx.patchState(action.payload);
  }

  @Action(UpdateUserCount)
  updateUserCount(ctx: StateContext<DashboardStateModel>, action: UpdateUserCount): void {
    ctx.patchState({ userCount: action.payload });
  }

  @Action(UpdateActiveUsers)
  updateActiveUsers(ctx: StateContext<DashboardStateModel>, action: UpdateActiveUsers): void {
    ctx.patchState({ activeUsers: action.payload });
  }

  @Action(UpdateReports)
  updateReports(ctx: StateContext<DashboardStateModel>, action: UpdateReports): void {
    ctx.patchState({ reports: action.payload });
  }

  @Action(UpdatePendingUpdates)
  updatePendingUpdates(ctx: StateContext<DashboardStateModel>, action: UpdatePendingUpdates): void {
    ctx.patchState({ pendingUpdates: action.payload });
  }
}
