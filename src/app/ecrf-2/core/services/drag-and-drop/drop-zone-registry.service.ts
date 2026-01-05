import { Injectable } from '@angular/core';
import { CdkDropList } from '@angular/cdk/drag-drop';
import { IFormControl } from '../../models/interfaces/form.interfaces';

/**
 * Service responsible for registering and tracking drop zones
 */
@Injectable({ providedIn: 'root' })
export class DropZoneRegistryService {
  /** List of registered drop zones */
  private _dropLists: CdkDropList<IFormControl[]>[] = [];

  /**
   * Get all registered drop lists
   */
  get dropLists(): CdkDropList<IFormControl[]>[] {
    return this._dropLists;
  }

  /** ID of a currently hovered drop list */
  private _currentHoverDropListId?: string;

  /**
   * Get the ID of the currently hovered drop list
   */
  get currentHoverDropListId(): string | undefined {
    return this._currentHoverDropListId;
  }

  /**
   * Register a drop list with the service
   * This makes the drop list available for drag and drop operations
   *
   * @param dropList The drop list to register
   */
  register(dropList: CdkDropList<IFormControl[]>): void {
    this._dropLists.push(dropList);
  }

  /**
   * Set the ID of the currently hovered drop list
   * @param id The ID of the hovered drop list, or undefined if none
   */
  setCurrentHoverDropListId(id?: string): void {
    this._currentHoverDropListId = id;
  }
}
