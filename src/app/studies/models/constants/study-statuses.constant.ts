import { StudyStatus } from '../enums';

export const STUDY_STATUS_OPTIONS = [
  { label: 'Draft', value: StudyStatus.DRAFT },
  { label: 'Planning', value: StudyStatus.PLANNING },
  { label: 'Recruiting', value: StudyStatus.RECRUITING },
  { label: 'Active', value: StudyStatus.ACTIVE },
  { label: 'Suspended', value: StudyStatus.SUSPENDED },
  { label: 'Completed', value: StudyStatus.COMPLETED },
  { label: 'Cancelled', value: StudyStatus.CANCELLED },
];
