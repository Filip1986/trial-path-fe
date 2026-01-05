import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { SetEmailBannerVisible } from './layout.actions';

export interface LayoutStateModel {
  emailBannerVisible: boolean;
  // You can add other UI-related flags here in the future
}

@State<LayoutStateModel>({
  name: 'layout',
  defaults: {
    emailBannerVisible: false,
  },
})
@Injectable()
export class LayoutState {
  /**
   * Selector to get the email banner visibility status
   * @param state The layout state
   * @returns Boolean indicating if the email confirmation banner is visible
   */
  @Selector()
  static isEmailBannerVisible(state: LayoutStateModel): boolean {
    return state.emailBannerVisible;
  }

  @Selector()
  static getSidenavExpanded(state: LayoutStateModel): boolean {
    return false;
  }

  /**
   * Action handler to update the email banner visibility
   * @param ctx The state context
   * @param action The action containing the visibility payload
   */
  @Action(SetEmailBannerVisible)
  setEmailBannerVisible(ctx: StateContext<LayoutStateModel>, action: SetEmailBannerVisible): void {
    ctx.patchState({
      emailBannerVisible: action.payload,
    });
  }
}
