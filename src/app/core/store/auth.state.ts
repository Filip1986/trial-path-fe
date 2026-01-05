import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { SetUser, SetUsername, SetEmailConfirmed, SetUserEmail } from './auth.actions';
import { UserRole } from '../models/roles';

export interface UserDetails {
  id: number;
  username: string;
  createdAt?: Date;
  email: string;
  role: UserRole;
  isEmailConfirmed: boolean;
  isSuspended?: boolean;
  suspensionReason?: string;
  needsPrivacyPolicyAcceptance?: boolean;
  latestPrivacyPolicyVersion?: string;
  privacyPolicyVersion?: string;
  isBetaTester?: boolean;
}

export interface AuthStateModel {
  user: UserDetails | null;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    user: null,
  },
})
@Injectable()
export class AuthState {
  @Selector()
  static getUser(state: AuthStateModel): UserDetails | null {
    return state.user;
  }

  @Selector()
  static getUserEmail(state: AuthStateModel): string {
    return state.user?.email || '';
  }

  @Selector()
  static getUserRole(state: AuthStateModel): string | undefined {
    return state.user?.role;
  }

  @Selector()
  static isEmailConfirmed(state: AuthStateModel): boolean {
    return state.user?.isEmailConfirmed ?? false;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel): boolean {
    return !!state.user;
  }

  @Selector()
  static needsPrivacyPolicyAcceptance(state: AuthStateModel): boolean {
    return state.user?.needsPrivacyPolicyAcceptance ?? false;
  }

  @Action(SetUsername)
  setUsername(ctx: StateContext<AuthStateModel>, action: SetUsername): void {
    const state: AuthStateModel = ctx.getState();
    if (state.user) {
      ctx.setState({
        ...state,
        user: {
          ...state.user,
          username: action.payload,
        },
      });
    }
  }

  @Action(SetUserEmail)
  setUserEmail(ctx: StateContext<AuthStateModel>, action: SetUserEmail): void {
    const state: AuthStateModel = ctx.getState();
    if (state.user) {
      ctx.setState({
        ...state,
        user: {
          ...state.user,
          email: action.payload,
        },
      });
    }
  }

  @Action(SetUser)
  setUser(ctx: StateContext<AuthStateModel>, action: SetUser): void {
    const state: AuthStateModel = ctx.getState();
    ctx.setState({
      ...state,
      user: action.payload,
    });
  }

  @Action(SetEmailConfirmed)
  setEmailConfirmed(ctx: StateContext<AuthStateModel>, action: SetEmailConfirmed): void {
    const state: AuthStateModel = ctx.getState();
    if (state.user) {
      ctx.setState({
        ...state,
        user: {
          ...state.user,
          isEmailConfirmed: action.payload,
        },
      });
    }
  }
}
