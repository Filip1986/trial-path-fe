import { Component, Input } from '@angular/core';

import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';

export interface TableSkeletonConfig {
  showHeader?: boolean;
  showFilters?: boolean;
  showPagination?: boolean;
  rowCount?: number;
  columnCount?: number;
  headerHeight?: string;
  rowHeight?: string;
  showActions?: boolean;
  showAvatar?: boolean;
  showStatus?: boolean;
}

@Component({
  selector: 'app-table-skeleton',
  standalone: true,
  imports: [CardModule, SkeletonModule],
  templateUrl: './table-skeleton.component.html',
  styleUrls: ['./table-skeleton.component.scss'],
})
export class TableSkeletonComponent {
  @Input() config: TableSkeletonConfig = {
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
  };

  @Input() ariaLabel = 'Loading table data';
  @Input() loadingMessage = 'Loading table data, please wait...';
  @Input() headerButtonWidth = '150px';

  get skeletonRows() {
    return Array.from({ length: this.config.rowCount || 8 }, (_, i) => i);
  }

  get filterColumns() {
    return Array.from({ length: this.config.columnCount || 4 }, (_, i) => i);
  }

  get paginationButtons() {
    return Array.from({ length: 4 }, (_, i) => i);
  }

  get tableColumns() {
    // Define default column structure - can be customized per use case
    return [
      { type: 'text', width: '90px', headerWidth: '100px' },
      { type: 'avatar', width: '120px', headerWidth: '80px' },
      { type: 'text', width: '30px', headerWidth: '60px' },
      { type: 'text', width: '160px', headerWidth: '120px' },
      { type: 'text', width: '80px', headerWidth: '100px' },
      { type: 'status', width: '60px', headerWidth: '80px' },
      { type: 'checkbox', width: '40px', headerWidth: '70px' },
      { type: 'text', width: '100px', headerWidth: '90px' },
      { type: 'actions', width: '80px', headerWidth: '80px' },
    ];
  }

  getRandomWidth(min = 60, max = 120): string {
    const width = Math.floor(Math.random() * (max - min + 1)) + min;
    return `${width}px`;
  }
}
