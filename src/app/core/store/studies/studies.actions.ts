import { StudyFilters } from '../../../studies/models/interfaces/study-filters.interface';

export class ToggleStudiesFilter {
  static readonly type = '[Studies] Toggle Filter';
}

export class SetStudiesFilterOpen {
  static readonly type = '[Studies] Set Filter Open';
  constructor(public payload: boolean) {}
}

export class SetStudiesFilters {
  static readonly type = '[Studies] Set Filters';
  constructor(public payload: StudyFilters) {}
}

export class ClearStudiesFilters {
  static readonly type = '[Studies] Clear Filters';
}

export class UpdateStudiesSearchFilter {
  static readonly type = '[Studies] Update Search Filter';
  constructor(public payload: string) {}
}

export class UpdateStudiesStatusFilter {
  static readonly type = '[Studies] Update Status Filter';
  constructor(public payload: string) {}
}

export class UpdateStudiesPhaseFilter {
  static readonly type = '[Studies] Update Phase Filter';
  constructor(public payload: string) {}
}

export class UpdateStudiesTherapeuticAreasFilter {
  static readonly type = '[Studies] Update Therapeutic Areas Filter';
  constructor(public payload: string[]) {}
}
