import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Item } from '../models/item';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragEnter,
  CdkDragExit,
  CdkDragHandle,
  CdkDragPreview,
  CdkDropList,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dnd-list-item',
  standalone: true,
  imports: [CdkDropList, CdkDrag, CdkDragHandle, CdkDragPreview],
  templateUrl: './dnd-list-item.component.html',
  styleUrl: './dnd-list-item.component.scss',
})
export class DndListItemComponent {
  @Input() item!: Item;
  @Input() parentItem?: Item;
  public allDropListsIds: string[];
  @Output() itemDrop: EventEmitter<CdkDragDrop<Item>>;

  constructor() {
    this.allDropListsIds = [];
    this.itemDrop = new EventEmitter();
  }

  /**
   * Gets a list of all connected drop lists excluding the current one
   * @returns Array of connected drop list IDs
   */
  public get connectedDropListsIds(): string[] {
    return this.allDropListsIds.filter((id) => id !== this.item.uId);
  }

  @Input() public set connectedDropListsIds(ids: string[]) {
    this.allDropListsIds = ids;
  }

  /**
   * Determines if dragging is disabled for this item
   * @returns True if drag should be disabled
   */
  public get dragDisabled(): boolean {
    return false;
  }

  /**
   * Gets the parent item ID or empty string if no parent
   * @returns Parent item ID or empty string
   */
  public get parentItemId(): string {
    return this.parentItem?.uId ?? '';
  }

  /**
   * Handles the drop event and emits it to parent component
   * @param event The drag drop event
   */
  public onDragDrop(event: CdkDragDrop<any>): void {
    this.itemDrop.emit(event);
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
}
