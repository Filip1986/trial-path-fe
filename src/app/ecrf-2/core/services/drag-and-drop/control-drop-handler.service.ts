import { Injectable } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Observable, Subject } from 'rxjs';
import { DialogService } from '../dialog/dialog.service';
import { FormDialogService } from '../dialog/form-dialog.service';
import { ToastManagerService } from '../../../../core/services/toast-manager.service';
import { FormControlsService } from '../form/form-controls.service';
import { FormStateService } from '../form/form-state.service';
import { ECRFTextAreaClass } from '../../../form-controls/form-elements/textarea/textarea.class';
import { ECRFCheckboxClass } from '../../../form-controls/form-elements/checkbox/checkbox.class';
import { ECRFRadioButtonClass } from '../../../form-controls/form-elements/radio-button/radio-button.class';
import { EcrfDatePickerClass } from '../../../form-controls/form-elements/date-picker';
import { ECRFListBoxClass } from '../../../form-controls/form-elements/listbox/listbox.class';
import { ECRFInputNumberClass } from '../../../form-controls/form-elements/input-number/input-number.class';
import { Multiselect } from '../../../form-controls/form-elements/multiselect/multiselect.class';
import { EcrfTimePickerClass } from '../../../form-controls/form-elements/time-picker';
import { ECRFSelectClass } from '../../../form-controls/form-elements/select/select.class';
import { ECRFSelectButtonClass } from '../../../form-controls/form-elements/select-button/select-button.class';
import { ECRFInputTextClass } from '../../../form-controls/form-elements/input-text/ecrf-input-text.class';
import { DropHandler } from '../../models/types/drag-and-drop.types';
import { MESSAGES } from '../../models/consts/toast-notification.const';
import { IFormControl } from '../../models/interfaces/form.interfaces';
import { FormElementType } from '../../models/enums/form.enums';
import { ELEMENT_CONTAINERS } from '../../models/consts/element-containers.const';

/**
 * Service responsible for handling dropped controls
 */
@Injectable({ providedIn: 'root' })
export class ControlDropHandlerService {
  /** Subject that emits when a control is dropped */
  controlDropped: Subject<IFormControl> = new Subject<IFormControl>();

  /** Map of drop handlers for each control type */
  private dropHandlers: Map<FormElementType, DropHandler<any>> = new Map();

  constructor(
    private formControlsService: FormControlsService,
    private dialogService: DialogService,
    private formDialogService: FormDialogService,
    private toastManager: ToastManagerService,
    private formStateService: FormStateService,
  ) {
    this.initializeDropHandlers();
  }

  /**
   * Handle the drop event based on the type of control and source container
   *
   * @param event The drag drop event
   * @returns Observable of the dropped control
   */
  handleDrop(event: CdkDragDrop<IFormControl[]>): Observable<IFormControl> {
    const dragData = event.item.data as IFormControl;
    const isToolboxDrop: boolean = event.previousContainer.id.startsWith(
      ELEMENT_CONTAINERS.TOOLBOX_PREFIX,
    );

    this.log('Handling drop operation:', {
      sourceId: event.previousContainer.id,
      targetId: event.container.id,
      isFromToolbox: isToolboxDrop,
      controlType: dragData?.type,
    });

    // Handle toolbox items - creating new elements
    if (isToolboxDrop) {
      return this.handleToolboxDrop(event, dragData);
    } else {
      // Handle move between containers
      return this.handleContainerMove(event, dragData);
    }
  }

