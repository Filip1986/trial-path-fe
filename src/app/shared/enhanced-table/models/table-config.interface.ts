export interface TableConfig {
  // Table behavior
  paginator?: boolean;
  rows?: number;
  rowsPerPageOptions?: number[];
  sortField?: string;
  sortOrder?: number;
  globalFilterFields?: string[];
  resizableColumns?: boolean;
  scrollable?: boolean;
  scrollHeight?: string;
  responsiveLayout?: 'stack' | 'scroll';

  // Display options
  showCurrentPageReport?: boolean;
  currentPageReportTemplate?: string;
  emptyMessage?: string;
  loadingMessage?: string;
}
