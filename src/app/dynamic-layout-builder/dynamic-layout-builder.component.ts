import { Component, OnInit } from '@angular/core';

import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { LayoutItem, LayoutItemType, createLayoutItem } from './models/layout-item.model';
import { LayoutPaletteComponent } from './layout-palette/layout-palette.component';
import { LayoutContainerComponent } from './layout-container/layout-container.component';

@Component({
  selector: 'app-dynamic-layout-builder',
  standalone: true,
  imports: [DragDropModule, LayoutPaletteComponent, LayoutContainerComponent],
  templateUrl: './dynamic-layout-builder.component.html',
  styleUrls: ['./dynamic-layout-builder.component.scss'],
})
export class DynamicLayoutBuilderComponent implements OnInit {
  /** Root container for the layout */
  public rootContainer: LayoutItem;

  /** List of all drop zone IDs for connections */
  public allDropListIds: string[] = [];

  constructor() {
    // Initialize the root container
    this.rootContainer = createLayoutItem(LayoutItemType.CONTAINER, 'Root Container');
    this.rootContainer.children = [];
  }

  ngOnInit(): void {
    // Initialize drop list IDs
    this.updateDropListIds();
  }

  /**
   * Handles items dropped from the palette
   * @param event Information about the dropped item
   */
  public onPaletteItemDropped(event: {
    item: LayoutItem;
    containerId: string;
    index: number;
  }): void {
    // Find the target container
    if (event.containerId === this.rootContainer.id) {
      // Add to root container
      this.rootContainer.children!.splice(event.index, 0, event.item);
    } else {
      // Find container in the hierarchy
      this.addItemToContainer(this.rootContainer, event);
    }

    // Update drop lists if a new container was added
    if (event.item.type === LayoutItemType.CONTAINER) {
      this.updateDropListIds();
    }
  }

  /**
   * Handles item drops between containers
   * @param event The drag drop event
   */
  public onItemDrop(event: CdkDragDrop<any>): void {
    if (event.previousContainer === event.container) {
      // This is handled in the container component
      return;
    }

    // Get source and destination containers
    const sourceContainerId = event.previousContainer.id;
    const destContainerId = event.container.id;
    const draggedItem = event.item.data as LayoutItem;

    // Remove from source container
    this.removeItemFromContainer(this.rootContainer, sourceContainerId, draggedItem.id);

    // Add to destination container
    this.onPaletteItemDropped({
      item: draggedItem,
      containerId: destContainerId,
      index: event.currentIndex,
    });
  }

  /**
   * Handles the remove item request
   * @param info The container and item IDs
   */
  public onRemoveItem(info: { containerId: string; itemId: string }): void {
    const removed = this.removeItemFromContainer(this.rootContainer, info.containerId, info.itemId);

    if (removed) {
      // Update available drop zones if needed
      this.updateDropListIds();
    }
  }

  /**
   * Clears all items from the layout
   */
  public clearLayout(): void {
    this.rootContainer.children = [];
  }

  /**
   * Exports the current layout as JSON
   */
  public exportLayout(): string {
    return JSON.stringify(this.rootContainer, null, 2);
  }

  /**
   * Updates the list of all drop zone IDs
   */
  private updateDropListIds(): void {
    this.allDropListIds = this.getDropListIdsRecursive(this.rootContainer);
  }

  /**
   * Recursively collects all drop list IDs
   * @param container The container to process
   * @returns Array of drop list IDs
   */
  private getDropListIdsRecursive(container: LayoutItem): string[] {
    let ids = [container.id];

    if (container.children) {
      container.children.forEach((item) => {
        if (item.type === LayoutItemType.CONTAINER) {
          ids = ids.concat(this.getDropListIdsRecursive(item));
        }
      });
    }

    return ids;
  }

  /**
   * Recursively finds a container and adds an item to it
   * @param container The container to search within
   * @param event The drop event information
   * @returns True if the item was added
   */
  private addItemToContainer(
    container: LayoutItem,
    event: { item: LayoutItem; containerId: string; index: number },
  ): boolean {
    if (container.id === event.containerId) {
      container.children!.splice(event.index, 0, event.item);
      return true;
    }

    if (container.children) {
      for (const child of container.children) {
        if (child.type === LayoutItemType.CONTAINER) {
          if (this.addItemToContainer(child, event)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
   * Removes an item from a container
   * @param container The container to search in
   * @param containerId The ID of the container to remove from
   * @param itemId The ID of the item to remove
   * @returns True if the item was removed
   */
  private removeItemFromContainer(
    container: LayoutItem,
    containerId: string,
    itemId: string,
  ): boolean {
    if (container.id === containerId && container.children) {
      container.children = container.children.filter((item) => item.id !== itemId);
      return true;
    }

    if (container.children) {
      for (const child of container.children) {
        if (child.type === LayoutItemType.CONTAINER) {
          if (this.removeItemFromContainer(child, containerId, itemId)) {
            return true;
          }
        }
      }
    }

    return false;
  }
}
