export interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  width?: string;
  type?: 'text' | 'tag' | 'progress' | 'date' | 'custom' | 'actions';
  customTemplate?: string; // Template reference name
  tagSeverity?: (value: any) => 'success' | 'info' | 'warn' | 'danger' | 'secondary' | undefined;
  formatFn?: (value: any, rowData: any) => string;
  progressColor?: (value: any, rowData: any) => string;
  progressValue?: (rowData: any) => number;
}
