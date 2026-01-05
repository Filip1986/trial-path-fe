import { UserDetails } from './auth.state';

export class SetUsername {
  static readonly type = '[Auth] Set Username';
  constructor(public payload: string) {}
}

export class SetUserEmail {
  static readonly type = '[Auth] Set User Email';
  constructor(public payload: string) {}
}

export class SetUser {
  static readonly type = '[Auth] Set User';
  constructor(public payload: UserDetails | null) {}
}

export class SetEmailConfirmed {
  static readonly type = '[Auth] Set Email Confirmed';
  constructor(public payload: boolean) {}
}
