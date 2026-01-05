import { Component, EventEmitter, Output } from '@angular/core';

import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDragPreview,
  CdkDragStart,
} from '@angular/cdk/drag-drop';
import { Item } from '../models/item';

/**
 * A component that serves as a palette of draggable items that can be cloned
 * and dragged multiple times into drop zones.
 */
@Component({
  selector: 'app-drag-factory',
  standalone: true,
  imports: [CdkDrag, CdkDragPreview, CdkDragPlaceholder],
  templateUrl: './drag-factory.component.html',
  styleUrl: './drag-factory.component.scss',
})
export class DragFactoryComponent {
  /** Template items that can be cloned and dragged */
  public templateItems: Item[] = [
    new Item({ name: 'Draggable Item 1' }),
    new Item({ name: 'Draggable Item 2' }),
    new Item({ name: 'Draggable Item 3' }),
  ];

  /** Event emitted when a new cloned item is dropped */
  @Output() itemDropped = new EventEmitter<{
    item: Item;
    dropListId: string;
    dropIndex: number;
  }>();

  /** Active drag flag for styling */
  public activeDrag = false;

  /**
   * Handles the start of dragging a template item
   * @param event The drag start event
   */
  onDragStarted(event: CdkDragStart): void {
    this.activeDrag = true;
    // Add a CSS class to the body for global styling during drag
    document.body.classList.add('item-dragging');
  }

  /**
   * Handles the end of a drag operation
   */
  onDragEnded(): void {
    this.activeDrag = false;
    document.body.classList.remove('item-dragging');
  }

  /**
   * Handles the drop of a cloned item into a drop zone
   * @param event The drop event containing source and target information
   * @param item The template item being dragged
   */
  onDrop(event: CdkDragDrop<any>, item: Item): void {
    // We don't want to remove the item from the palette,
    // so we create a clone and emit an event with the details
    const clonedItem = new Item({
      name: item.name,
      children: [], // Start with empty children
    });

    this.itemDropped.emit({
      item: clonedItem,
      dropListId: event.container.id,
      dropIndex: event.currentIndex,
    });
  }
}
