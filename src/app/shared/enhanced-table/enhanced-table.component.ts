import {
  Component,
  Output,
  EventEmitter,
  TemplateRef,
  ContentChild,
  AfterContentInit,
  input,
  InputSignal,
  signal,
  WritableSignal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG Components
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

// Import the existing table filters component
import {
  FilterField,
  FilterValues,
  TableFiltersComponent,
} from '../table-filters/table-filters.component';

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

export interface TableMetric {
  title: string;
  subtitle: string;
  value: string | number;
  cardClass?: string;
}

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

@Component({
  selector: 'app-enhanced-table',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    ProgressSpinnerModule,
    CardModule,
    TooltipModule,
    MenuModule,
    TableFiltersComponent,
  ],
  templateUrl: './enhanced-table.component.html',
  styleUrls: ['./enhanced-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnhancedTableComponent implements AfterContentInit {
  // Required inputs (signals)
  data: InputSignal<any[]> = input<any[]>([]);
  columns: InputSignal<TableColumn[]> = input<TableColumn[]>([]);

  // Optional configuration (signals)
  config: InputSignal<TableConfig> = input<TableConfig>({});
  loading: InputSignal<boolean> = input<boolean>(false);
  tableTitle: InputSignal<string> = input<string>('');

  // Metrics (optional)
  metrics: InputSignal<TableMetric[]> = input<TableMetric[]>([]);

  // Filters (optional)
  showFilters: InputSignal<boolean> = input<boolean>(false);
  filterTitle: InputSignal<string> = input<string>('Filters');
  filterFields: InputSignal<FilterField[]> = input<FilterField[]>([]);
  filterValues: InputSignal<FilterValues> = input<FilterValues>({});

  // Empty state (optional)
  showCreateButton: InputSignal<boolean> = input<boolean>(false);
  createButtonLabel: InputSignal<string> = input<string>('');
  createButtonIcon: InputSignal<string> = input<string>('');

  // Actions (optional)
  getActionsForRow: InputSignal<((rowData: any) => MenuItem[]) | undefined> = input<
    ((rowData: any) => MenuItem[]) | undefined
  >(undefined);

  // Events
  @Output() filterChange = new EventEmitter<FilterValues>();
  @Output() clearFilters = new EventEmitter<void>();
  @Output() createNew = new EventEmitter<void>();
  @Output() rowAction = new EventEmitter<{ action: string; rowData: any }>();

  // Template references
  @ContentChild('emptyTemplate') emptyTemplate?: TemplateRef<any>;

  // Internal state
  currentRowActions: WritableSignal<MenuItem[]> = signal<MenuItem[]>([]);
  private customTemplates = new Map<string, TemplateRef<any>>();

  ngAfterContentInit() {
    // Initialize any template references if needed
  }

  // Template methods
  getFieldValue(field: string, rowData: any): any {
    return field.split('.').reduce((obj, key) => obj?.[key], rowData);
  }

  getFormattedValue(col: TableColumn, rowData: any): string {
    const value = this.getFieldValue(col.field, rowData);

    if (col.formatFn) {
      return col.formatFn(value, rowData);
    }

    return value?.toString() || '';
  }

  getCustomTemplate(templateName: string): TemplateRef<any> | null {
    return this.customTemplates.get(templateName) || null;
  }

  getDefaultPageReportTemplate(): string {
    return `Showing {first} to {last} of {totalRecords} entries`;
  }

  // Event handlers
  onFilterChange(filterValues: FilterValues): void {
    this.filterChange.emit(filterValues);
  }

  onClearFilters(): void {
    this.clearFilters.emit();
  }

  onCreateNew(): void {
    this.createNew.emit();
  }

  showActionsMenu(event: Event, rowData: any): void {
    const provider = this.getActionsForRow();
    if (provider) {
      this.currentRowActions.set(provider(rowData) || []);
    }
  }

  // Method to register custom templates
  registerCustomTemplate(name: string, template: TemplateRef<any>): void {
    this.customTemplates.set(name, template);
  }
}
