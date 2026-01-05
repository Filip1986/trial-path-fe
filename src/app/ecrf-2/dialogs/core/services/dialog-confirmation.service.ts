import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

/**
 * Service to provide consistent confirmation dialogs across form dialogs
 */
@Injectable({
  providedIn: 'root',
})
export class DialogConfirmationService {
  constructor(private confirmationService: ConfirmationService) {}

  /**
   * Show a confirmation dialog for unsaved changes
   */
  confirmUnsavedChanges(): Promise<boolean> {
    return new Promise((resolve): void => {
      this.confirmationService.confirm({
        message: 'You have unsaved changes. Are you sure you want to close without saving?',
        header: 'Unsaved Changes',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: 'pi pi-check',
        rejectIcon: 'pi pi-times',
        acceptLabel: 'Yes, Close',
        rejectLabel: 'Cancel',
        acceptButtonStyleClass: 'p-button-danger p-button-sm',
        rejectButtonStyleClass: 'p-button-secondary p-button-outlined p-button-sm',
        accept: (): void => resolve(true),
        reject: (): void => resolve(false),
      });
    });
  }

  /**
   * Show a confirmation dialog for deleting presets
   */
  confirmDeletePreset(presetName: string): Promise<boolean> {
    return new Promise((resolve): void => {
      this.confirmationService.confirm({
        message: `Are you sure you want to delete the preset "${presetName}"? This action cannot be undone.`,
        header: 'Delete Preset',
        icon: 'pi pi-trash',
        acceptIcon: 'pi pi-check',
        rejectIcon: 'pi pi-times',
        acceptLabel: 'Delete',
        rejectLabel: 'Cancel',
        acceptButtonStyleClass: 'p-button-danger p-button-sm',
        rejectButtonStyleClass: 'p-button-secondary p-button-outlined p-button-sm',
        accept: (): void => resolve(true),
        reject: (): void => resolve(false),
      });
    });
  }

  /**
   * Show a confirmation dialog for form reset/clear
   */
  confirmFormReset(): Promise<boolean> {
    return new Promise((resolve): void => {
      this.confirmationService.confirm({
        message:
          'This will reset the form to its default values. Are you sure you want to continue?',
        header: 'Reset Form',
        icon: 'pi pi-refresh',
        acceptIcon: 'pi pi-check',
        rejectIcon: 'pi pi-times',
        acceptLabel: 'Reset',
        rejectLabel: 'Cancel',
        acceptButtonStyleClass: 'p-button-warning p-button-sm',
        rejectButtonStyleClass: 'p-button-secondary p-button-outlined p-button-sm',
        accept: (): void => resolve(true),
        reject: (): void => resolve(false),
      });
    });
  }

  /**
   * Show a generic confirmation dialog
   */
  confirm(options: {
    message: string;
    header?: string;
    icon?: string;
    acceptLabel?: string;
    rejectLabel?: string;
  }): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmationService.confirm({
        message: options.message,
        header: options.header || 'Confirm',
        icon: options.icon || 'pi pi-question-circle',
        acceptIcon: 'pi pi-check',
        rejectIcon: 'pi pi-times',
        acceptLabel: options.acceptLabel || 'Yes',
        rejectLabel: options.rejectLabel || 'No',
        acceptButtonStyleClass: 'p-button-primary p-button-sm',
        rejectButtonStyleClass: 'p-button-secondary p-button-outlined p-button-sm',
        accept: (): void => resolve(true),
        reject: (): void => resolve(false),
      });
    });
  }
}