  /**
   * Initialize the drop handlers map
   */
  private initializeDropHandlers(): void {
    this.dropHandlers = new Map([
      [
        FormElementType.INPUT_TEXT,
        {
          elementType: FormElementType.INPUT_TEXT,
          openDialog: (control: ECRFInputTextClass): Observable<ECRFInputTextClass> =>
            this.formDialogService.openTextInputDialog(control),
          successMessage: MESSAGES.SUCCESS.TEXT_INPUT,
          cancelMessage: MESSAGES.CANCELLED.TEXT_INPUT,
        },
      ],
      [
        FormElementType.TEXT_AREA,
        {
          elementType: FormElementType.TEXT_AREA,
          openDialog: (control: ECRFTextAreaClass): Observable<ECRFTextAreaClass> =>
            this.formDialogService.openTextareaDialog(control),
          successMessage: MESSAGES.SUCCESS.TEXT_AREA,
          cancelMessage: MESSAGES.CANCELLED.TEXT_AREA,
        },
      ],
      [
        FormElementType.CHECKBOX,
        {
          elementType: FormElementType.CHECKBOX,
          openDialog: (control: ECRFCheckboxClass): Observable<ECRFCheckboxClass> =>
            this.formDialogService.openCheckboxDialog(control),
          successMessage: MESSAGES.SUCCESS.CHECKBOX,
          cancelMessage: MESSAGES.CANCELLED.CHECKBOX,
        },
      ],
      [
        FormElementType.RADIO,
        {
          elementType: FormElementType.RADIO,
          openDialog: (control: ECRFRadioButtonClass): Observable<ECRFRadioButtonClass> =>
            this.formDialogService.openRadioButtonDialog(control),
          successMessage: MESSAGES.SUCCESS.RADIO,
          cancelMessage: MESSAGES.CANCELLED.RADIO,
        },
      ],
      [
        FormElementType.DATE_PICKER,
        {
          elementType: FormElementType.DATE_PICKER,
          openDialog: (control: EcrfDatePickerClass): Observable<EcrfDatePickerClass> =>
            this.formDialogService.openDatePickerDialog(control),
          successMessage: MESSAGES.SUCCESS.DATE,
          cancelMessage: MESSAGES.CANCELLED.DATE,
        },
      ],
      [
        FormElementType.LIST_BOX,
        {
          elementType: FormElementType.LIST_BOX,
          openDialog: (control: ECRFListBoxClass): Observable<ECRFListBoxClass> =>
            this.formDialogService.openListBoxDialog(control),
          successMessage: MESSAGES.SUCCESS.LISTBOX,
          cancelMessage: MESSAGES.CANCELLED.LISTBOX,
        },
      ],
      [
        FormElementType.INPUT_NUMBER,
        {
          elementType: FormElementType.INPUT_NUMBER,
          openDialog: (control: ECRFInputNumberClass): Observable<ECRFInputNumberClass> =>
            this.formDialogService.openInputNumberDialog(control),
          successMessage: MESSAGES.SUCCESS.NUMBER_INPUT,
          cancelMessage: MESSAGES.CANCELLED.NUMBER_INPUT,
        },
      ],
      [
        FormElementType.MULTISELECT,
        {
          elementType: FormElementType.MULTISELECT,
          openDialog: (control: Multiselect): Observable<Multiselect> =>
            this.formDialogService.openMultiselectDialog(control),
          successMessage: MESSAGES.SUCCESS.MULTISELECT,
          cancelMessage: MESSAGES.CANCELLED.MULTISELECT,
        },
      ],
      [
        FormElementType.TIME_PICKER,
        {
          elementType: FormElementType.TIME_PICKER,
          openDialog: (control: EcrfTimePickerClass): Observable<EcrfTimePickerClass> =>
            this.formDialogService.openTimePickerDialog(control),
          successMessage: MESSAGES.SUCCESS.TIME,
          cancelMessage: MESSAGES.CANCELLED.TIME,
        },
      ],
      [
        FormElementType.SELECT,
        {
          elementType: FormElementType.SELECT,
          openDialog: (control: ECRFSelectClass): Observable<ECRFSelectClass> =>
            this.formDialogService.openSelectDialog(control),
          successMessage: MESSAGES.SUCCESS.DROPDOWN,
          cancelMessage: MESSAGES.CANCELLED.DROPDOWN,
        },
      ],
      [
        FormElementType.SELECT_BUTTON,
        {
          elementType: FormElementType.SELECT_BUTTON,
          openDialog: (control: ECRFSelectButtonClass): Observable<ECRFSelectButtonClass> =>
            this.formDialogService.openSelectButtonDialog(control),
          successMessage: MESSAGES.SUCCESS.SELECTBUTTON,
          cancelMessage: MESSAGES.CANCELLED.SELECTBUTTON,
        },
      ],
    ]);
  }

  /**
   * Handle drops from the toolbox
   */
  private handleToolboxDrop(
    event: CdkDragDrop<IFormControl[]>,
    dragData: IFormControl,
  ): Observable<IFormControl> {
    // Special handling for columns
    if (dragData?.type === FormElementType.COLUMNS) {
      return this.handleColumnDrop(event, dragData);
    }

    // Handle other control types using the drop handler map
    const handler = this.dropHandlers.get(dragData?.type);
    if (handler) {
      return this.handleGenericDrop(event, handler);
    }

    // Default handling for unmapped types
    return this.handleDefaultDrop(event, dragData);
  }

