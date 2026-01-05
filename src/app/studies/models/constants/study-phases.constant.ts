import { StudyPhase } from '../enums';

export const STUDY_PHASE_OPTIONS = [
  { label: 'Preclinical', value: StudyPhase.PRECLINICAL },
  { label: 'Early Phase 1', value: StudyPhase.EARLY_PHASE_1 },
  { label: 'Phase I', value: StudyPhase.PHASE_1 },
  { label: 'Phase I/Phase II', value: StudyPhase.PHASE_1_2 },
  { label: 'Phase II', value: StudyPhase.PHASE_2 },
  { label: 'Phase II/Phase III', value: StudyPhase.PHASE_2_3 },
  { label: 'Phase III', value: StudyPhase.PHASE_3 },
  { label: 'Phase IV', value: StudyPhase.PHASE_4 },
  { label: 'Not Applicable', value: StudyPhase.NOT_APPLICABLE },
];
