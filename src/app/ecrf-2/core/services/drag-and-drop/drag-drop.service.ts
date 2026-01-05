import {
  CdkDrag,
  CdkDragDrop,
  CdkDragMove,
  CdkDragRelease,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DropZoneRegistryService } from './drop-zone-registry.service';
import { DragValidationService } from './drag-validation.service';
import { DragFeedbackService } from './drag-feedback.service';
import { ControlDropHandlerService } from './control-drop-handler.service';
import { debounceTime } from 'rxjs/operators';
import { IFormControl } from '../../models/interfaces/form.interfaces';
import { ELEMENT_CONTAINERS } from '../../models/consts/element-containers.const';

/**
 * Orchestration service for drag and drop operations in the form builder
 * Coordinates specialized services for each aspect of drag-drop functionality
 */
@Injectable({ providedIn: 'root' })
export class DragDropService {
  // Subject to notify components when change detection is needed
  private changeDetectionSubject: Subject<void> = new Subject<void>();

  // Observable that components can subscribe to for change detection
  public changeDetectionNeeded$: Observable<void> = this.changeDetectionSubject.pipe(
    // Debounce change detection to avoid excessive updates during drag operations
    debounceTime(50),
  );

  // Batch update timer
  private batchUpdateTimer: any = null;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private dropZoneRegistry: DropZoneRegistryService,
    private dragValidation: DragValidationService,
    private dragFeedback: DragFeedbackService,
    private controlDropHandler: ControlDropHandlerService,
    private ngZone: NgZone,
  ) {}

  /**
   * Get the list of registered drop lists
   */
  get dropLists(): CdkDropList<IFormControl[]>[] {
    return this.dropZoneRegistry.dropLists;
  }

  /**
   * Get an observable that emits when a control is dropped
   */
  get controlDropped(): Observable<IFormControl> {
    return this.controlDropHandler.controlDropped.asObservable();
  }

  /**
   * Register a drop-list with the service
   *
   * @param dropList The drop list to register
   */
  public register(dropList: CdkDropList<IFormControl[]>): void {
    this.dropZoneRegistry.register(dropList);
  }

  /**
   * Track mouse position during drag and identify potential drop targets
   * Uses batching to reduce performance impact
   *
   * @param event The drag move event
   */
  dragMoved(event: CdkDragMove<IFormControl>): void {
    // Clear any existing timer
    if (this.batchUpdateTimer) {
      clearTimeout(this.batchUpdateTimer);
    }

    // Use NgZone.runOutsideAngular to avoid triggering change detection
    this.ngZone.runOutsideAngular((): void => {
      // Set a new timer for batched update
      this.batchUpdateTimer = setTimeout((): void => {
        this.processDragMove(event);
      }, 16); // Roughly 60fps
    });
  }

  /**
   * Determine if a drop is allowed based on the current hover state and nesting rules
   *
   * @param drag The drag element
   * @param drop The drop list
   * @returns Boolean indicating if a drop is allowed
   */
  isDropAllowed<T, U>(drag: CdkDrag<T>, drop: CdkDropList<U[]>): boolean {
    return this.dragValidation.isDropAllowed(
      drag,
      drop,
      this.dropZoneRegistry.currentHoverDropListId,
    );
  }

  /**
   * Handle the drop event
   *
   * @param event The drag drop event
   */
  drop(event: CdkDragDrop<IFormControl[]>): void {
    // Clear the batch update timer
    if (this.batchUpdateTimer) {
      clearTimeout(this.batchUpdateTimer);
      this.batchUpdateTimer = null;
    }

    this.controlDropHandler.handleDrop(event).subscribe({
      next: (): void => {
        // Notify subscribers that they need to trigger change detection
        this.notifyChangeDetectionNeeded();
      },
      error: (err: any): void => {
        console.error('Error handling drop:', err);
        this.notifyChangeDetectionNeeded();
      },
      complete: (): void => {
        this.dragFeedback.clearActiveDropZone();
      },
    });
  }

  /**
   * Handle drag release event
   *
   * @param event The drag release event
   */
  dragReleased(event: CdkDragRelease): void {
    // Clear the batch update timer
    if (this.batchUpdateTimer) {
      clearTimeout(this.batchUpdateTimer);
      this.batchUpdateTimer = null;
    }

    this.dropZoneRegistry.setCurrentHoverDropListId(undefined);
    this.dragFeedback.clearActiveDropZone();

    // Notify about the release for change detection
    this.notifyChangeDetectionNeeded();
  }

  /**
   * Process the drag move event
   * @param event The drag move event
   */
  private processDragMove(event: CdkDragMove<IFormControl>): void {
    const elementFromPoint: Element | null = this.document.elementFromPoint(
      event.pointerPosition.x,
      event.pointerPosition.y,
    );

    if (!elementFromPoint) {
      this.dragFeedback.clearActiveDropZone();
      this.dropZoneRegistry.setCurrentHoverDropListId(undefined);
      return;
    }

    if (elementFromPoint.classList.contains('no-drop')) {
      this.dragFeedback.clearActiveDropZone();
      this.dropZoneRegistry.setCurrentHoverDropListId(ELEMENT_CONTAINERS.NO_DROP);
      return;
    }

    const dropList: Element | null = elementFromPoint.classList.contains('cdk-drop-list')
      ? elementFromPoint
      : elementFromPoint.closest('.cdk-drop-list');

    if (!dropList) {
      this.dragFeedback.clearActiveDropZone();
      this.dropZoneRegistry.setCurrentHoverDropListId(undefined);
      return;
    }

    // Check if we're trying to nest columns too deeply
    const dragData = event.source.data as IFormControl;
    if (this.dragValidation.isExceedingNestingLimit(dragData, dropList)) {
      this.dragFeedback.clearActiveDropZone();
      this.dropZoneRegistry.setCurrentHoverDropListId(ELEMENT_CONTAINERS.NO_DROP);

      // Show warning toast if needed
      this.dragValidation.showNestingLimitWarningIfNeeded(dragData);
      return;
    }

    // Set new current hover ID
    this.dropZoneRegistry.setCurrentHoverDropListId(dropList.id);

    // Add Tailwind classes for the active drop zone
    this.dragFeedback.updateDropFeedback(dropList);
  }

  /**
   * Notify subscribers that change detection is needed
   * Runs inside Angular zone to ensure change detection is triggered
   */
  private notifyChangeDetectionNeeded(): void {
    // Run inside the Angular zone to trigger change detection
    this.ngZone.run((): void => {
      this.changeDetectionSubject.next();
    });
  }
}