  /**
   * Generic drop handler for all dialog-based controls
   */
  private handleGenericDrop<T extends IFormControl>(
    event: CdkDragDrop<IFormControl[]>,
    handler: DropHandler<T>,
  ): Observable<IFormControl> {
    const result = new Subject<IFormControl>();

    // Create a temporary control
    const tempControl = this.formControlsService.createControl(handler.elementType) as T;

    // Open the configuration dialog
    handler.openDialog(tempControl).subscribe({
      next: (configuredControl: T): void => {
        this.addControlToContainer(event, configuredControl);
        this.controlDropped.next(configuredControl);
        this.showSuccessToast(handler.successMessage);
        result.next(configuredControl);
        result.complete();
      },
      error: (err): void => {
        this.showInfoToast(handler.cancelMessage);
        result.error(err);
      },
    });

    return result.asObservable();
  }

  /**
   * Handle dropping of a Column element (special case)
   */
  private handleColumnDrop(
    event: CdkDragDrop<IFormControl[]>,
    dragData: IFormControl,
  ): Observable<IFormControl> {
    return new Observable<IFormControl>((observer) => {
      this.dialogService.promptForColumnCount().subscribe({
        next: (columnCount: number) => {
          const control: IFormControl = this.formControlsService.createControl(dragData.type, {
            columnCount,
          });
          this.addControlToContainer(event, control);
          this.showSuccessToast(
            MESSAGES.SUCCESS.COLUMNS.replace('%count%', columnCount.toString()),
          );
          this.controlDropped.next(control);
          observer.next(control);
          observer.complete();
        },
        error: (err) => {
          this.showInfoToast(MESSAGES.CANCELLED.COLUMNS);
          observer.error(err);
        },
      });
    });
  }

  /**
   * Handle default drop for unmapped control types
   */
  private handleDefaultDrop(
    event: CdkDragDrop<IFormControl[]>,
    dragData: IFormControl,
  ): Observable<IFormControl> {
    const control = this.formControlsService.createControl(dragData.type);
    this.addControlToContainer(event, control);
    this.controlDropped.next(control);
    this.showSuccessToast(`${dragData.type} added successfully`);
    return new Observable<IFormControl>((observer) => {
      observer.next(control);
      observer.complete();
    });
  }

  /**
   * Handle moving controls between containers
   */
  private handleContainerMove(
    event: CdkDragDrop<IFormControl[]>,
    draggedControl: IFormControl,
  ): Observable<IFormControl> {
    const sourceContainerId: string = event.previousContainer.id;
    const targetContainerId: string = event.container.id;

    if (event.previousContainer === event.container) {
      // Moving within the same container
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      const newOrder: string[] = event.container.data.map((control) => control.id);
      this.formStateService.reorderControls(targetContainerId, newOrder);
    } else {
      // Moving between containers
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      this.formStateService.moveControl(
        draggedControl.id,
        sourceContainerId,
        targetContainerId,
        event.currentIndex,
      );
    }

    this.controlDropped.next(draggedControl);
    return new Observable<IFormControl>((observer) => {
      observer.next(draggedControl);
      observer.complete();
    });
  }

  /**
   * Add a control to a container
   */
  private addControlToContainer(event: CdkDragDrop<IFormControl[]>, control: IFormControl): void {
    event.container.data.splice(event.currentIndex, 0, control);
  }

  /**
   * Show success toast with a delay
   */
  private showSuccessToast(message: string): void {
    setTimeout(() => this.toastManager.success(message), 0);
  }

  /**
   * Show info toast with a delay
   */
  private showInfoToast(message: string): void {
    setTimeout(() => this.toastManager.info(message), 0);
  }

  /**
   * Log debug information
   */
  private log(message: string, data?: any): void {
    if (this.isDebugMode()) {
      console.log(`[ControlDropHandler] ${message}`, data);
    }
  }

  /**
   * Check if debug mode is enabled
   */
  private isDebugMode(): boolean {
    // This could be configured via environment or service
    return false;
  }
}
