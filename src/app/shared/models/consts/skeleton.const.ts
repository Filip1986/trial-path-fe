import { TableSkeletonConfig } from '../../table-skeleton/table-skeleton.component';

export const SKELETON_PRESETS = {
  SCREENING_TABLE: {
    showHeader: true,
    showFilters: true,
    showPagination: true,
    rowCount: 8,
    columnCount: 4,
    headerHeight: '48px',
    rowHeight: '60px',
    showActions: true,
    showAvatar: true,
    showStatus: true,
    // Custom column configuration for screening table
    tableColumns: [
      { type: 'text', width: '90px', headerWidth: '100px' }, // Participant ID
      { type: 'avatar', width: '180px', headerWidth: '120px' }, // Name with avatar
      { type: 'text', width: '50px', headerWidth: '60px' }, // Age
      { type: 'text', width: '160px', headerWidth: '120px' }, // Study
      { type: 'date', width: '100px', headerWidth: '120px' }, // Screening Date
      { type: 'status', width: '80px', headerWidth: '80px' }, // Status
      { type: 'text', width: '80px', headerWidth: '80px' }, // Consent
      { type: 'text', width: '120px', headerWidth: '100px' }, // Reviewed By
      { type: 'actions', width: '120px', headerWidth: '80px' }, // Actions (more buttons)
    ],
  } as TableSkeletonConfig,

  PARTICIPANTS_TABLE: {
    showHeader: true,
    showFilters: true,
    showPagination: true,
    rowCount: 10,
    columnCount: 4,
    headerHeight: '48px',
    rowHeight: '60px',
    showActions: true,
    showAvatar: true,
    showStatus: true,
    // Custom column configuration for participants table
    tableColumns: [
      { type: 'text', width: '90px', headerWidth: '100px' }, // ID
      { type: 'avatar', width: '150px', headerWidth: '100px' }, // Name
      { type: 'text', width: '120px', headerWidth: '80px' }, // Email
      { type: 'text', width: '50px', headerWidth: '60px' }, // Age
      { type: 'text', width: '80px', headerWidth: '80px' }, // Gender
      { type: 'text', width: '140px', headerWidth: '100px' }, // Study
      { type: 'status', width: '80px', headerWidth: '80px' }, // Status
      { type: 'date', width: '120px', headerWidth: '130px' }, // Enrollment Date
      { type: 'actions', width: '80px', headerWidth: '80px' }, // Actions
    ],
  } as TableSkeletonConfig,

  STUDIES_TABLE: {
    showHeader: true,
    showFilters: true,
    showPagination: true,
    rowCount: 6,
    columnCount: 3,
    headerHeight: '48px',
    rowHeight: '70px',
    showActions: true,
    showAvatar: false,
    showStatus: true,
    // Custom column configuration for study table
    tableColumns: [
      { type: 'text', width: '200px', headerWidth: '150px' }, // Study Title
      { type: 'text', width: '100px', headerWidth: '80px' }, // Phase
      { type: 'text', width: '120px', headerWidth: '100px' }, // Principal Investigator
      { type: 'status', width: '80px', headerWidth: '80px' }, // Status
      { type: 'text', width: '80px', headerWidth: '100px' }, // Participants
      { type: 'date', width: '100px', headerWidth: '100px' }, // Start Date
      { type: 'actions', width: '100px', headerWidth: '80px' }, // Actions
    ],
  } as TableSkeletonConfig,
};

// Enhanced skeleton configuration interface
export interface EnhancedTableSkeletonConfig extends TableSkeletonConfig {
  tableColumns?: {
    type: 'text' | 'avatar' | 'status' | 'actions' | 'checkbox' | 'date' | 'number';
    width: string;
    headerWidth: string;
    minWidth?: string;
    maxWidth?: string;
  }[];
  customAnimations?: {
    enabled: boolean;
    staggerDelay: number;
    duration: number;
  };
  accessibility?: {
    ariaLabel: string;
    loadingMessage: string;
    respectReducedMotion: boolean;
  };
}
