import { Injectable } from '@angular/core';
import { ComponentType } from '../models/enums/component-types.enum';
import { COMPONENT_METADATA } from '../models/consts/component-meta-data.consts';
import { FORM_ELEMENT_TO_COMPONENT_MAP } from '../models/consts/form-element-to-component.const';
import { FormElementType } from '../models/enums/form.enums';
import { IComponentMetadata } from '../models/interfaces/component-meta-data.interface';

/**
 * Service to centralize all icon mappings
 * This eliminates hardcoded icon strings throughout the app
 */
@Injectable({
  providedIn: 'root',
})
export class IconMappingService {
  /**
   * Maps form element types to PrimeNG icon classes
   */
  private readonly primeIconMap: Record<FormElementType, string> = {
    [FormElementType.INPUT_TEXT]: 'pi pi-pencil',
    [FormElementType.TEXT_AREA]: 'pi pi-align-left',
    [FormElementType.INPUT_NUMBER]: 'pi pi-hashtag',
    [FormElementType.DATE_PICKER]: 'pi pi-calendar-plus',
    [FormElementType.TIME_PICKER]: 'pi pi-clock',
    [FormElementType.CHECKBOX]: 'pi pi-check-square',
    [FormElementType.RADIO]: 'pi pi-circle-on',
    [FormElementType.SELECT]: 'pi pi-chevron-down',
    [FormElementType.MULTISELECT]: 'pi pi-list',
    [FormElementType.LIST_BOX]: 'pi pi-list',
    [FormElementType.COLUMNS]: 'pi pi-columns',
    [FormElementType.SELECT_BUTTON]: 'pi pi-toggle-on',
  };

  /**
   * Get PrimeNG icon class for a form element type
   * @param type The form element type
   * @returns The PrimeNG icon class
   */
  getPrimeIcon(type: FormElementType): string {
    const componentType: ComponentType | undefined = FORM_ELEMENT_TO_COMPONENT_MAP[type];
    if (componentType) {
      const metadata: IComponentMetadata = COMPONENT_METADATA[componentType];
      if (metadata?.icon) {
        return metadata.icon;
      }
    }
    return this.primeIconMap[type] || 'pi pi-question-circle';
  }

  /**
   * Format element type for display
   * Converts camelCase or snake_case to Title Case with spaces
   * @param type The form element type
   * @returns Formatted display name
   */
  getFormattedTypeName(type: FormElementType): string {
    // Get the string value of the enum
    const typeString = type.toString();

    // Convert from camelCase or snake_case to Title Case with spaces
    return typeString
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^\w/, (c) => c.toUpperCase())
      .trim();
  }
}
