import { Injectable } from '@angular/core';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { FormConfigService } from '../form/form-config.service';
import { ToastManagerService } from '../../../../core/services/toast-manager.service';
import { IFormControl } from '../../models/interfaces/form.interfaces';
import { FormElementType } from '../../models/enums/form.enums';

/**
 * Service responsible for validating drag and drop operations
 */
@Injectable({ providedIn: 'root' })
export class DragValidationService {
  /** Maximum allowed nesting level for column elements */
  private readonly MAX_COLUMN_NESTING_LEVEL: number;

  /** Flag to track if we've shown the nesting warning to avoid spamming */
  private _hasShownNestingWarning = false;

  constructor(
    private formConfigService: FormConfigService,
    private toastManager: ToastManagerService,
  ) {
    // Get max nesting level from config service
    this.MAX_COLUMN_NESTING_LEVEL = this.formConfigService.getMaxColumnNestingLevel();
  }

  /**
   * Determine if a drop is allowed based on the current hover state and nesting rules
   *
   * @param drag The drag element
   * @param drop The drop list
   * @param currentHoverDropListId The ID of the currently hovered drop list
   * @returns Boolean indicating if a drop is allowed
   */
  isDropAllowed<T, U>(
    drag: CdkDrag<T>,
    drop: CdkDropList<U[]>,
    currentHoverDropListId?: string,
  ): boolean {
    // First, check the current hover state
    if (currentHoverDropListId == null) {
      return true;
    }

    if (currentHoverDropListId === 'no-drop') {
      return false;
    }

    // Check if dropping here would exceed the nesting limit
    const dropElement: HTMLElement = drop.element.nativeElement;
    if (this.isExceedingNestingLimit(drag.data as unknown as IFormControl, dropElement)) {
      return false;
    }

    return drop.id === currentHoverDropListId;
  }

  /**
   * Checks if dropping the element exceeds the maximum nesting level
   *
   * @param dragItem The item being dragged
   * @param dropElement The potential drop target element
   * @returns True if the nesting limit is exceeded
   */
  isExceedingNestingLimit(
    dragItem: IFormControl | null | undefined,
    dropElement: Element,
  ): boolean {
    // Only apply nesting limit to Column elements
    if (!dragItem) {
      return false;
    }

    // Handle case where dragItem might be an array or other type
    let itemType: string | undefined;

    if (typeof dragItem === 'object') {
      if ('type' in dragItem) {
        itemType = (dragItem as { type: string }).type;
      } else {
        // Not a recognized form control
        return false;
      }
    } else {
      // Not an object
      return false;
    }

    // Check for Columns type
    if (itemType !== FormElementType.COLUMNS) {
      return false;
    }

    // Get the current nesting level from data attribute if available
    const nestingLevelAttr: string | null = dropElement.getAttribute('data-nesting-level');
    if (nestingLevelAttr) {
      const nestingLevel: number = parseInt(nestingLevelAttr, 10);
      return nestingLevel >= this.MAX_COLUMN_NESTING_LEVEL;
    }

    // Fallback to DOM traversal method if data attribute not found
    let nestingLevel = 0;
    let currentElement: Element | null = dropElement;

    while (currentElement && nestingLevel < this.MAX_COLUMN_NESTING_LEVEL) {
      // Check if an element is within a column component
      if (
        currentElement.classList.contains('column-container') ||
        currentElement.closest('.column-container')
      ) {
        nestingLevel++;
      }

      // Move up one level in the DOM
      const parent: Element | null = currentElement.parentElement;
      if (!parent) break;
      currentElement = parent;
    }

    return nestingLevel >= this.MAX_COLUMN_NESTING_LEVEL;
  }

  /**
   * Show a warning toast if the nesting level is exceeded
   * Avoids showing the toast too frequently
   *
   * @param dragData The form control being dragged
   * @returns True if a warning was shown
   */
  showNestingLimitWarningIfNeeded(dragData: IFormControl): boolean {
    // Only show warnings for column elements
    if (dragData?.type !== FormElementType.COLUMNS) {
      return false;
    }

    // Use a static property to track if we've shown the toast to avoid spamming
    if (!this._hasShownNestingWarning) {
      this.toastManager.warn(
        `Maximum column nesting level (${this.MAX_COLUMN_NESTING_LEVEL}) reached. Cannot nest columns deeper.`,
      );
      this._hasShownNestingWarning = true;

      // Reset the warning flag after a few seconds
      setTimeout((): void => {
        this._hasShownNestingWarning = false;
      }, 5000);

      return true;
    }

    return false;
  }
}
