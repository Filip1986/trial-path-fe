export interface SkeletonTableColumn {
  type: 'text' | 'avatar' | 'status' | 'actions' | 'checkbox' | 'date' | 'number';
  width: string;
  headerWidth: string;
  minWidth?: string;
  maxWidth?: string;
}

export interface SkeletonConfig {
  table: {
    columns: SkeletonTableColumn[];
    rowCount: number;
    showHeader: boolean;
    showPagination: boolean;
    paginationButtonCount: number;
  };
  filters: {
    show: boolean;
    columnCount: number;
    title: string;
  };
  header: {
    show: boolean;
    primaryButtonWidth: string;
    secondaryButtonCount: number;
  };
  animations: {
    enabled: boolean;
    staggerDelay: number;
    duration: number;
  };
  accessibility: {
    ariaLabel: string;
    loadingMessage: string;
    respectReducedMotion: boolean;
  };
}
