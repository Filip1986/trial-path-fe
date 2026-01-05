import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToolbarModule } from 'primeng/toolbar';
import { DatePickerModule } from 'primeng/datepicker';

interface FormQuery {
  id: string;
  fieldId: string;
  fieldName: string;
  formName: string;
  participantId: string;
  message: string;
  status: 'open' | 'answered' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdBy: string;
  createdDate: string;
  answeredBy?: string;
  answeredDate?: string;
  answer?: string;
  category: 'data_quality' | 'missing_data' | 'clarification' | 'validation' | 'other';
}

@Component({
  selector: 'app-query-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    CardModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    ToolbarModule,
    DatePickerModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './query-management.component.html',
  styleUrls: ['./query-management.component.scss'],
})
export class QueryManagementComponent implements OnInit {
  queries: FormQuery[] = [];
  filteredQueries: FormQuery[] = [];
  selectedQuery: FormQuery | null = null;
  queryForm: FormGroup;

  isLoading = true;
  isSaving = false;

  // Dialog states
  viewQueryDialog = false;
  answerQueryDialog = false;
  createQueryDialog = false;

  // Filter options
  globalFilterValue = '';
  statusFilter = '';
  priorityFilter = '';
  categoryFilter = '';

  // Dropdown options
  statusOptions = [
    { label: 'All Statuses', value: '' },
    { label: 'Open', value: 'open' },
    { label: 'Answered', value: 'answered' },
    { label: 'Closed', value: 'closed' },
  ];

  priorityOptions = [
    { label: 'All Priorities', value: '' },
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Urgent', value: 'urgent' },
  ];

  categoryOptions = [
    { label: 'All Categories', value: '' },
    { label: 'Data Quality', value: 'data_quality' },
    { label: 'Missing Data', value: 'missing_data' },
    { label: 'Clarification', value: 'clarification' },
    { label: 'Validation', value: 'validation' },
    { label: 'Other', value: 'other' },
  ];

  answerForm!: FormGroup;
  newQueryForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {
    this.queryForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.loadQueries();

    this.answerForm = this.fb.group({
      answer: ['', [Validators.required, Validators.minLength(10)]],
    });

    this.newQueryForm = this.fb.group({
      fieldId: ['', Validators.required],
      fieldName: ['', Validators.required],
      formName: ['', Validators.required],
      participantId: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
      priority: ['medium', Validators.required],
      category: ['clarification', Validators.required],
    });
  }

  loadQueries(): void {
    this.isLoading = true;

    // Simulate API call with mock data
    setTimeout(() => {
      this.queries = this.generateMockQueries();
      this.filteredQueries = [...this.queries];
      this.isLoading = false;
    }, 1000);
  }

  generateMockQueries(): FormQuery[] {
    const mockQueries: FormQuery[] = [
      {
        id: 'Q001',
        fieldId: 'patient_weight',
        fieldName: 'Patient Weight',
        formName: 'Baseline Assessment',
        participantId: 'PT-001',
        message: 'The weight value seems unusually high (500kg). Please verify this measurement.',
        status: 'open',
        priority: 'high',
        createdBy: 'Dr. Sarah Johnson',
        createdDate: '2025-06-15T10:30:00Z',
        category: 'data_quality',
      },
      {
        id: 'Q002',
        fieldId: 'medication_dosage',
        fieldName: 'Medication Dosage',
        formName: 'Treatment Log',
        participantId: 'PT-002',
        message:
          'Missing dosage information for prescribed medication. Please provide complete details.',
        status: 'answered',
        priority: 'medium',
        createdBy: 'Dr. Michael Chen',
        createdDate: '2025-06-14T14:15:00Z',
        answeredBy: 'Nurse Emily Davis',
        answeredDate: '2025-06-15T09:20:00Z',
        answer: 'The dosage was 10mg twice daily. Updated the form with correct information.',
        category: 'missing_data',
      },
      {
        id: 'Q003',
        fieldId: 'adverse_event',
        fieldName: 'Adverse Event Description',
        formName: 'Safety Report',
        participantId: 'PT-003',
        message:
          'The adverse event description is unclear. Please provide more specific details about the symptoms.',
        status: 'open',
        priority: 'urgent',
        createdBy: 'Dr. Amanda Rodriguez',
        createdDate: '2025-06-16T16:45:00Z',
        category: 'clarification',
      },
      {
        id: 'Q004',
        fieldId: 'lab_results',
        fieldName: 'Lab Results',
        formName: 'Laboratory Data',
        participantId: 'PT-001',
        message:
          'Lab values are outside normal range. Please confirm results and provide interpretation.',
        status: 'closed',
        priority: 'high',
        createdBy: 'Dr. Robert Kim',
        createdDate: '2025-06-13T11:20:00Z',
        answeredBy: 'Dr. Lisa Thompson',
        answeredDate: '2025-06-14T08:30:00Z',
        answer:
          'Values confirmed. Patient has known condition that explains these results. No action required.',
        category: 'validation',
      },
      {
        id: 'Q005',
        fieldId: 'visit_date',
        fieldName: 'Visit Date',
        formName: 'Follow-up Visit',
        participantId: 'PT-004',
        message: 'Visit date conflicts with previous entries. Please verify the correct date.',
        status: 'open',
        priority: 'low',
        createdBy: 'Coordinator Jane Smith',
        createdDate: '2025-06-17T09:10:00Z',
        category: 'data_quality',
      },
      {
        id: 'Q006',
        fieldId: 'consent_form',
        fieldName: 'Informed Consent',
        formName: 'Enrollment',
        participantId: 'PT-005',
        message: 'Informed consent form appears to be incomplete. Missing signature date.',
        status: 'answered',
        priority: 'medium',
        createdBy: 'Dr. Patricia Wilson',
        createdDate: '2025-06-12T13:25:00Z',
        answeredBy: 'Coordinator Mark Johnson',
        answeredDate: '2025-06-13T10:15:00Z',
        answer: 'Signature date added. Form is now complete and compliant.',
        category: 'missing_data',
      },
    ];

    return mockQueries;
  }

