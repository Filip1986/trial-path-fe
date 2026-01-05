import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { ReactiveFormsModule } from '@angular/forms';

interface Participant {
  id: string;
  name: string;
  studyId: string;
  enrollmentDate: string;
  group: string;
  status: string;
}

interface ComplianceOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-data-entry',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.scss'],
})
export class DataEntryComponent implements OnInit {
  dataEntryForm!: FormGroup;
  participants: Participant[] = [];
  selectedParticipant: Participant | null = null;
  saveStatus: 'idle' | 'saving' | 'success' | 'error' = 'idle';

  symptomOptions = [
    'Headache',
    'Nausea',
    'Fatigue',
    'Dizziness',
    'Chest Pain',
    'Shortness of Breath',
    'Fever',
    'Joint Pain',
    'Muscle Weakness',
  ];

  complianceOptions: ComplianceOption[] = [
    { value: 'excellent', label: 'Excellent (>95%)' },
    { value: 'good', label: 'Good (80-95%)' },
    { value: 'fair', label: 'Fair (60-79%)' },
    { value: 'poor', label: 'Poor (<60%)' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadMockData();
    this.initializeForm();
  }

  onParticipantSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const participantId = target.value;
    this.selectedParticipant = this.participants.find((p) => p.id === participantId) || null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.dataEntryForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isNestedFieldInvalid(groupName: string, fieldName: string): boolean {
    const field = this.dataEntryForm.get([groupName, fieldName]);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSave(): void {
    if (this.dataEntryForm.valid) {
      this.saveStatus = 'saving';

      // Simulate API call
      setTimeout(() => {
        this.saveStatus = 'success';
        console.log('Form Data:', this.dataEntryForm.value);

        // Reset status after 3 seconds
        setTimeout(() => {
          this.saveStatus = 'idle';
        }, 3000);
      }, 1000);
    } else {
      this.saveStatus = 'error';
      this.markFormGroupTouched(this.dataEntryForm);

      setTimeout(() => {
        this.saveStatus = 'idle';
      }, 3000);
    }
  }

  private loadMockData(): void {
    this.participants = [
      {
        id: 'P123456001',
        name: 'Sarah Johnson',
        studyId: 'CVD-2025-001',
        enrollmentDate: '2025-01-15',
        group: 'Treatment A',
        status: 'Active',
      },
      {
        id: 'P123456002',
        name: 'Michael Chen',
        studyId: 'ONC-2025-002',
        enrollmentDate: '2025-02-03',
        group: 'Treatment B',
        status: 'Active',
      },
      {
        id: 'P123456003',
        name: 'Emily Rodriguez',
        studyId: 'CVD-2025-001',
        enrollmentDate: '2025-01-28',
        group: 'Control',
        status: 'Active',
      },
      {
        id: 'P123456004',
        name: 'David Kim',
        studyId: 'NEU-2025-003',
        enrollmentDate: '2025-03-10',
        group: 'Treatment A',
        status: 'Active',
      },
    ];
  }

  private initializeForm(): void {
    this.dataEntryForm = this.fb.group({
      participantId: ['', Validators.required],
      visitDate: ['', Validators.required],
      vitalSigns: this.fb.group({
        systolicBP: ['', [Validators.min(70), Validators.max(250)]],
        diastolicBP: ['', [Validators.min(40), Validators.max(150)]],
        heartRate: ['', [Validators.min(30), Validators.max(200)]],
        temperature: ['', [Validators.min(35), Validators.max(42)]],
        weight: [''],
        height: [''],
      }),
      clinicalAssessment: this.fb.group({
        symptoms: this.fb.array(this.symptomOptions.map(() => this.fb.control(false))),
        compliance: [''],
        adverseEvents: [''],
        concomitantMeds: [''],
      }),
      labResults: this.fb.group({
        hemoglobin: [''],
        plateletCount: [''],
        creatinine: [''],
        glucose: [''],
      }),
      notes: [''],
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched({ onlySelf: true });
      }
    });
  }
}
