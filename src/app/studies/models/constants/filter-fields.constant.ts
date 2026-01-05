import { FilterField } from '../../../shared/table-filters/table-filters.component';

export const STUDY_FILTER_FIELDS: FilterField[] = [
  {
    key: 'search',
    label: 'Search Studies',
    icon: 'pi pi-search',
    type: 'text',
    placeholder: 'Search by title, indication, PI...',
  },
  {
    key: 'status',
    label: 'Status',
    icon: 'pi pi-circle',
    type: 'dropdown',
    placeholder: 'All Statuses',
    showClear: true,
    options: [
      { label: 'Draft', value: 'draft' },
      { label: 'Planning', value: 'planning' },
      { label: 'Recruiting', value: 'recruiting' },
      { label: 'Active', value: 'active' },
      { label: 'Suspended', value: 'suspended' },
      { label: 'Completed', value: 'completed' },
      { label: 'Cancelled', value: 'cancelled' },
    ],
  },
  {
    key: 'phase',
    label: 'Phase',
    icon: 'pi pi-flag',
    type: 'dropdown',
    placeholder: 'All Phases',
    showClear: true,
    options: [
      { label: 'Phase I', value: 'phase_1' },
      { label: 'Phase II', value: 'phase_2' },
      { label: 'Phase III', value: 'phase_3' },
      { label: 'Phase IV', value: 'phase_4' },
    ],
  },
  {
    key: 'therapeuticAreas',
    label: 'Therapeutic Areas',
    icon: 'pi pi-sitemap',
    type: 'multiselect',
    placeholder: 'Select areas',
    showClear: true,
    maxSelectedLabels: 2,
    selectedItemsLabel: '{0} areas selected',
    options: [
      { label: 'Oncology', value: 'oncology' },
      { label: 'Cardiology', value: 'cardiology' },
      { label: 'Neurology', value: 'neurology' },
      { label: 'Dermatology', value: 'dermatology' },
      { label: 'Endocrinology', value: 'endocrinology' },
    ],
  },
];
