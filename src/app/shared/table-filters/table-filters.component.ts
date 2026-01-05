import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  input,
  InputSignal,
  signal,
  WritableSignal,
  ChangeDetectionStrategy,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';

// PrimeNG Components
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

// UI Library Components
import {
  LibInputTextComponent,
  InputTextConfig,
  InputTextTypeEnum,
  LibSelectComponent,
  SelectConfig,
  LibMultiSelectComponent,
  MultiSelectConfig,
  MultiSelectDisplayModeEnum,
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  FormLabelPositionEnum,
  FormLabelStyleEnum,
  FormLabelStyleType,
  FormLabelPositionType,
  FormComponentSizeType,
  FormComponentVariantType,
  DEFAULT_SCROLL_HEIGHT,
} from '@artificial-sense/ui-lib';

export interface FilterField {
  key: string;
  label: string;
  icon: string;
  type: 'text' | 'dropdown' | 'multiselect';
  placeholder: string;
  options?: { label: string; value: any }[];
  showClear?: boolean;
  maxSelectedLabels?: number;
  selectedItemsLabel?: string;
  // UI Library specific properties
  labelStyle?: FormLabelStyleType;
  labelPosition?: FormLabelPositionType;
  size?: FormComponentSizeType;
  variant?: FormComponentVariantType;
  filter?: boolean;
  scrollHeight?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
}

export interface FilterValues {
  [key: string]: any;
}

export interface ActiveFilter {
  key: string;
  label: string;
  value: any;
  displayValue: string;
}

