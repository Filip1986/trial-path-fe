import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { UserListDto } from '@back-end/models/UserListDto';
import { SuspensionService } from '@core/services/suspension.service';

@Component({
  selector: 'app-suspension-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    DialogModule,
    SelectModule,
    CheckboxModule,
    ConfirmDialogModule,
  ],
  templateUrl: './user-suspension-dialog.component.html',
  styleUrl: './user-suspension-dialog.component.scss',
})
export class UserSuspensionDialogComponent {
  @Input() suspendDialogVisible = false;
  @Output() suspendDialogVisibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedUser: UserListDto | null = null;
  @Output() operationComplete = new EventEmitter<{
    success: boolean;
    user: UserListDto | null;
  }>();

  suspensionData = {
    suspensionReason: '',
    suspensionNotes: '',
    sendEmail: true,
  };

  isSuspending = false;
  reasonError = '';

  // Predefined reasons for suspension
  suspensionReasons = [
    {
      label: 'Violation of Terms of Service',
      value: 'Violation of Terms of Service',
    },
    {
      label: 'Inappropriate Content',
      value: 'Posting or sharing inappropriate content',
    },
    {
      label: 'Spam or Advertising',
      value: 'Spamming or unauthorized advertising',
    },
    {
      label: 'Harassment or Bullying',
      value: 'Harassment or bullying other users',
    },
    { label: 'Security Concerns', value: 'Account security concerns' },
    {
      label: 'Multiple Policy Violations',
      value: 'Multiple policy violations',
    },
    { label: 'Other', value: 'Other - see additional notes' },
  ];

  constructor(
    private suspensionService: SuspensionService,
    private messageService: MessageService,
  ) {}

  cancelSuspension(): void {
    this.resetDialog();
    this.suspendDialogVisible = false;
    this.suspendDialogVisibleChange.emit(false);
  }

  confirmSuspension(): void {
    // Validate inputs
    if (!this.suspensionData.suspensionReason) {
      this.reasonError = 'Please select a reason for suspension';
      return;
    }

    if (!this.selectedUser) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No user selected for suspension',
      });
      return;
    }

    this.isSuspending = true;

    // Call suspension service
    this.suspensionService
      .suspendUser(
        this.selectedUser!.id.toString(),
        this.suspensionData.suspensionReason,
        this.suspensionData.suspensionNotes,
      )
      .subscribe({
        next: (): void => {
          // Success
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `User ${this.selectedUser!.username} has been suspended`,
          });

          // Update local user data
          if (this.selectedUser) {
            this.selectedUser.isSuspended = true;
            this.selectedUser.suspensionReason = this.suspensionData.suspensionReason;
          }

          // Reset and close dialog
          this.resetDialog();
          this.isSuspending = false;
          this.suspendDialogVisible = false;
          this.suspendDialogVisibleChange.emit(false);

          // Emit completion event
          this.operationComplete.emit({
            success: true,
            user: this.selectedUser,
          });
        },
        error: (error) => {
          console.error('Error suspending user:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to suspend user. Please try again.',
          });
          this.isSuspending = false;
        },
      });
  }

  /**
   * Reset the dialog form
   */
  private resetDialog(): void {
    this.suspensionData = {
      suspensionReason: '',
      suspensionNotes: '',
      sendEmail: true,
    };
    this.reasonError = '';
  }
}