  applyFilters(): void {
    this.filteredQueries = this.queries.filter((query) => {
      const matchesGlobal = this.globalFilterValue
        ? Object.values(query).some((value) =>
            value?.toString().toLowerCase().includes(this.globalFilterValue.toLowerCase()),
          )
        : true;

      const matchesStatus = this.statusFilter ? query.status === this.statusFilter : true;
      const matchesPriority = this.priorityFilter ? query.priority === this.priorityFilter : true;
      const matchesCategory = this.categoryFilter ? query.category === this.categoryFilter : true;

      return matchesGlobal && matchesStatus && matchesPriority && matchesCategory;
    });
  }

  onGlobalFilter(): void {
    this.applyFilters();
  }

  onStatusFilter(): void {
    this.applyFilters();
  }

  onPriorityFilter(): void {
    this.applyFilters();
  }

  onCategoryFilter(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.globalFilterValue = '';
    this.statusFilter = '';
    this.priorityFilter = '';
    this.categoryFilter = '';
    this.filteredQueries = [...this.queries];
  }

  viewQuery(query: FormQuery): void {
    this.selectedQuery = query;
    this.viewQueryDialog = true;
  }

  answerQuery(query: FormQuery): void {
    this.selectedQuery = query;
    this.answerForm.reset();
    this.answerQueryDialog = true;
  }

  submitAnswer(): void {
    if (this.answerForm.valid && this.selectedQuery) {
      this.isSaving = true;

      // Simulate API call
      setTimeout(() => {
        const answer = this.answerForm.get('answer')?.value;

        // Update the query
        const queryIndex = this.queries.findIndex((q) => q.id === this.selectedQuery!.id);
        if (queryIndex !== -1) {
          this.queries[queryIndex] = {
            ...this.queries[queryIndex],
            status: 'answered',
            answer: answer,
            answeredBy: 'Current User', // In real app, get from auth service
            answeredDate: new Date().toISOString(),
          };
        }

        this.applyFilters();
        this.answerQueryDialog = false;
        this.isSaving = false;

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Query answered successfully',
        });
      }, 1000);
    }
  }

  closeQuery(query: FormQuery): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to close this query?',
      header: 'Confirm Close',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const queryIndex = this.queries.findIndex((q) => q.id === query.id);
        if (queryIndex !== -1) {
          this.queries[queryIndex] = {
            ...this.queries[queryIndex],
            status: 'closed',
          };
        }

        this.applyFilters();

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Query closed successfully',
        });
      },
    });
  }

  reopenQuery(query: FormQuery): void {
    const queryIndex = this.queries.findIndex((q) => q.id === query.id);
    if (queryIndex !== -1) {
      this.queries[queryIndex] = {
        ...this.queries[queryIndex],
        status: 'open',
      };
    }

    this.applyFilters();

    this.messageService.add({
      severity: 'info',
      summary: 'Query Reopened',
      detail: 'Query has been reopened',
    });
  }

  createNewQuery(): void {
    this.newQueryForm.reset({
      priority: 'medium',
      category: 'clarification',
    });
    this.createQueryDialog = true;
  }

  submitNewQuery(): void {
    if (this.newQueryForm.valid) {
      this.isSaving = true;

      // Simulate API call
      setTimeout(() => {
        const formValue = this.newQueryForm.value;
        const newQuery: FormQuery = {
          id: `Q${String(this.queries.length + 1).padStart(3, '0')}`,
          fieldId: formValue.fieldId!,
          fieldName: formValue.fieldName!,
          formName: formValue.formName!,
          participantId: formValue.participantId!,
          message: formValue.message!,
          priority: formValue.priority as any,
          category: formValue.category as any,
          status: 'open',
          createdBy: 'Current User', // In real app, get from auth service
          createdDate: new Date().toISOString(),
        };

        this.queries.unshift(newQuery);
        this.applyFilters();
        this.createQueryDialog = false;
        this.isSaving = false;

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Query created successfully',
        });
      }, 1000);
    }
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (status) {
      case 'open':
        return 'warn';
      case 'answered':
        return 'success';
      case 'closed':
        return 'secondary';
      default:
        return 'info';
    }
  }

  getPrioritySeverity(priority: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (priority) {
      case 'urgent':
        return 'danger';
      case 'high':
        return 'warn';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'info';
    }
  }

  getCategoryColor(category: string): string {
    switch (category) {
      case 'data_quality':
        return '#ff6b6b';
      case 'missing_data':
        return '#feca57';
      case 'clarification':
        return '#48dbfb';
      case 'validation':
        return '#ff9ff3';
      case 'other':
        return '#54a0ff';
      default:
        return '#70a1ff';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getQueryStats() {
    const total = this.queries.length;
    const open = this.queries.filter((q) => q.status === 'open').length;
    const answered = this.queries.filter((q) => q.status === 'answered').length;
    const closed = this.queries.filter((q) => q.status === 'closed').length;
    const urgent = this.queries.filter((q) => q.priority === 'urgent').length;

    return { total, open, answered, closed, urgent };
  }
}