@Component({
  selector: 'app-table-filters',
  standalone: true,
  imports: [
    FormsModule,
    CardModule,
    ButtonModule,
    LibInputTextComponent,
    LibSelectComponent,
    LibMultiSelectComponent
],
  animations: [
    trigger('expandCollapse', [
      state(
        'collapsed',
        style({
          height: '0px',
          opacity: 0,
        }),
      ),
      state(
        'expanded',
        style({
          height: '*',
          opacity: 1,
        }),
      ),
      transition('collapsed <=> expanded', [animate('300ms ease-in-out')]),
    ]),
  ],
  templateUrl: './table-filters.component.html',
  styleUrls: ['./table-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableFiltersComponent implements OnInit {
  // Inputs as signals
  title: InputSignal<string> = input<string>('Filters');
  filterFields: InputSignal<FilterField[]> = input<FilterField[]>([]);
  filterValues: InputSignal<FilterValues> = input<FilterValues>({});
  expanded: InputSignal<boolean> = input<boolean>(false); // initial state
  expandable: InputSignal<boolean> = input<boolean>(true); // enable/disable expand

  // Outputs
  @Output() filterChange: EventEmitter<FilterValues> = new EventEmitter<FilterValues>();
  @Output() clearFilters: EventEmitter<void> = new EventEmitter<void>();
  @Output() expandedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  // Internal state
  isExpanded: WritableSignal<boolean> = signal(false);
  localValues: WritableSignal<FilterValues> = signal<FilterValues>({});

  ngOnInit(): void {
    // Set initial expanded state from input
    this.isExpanded.set(this.expanded());

    // Initialize local values merged with defaults
    const incoming: FilterValues = this.filterValues() || {};
    const merged: FilterValues = { ...incoming };
    this.filterFields().forEach((field: FilterField): void => {
      if (!(field.key in merged)) {
        merged[field.key] = field.type === 'multiselect' ? [] : '';
      }
    });
    this.localValues.set(merged);

    // If we had to add defaults, notify parent once to keep in sync
    if (JSON.stringify(incoming) !== JSON.stringify(merged)) {
      this.filterChange.emit({ ...merged });
    }
  }

  toggleExpanded(): void {
    if (!this.expandable()) return;

    this.isExpanded.update((v: boolean): boolean => !v);
    this.expandedChange.emit(this.isExpanded());
  }

  onFilterChange(key: string, value: any): void {
    const next = { ...this.localValues(), [key]: value };
    this.localValues.set(next);
    this.filterChange.emit({ ...next });
  }

  hasActiveFilters(): boolean {
    const fields: FilterField[] = this.filterFields();
    const values: FilterValues = this.localValues();
    return fields.some((field: FilterField): boolean => {
      const value: any = values[field.key];
      if (field.type === 'multiselect') {
        return value && value.length > 0;
      }
      return value !== null && value !== undefined && value !== '';
    });
  }

  getActiveFilters(): ActiveFilter[] {
    const fields: FilterField[] = this.filterFields();
    const values: FilterValues = this.localValues();
    return fields
      .filter((field: FilterField): boolean => {
        const value: any = values[field.key];
        if (field.type === 'multiselect') {
          return value && value.length > 0;
        }
        return value !== null && value !== undefined && value !== '';
      })
      .map(
        (field: FilterField): ActiveFilter => ({
          key: field.key,
          label: field.label,
          value: values[field.key],
          displayValue: this.getDisplayValue(field, values[field.key]),
        }),
      );
  }

  clearSingleFilter(key: string): void {
    const field: FilterField | undefined = this.filterFields().find(
      (f: FilterField): boolean => f.key === key,
    );
    if (field) {
      const next = { ...this.localValues(), [key]: field.type === 'multiselect' ? [] : '' };
      this.localValues.set(next);
      this.filterChange.emit({ ...next });
    }
  }

  clearAllFilters(): void {
    const values = { ...this.localValues() };
    this.filterFields().forEach((field: FilterField): void => {
      values[field.key] = field.type === 'multiselect' ? [] : '';
    });
    this.localValues.set(values);
    this.clearFilters.emit();
    this.filterChange.emit({ ...values });
  }

  // Generate InputTextConfig for text fields
  getInputTextConfig(field: FilterField): InputTextConfig {
    return {
      id: `filter-${field.key}`,
      label: field.label,
      placeholder: field.placeholder,
      type: InputTextTypeEnum.TEXT,
      icon: field.icon,
      autofocus: false,
      required: field.required || false,
      disabled: field.disabled || false,
      size: field.size || FormComponentSizeEnum.NORMAL,
      variant: field.variant || FormComponentVariantEnum.OUTLINED,
      labelStyle: field.labelStyle || FormLabelStyleEnum.DEFAULT,
      labelPosition: field.labelPosition || FormLabelPositionEnum.ABOVE,
      helperText: field.helperText,
    };
  }

  // Generate SelectConfig for dropdown fields
  getSelectConfig(field: FilterField): SelectConfig {
    return {
      id: `filter-${field.key}`,
      label: field.label,
      placeholder: field.placeholder,
      options: field.options || [],
      optionLabel: 'label',
      optionValue: 'value',
      filter: field.filter || false,
      showClear: field.showClear || true,
      scrollHeight: field.scrollHeight || DEFAULT_SCROLL_HEIGHT,
      required: field.required || false,
      disabled: field.disabled || false,
      size: field.size || FormComponentSizeEnum.NORMAL,
      variant: field.variant || FormComponentVariantEnum.OUTLINED,
      labelStyle: field.labelStyle || FormLabelStyleEnum.DEFAULT,
      labelPosition: field.labelPosition || FormLabelPositionEnum.ABOVE,
      helperText: field.helperText,
    };
  }

  // Generate MultiSelectConfig for multiselect fields
  getMultiSelectConfig(field: FilterField): MultiSelectConfig {
    return {
      id: `filter-${field.key}`,
      label: field.label,
      placeholder: field.placeholder,
      options: field.options || [],
      optionLabel: 'label',
      optionValue: 'value',
      display: MultiSelectDisplayModeEnum.COMMA,
      filter: field.filter || false,
      showToggleAll: true,
      maxSelectedLabels: field.maxSelectedLabels || 3,
      scrollHeight: field.scrollHeight || DEFAULT_SCROLL_HEIGHT,
      required: field.required || false,
      disabled: field.disabled || false,
      size: field.size || FormComponentSizeEnum.NORMAL,
      variant: field.variant || FormComponentVariantEnum.OUTLINED,
      labelStyle: field.labelStyle || FormLabelStyleEnum.DEFAULT,
      labelPosition: field.labelPosition || FormLabelPositionEnum.ABOVE,
      helperText: field.helperText,
    };
  }

  private getDisplayValue(field: FilterField, value: any): string {
    if (field.type === 'multiselect' && Array.isArray(value)) {
      if (value.length === 0) return '';
      if (value.length === 1) {
        const option = field.options?.find((opt): boolean => opt.value === value[0]);
        return option?.label || value[0];
      }
      return `${value.length} ${field.selectedItemsLabel?.replace('{0}', value.length.toString()) || 'items'}`;
    }

    if (field.type === 'dropdown') {
      const option = field.options?.find((opt): boolean => opt.value === value);
      return option?.label || value;
    }

    if (field.type === 'text') {
      return `"${value}"`;
    }

    return value;
  }
}
