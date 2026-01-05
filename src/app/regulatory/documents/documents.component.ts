import { Component, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
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
import { FileUploadModule } from 'primeng/fileupload';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { DividerModule } from 'primeng/divider';
import { ChipModule } from 'primeng/chip';
import { CheckboxModule } from 'primeng/checkbox';

// UI-Lib Components
import {
  LibInputTextComponent,
  LibSelectComponent,
  LibTextareaComponent,
  FormLabelPositionEnum,
  FormLabelStyleEnum,
  FormComponentVariantEnum,
  FormComponentSizeEnum,
  DEFAULT_SCROLL_HEIGHT,
} from '@artificial-sense/ui-lib';

interface Document {
  id: string;
  name: string;
  type: string;
  category:
    | 'protocol'
    | 'consent'
    | 'case_report'
    | 'lab_result'
    | 'medical_image'
    | 'regulatory'
    | 'other';
  size: number;
  uploadDate: string;
  uploadedBy: string;
  participantId?: string;
  studyId?: string;
  version: string;
  status: 'active' | 'archived' | 'pending_review' | 'approved' | 'rejected';
  description?: string;
  tags: string[];
  downloadCount: number;
  lastAccessed?: string;
  accessedBy?: string;
  fileExtension: string;
  checksum?: string;
  isConfidential: boolean;
}

interface DocumentCategory {
  label: string;
  value: string;
  icon: string;
}

interface DocumentStatus {
  label: string;
  value: string;
  severity: 'success' | 'info' | 'warn' | 'danger';
}

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
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
    FileUploadModule,
    BadgeModule,
    TooltipModule,
    InputGroupModule,
    InputGroupAddonModule,
    DividerModule,
    ChipModule,
    CheckboxModule,
    LibInputTextComponent,
    LibSelectComponent,
    LibTextareaComponent
],
  providers: [MessageService, ConfirmationService],
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
})
export class DocumentsComponent implements OnInit {
  // Component state
  documents: Document[] = [];
  filteredDocuments: Document[] = [];
  selectedDocuments: Document[] = [];
  isLoading = false;
  isUploading = false;

  // Dialog states
  showUploadDialog = false;
  showDocumentDialog = false;
  showViewDialog = false;
  selectedDocument: Document | null = null;

  // Forms
  uploadForm!: FormGroup;
  filterForm!: FormGroup;

  // Filter and search
  searchValue = '';
  selectedCategory = '';
  selectedStatus = '';
  selectedParticipant = '';
  selectedStudy = '';

  // Constants for UI-Lib
  readonly FormLabelPositionEnum = FormLabelPositionEnum;
  readonly FormLabelStyleEnum = FormLabelStyleEnum;
  readonly FormComponentVariantEnum = FormComponentVariantEnum;
  readonly FormComponentSizeEnum = FormComponentSizeEnum;
  readonly DEFAULT_SCROLL_HEIGHT = DEFAULT_SCROLL_HEIGHT;

  // Dropdown options
  documentCategories: DocumentCategory[] = [
    { label: 'All Categories', value: '', icon: 'pi pi-list' },
    { label: 'Study Protocol', value: 'protocol', icon: 'pi pi-file-pdf' },
    { label: 'Informed Consent', value: 'consent', icon: 'pi pi-file-word' },
    { label: 'Case Report Form', value: 'case_report', icon: 'pi pi-table' },
    { label: 'Lab Results', value: 'lab_result', icon: 'pi pi-chart-line' },
    { label: 'Medical Images', value: 'medical_image', icon: 'pi pi-image' },
    { label: 'Regulatory Documents', value: 'regulatory', icon: 'pi pi-shield' },
    { label: 'Other', value: 'other', icon: 'pi pi-file' },
  ];

  documentStatuses: DocumentStatus[] = [
    { label: 'All Statuses', value: '', severity: 'info' },
    { label: 'Active', value: 'active', severity: 'success' },
    { label: 'Pending Review', value: 'pending_review', severity: 'warn' },
    { label: 'Approved', value: 'approved', severity: 'success' },
    { label: 'Rejected', value: 'rejected', severity: 'danger' },
    { label: 'Archived', value: 'archived', severity: 'info' },
  ];

