import { Component, OnInit } from '@angular/core';

import { Item } from './models/item';
import { CdkDragDrop, CdkDragEnter, CdkDragExit, moveItemInArray } from '@angular/cdk/drag-drop';
import { DndListItemComponent } from './dnd-list-item/dnd-list-item.component';
import { DragFactoryComponent } from './drag-factory/drag-factory.component';

@Component({
  selector: 'app-nested-dnd-example',
  standalone: true,
  imports: [DndListItemComponent, DragFactoryComponent],
  templateUrl: './nested-dnd-example.component.html',
  styleUrl: './nested-dnd-example.component.scss',
})
export class NestedDndExampleComponent implements OnInit {
  public parentItem: Item;

  constructor() {
    this.parentItem = new Item({ name: 'parent-item' });
  }

  public get connectedDropListsIds(): string[] {
    // We reverse ids here to respect item nesting hierarchy
    return this.getIdsRecursive(this.parentItem).reverse();
  }

  public ngOnInit() {
    this.parentItem.children.push(
      new Item({
        name: 'test1',
        children: [
          new Item({ name: 'subItem1' }),
          new Item({ name: 'subItem2' }),
          new Item({ name: 'subItem3' }),
        ],
      }),
    );
    this.parentItem.children.push(
      new Item({
        name: 'test2',
        children: [
          new Item({ name: 'subItem4' }),
          new Item({ name: 'subItem5' }),
          new Item({
            name: 'subItem6',
            children: [new Item({ name: 'subItem8' })],
          }),
        ],
      }),
    );
    this.parentItem.children.push(new Item({ name: 'test3' }));
  }

  /**
   * Handles drag-drop events within the nested structure
   * @param event The drag-drop event with source and target information
   */
  public onDragDrop(event: CdkDragDrop<Item>): void {
    event.container.element.nativeElement.classList.remove('active');

    // Make sure we're not trying to drop an item inside itself (which would create a cycle)
    if (
      event.item.data &&
      event.container.data &&
      this.hasChild(event.item.data, event.container.data)
    ) {
      console.log('Cannot drop into a child item - would create a cycle');
      return;
    }

    if (event.previousContainer !== event.container) {
      // Item is being moved to a new container
      const movingItem: Item = event.item.data;

      // Clone the item if it's the parent item to avoid reference issues
      const itemToAdd =
        movingItem.uId === this.parentItem.uId
          ? new Item({ name: movingItem.name, children: [...movingItem.children] })
          : movingItem;

      // Add the item to the new container
      event.container.data.children.push(itemToAdd);

      // If it's not the parent item, remove it from the previous container
      if (movingItem.uId !== this.parentItem.uId) {
        event.previousContainer.data.children = event.previousContainer.data.children.filter(
          (child) => child.uId !== movingItem.uId,
        );
      }

      // Log the successful move
      console.log(`Moved ${itemToAdd.name} to ${event.container.data.name}'s children`);
    } else {
      // Reordering within the same container
      moveItemInArray(event.container.data.children, event.previousIndex, event.currentIndex);
    }
  }

  /**
   * Handles drops from the drag factory component
   * @param dropInfo Object containing the dropped item and destination info
   */
  public handleFactoryItemDrop(dropInfo: {
    item: Item;
    dropListId: string;
    dropIndex: number;
  }): void {
    // Find the target container by ID
    if (dropInfo.dropListId === this.parentItem.uId) {
      // Drop in top-level parent
      this.parentItem.children.splice(dropInfo.dropIndex, 0, dropInfo.item);
    } else {
      // Find the correct container in the nested structure
      this.addFactoryItemToContainer(this.parentItem, dropInfo);
    }
  }

  /**
   * Recursively searches for a container and adds the factory item to it
   * @param container The container to search within
   * @param dropInfo The drop information with target ID
   * @returns True if the item was successfully added
   */
  private addFactoryItemToContainer(
    container: Item,
    dropInfo: { item: Item; dropListId: string; dropIndex: number },
  ): boolean {
    // Check if this is the target container
    if (container.uId === dropInfo.dropListId) {
      container.children.splice(dropInfo.dropIndex, 0, dropInfo.item);
      return true;
    }

    // Search within this container's children
    for (const child of container.children) {
      if (this.addFactoryItemToContainer(child, dropInfo)) {
        return true;
      }
    }

    return false;
  }

  private getIdsRecursive(item: Item): string[] {
    let ids = [item.uId];
    item.children.forEach((childItem) => {
      ids = ids.concat(this.getIdsRecursive(childItem));
    });
    return ids;
  }

  private canBeDropped(event: CdkDragDrop<Item, Item>): boolean {
    const movingItem: Item = event.item.data;

    return (
      event.previousContainer.id !== event.container.id &&
      this.isNotSelfDrop(event) &&
      !this.hasChild(movingItem, event.container.data)
    );
  }

  private isNotSelfDrop(
    event: CdkDragDrop<Item> | CdkDragEnter<Item> | CdkDragExit<Item>,
  ): boolean {
    return event.container.data.uId !== event.item.data.uId;
  }

  private hasChild(parentItem: Item, childItem: Item): boolean {
    const hasChild = parentItem.children.some((item) => item.uId === childItem.uId);
    return hasChild ? true : parentItem.children.some((item) => this.hasChild(item, childItem));
  }
}
