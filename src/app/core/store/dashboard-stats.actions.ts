import { DashboardStateModel } from './dashboard-stats.state';

export class SetDashboardStats {
  static readonly type = '[Dashboard] Set Stats';
  constructor(public payload: DashboardStateModel) {}
}

export class UpdateUserCount {
  static readonly type = '[Dashboard] Update User Count';
  constructor(public payload: number) {}
}

export class UpdateActiveUsers {
  static readonly type = '[Dashboard] Update Active Users';
  constructor(public payload: number) {}
}

export class UpdateReports {
  static readonly type = '[Dashboard] Update Reports';
  constructor(public payload: number) {}
}

export class UpdatePendingUpdates {
  static readonly type = '[Dashboard] Update Pending Updates';
  constructor(public payload: number) {}
}
