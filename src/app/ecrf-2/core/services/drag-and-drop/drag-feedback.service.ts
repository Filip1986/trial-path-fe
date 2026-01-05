import { Injectable } from '@angular/core';

/**
 * Service responsible for visual feedback during drag operations
 */
@Injectable({ providedIn: 'root' })
export class DragFeedbackService {
  /** Element that is currently active as a drop target */
  private activeDropElement: Element | null = null;

  /**
   * Apply visual feedback to a drop target element
   *
   * @param element The element to mark as active
   */
  updateDropFeedback(element: Element | null): void {
    this.clearActiveDropZone();

    if (element) {
      this.activeDropElement = element;
      this.activeDropElement.classList.add('drop-active', 'bg-blue-50');
    }
  }

  /**
   * Clear styling from the previously active drop zone
   */
  clearActiveDropZone(): void {
    if (this.activeDropElement) {
      this.activeDropElement.classList.remove('drop-active', 'bg-blue-50');
      this.activeDropElement = null;
    }
  }
}
