import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { CastPipe } from '../core/cast.pipe';
import { DynamicComponentLoaderComponent } from '../dynamic-component-loader.component';
import { DragDropService } from '../core/services/drag-and-drop';
import { ECRFCheckboxComponent } from '../form-controls/form-elements/checkbox/ecrf-checkbox.component';
import { EcrfRadioButtonComponent } from '../form-controls/form-elements/radio-button/ecrf-radio-button.component';
import { ToastManagerService } from '../../core/services/toast-manager.service';
import { Subscription } from 'rxjs';
import {
  CdkDragDrop,
  CdkDropList,
  CdkDragRelease,
  CdkDragMove,
  CdkDragEnter,
  CdkDragExit,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { EcrfTextAreaComponent } from '../form-controls/form-elements/textarea/ecrf-text-area.component';
import {
  isCheckboxControl,
  isDatePickerControl,
  isInputNumberControl,
  isListBoxControl,
  isMultiSelectControl,
  isRadioButtonControl,
  isSelectButtonControl,
  isSelectControl,
  isTextAreaControl,
  isTextInputControl,
  isTimePickerControl,
} from '../core/utils/type-guards';
import { ECRFCheckboxClass } from '../form-controls/form-elements/checkbox/checkbox.class';
import { ECRFTextAreaClass } from '../form-controls/form-elements/textarea/textarea.class';
import { ECRFRadioButtonClass } from '../form-controls/form-elements/radio-button/radio-button.class';
import { ECRFDatePickerComponent } from '../form-controls/form-elements/date-picker';
import { EcrfDatePickerClass } from '../form-controls/form-elements/date-picker';
import { EcrfListboxComponent } from '../form-controls/form-elements/listbox/ecrf-listbox.component';
import { ECRFListBoxClass } from '../form-controls/form-elements/listbox/listbox.class';
import { ECRFInputNumberComponent } from '../form-controls/form-elements/input-number/ecrf-input-number.component';
import { ECRFInputNumberClass } from '../form-controls/form-elements/input-number/input-number.class';
import { EcrfMultiSelectComponent } from '../form-controls/form-elements/multiselect/ecrf-multi-select.component';
import { ECRFMultiSelectClass } from '../form-controls/form-elements/multiselect/multiselect.class';
import {
  EcrfTimePickerClass,
  EcrfTimePickerComponent,
} from '../form-controls/form-elements/time-picker';
import { ECRFSelectClass } from '../form-controls/form-elements/select/select.class';
import { EcrfSelectComponent } from '../form-controls/form-elements/select/ecrf-select.component';
import { EcrfSelectButtonComponent } from '../form-controls/form-elements/select-button/ecrf-select-button.component';
import { ECRFSelectButtonClass } from '../form-controls/form-elements/select-button/select-button.class';
import { EcrfInputTextComponent } from '../form-controls/form-elements/input-text/ecrf-input-text-component.component';
import { ECRFInputTextClass } from '../form-controls/form-elements/input-text/ecrf-input-text.class';
import { IFormContainer, IFormControl } from '../core/models/interfaces/form.interfaces';
import { ComponentType } from '../core/models/enums/component-types.enum';
import { COMPONENT_METADATA } from '../core/models/consts/component-meta-data.consts';
import { FORM_ELEMENT_TO_COMPONENT_MAP } from '../core/models/consts/form-element-to-component.const';
import { FormElementType } from '../core/models/enums/form.enums';
import { FormControlDrag, FormControlDropList } from '../core/models/types/drag-and-drop.types';
import { IComponentMetadata } from '../core/models/interfaces/component-meta-data.interface';

@Component({
  selector: 'app-form-container',
  templateUrl: './form-container.component.html',
  styleUrls: ['./form-container.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DragDropModule,
    EcrfInputTextComponent,
    DynamicComponentLoaderComponent,
    CastPipe,
    EcrfTextAreaComponent,
    ECRFCheckboxComponent,
    EcrfRadioButtonComponent,
    ECRFDatePickerComponent,
    EcrfListboxComponent,
    ECRFInputNumberComponent,
    EcrfMultiSelectComponent,
    EcrfTimePickerComponent,
    EcrfSelectComponent,
    EcrfSelectButtonComponent
],
})
export class FormContainerComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(CdkDropList) dropList?: CdkDropList;
  @Input() container: IFormContainer = { controls: [] }; // Provide default value
  @Input() showOutline = true;
  @Input() id = '';

  /**
   * The Current nesting level of this container
   * Top level is 0, increases with each level of nesting
   */
  @Input() nestingLevel = 0;

  /**
   * Show debugging information like nesting levels
   */
  @Input() showDebugInfo = false;

  // Constants exposed to the template
  readonly FormElementType: typeof FormElementType = FormElementType;
  readonly ComponentType: typeof ComponentType = ComponentType;

  // Track if dropping is currently allowed for visual feedback
  dropAllowed = true;
  /**
   * Use the imported type guards
   */
  isTextInput: (control: any) => control is ECRFInputTextClass = isTextInputControl;
  isTextArea: (control: any) => control is ECRFTextAreaClass = isTextAreaControl;
  isCheckbox: (control: any) => control is ECRFCheckboxClass = isCheckboxControl;
  isRadioButton: (control: any) => control is ECRFRadioButtonClass = isRadioButtonControl;
  isListBox: (control: any) => control is ECRFListBoxClass = isListBoxControl;
  isDatePicker: (control: any) => control is EcrfDatePickerClass = isDatePickerControl;
  isInputNumber: (control: any) => control is ECRFInputNumberClass = isInputNumberControl;
  isMultiSelect: (control: any) => control is ECRFMultiSelectClass = isMultiSelectControl;
  isTimePicker: (control: any) => control is EcrfTimePickerClass = isTimePickerControl;
  isSelect: (control: any) => control is ECRFSelectClass = isSelectControl;
  isSelectButton: (control: any) => control is ECRFSelectButtonClass = isSelectButtonControl;

  // Subscription for change detection triggers
  private subscription: Subscription = new Subscription();

  constructor(
    public dragDropService: DragDropService,
    private toastManager: ToastManagerService,
    private cdr: ChangeDetectorRef,
  ) {}

  public get connectedLists() {
    return this.dragDropService.dropLists;
  }

  ngOnInit(): void {
    // Ensure container is valid
    if (!this.container) {
      this.container = { controls: [] };
    }

    // Subscribe to change detection triggers
    this.subscription.add(
      this.dragDropService.changeDetectionNeeded$.subscribe((): void => {
        this.cdr.markForCheck();
      }),
    );

    // Also subscribe to control dropped events
    this.subscription.add(
      this.dragDropService.controlDropped.subscribe((): void => {
        this.cdr.markForCheck();
      }),
    );
  }

  ngOnDestroy(): void {
    // Cleanup subscriptions
    this.subscription.unsubscribe();
  }

  /**
   * TrackBy function to optimize rendering of controls
   * @param index The index of the control
   * @param control The form control
   * @returns A unique identifier for the control
   */
  trackByControlId(index: number, control: IFormControl): string {
    return control.id || `control-${index}`;
  }

  /**
   * Predicate function to determine if a drop is allowed
   *
   * @param drag The drag element
   * @param drop The drop list
   * @returns Boolean indicating if a drop is allowed
   */
  allowDropPredicate = (drag: FormControlDrag, drop: FormControlDropList): boolean => {
    const isAllowed: boolean = this.dragDropService.isDropAllowed(drag, drop);
    this.dropAllowed = isAllowed;
    return isAllowed;
  };

  ngAfterViewInit(): void {
    if (this.dropList) {
      this.dragDropService.register(this.dropList);
    }
  }

  /**
   * Handle control duplicated event from a child component
   *
   * @param duplicatedControl The duplicated control
   * @param originalIndex The index of the original control in the container
   */
  onControlDuplicated(duplicatedControl: IFormControl, originalIndex: number): void {
    if (originalIndex >= 0 && originalIndex < this.container.controls.length) {
      // Insert the duplicated control right after the original control
      this.container.controls.splice(originalIndex + 1, 0, duplicatedControl);

      // Show success message
      this.toastManager.success(`${duplicatedControl.title || 'Control'} duplicated successfully`);

      // Trigger change detection
      this.cdr.markForCheck();
    }
  }

  /**
   * Handle drop event
   *
   * @param event The drag drop event
   */
  dropped(event: CdkDragDrop<IFormControl[]>): void {
    this.dragDropService.drop(event);
    // Manually trigger change detection after a drop
    this.cdr.markForCheck();
  }

  /**
   * Handle drag move event
   *
   * @param event The drag move event
   */
  dragMoved(event: CdkDragMove<IFormControl>): void {
    this.dragDropService.dragMoved(event);
  }

  /**
   * Handle drag release event
   *
   * @param event The drag release event
   */
  dragReleased(event: CdkDragRelease): void {
    this.dragDropService.dragReleased(event);
    // Reset drop allowed state
    this.dropAllowed = true;
  }

  /**
   * Handle drag enter event
   *
   * @param event The drag enter event
   */
  dragEntered(event: CdkDragEnter<IFormControl[]>): void {
    // The data is either a form control or an object with type property
    // Use a more flexible approach to determine the type
    const dragData = event.item.data;

    // Check if this is a column being entered into another column
    // First determine if it's a direct FormControl or has a 'type' property
    const itemType = this.getItemType(dragData);

    if (itemType === FormElementType.COLUMNS) {
      const dropElement: HTMLElement = event.container.element.nativeElement;
      const isColumn: Element | null = dropElement.closest('.column-container');

      if (isColumn && !this.dragDropService.isDropAllowed(event.item, event.container)) {
        dropElement.classList.add('nesting-not-allowed');
      }
    }
  }

  /**
   * Handle drag exit event
   *
   * @param event The drag exit event
   */
  dragExited(event: CdkDragExit<IFormControl[]>): void {
    // Remove any visual indicators
    const dropElement: HTMLElement = event.container.element.nativeElement;
    dropElement.classList.remove('nesting-not-allowed');
  }

  /**
   * Handle control edited event from a child component
   *
   * @param updatedControl The updated control
   * @param index The index of the control in the container
   */
  onControlEdited(updatedControl: IFormControl, index: number): void {
    // Update the control in the container
    if (index >= 0 && index < this.container.controls.length) {
      // Replace the control at the specified index
      this.container.controls[index] = updatedControl;
      // Explicitly trigger change detection
      this.cdr.markForCheck();
    }
  }

  /**
   * Handle control deleted event from a child component
   *
   * @param index The index of the control in the container
   */
  onControlDeleted(index: number): void {
    if (index >= 0 && index < this.container.controls.length) {
      this.container.controls.splice(index, 1);
      this.cdr.markForCheck();
    }
  }

  /**
   * Get the display name for a control type
   */
  getControlDisplayName(control: IFormControl): string {
    const componentType: ComponentType | undefined = FORM_ELEMENT_TO_COMPONENT_MAP[control.type];
    if (componentType) {
      const metadata: IComponentMetadata = COMPONENT_METADATA[componentType];
      return metadata?.displayName || control.title;
    }
    return control.title;
  }

  /**
   * Get the description for a control type
   */
  getControlDescription(control: IFormControl): string {
    const componentType: ComponentType | undefined = FORM_ELEMENT_TO_COMPONENT_MAP[control.type];
    if (componentType) {
      const metadata: IComponentMetadata = COMPONENT_METADATA[componentType];
      return metadata?.description || '';
    }
    return '';
  }

  /**
   * Helper method to safely get the type from drag data
   * @param data The drag data object
   * @returns The form element type or undefined
   */
  private getItemType(data: any): FormElementType | undefined {
    if (typeof data === 'object' && data !== null) {
      if (Array.isArray(data)) {
        return undefined;
      }

      // Check for a type property which might be a string or FormElementType
      if ('type' in data) {
        return data.type as FormElementType;
      }
    }
    return undefined;
  }
}
