import { ParticipantFilters } from '../../../participants/models/interfaces';

export class ToggleParticipantsFilter {
  static readonly type = '[Participants] Toggle Filter';
}

export class SetParticipantsFilterOpen {
  static readonly type = '[Participants] Set Filter Open';
  constructor(public payload: boolean) {}
}

export class SetParticipantsFilters {
  static readonly type = '[Participants] Set Filters';
  constructor(public payload: ParticipantFilters) {}
}

export class ClearParticipantsFilters {
  static readonly type = '[Participants] Clear Filters';
}

export class UpdateParticipantsSearchFilter {
  static readonly type = '[Participants] Update Search Filter';
  constructor(public payload: string) {}
}

export class UpdateParticipantsStudyFilter {
  static readonly type = '[Participants] Update Study Filter';
  constructor(public payload: string) {}
}

export class UpdateParticipantsStatusFilter {
  static readonly type = '[Participants] Update Status Filter';
  constructor(public payload: string) {}
}

export class UpdateParticipantsGenderFilter {
  static readonly type = '[Participants] Update Gender Filter';
  constructor(public payload: string) {}
}
