import { Injectable } from '@angular/core';
import { BaseDialogService } from './base-dialog.service';
import { IDialogRegistration } from '../../models/interfaces/dialog.interfaces';
import { IFormControl } from '../../models/interfaces/form.interfaces';

/**
 * Factory service for creating and managing form control dialogs
 * Provides a unified interface and reduces code duplication
 */
@Injectable({
  providedIn: 'root',
})
export class DialogFactoryService extends BaseDialogService {
  private dialogRegistry = new Map<string, IDialogRegistration<any>>();

  /**
   * Register a dialog component for a specific control type
   */
  registerDialog<T extends IFormControl>(registration: IDialogRegistration<T>): void {
    this.dialogRegistry.set(registration.controlType, registration);
  }
}
