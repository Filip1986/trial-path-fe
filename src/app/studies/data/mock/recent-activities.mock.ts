import { RecentActivity } from '../../models/interfaces/dashboard.interface';

export const MOCK_RECENT_ACTIVITIES: RecentActivity[] = [
  {
    id: '1',
    type: 'enrollment',
    message: 'New participant enrolled in STUDY-001',
    timestamp: new Date('2024-06-20T10:30:00'),
    studyId: '1',
    studyTitle: 'STUDY-001',
  },
  {
    id: '2',
    type: 'status_change',
    message: 'PEDIA-DM-2024 status changed to Suspended',
    timestamp: new Date('2024-06-19T14:15:00'),
    studyId: '5',
    studyTitle: 'PEDIA-DM-2024',
  },
  {
    id: '3',
    type: 'milestone',
    message: 'CARDIO-HF-2024 reached 80% enrollment target',
    timestamp: new Date('2024-06-18T09:45:00'),
    studyId: '2',
    studyTitle: 'CARDIO-HF-2024',
  },
  {
    id: '4',
    type: 'study_created',
    message: 'New study IMMUNO-MEL-001 created',
    timestamp: new Date('2024-06-17T16:20:00'),
    studyId: '4',
    studyTitle: 'IMMUNO-MEL-001',
  },
];
