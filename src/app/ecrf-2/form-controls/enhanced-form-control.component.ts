import { Component, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { FormControlComponentBase } from './control-component-base.class';
import { IconMappingService } from '../core/services/icon-mapping.service';
import { FormDialogService } from '../core/services/dialog/form-dialog.service';
import { ToastManagerService } from '../../core/services/toast-manager.service';
import { IFormControl } from '../core/models/interfaces/form.interfaces';

/**
 * Enhanced base class for all form control components
 * Provides standardized interface and common functionality for editing, deleting, and duplicating controls
 */
@Component({
  template: '', // Empty template for an abstract component
})
export abstract class EnhancedFormControlComponent<
  T extends IFormControl,
> extends FormControlComponentBase<T> {
  /** Event emitted when a control is edited */
  @Output() controlEdited: EventEmitter<T> = new EventEmitter<T>();

  /** Event emitted when a control is deleted */
  @Output() controlDeleted: EventEmitter<T> = new EventEmitter<T>();

  /** Event emitted when a control is duplicated */
  @Output() controlDuplicated: EventEmitter<T> = new EventEmitter<T>();

  /** Holds the icon name for the control */
  readonly iconName: string;

  /** Speed dial menu items */
  speedDialItems: MenuItem[] = [];

  /**
   * Creates an instance of EnhancedFormControlComponent
   *
   * @param iconService Service for retrieving icons
   * @param formDialogService Service for managing form dialogs
   * @param toastManager Service for displaying toast notifications
   * @param confirmationService Service for showing confirmation dialogs
   */
  protected constructor(
    protected iconService: IconMappingService,
    protected formDialogService: FormDialogService,
    protected toastManager: ToastManagerService,
    protected confirmationService: ConfirmationService,
  ) {
    super();
    this.iconName = this.getIconName();
    this.initializeSpeedDialItems();
  }

  /**
   * Handle click on the edit button
   * @param event Mouse event to stop propagation
   */
  onEditClick(event?: MouseEvent): void {
    event?.stopPropagation();
    if (!this.isValidControl()) return;

    this.openConfigDialog().subscribe({
      next: (updatedControl: T): void => {
        this.controlEdited.emit(updatedControl);
        this.toastManager.success(`${this.getControlTypeName()} updated successfully`);
      },
      error: (): void => {
        this.toastManager.info(`${this.getControlTypeName()} editing cancelled`);
      },
    });
  }

  /**
   * Handle click on the delete button with confirmation
   * @param event Mouse event to stop propagation
   */
  onDeleteClick(event?: MouseEvent): void {
    event?.stopPropagation();
    if (!this.control) return;

    const controlTypeName = this.getControlTypeName();
    const controlTitle = this.control.options?.title || this.control.title || 'Untitled';

    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${controlTitle}"?`,
      header: `Delete ${controlTypeName}`,
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-trash',
      rejectIcon: 'pi pi-times',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      rejectButtonStyleClass: 'p-button-secondary p-button-sm',
      accept: () => {
        this.controlDeleted.emit(this.control as T);
        this.toastManager.success(`${controlTypeName} "${controlTitle}" removed successfully`);
      },
      reject: () => {
        this.toastManager.info(`${controlTypeName} deletion cancelled`);
      },
    });
  }

  /**
   * Handle click on the duplicate button
   * @param event Mouse event to stop propagation
   */
  onDuplicateClick(event?: MouseEvent): void {
    event?.stopPropagation();
    if (!this.control) return;

    try {
      const duplicatedControl = this.createDuplicate();
      if (duplicatedControl) {
        this.controlDuplicated.emit(duplicatedControl);
        this.toastManager.success(`${this.getControlTypeName()} duplicated successfully`);
      } else {
        throw new Error('Duplication not implemented for this control type');
      }
    } catch (error) {
      console.error('Error duplicating control:', error);
      this.toastManager.error(`Failed to duplicate ${this.getControlTypeName()}`);
    }
  }

  /**
   * Handle value changes from the component
   * @param value The new value
   */
  onValueChange(value: any): void {
    if (this.control) {
      this.control.value = value;
    }
  }

  /**
   * Abstract method to open the configuration dialog
   * @returns Observable that emits the configured control
   */
  protected abstract openConfigDialog(): Observable<T>;

  /**
   * Abstract method to get a human-readable control type name
   * @returns The control type name
   */
  protected abstract getControlTypeName(): string;

  /**
   * Abstract method to get component-specific configuration
   * @returns Configuration object for the component
   */
  protected abstract getControlConfig(): any;

  /**
   * Abstract method to get the icon name for the control
   * @returns The icon name
   */
  protected abstract getIconName(): string;

  /**
   * Check if the control is valid for editing
   * @returns True if the control is valid
   */
  protected abstract isValidControl(): boolean;

  /**
   * Creates and returns a duplicate of the current instance or null if duplication is not possible.
   *
   * @return {T | null} A duplicate instance of type T or null if duplication cannot occur.
   */
  protected abstract createDuplicate(): T | null;

  /**
   * Handle special duplication cases for different control types
   * @param duplicatedControl The duplicated control
   * @param originalControl The original control
   */
  private handleSpecialDuplicationCases(duplicatedControl: any, originalControl: T): void {
    switch (originalControl.type) {
      case 'Radio':
        // For radio buttons, ensure they have a unique group name
        if (duplicatedControl.name) {
          duplicatedControl.name = `radio-group-${Math.random().toString(36).substring(2, 9)}`;
        }
        break;

      case 'Columns':
        // For columns, we might want to duplicate the nested structure
        // This is more complex and might require special handling
        break;

      case 'CheckBox':
        // For checkbox groups, ensure the value is properly initialized
        if (duplicatedControl.mode === 'group' && !Array.isArray(duplicatedControl.value)) {
          duplicatedControl.value = [];
        }
        break;

      default:
        // No special handling needed for other types
        break;
    }
  }

  /**
   * Initialize speed dial menu items
   */
  private initializeSpeedDialItems(): void {
    this.speedDialItems = [
      {
        icon: 'pi pi-pencil',
        tooltipOptions: {
          tooltipLabel: 'Edit field',
          tooltipPosition: 'top',
        },
        command: (event: MenuItemCommandEvent): void => {
          this.onEditClick(event.originalEvent as MouseEvent);
        },
        styleClass: 'p-button-info p-button-sm',
      },
      {
        icon: 'pi pi-copy',
        tooltipOptions: {
          tooltipLabel: 'Duplicate field',
          tooltipPosition: 'top',
        },
        command: (event: MenuItemCommandEvent): void => {
          this.onDuplicateClick(event.originalEvent as MouseEvent);
        },
        styleClass: 'p-button-success p-button-sm',
      },
      {
        icon: 'pi pi-trash',
        tooltipOptions: {
          tooltipLabel: 'Remove field',
          tooltipPosition: 'top',
        },
        command: (event: MenuItemCommandEvent): void => {
          this.onDeleteClick(event.originalEvent as MouseEvent);
        },
        styleClass: 'p-button-danger p-button-sm',
      },
    ];
  }
}
