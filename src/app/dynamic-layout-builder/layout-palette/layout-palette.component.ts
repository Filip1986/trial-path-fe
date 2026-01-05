import { Component, EventEmitter, Output } from '@angular/core';

import { CdkDrag, CdkDragDrop, CdkDragStart, DragDropModule } from '@angular/cdk/drag-drop';
import { LayoutItem, LayoutItemType, createLayoutItem } from '../models/layout-item.model';

@Component({
  selector: 'app-layout-palette',
  standalone: true,
  imports: [DragDropModule],
  templateUrl: './layout-palette.component.html',
  styleUrls: ['./layout-palette.component.scss'],
})
export class LayoutPaletteComponent {
  /** Available items in the palette */
  public paletteItems: { label: string; type: LayoutItemType; icon: string }[] = [
    { label: 'Text Element', type: LayoutItemType.ELEMENT, icon: 'pi pi-text-size' },
    { label: 'Container', type: LayoutItemType.CONTAINER, icon: 'pi pi-box' },
  ];

  /** Flag to track active drag state */
  public activeDrag = false;

  /** Event emitted when a palette item is dropped */
  @Output() itemDropped = new EventEmitter<{
    item: LayoutItem;
    containerId: string;
    index: number;
  }>();

  /**
   * Handles the start of a drag operation
   * @param event The drag start event
   */
  onDragStarted(event: CdkDragStart): void {
    this.activeDrag = true;
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
   * Handles drop events from the palette
   * @param event The drag drop event
   * @param itemType The type of item being dragged
   * @param label The label of the item being dragged
   */
  onDrop(event: CdkDragDrop<any>, itemType: LayoutItemType, label: string): void {
    // Create a new item based on the template that was dragged
    const newItem = createLayoutItem(itemType, label);

    // Emit the drop event with the new item and target information
    this.itemDropped.emit({
      item: newItem,
      containerId: event.container.id,
      index: event.currentIndex,
    });
  }
}
