import { Component, EventEmitter, Input, Output } from '@angular/core';

import {
  CdkDragDrop,
  CdkDragEnter,
  CdkDragExit,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { LayoutItem, LayoutItemType } from '../models/layout-item.model';

@Component({
  selector: 'app-layout-container',
  standalone: true,
  imports: [DragDropModule],
  templateUrl: './layout-container.component.html',
  styleUrls: ['./layout-container.component.scss'],
})
export class LayoutContainerComponent {
  /** The container item */
  @Input() container!: LayoutItem;
  /** The parent container ID */
  @Input() parentId?: string;
  /** Connected droplist IDs */
  @Input() connectedDropListIds: string[] = [];
  /** Whether this is the root container */
  @Input() isRoot = false;

  /** Event when an item is dropped */
  @Output() itemDrop = new EventEmitter<CdkDragDrop<LayoutItem>>();
  /** Event to remove an item */
  @Output() removeItem = new EventEmitter<{ containerId: string; itemId: string }>();

  /** For type checking in the template */
  LayoutItemType = LayoutItemType;

  /**
   * Gets IDs of all connected drop lists excluding the current one
   */
  public get connectedLists(): string[] {
    return this.connectedDropListIds.filter((id) => id !== this.container.id);
  }

  /**
   * Handles drop events within the container
   * @param event The drag drop event
   */
  public onDragDrop(event: CdkDragDrop<any>): void {
    if (event.previousContainer === event.container) {
      // Reordering within the same container
      moveItemInArray(this.container.children!, event.previousIndex, event.currentIndex);
    } else {
      // Forward the event to the parent component to handle
      this.itemDrop.emit(event);
    }
  }

  /**
   * Handles the remove item action
   * @param itemId The ID of the item to remove
   */
  public onRemoveItem(itemId: string): void {
    this.removeItem.emit({
      containerId: this.container.id,
      itemId: itemId,
    });
  }

  /**
   * Handles drag enter events to style active drop targets
   * @param event The drag enter event
   */
  public onDragEnter(event: CdkDragEnter<any>): void {
    event.container.element.nativeElement.classList.add('active');
  }

  /**
   * Handles drag exit events to remove styling from drop targets
   * @param event The drag exit event
   */
  public onDragExit(event: CdkDragExit<any>): void {
    event.container.element.nativeElement.classList.remove('active');
  }

  /**
   * Determine if item can be dropped in this container
   * @param item The item being dragged
   * @returns True if the item can be dropped
   */
  public canBeDropped(item: LayoutItem): boolean {
    // Add any specific rules here
    return true;
  }
}
