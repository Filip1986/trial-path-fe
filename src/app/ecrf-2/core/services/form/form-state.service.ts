import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HistoryService } from './form-history.service';
import { Columns } from '../../../form-controls/form-layout/columns/columns.class';
import { ECRFInputTextClass } from '../../../form-controls/form-elements/input-text/ecrf-input-text.class';
import { IForm, IFormControl, SavedFormMetadata } from '../../models/interfaces/form.interfaces';
import { FormMetadataUpdates } from '../../models/types/form.types';
import { FormElementType } from '../../models/enums/form.enums';
import { isRootContainerId } from '../../utils/utils';
import { ELEMENT_CONTAINERS } from '../../models/consts/element-containers.const';

@Injectable({ providedIn: 'root' })
export class FormStateService {
  // Initial form state
  private formStateSubject: BehaviorSubject<IForm> = new BehaviorSubject<IForm>({
    title: 'New Form',
    description: '',
    container: { controls: [] },
    status: 'draft',
  });

  // Observable for form state
  public form$: Observable<IForm> = this.formStateSubject.asObservable();

  /**
   * Initialize the service with a default form and set up history
   */
  constructor(private historyService: HistoryService<IForm>) {
    // Initialize with a default form
    const initialForm: IForm = {
      title: 'New Form',
      description: '',
      container: { controls: [] },
      status: 'draft',
    };

    this.formStateSubject.next(initialForm);

    // Initialize history with the default form
    this.historyService.initializeHistory(initialForm);
  }

