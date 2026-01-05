import { TableColumn } from '../../../shared/enhanced-table/enhanced-table.component';

export const STUDY_TABLE_COLUMNS: TableColumn[] = [
  {
    field: 'shortTitle',
    header: 'Study ID',
    sortable: true,
    type: 'custom',
    customTemplate: 'studyIdTemplate',
  },
  {
    field: 'title',
    header: 'Title',
    type: 'custom',
    customTemplate: 'studyTitleTemplate',
  },
  {
    field: 'phase',
    header: 'Phase',
    sortable: true,
    type: 'tag',
  },
  {
    field: 'status',
    header: 'Status',
    sortable: true,
    type: 'tag',
  },
  {
    field: 'indication',
    header: 'Indication',
    type: 'text',
  },
  {
    field: 'enrollment',
    header: 'Enrollment Progress',
    type: 'custom',
    customTemplate: 'enrollmentTemplate',
  },
  {
    field: 'sites',
    header: 'Sites',
    sortable: true,
    type: 'text',
  },
  {
    field: 'plannedStartDate',
    header: 'Start Date',
    sortable: true,
    type: 'date',
  },
  {
    field: 'riskLevel',
    header: 'Risk Level',
    type: 'custom',
    customTemplate: 'riskLevelTemplate',
  },
  {
    field: 'actions',
    header: 'Actions',
    type: 'actions',
    width: '100px',
  },
];
