import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
  computed,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { StudyStateService } from '../../services/study-state.service';
import { StudyCardComponent } from '../shared/study-card/study-card.component';

import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import {
  TableFiltersComponent,
  FilterField,
  FilterValues,
} from '../../../shared/table-filters/table-filters.component';
import { Study } from '../../models/interfaces/study.interface';
import { StudyFilters } from '../../models/interfaces/study-filters.interface';

@Component({
  selector: 'app-study-list-page',
  standalone: true,
  imports: [
    CommonModule,
    StudyCardComponent,
    TableFiltersComponent,
    ButtonModule,
    ProgressSpinnerModule,
    MessageModule,
  ],
  templateUrl: './study-list-1.component.html',
  styleUrls: ['./study-list-1.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudyList1Component implements OnInit {
  private studyStateService = inject(StudyStateService);
  private router: Router = inject(Router);

  // Signals from state service
  readonly filters: Signal<StudyFilters | null> = toSignal<StudyFilters | null>(
    this.studyStateService.filters$,
    { initialValue: null },
  );
  readonly studies: Signal<Study[] | null> = toSignal<Study[] | null>(
    this.studyStateService.studies$,
    { initialValue: null },
  );
  readonly loading: Signal<boolean | null> = toSignal<boolean | null>(
    this.studyStateService.loading$,
    { initialValue: null },
  );
  readonly error: Signal<string | null> = toSignal<string | null>(this.studyStateService.error$, {
    initialValue: null,
  });
  readonly metrics = toSignal(this.studyStateService.metrics$, { initialValue: null });

  // Derived: filtered studies
  readonly filteredStudies: Signal<Study[]> = computed((): Study[] => {
    const s = this.studies() ?? [];
    const f = this.filters() ?? ({} as StudyFilters);
    return this.applyFilters(s, f);
  });

  // Layout control as signal
  currentLayout: WritableSignal<'row' | 'card'> = signal<'row' | 'card'>('row');

  // Existing filter configuration
  filterFields: FilterField[] = [
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
    // Add more filter fields as needed...
  ];

  readonly filterValues: Signal<FilterValues> = computed((): FilterValues => {
    const filters: any = this.filters() ?? ({} as any);
    return {
      search: (filters as any).search || '',
      status: (filters as any).status || null,
      phase: (filters as any).phase || null,
    } as FilterValues;
  });

  ngOnInit(): void {
    this.studyStateService.loadStudies();
  }

  // Layout toggle methods
  switchLayout(layout: 'row' | 'card'): void {
    this.currentLayout.set(layout);
  }

  isLayoutActive(layout: 'row' | 'card'): boolean {
    return this.currentLayout() === layout;
  }

  // Existing methods
  onFiltersChange(filters: FilterValues): void {
    const studyFilters: StudyFilters = {
      search: filters['search'] as string,
      status: filters['status'] as string,
      phase: filters['phase'] as string,
      // Map other filters as needed
    };
    this.studyStateService.updateFilters(studyFilters);
  }

  onClearFilters(): void {
    this.studyStateService.clearFilters();
  }

  private applyFilters(studies: Study[], filters: StudyFilters): Study[] {
    return studies.filter((study: Study): boolean => {
      // Search filter
      if (filters.search) {
        const searchTerm: string = filters.search.toLowerCase();
        const searchFields: string[] = [
          study.title,
          study.shortTitle,
          study.indication,
          study.principalInvestigator,
          study.sponsorName,
        ]
          .filter((field: string): string => field)
          .map((field: string): string => field!.toLowerCase());

        if (!searchFields.some((field: string): boolean => field.includes(searchTerm))) {
          return false;
        }
      }

      // Status filter
      if (filters.status && study.status !== filters.status) {
        return false;
      }

      // Phase filter
      if (filters.phase && study.phase !== filters.phase) {
        return false;
      }

      return true;
    });
  }

  trackByStudyId(index: number, study: Study): string {
    return study.id;
  }

  viewStudy(study: Study): void {
    void this.router.navigate(['/studies', study.id]);
  }

  editStudy(study: Study): void {
    void this.router.navigate(['/studies', study.id, 'edit']);
  }

  createNewStudy(): void {
    void this.router.navigate(['/studies/create1']);
  }
}