  studies = [
    { label: 'All Studies', value: '' },
    { label: 'Phase III Cardiovascular Drug Trial', value: '1' },
    { label: 'Oncology Immunotherapy Study', value: '2' },
    { label: 'Diabetes Prevention Trial', value: '3' },
    { label: "Alzheimer's Disease Research", value: '4' },
  ];

  participants = [
    { label: 'All Participants', value: '' },
    { label: 'P123456001 - Sarah Johnson', value: 'P123456001' },
    { label: 'P123456002 - Michael Chen', value: 'P123456002' },
    { label: 'P123456003 - Emily Rodriguez', value: 'P123456003' },
    { label: 'P123456004 - David Kim', value: 'P123456004' },
    { label: 'P123456005 - Maria Garcia', value: 'P123456005' },
  ];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.loadDocuments();
  }

  initializeForms(): void {
    this.uploadForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', Validators.required],
      participantId: [''],
      studyId: ['', Validators.required],
      description: [''],
      isConfidential: [false],
      tags: [[]],
    });

    this.filterForm = this.fb.group({
      search: [''],
      category: [''],
      status: [''],
      participantId: [''],
      studyId: [''],
    });
  }

  loadDocuments(): void {
    this.isLoading = true;

    // Simulate API call with mock data
    setTimeout(() => {
      this.documents = this.generateMockDocuments();
      this.filteredDocuments = [...this.documents];
      this.isLoading = false;
    }, 1000);
  }

  generateMockDocuments(): Document[] {
    return [
      {
        id: 'DOC001',
        name: 'Informed_Consent_Form_v2.3.pdf',
        type: 'application/pdf',
        category: 'consent',
        size: 2548736,
        uploadDate: '2025-06-15T10:30:00Z',
        uploadedBy: 'Dr. Sarah Johnson',
        participantId: 'P123456001',
        studyId: '1',
        version: '2.3',
        status: 'approved',
        description: 'Updated informed consent form with latest regulatory requirements',
        tags: ['consent', 'regulatory', 'v2.3'],
        downloadCount: 12,
        lastAccessed: '2025-06-18T14:20:00Z',
        accessedBy: 'Dr. Michael Chen',
        fileExtension: 'pdf',
        checksum: 'a1b2c3d4e5f6',
        isConfidential: true,
      },
      {
        id: 'DOC002',
        name: 'Lab_Results_2025-06-16.xlsx',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        category: 'lab_result',
        size: 1024000,
        uploadDate: '2025-06-16T09:15:00Z',
        uploadedBy: 'Lab Technician Alex Wilson',
        participantId: 'P123456002',
        studyId: '2',
        version: '1.0',
        status: 'active',
        description: 'Complete blood panel and biomarker analysis',
        tags: ['lab', 'biomarkers', 'blood'],
        downloadCount: 8,
        lastAccessed: '2025-06-17T11:45:00Z',
        accessedBy: 'Dr. Emily Rodriguez',
        fileExtension: 'xlsx',
        checksum: 'f6e5d4c3b2a1',
        isConfidential: true,
      },
      {
        id: 'DOC003',
        name: 'Study_Protocol_Amendment_3.docx',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        category: 'protocol',
        size: 3145728,
        uploadDate: '2025-06-14T16:20:00Z',
        uploadedBy: 'Dr. Principal Investigator',
        studyId: '1',
        version: '3.0',
        status: 'pending_review',
        description: 'Protocol amendment addressing safety concerns and inclusion criteria updates',
        tags: ['protocol', 'amendment', 'safety'],
        downloadCount: 25,
        lastAccessed: '2025-06-18T10:30:00Z',
        accessedBy: 'Regulatory Affairs Manager',
        fileExtension: 'docx',
        checksum: 'abc123def456',
        isConfidential: false,
      },
      {
        id: 'DOC004',
        name: 'MRI_Scan_Brain_P123456003.dicom',
        type: 'application/dicom',
        category: 'medical_image',
        size: 52428800,
        uploadDate: '2025-06-17T13:45:00Z',
        uploadedBy: 'Radiology Department',
        participantId: 'P123456003',
        studyId: '4',
        version: '1.0',
        status: 'active',
        description: "Baseline brain MRI scan for Alzheimer's research study",
        tags: ['mri', 'brain', 'baseline'],
        downloadCount: 3,
        lastAccessed: '2025-06-18T09:00:00Z',
        accessedBy: 'Dr. Neurologist',
        fileExtension: 'dicom',
        checksum: '789abc123def',
        isConfidential: true,
      },
      {
        id: 'DOC005',
        name: 'Adverse_Event_Report_AE001.pdf',
        type: 'application/pdf',
        category: 'case_report',
        size: 1536000,
        uploadDate: '2025-06-18T11:00:00Z',
        uploadedBy: 'Clinical Research Coordinator',
        participantId: 'P123456004',
        studyId: '2',
        version: '1.1',
        status: 'approved',
        description: 'Serious adverse event report - Grade 3 nausea',
        tags: ['adverse-event', 'serious', 'nausea'],
        downloadCount: 6,
        lastAccessed: '2025-06-18T15:30:00Z',
        accessedBy: 'Safety Manager',
        fileExtension: 'pdf',
        checksum: 'def456ghi789',
        isConfidential: true,
      },
      {
        id: 'DOC006',
        name: 'FDA_Submission_Package.zip',
        type: 'application/zip',
        category: 'regulatory',
        size: 104857600,
        uploadDate: '2025-06-13T14:30:00Z',
        uploadedBy: 'Regulatory Affairs',
        studyId: '1',
        version: '1.0',
        status: 'archived',
        description: 'Complete FDA submission package for IND application',
        tags: ['fda', 'submission', 'ind'],
        downloadCount: 15,
        lastAccessed: '2025-06-16T12:00:00Z',
        accessedBy: 'Quality Assurance',
        fileExtension: 'zip',
        checksum: 'ghi789jkl012',
        isConfidential: false,
      },
      {
        id: 'DOC007',
        name: 'Patient_Diary_Week1_P123456005.pdf',
        type: 'application/pdf',
        category: 'case_report',
        size: 512000,
        uploadDate: '2025-06-19T08:15:00Z',
        uploadedBy: 'P123456005',
        participantId: 'P123456005',
        studyId: '3',
        version: '1.0',
        status: 'pending_review',
        description: 'Week 1 patient diary entries for diabetes prevention study',
        tags: ['diary', 'week1', 'diabetes'],
        downloadCount: 2,
        fileExtension: 'pdf',
        checksum: 'jkl012mno345',
        isConfidential: true,
      },
    ];
  }

  // File upload methods
  onFileSelect(event: any): void {
    const files = event.files;
    if (files && files.length > 0) {
      this.showUploadDialog = true;
      const file = files[0];
      this.uploadForm.patchValue({
        name: file.name.split('.')[0],
      });
    }
  }

  uploadDocument(): void {
    // Check if required fields are filled
    const name = this.uploadForm.get('name')?.value;
    const category = this.uploadForm.get('category')?.value;
    const studyId = this.uploadForm.get('studyId')?.value;

    if (!name || !category || !studyId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields',
      });
      return;
    }

    this.isUploading = true;

    setTimeout(() => {
      const formValue = this.uploadForm.value;
      const newDocument: Document = {
        id: `DOC${String(this.documents.length + 1).padStart(3, '0')}`,
        name: `${formValue.name}.pdf`,
        type: 'application/pdf',
        category: formValue.category,
        size: Math.floor(Math.random() * 5000000) + 500000,
        uploadDate: new Date().toISOString(),
        uploadedBy: 'Current User',
        participantId: formValue.participantId,
        studyId: formValue.studyId,
        version: '1.0',
        status: 'pending_review',
        description: formValue.description,
        tags: formValue.tags || [],
        downloadCount: 0,
        fileExtension: 'pdf',
        isConfidential: formValue.isConfidential,
      };

      this.documents.unshift(newDocument);
      this.applyFilters();
      this.isUploading = false;
      this.showUploadDialog = false;
      this.uploadForm.reset();

      this.messageService.add({
        severity: 'success',
        summary: 'Upload Successful',
        detail: 'Document has been uploaded successfully',
      });
    }, 2000);
  }

  // Filter and search methods
  applyFilters(): void {
    this.filteredDocuments = this.documents.filter((doc) => {
      const matchesSearch =
        !this.searchValue ||
        doc.name.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        doc.description?.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        doc.uploadedBy.toLowerCase().includes(this.searchValue.toLowerCase());

      const matchesCategory = !this.selectedCategory || doc.category === this.selectedCategory;
      const matchesStatus = !this.selectedStatus || doc.status === this.selectedStatus;
      const matchesParticipant =
        !this.selectedParticipant || doc.participantId === this.selectedParticipant;
      const matchesStudy = !this.selectedStudy || doc.studyId === this.selectedStudy;

      return (
        matchesSearch && matchesCategory && matchesStatus && matchesParticipant && matchesStudy
      );
    });
  }

  onSearchChange(value: string): void {
    this.searchValue = value;
    this.applyFilters();
  }

  onCategoryChange(value: string): void {
    this.selectedCategory = value;
    this.applyFilters();
  }

  onStatusChange(value: string): void {
    this.selectedStatus = value;
    this.applyFilters();
  }

  onParticipantChange(value: string): void {
    this.selectedParticipant = value;
    this.applyFilters();
  }

  onStudyChange(value: string): void {
    this.selectedStudy = value;
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchValue = '';
    this.selectedCategory = '';
    this.selectedStatus = '';
    this.selectedParticipant = '';
    this.selectedStudy = '';
    this.filteredDocuments = [...this.documents];
  }

  // Document actions
  viewDocument(document: Document): void {
    this.selectedDocument = document;
    this.showViewDialog = true;
  }

  downloadDocument(document: Document): void {
    document.downloadCount++;
    document.lastAccessed = new Date().toISOString();
    document.accessedBy = 'Current User';

    this.messageService.add({
      severity: 'info',
      summary: 'Download Started',
      detail: `Downloading ${document.name}`,
    });
  }

  editDocument(document: Document): void {
    this.selectedDocument = document;
    this.showDocumentDialog = true;

    // Populate form with current document data using setValue
    this.uploadForm.get('name')?.setValue(document.name.split('.')[0]);
    this.uploadForm.get('category')?.setValue(document.category);
    this.uploadForm.get('participantId')?.setValue(document.participantId);
    this.uploadForm.get('studyId')?.setValue(document.studyId);
    this.uploadForm.get('description')?.setValue(document.description);
    this.uploadForm.get('isConfidential')?.setValue(document.isConfidential);
    this.uploadForm.get('tags')?.setValue(document.tags);
  }

  deleteDocument(document: Document): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${document.name}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.documents = this.documents.filter((d) => d.id !== document.id);
        this.applyFilters();
        this.messageService.add({
          severity: 'success',
          summary: 'Document Deleted',
          detail: 'Document has been deleted successfully',
        });
      },
    });
  }

  bulkDeleteDocuments(): void {
    if (this.selectedDocuments.length === 0) return;

    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${this.selectedDocuments.length} selected documents?`,
      header: 'Confirm Bulk Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        const selectedIds = this.selectedDocuments.map((d) => d.id);
        this.documents = this.documents.filter((d) => !selectedIds.includes(d.id));
        this.selectedDocuments = [];
        this.applyFilters();
        this.messageService.add({
          severity: 'success',
          summary: 'Documents Deleted',
          detail: `${selectedIds.length} documents have been deleted successfully`,
        });
      },
    });
  }

  // Utility methods
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  canUpload(): boolean {
    const name = this.uploadForm.get('name')?.value;
    const category = this.uploadForm.get('category')?.value;
    const studyId = this.uploadForm.get('studyId')?.value;
    return !!(name && category && studyId);
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' {
    const statusMap: Record<string, 'success' | 'info' | 'warn' | 'danger'> = {
      active: 'success',
      approved: 'success',
      pending_review: 'warn',
      rejected: 'danger',
      archived: 'info',
    };
    return statusMap[status] || 'info';
  }

  getStatusLabel(status: string): string {
    const statusOption = this.documentStatuses.find((s) => s.value === status);
    return statusOption?.label || status;
  }

  getCategoryIcon(category: string): string {
    const iconMap: Record<string, string> = {
      protocol: 'pi pi-file-pdf',
      consent: 'pi pi-file-word',
      case_report: 'pi pi-table',
      lab_result: 'pi pi-chart-line',
      medical_image: 'pi pi-image',
      regulatory: 'pi pi-shield',
      other: 'pi pi-file',
    };
    return iconMap[category] || 'pi pi-file';
  }

  getCategoryLabel(category: string): string {
    const categoryOption = this.documentCategories.find((c) => c.value === category);
    return categoryOption?.label || category;
  }

  getStudyLabel(studyId: string): string {
    const studyOption = this.studies.find((s) => s.value === studyId);
    return studyOption?.label || studyId;
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
}
