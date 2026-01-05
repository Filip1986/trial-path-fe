import {
  CdkDragExit,
  CdkDragMove,
  CdkDragRelease,
  CdkDropList,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControlsService } from '../core/services/form/form-controls.service';
import { IconMappingService } from '../core/services/icon-mapping.service';
import { DragDropService } from '../core/services/drag-and-drop';
import { TabsModule } from 'primeng/tabs';
import { IFormControl, IFormControlOptions } from '../core/models/interfaces/form.interfaces';
import { IDragItem } from '../core/models/interfaces/drag-and-drop.interfaces';
import { ComponentType } from '../core/models/enums/component-types.enum';
import { COMPONENT_METADATA } from '../core/models/consts/component-meta-data.consts';
import { FORM_ELEMENT_TO_COMPONENT_MAP } from '../core/models/consts/form-element-to-component.const';
import { FormElementType } from '../core/models/enums/form.enums';
import { ELEMENT_CONTAINERS } from '../core/models/consts/element-containers.const';

interface ElementGroup {
  name: string;
  items: IFormControl[];
}

@Component({
  selector: 'app-new-controls',
  templateUrl: './new-controls.component.html',
  styleUrls: ['./new-controls.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, DragDropModule, TabsModule],
})
export class NewControlsComponent implements OnInit, AfterViewInit {
  @ViewChild(CdkDropList) dropList?: CdkDropList;

  readonly GROUP_NAMES = {
    BASIC: ELEMENT_CONTAINERS.GROUP_BASIC,
    ADVANCED: ELEMENT_CONTAINERS.GROUP_ADVANCED,
    LAYOUT: ELEMENT_CONTAINERS.GROUP_LAYOUT,
  };

  // All available form elements
  public items: IDragItem[] = [];

  // Element groups for tabs
  public elementGroups: ElementGroup[] = [
    { name: this.GROUP_NAMES.BASIC, items: [] },
    { name: this.GROUP_NAMES.ADVANCED, items: [] },
    { name: this.GROUP_NAMES.LAYOUT, items: [] },
  ];

  constructor(
    private formControlsService: FormControlsService,
    public dragDropService: DragDropService,
    private iconService: IconMappingService,
  ) {}

  /**
   * Get the list of connected drop lists from the drag drop service
   * @returns Array of connected drop lists
   */
  public get connectedLists() {
    return this.dragDropService.dropLists;
  }

  /**
   * Initialize component and load available form controls
   */
  ngOnInit(): void {
    this.loadControlTypes();
    this.organizeControlGroups();
  }

  /**
   * After view initialization, register the drop list
   */
  ngAfterViewInit(): void {
    if (this.dropList) {
      this.dragDropService.register(this.dropList);
    }
  }

  /**
   * Get items for a specific group
   * @param index The index of the group
   * @returns Array of form controls for the specified group
   */
  getGroupItems(index: number): IFormControl[] {
    return this.elementGroups[index].items;
  }

  /**
   * Get the appropriate PrimeNG icon for an element type
   * @param type The type of element
   * @returns The PrimeNG icon class
   */
  getElementIcon(type: FormElementType): string {
    return this.iconService.getPrimeIcon(type);
  }

  /**
   * TrackBy function for form controls to optimize rendering
   * @param index The index of the control
   * @param item The form control
   * @returns A unique identifier for the control
   */
  trackByControlId(index: number, item: IFormControl): string {
    return item.id || `toolbox-item-${index}`;
  }

  /**
   * Predicate function to disallow dropping items into this container
   * @returns Always returns false to prevent drops
   */
  disallowDropPredicate(): boolean {
    return false;
  }

  /**
   * Create a clone of the dragged item when it exits the container
   * @param event The drag exit event
   */
  createItemClone(event: CdkDragExit<any>): void {
    const groupIndex: number = this.getGroupIndexFromId(event.container.id);
    if (groupIndex !== -1) {
      const itemIndex: number = event.container._dropListRef.getItemIndex(event.item._dragRef);
      if (itemIndex !== -1) {
        // Ensure we're working with the correct data type
        const dragData = event.item.data as IDragItem;

        if (dragData && typeof dragData === 'object') {
          this.elementGroups[groupIndex].items.splice(itemIndex + 1, 0, {
            ...dragData,
            isClone: true,
            iconName: '',
            type: dragData.type || FormElementType.INPUT_TEXT, // Provide default value
            title: '',
            id: `clone-${dragData.id || Math.random().toString(36).substring(2, 9)}`, // Ensure unique ID for clones
          });
        }
      }
    }
  }

  /**
   * Track the drag movement for visual feedback
   * @param event The drag move event
   */
  dragMoved(event: CdkDragMove<IFormControl>): void {
    this.dragDropService.dragMoved(event);
  }

  /**
   * Handle drag release to clean up UI state
   * @param event The drag release event
   */
  dragReleased(event: CdkDragRelease): void {
    this.dragDropService.dragReleased(event);
    this.removeItemClone();
  }

  /**
   * Remove any temporary clone items
   */
  removeItemClone(): void {
    this.elementGroups.forEach((group: ElementGroup): void => {
      group.items = group.items.filter((i: IDragItem): boolean => !i.isClone);
    });
  }

  /**
   * Get tooltip for an element
   */
  getElementTooltip(type: FormElementType): string {
    const componentType: ComponentType | undefined = FORM_ELEMENT_TO_COMPONENT_MAP[type];
    if (componentType) {
      const metadata = COMPONENT_METADATA[componentType];
      return metadata?.description || '';
    }
    return '';
  }

  /**
   * Get the group index from a container ID
   * @param id The container ID (e.g., 'toolbox-Basic')
   * @returns The index of the group, or -1 if not found
   */
  private getGroupIndexFromId(id: string): number {
    if (!id.startsWith(ELEMENT_CONTAINERS.TOOLBOX_PREFIX)) return -1;

    const groupName: string = id.replace(ELEMENT_CONTAINERS.TOOLBOX_PREFIX, '');
    return this.elementGroups.findIndex((g: ElementGroup): boolean => g.name === groupName);
  }

  /**
   * Load all available control types from the service
   */
  private loadControlTypes(): void {
    const controlTypes: FormElementType[] = this.formControlsService.getAvailableControlTypes();

    for (const type of controlTypes) {
      const control: IFormControl<IFormControlOptions, any> =
        this.formControlsService.createControl(type);

      // Enhance with metadata
      const componentType: ComponentType | undefined = FORM_ELEMENT_TO_COMPONENT_MAP[type];
      if (componentType) {
        const metadata = COMPONENT_METADATA[componentType];
        if (metadata) {
          // Override title with display name from metadata
          control.title = metadata.displayName;
          // Use icon from metadata if available
          if (metadata.icon) {
            control.iconName = metadata.icon;
          }
        }
      }

      this.items.push(control as IDragItem);
    }
  }

  /**
   * Organize controls into categories
   */
  private organizeControlGroups(): void {
    // Get predefined groups from a service
    const groups: { [key: string]: FormElementType[] } =
      this.formControlsService.getControlGroups();

    // Assign controls to groups based on type
    this.items.forEach((item: IDragItem): void => {
      const type: FormElementType = item.type;

      if (groups['basic'].includes(type)) {
        this.elementGroups[0].items.push(item);
      } else if (groups['advanced'].includes(type)) {
        this.elementGroups[1].items.push(item);
      } else if (groups['layout'].includes(type)) {
        this.elementGroups[2].items.push(item);
      } else {
        // Default to basic if not categorized
        this.elementGroups[0].items.push(item);
      }
    });
  }
}
