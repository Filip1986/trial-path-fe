import { Component, OnInit, ChangeDetectionStrategy, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CKEditorComponent } from '@artificial-sense/ui-lib';
import {
  PrivacyPolicyDto,
  PrivacyPolicyService,
  CreatePrivacyPolicyDto,
  UpdatePrivacyPolicyDto,
} from '../../../../../../shared/src/lib/api';
import { Tag } from 'primeng/tag';
import { Ripple } from 'primeng/ripple';
import { Tooltip } from 'primeng/tooltip';
import { DatePickerModule } from 'primeng/datepicker';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

interface PolicyFormValues {
  version: string;
  content: string;
  effectiveDate: string;
  isActive: boolean;
}

@Component({
  selector: 'app-privacy-policy-management',
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
    DatePickerModule,
    SelectModule,
    TabsModule,
    ToggleButtonModule,
    ToastModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    CKEditorComponent,
    Tag,
    Ripple,
    Tooltip,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './privacy-policy-management.component.html',
  styleUrls: ['./privacy-policy-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPolicyManagementComponent implements OnInit {
  policies: WritableSignal<PrivacyPolicyDto[]> = signal<PrivacyPolicyDto[]>([]);
  selectedPolicy: PrivacyPolicyDto | null = null;
  policyForm: FormGroup | null = null;

  isLoading: WritableSignal<boolean> = signal(true);
  isSaving: WritableSignal<boolean> = signal(false);
  editMode = false;

  // Keep dialog visibility as plain booleans due to [(visible)] two-way binding
  viewPolicyDialog = false;
  editPolicyDialog = false;
  newPolicyDialog = false;

  constructor(
    private privacyPolicyService: PrivacyPolicyService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.loadPolicies();
  }

  loadPolicies(): void {
    this.isLoading.set(true);

    this.privacyPolicyService
      .privacyPolicyControllerGetAllVersions()
      .pipe(finalize((): void => this.isLoading.set(false)))
      .subscribe({
        next: (privacyPolicyDto: PrivacyPolicyDto[]): void => {
          this.policies.set(privacyPolicyDto);
        },
        error: (error: any): void => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load privacy policies: ' + (error.message || 'Unknown error'),
          });
        },
      });
  }

  viewPolicy(policy: PrivacyPolicyDto): void {
    this.selectedPolicy = policy;
    this.viewPolicyDialog = true;
  }

  editPolicy(policy: PrivacyPolicyDto): void {
    this.selectedPolicy = { ...policy };
    this.editMode = true;
    this.initForm(policy);
    this.editPolicyDialog = true;
  }

  makeActive(policy: PrivacyPolicyDto): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to make ${policy.version} the active privacy policy? This will deactivate all other versions.`,
      header: 'Confirm Activation',
      icon: 'pi pi-exclamation-triangle',
      accept: (): void => {
        const updateData: UpdatePrivacyPolicyDto = {
          content: policy.content,
          effectiveDate: new Date(policy.effectiveDate).toISOString(),
          isActive: true,
        };

        this.updatePolicy(policy.version, updateData);
      },
    });
  }

  openNewPolicyDialog(): void {
    this.editMode = false;
    this.initForm();
    this.newPolicyDialog = true;
  }

  cancelEdit(): void {
    this.editPolicyDialog = false;
    this.selectedPolicy = null;
    this.policyForm = null;
  }

  cancelCreate(): void {
    this.newPolicyDialog = false;
    this.policyForm = null;
  }

  savePolicy(): void {
    if (this.policyForm?.valid && this.selectedPolicy) {
      this.isSaving.set(true);

      const formValues: PolicyFormValues = this.policyForm.value;
      const updateData: UpdatePrivacyPolicyDto = {
        content: formValues.content,
        effectiveDate: new Date(formValues.effectiveDate).toISOString(),
        isActive: formValues.isActive,
      };

      this.updatePolicy(this.selectedPolicy.version, updateData);
    }
  }

  createPolicy(): void {
    if (this.policyForm?.valid) {
      this.isSaving.set(true);

      const formValues: any = this.policyForm.value;
      const createData: CreatePrivacyPolicyDto = {
        version: formValues.version,
        content: formValues.content,
        effectiveDate: new Date(formValues.effectiveDate).toISOString(),
        isActive: formValues.isActive,
      };

      this.privacyPolicyService
        .privacyPolicyControllerCreatePrivacyPolicy(createData)
        .pipe(finalize((): void => this.isSaving.set(false)))
        .subscribe({
          next: (privacyPolicyDto: PrivacyPolicyDto): void => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Privacy policy ${privacyPolicyDto.version} created successfully`,
            });
            this.newPolicyDialog = false;
            this.loadPolicies();
          },
          error: (error: Error | HttpErrorResponse): void => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to create privacy policy: ' + (error.message || 'Unknown error'),
            });
          },
        });
    }
  }

  private updatePolicy(version: string, updateData: UpdatePrivacyPolicyDto): void {
    this.privacyPolicyService
      .privacyPolicyControllerUpdatePrivacyPolicy(version, updateData)
      .pipe(finalize((): void => this.isSaving.set(false)))
      .subscribe({
        next: (privacyPolicyDto: PrivacyPolicyDto): void => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Privacy policy ${privacyPolicyDto.version} updated successfully`,
          });
          this.editPolicyDialog = false;
          this.loadPolicies();
        },
        error: (error: any): void => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update privacy policy: ' + (error.message || 'Unknown error'),
          });
        },
      });
  }

  private initForm(policy?: PrivacyPolicyDto): void {
    if (policy) {
      // Edit mode
      this.policyForm = this.fb.group({
        version: [{ value: policy.version, disabled: true }, [Validators.required]],
        effectiveDate: [new Date(policy.effectiveDate), [Validators.required]],
        isActive: [policy.isActive],
        content: [policy.content, [Validators.required, Validators.minLength(10)]],
      });
    } else {
      // Create mode
      this.policyForm = this.fb.group({
        version: ['', [Validators.required]],
        effectiveDate: [new Date(), [Validators.required]],
        isActive: [true],
        content: ['', [Validators.required, Validators.minLength(10)]],
      });
    }
  }
}
