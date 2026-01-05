import { Injectable } from '@angular/core';
import { FormControlFactory } from '../../factories/form-control-factory';
import { IconMappingService } from '../icon-mapping.service';
import { ControlFactoryOptions } from '../../models/types/control.type';
import { IFormControl } from '../../models/interfaces/form.interfaces';
import { FormElementType } from '../../models/enums/form.enums';

/**
 * Service that provides functionality for creating and managing form controls
 * Uses the FormControlFactory to eliminate magic strings
 */
@Injectable({ providedIn: 'root' })
export class FormControlsService {
  constructor(
    private formControlFactory: FormControlFactory,
    private iconService: IconMappingService,
  ) {}

  /**
   * Create a control of the specified type
   * @param type The type of control to create
   * @param options Optional parameters for control creation
   * @returns The created form control
   */
  public createControl(
    type: FormElementType,
    options?: Partial<ControlFactoryOptions>,
  ): IFormControl {
    // Provide default options if not specified
    const fullOptions: ControlFactoryOptions = {
      name: options?.name || this.iconService.getFormattedTypeName(type),
      title: options?.title || this.iconService.getFormattedTypeName(type),
      required: options?.required ?? false,
      ...(options || {}),
    } as ControlFactoryOptions;

    return this.formControlFactory.createControl(type, fullOptions);
  }

  /**
   * Get an array of all available control types
   * @returns Array of all form element types
   */
  public getAvailableControlTypes(): FormElementType[] {
    return Object.values(FormElementType);
  }

  /**
   * Group controls by category for UI organization
   * @returns Grouped control types
   */
  public getControlGroups(): { [key: string]: FormElementType[] } {
    return {
      basic: [
        FormElementType.INPUT_TEXT,
        FormElementType.TEXT_AREA,
        FormElementType.INPUT_NUMBER,
        FormElementType.CHECKBOX,
        FormElementType.RADIO,
        FormElementType.SELECT,
        FormElementType.SELECT_BUTTON,
      ],
      advanced: [
        FormElementType.DATE_PICKER,
        FormElementType.TIME_PICKER,
        FormElementType.MULTISELECT,
        FormElementType.LIST_BOX,
      ],
      layout: [FormElementType.COLUMNS],
    };
  }
}