  /**
   * Validate the current form
   * @returns Validation result with any errors
   */
  validateForm(): { valid: boolean; errors: string[] } {
    const form: IForm = this.getCurrentState();
    const errors: string[] = [];

    // Basic form validation
    if (!form.title) {
      errors.push('Form must have a title');
    }

    // Check if the form has controls
    if (form.container.controls.length === 0) {
      errors.push('Form must have at least one control');
    }

    // Validate control structure
    this.validateControls(form.container.controls, errors);

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get the current form state snapshot
   * @returns Current form state
   */
  getCurrentState(): IForm {
    return this.formStateSubject.getValue();
  }

  /**
   * Save the current form to local storage or backend
   * @param key Optional storage key, defaults to form ID or a generated key
   * @returns The key used to store the form
   */
  saveForm(key?: string): string {
    const form: IForm = this.getCurrentState();
    const storageKey = key || form.id || `form_${Date.now()}`;

    // Update timestamps
    const updatedForm = {
      ...form,
      id: form.id || storageKey,
      updatedAt: new Date(),
    };

    // If this is a new form, add createdAt
    if (!form.createdAt) {
      updatedForm.createdAt = new Date();
    }

    // Update the current state - don't track this in history as a separate state
    this.formStateSubject.next(updatedForm);

    // Save to localStorage (in a real app, this might be an API call)
    localStorage.setItem(`ecrf_${storageKey}`, JSON.stringify(updatedForm));

    return storageKey;
  }

  /**
   * Load a form from local storage or backend
   * @param key The storage key for the form
   * @returns True if the form was loaded successfully
   */
  loadForm(key: string): boolean {
    const storedForm: string | null = localStorage.getItem(`ecrf_${key}`);

    if (!storedForm) {
      return false;
    }

    try {
      const form = JSON.parse(storedForm) as IForm;

      // Reset history when loading a new form
      this.historyService.initializeHistory(form);

      this.formStateSubject.next(form);
      return true;
    } catch (error) {
      console.error('Error loading form:', error);
      return false;
    }
  }

  /**
   * Get a list of all saved forms
   * @returns Array of saved form metadata
   */
  getSavedForms(): SavedFormMetadata[] {
    const forms: any[] = [];

    // Scan localStorage for form keys
    for (let i = 0; i < localStorage.length; i++) {
      const key: string | null = localStorage.key(i);

      if (key?.startsWith('ecrf_')) {
        try {
          const formData = JSON.parse(localStorage.getItem(key) || '{}');
          forms.push({
            id: formData.id,
            title: formData.title || 'Untitled Form',
            updatedAt: new Date(formData.updatedAt),
          });
        } catch (e) {
          console.warn(`Could not parse form data for key ${key}`);
        }
      }
    }

    // Sort by most recently updated
    return forms.sort((a, b): number => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  /**
   * Update the form's metadata
   * @param updates Partial updates to the form metadata
   */
  updateFormMetadata(updates: FormMetadataUpdates): void {
    const currentState: IForm = this.getCurrentState();
    const newState = {
      ...currentState,
      ...updates,
    };

    this.formStateSubject.next(newState);
  }

  /**
   * Reset to a new empty form
   */
  resetToNewForm(): void {
    const newForm: IForm = {
      title: 'New Form',
      description: '',
      container: { controls: [] },
      status: 'draft',
    };

    // Reset history and start with the new form
    this.historyService.initializeHistory(newForm);
    this.formStateSubject.next(newForm);
  }

  /**
   * Update the order of controls within a container
   * @param containerId The ID of the container
   * @param controlIds Array of control IDs in the new order
   */
  reorderControls(containerId: string, controlIds: string[]): void {
    const currentState: IForm = this.getCurrentState();

    // Find the target container (root or nested)
    if (isRootContainerId(containerId)) {
      // Root container reordering
      const reorderedControls = this.reorderControlsArray(
        currentState.container.controls,
        controlIds,
      );

      const newState = {
        ...currentState,
        container: {
          ...currentState.container,
          controls: reorderedControls,
        },
      };

      this.formStateSubject.next(newState);
    } else {
      // Nested container reordering (columns, etc.)
      const newContainer = this.updateNestedContainerWithReordering(
        currentState.container,
        containerId,
        controlIds,
      );

      const newState = {
        ...currentState,
        container: newContainer,
      };

      this.formStateSubject.next(newState);
    }
  }

  /**
   * Move a control from one container to another
   * @param controlId The ID of the control to move
   * @param sourceContainerId The ID of the source container
   * @param targetContainerId The ID of the target container
   * @param targetIndex The index in the target container to place the control
   */
  moveControl(
    controlId: string,
    sourceContainerId: string,
    targetContainerId: string,
    targetIndex: number,
  ): void {
    const currentState = JSON.parse(JSON.stringify(this.getCurrentState()));
    let controlToMove: IFormControl | null = null;

    // Case 1: Source is the root container
    // It searches for the control in the root container's controls and removes it.
    if (isRootContainerId(sourceContainerId) || sourceContainerId === 'form') {
      const sourceControls = [...currentState.container.controls];
      const controlIndex: number = sourceControls.findIndex((c): boolean => c.id === controlId);

      if (controlIndex >= 0) {
        controlToMove = sourceControls[controlIndex];
        sourceControls.splice(controlIndex, 1);
        currentState.container.controls = sourceControls;
      }
    }
    // Case 2: Source is a nested container (likely a column)
    else {
      const isColumnContainer: boolean = sourceContainerId.startsWith(
        ELEMENT_CONTAINERS.COLUMN_PREFIX,
      );

      if (isColumnContainer) {
        // Find the column control and update its nested containers
        this.traverseAndUpdateNestedContainer(
          currentState.container,
          sourceContainerId,
          (container) => {
            const controlIndex: number = container.controls.findIndex(
              (c): boolean => c.id === controlId,
            );
            if (controlIndex >= 0) {
              controlToMove = container.controls[controlIndex];
              const updatedControls = [...container.controls];
              updatedControls.splice(controlIndex, 1);
              return { controls: updatedControls };
            }
            return container;
          },
        );
      }
    }

    // If control wasn't found, log an error and return early
    if (!controlToMove) {
      console.error(`Control with ID ${controlId} not found in source container`);
      return;
    }

    // Step 2: Add the control to the target container at the specified index
    // Case 1: Target is the root container
    if (isRootContainerId(targetContainerId)) {
      const targetControls = [...currentState.container.controls];
      targetControls.splice(targetIndex, 0, controlToMove);
      currentState.container.controls = targetControls;
    }
    // Case 2: Target is a nested container (likely a column)
    else {
      this.traverseAndUpdateNestedContainer(
        currentState.container,
        targetContainerId,
        (container) => {
          const updatedControls = [...container.controls];
          // TypeScript still might not be convinced, so we'll add a check
          if (controlToMove) {
            updatedControls.splice(targetIndex, 0, controlToMove);
          }
          return { controls: updatedControls };
        },
      );
    }

    // Step 3: Update the state with a single emission
    this.formStateSubject.next(currentState);
  }

  /**
   * Helper method to traverse and update a nested container
   *
   * @param container The container to traverse
   * @param targetId The ID of the target container
   * @param updateFn Function to update the container when found
   * @returns True if the container was found and updated
   */
  private traverseAndUpdateNestedContainer(
    container: { controls: IFormControl[] },
    targetId: string,
    updateFn: (container: { controls: IFormControl[] }) => { controls: IFormControl[] },
  ): boolean {
    // Root container case
    if (isRootContainerId(targetId)) {
      Object.assign(container, updateFn(container));
      return true;
    }

    // Handle nested containers (columns)
    for (let i = 0; i < container.controls.length; i++) {
      const control = container.controls[i];

      if (control.type === FormElementType.COLUMNS) {
        const columnsControl = control as Columns;

        for (let j = 0; j < columnsControl.columns.length; j++) {
          const column = columnsControl.columns[j];
          const columnContainerId = `column-${j}-${columnsControl.id}`;

          // If this is the target container
          if (columnContainerId === targetId) {
            columnsControl.columns[j] = {
              ...column,
              container: updateFn(column.container),
            };
            return true;
          }

          // Try to find the target in this column's container
          if (this.traverseAndUpdateNestedContainer(column.container, targetId, updateFn)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
   * Recursively update the order of controls in a nested container
   */
  private updateNestedContainerWithReordering(
    container: { controls: IFormControl[] },
    targetId: string,
    newOrder: string[],
  ): { controls: IFormControl[] } {
    // For column containers, we need to look for matches in the controls
    const newControls = container.controls.map((control) => {
      if (control.type === FormElementType.COLUMNS) {
        const columnsControl = control as Columns;
        const updatedColumns = columnsControl.columns.map((column, columnIndex) => {
          // Generate container ID for this column
          const columnContainerId = `column-${columnsControl.id}-${columnIndex}`;

          if (columnContainerId === targetId) {
            return {
              ...column,
              container: {
                ...column.container,
                controls: this.reorderControlsArray(column.container.controls, newOrder),
              },
            };
          }

          // Recursively check this column's container
          return {
            ...column,
            container: this.updateNestedContainerWithReordering(
              column.container,
              targetId,
              newOrder,
            ),
          };
        });

        return {
          ...columnsControl,
          columns: updatedColumns,
        };
      }

      return control;
    });

    return { controls: newControls };
  }

  /**
   * Recursively validate controls
   */
  private validateControls(controls: IFormControl[], errors: string[], path = ''): void {
    controls.forEach((control, index) => {
      const controlPath = path
        ? `${path} > ${control.title || control.type}`
        : control.title || control.type;

      // Check for required fields based on type
      if (control.type === FormElementType.INPUT_TEXT) {
        const textInput = control as ECRFInputTextClass;
        if (!textInput.options?.title) {
          errors.push(`${controlPath}: Input text must have a title`);
        }
      } else if (control.type === FormElementType.COLUMNS) {
        const columns = control as Columns;

        // Validate column structure
        if (!columns.columns || columns.columns.length === 0) {
          errors.push(`${controlPath}: Columns control must have at least one column`);
        } else {
          // Validate nested controls in each column
          columns.columns.forEach((column: any, columnIndex: number) => {
            if (!column.container) {
              errors.push(`${controlPath} > Column ${columnIndex + 1}: Column missing container`);
            } else {
              this.validateControls(
                column.container.controls,
                errors,
                `${controlPath} > Column ${columnIndex + 1}`,
              );
            }
          });
        }
      }

      // Add more validations for other control types as needed
    });
  }

  /**
   * Helper method to reorder an array of controls based on control IDs
   */
  private reorderControlsArray(controls: IFormControl[], newOrder: string[]): IFormControl[] {
    // Create a map of id -> control for a quick lookup
    const controlMap: Record<string, IFormControl> = {};
    controls.forEach((control) => {
      controlMap[control.id] = control;
    });

    // Create a new array in a specified order
    return newOrder.map((id) => controlMap[id]).filter((control) => !!control); // Filter out any IDs that don't exist
  }
}
