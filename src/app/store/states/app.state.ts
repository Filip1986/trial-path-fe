import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';

export interface AppStateModel {
  title: string;
}

export class SetTitle {
  static readonly type = '[App] Set Title';
  constructor(public title: string) {}
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    title: 'trial-path-fe'
  }
})
@Injectable()
export class AppState {
  @Selector()
  static getTitle(state: AppStateModel): string {
    return state.title;
  }

  @Action(SetTitle)
  setTitle(ctx: StateContext<AppStateModel>, action: SetTitle) {
    ctx.patchState({ title: action.title });
  }
}

