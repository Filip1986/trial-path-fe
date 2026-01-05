import {
  Component,
  OnInit,
  inject,
  signal,
  WritableSignal,
  ChangeDetectionStrategy,
} from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TextareaModule } from 'primeng/textarea';
import { Participant } from '../../models/interfaces';

@Component({
  selector: 'app-participant-form-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    MessageModule,
    ProgressSpinnerModule,
    ToastModule,
    TextareaModule
],
  providers: [MessageService],
  templateUrl: './participant-form-page.component.html',
  styleUrls: ['./participant-form-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantFormPageComponent implements OnInit {
  participantForm!: FormGroup;
  participant: WritableSignal<Participant | null> = signal<Participant | null>(null);
  isEditMode: WritableSignal<boolean> = signal(false);
  saving: WritableSignal<boolean> = signal(false);

  relationshipOptions = [
    { label: 'Spouse', value: 'spouse' },
    { label: 'Parent', value: 'parent' },
    { label: 'Child', value: 'child' },
    { label: 'Sibling', value: 'sibling' },
    { label: 'Friend', value: 'friend' },
    { label: 'Other Relative', value: 'other_relative' },
    { label: 'Other', value: 'other' },
  ];

  countryOptions = [
    { label: 'United States', value: 'USA' },
    { label: 'Canada', value: 'Canada' },
    { label: 'United Kingdom', value: 'UK' },
    { label: 'Other', value: 'other' },
  ];

  studyOptions = [
    { label: 'Cardiovascular Health Study', value: 'study-001' },
    { label: 'Diabetes Prevention Trial', value: 'study-002' },
    { label: 'Neurological Disorder Research', value: 'study-003' },
  ];

  private fb: FormBuilder = inject(FormBuilder);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private messageService: MessageService = inject(MessageService);

  ngOnInit(): void {
    this.initializeForm();
    this.loadParticipant();
  }

  private initializeForm(): void {
    this.participantForm = this.fb.group({
      firstName: ['', [Validators.required]],
      middleName: [''],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      ethnicity: [''],
      address: this.fb.group({
        street: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        zipCode: ['', [Validators.required]],
        country: ['', [Validators.required]],
      }),
      emergencyContact: this.fb.group({
        name: ['', [Validators.required]],
        relationship: ['', [Validators.required]],
        phone: ['', [Validators.required]],
      }),
      studyId: ['', [Validators.required]],
      participantId: [''],
      medicalHistory: [''],
    });
  }

  private loadParticipant(): void {
    // Check if this is edit mode
    const resolved = this.route.snapshot.data['participant'] as Participant | null | undefined;
    this.participant.set(resolved ?? null);
    this.isEditMode.set(!!this.participant());

    if (this.isEditMode() && this.participant()) {
      this.populateForm(this.participant()!);
    }
  }

  private populateForm(participant: Participant): void {
    this.participantForm.patchValue({
      firstName: participant.firstName,
      middleName: participant.middleName,
      lastName: participant.lastName,
      email: participant.email,
      phone: participant.phone,
      dateOfBirth: participant.dateOfBirth,
      gender: participant.gender,
      ethnicity: participant.ethnicity,
      address: {
        street: participant.address, // Use the string address field
        city: participant.city,
        state: participant.state,
        zipCode: participant.zipCode,
        country: participant.country,
      },
      emergencyContact: {
        name: participant.emergencyContactName,
        relationship: participant.emergencyContactRelationship,
        phone: participant.emergencyContactPhone,
      },
      studyId: participant.studyId,
      participantId: participant.participantId,
      medicalHistory: participant.medicalHistory || '',
    });
  }

  onSubmit(): void {
    if (this.participantForm.valid) {
      this.saving.set(true);

      // Simulate API call
      setTimeout((): void => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.isEditMode()
            ? 'Participant updated successfully!'
            : 'Participant created successfully!',
        });

        this.saving.set(false);

        // Navigate to participant details or list
        const p: Participant | null = this.participant();
        if (this.isEditMode() && p) {
          void this.router.navigate(['/participants', p.id]);
        } else {
          void this.router.navigate(['/participants/all']);
        }
      }, 2000);
    } else {
      this.markFormGroupTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all required fields correctly.',
      });
    }
  }

  onReset(): void {
    this.participantForm.reset();
    if (this.isEditMode() && this.participant()) {
      this.populateForm(this.participant()!);
    }
    this.messageService.add({
      severity: 'info',
      summary: 'Reset',
      detail: 'Form has been reset.',
    });
  }

  goBack(): void {
    const p: Participant | null = this.participant();
    if (this.isEditMode() && p) {
      void this.router.navigate(['/participants', p.id]);
    } else {
      void this.router.navigate(['/participants/all']);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.participantForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  private markFormGroupTouched(): void {
    Object.keys(this.participantForm.controls).forEach((key: string): void => {
      const control = this.participantForm.get(key);
      if (control) {
        control.markAsTouched();
        if (control instanceof FormGroup) {
          this.markFormGroupTouched();
        }
      }
    });
  }
}
