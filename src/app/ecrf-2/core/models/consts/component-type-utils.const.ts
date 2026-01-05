import { ComponentType } from '../enums/component-types.enum';
import { COMPONENT_METADATA } from '../consts/component-meta-data.consts';
import { ComponentCategory } from '../enums/component-category.enum';

// Utility functions for working with component types
export const ComponentTypeUtils = {
  /**
   * Get all component types by category
   */
  getByCategory(category: ComponentCategory): ComponentType[] {
    return Object.values(ComponentType).filter(
      (type: ComponentType): boolean => COMPONENT_METADATA[type]?.category === category,
    );
  },

  /**
   * Get all form control component types
   */
  getFormControls(): ComponentType[] {
    return this.getByCategory(ComponentCategory.FORM_CONTROL);
  },

  /**
   * Get all dialog component types
   */
  getDialogs(): ComponentType[] {
    return this.getByCategory(ComponentCategory.DIALOG);
  },

  /**
   * Get all preview component types
   */
  getPreviews(): ComponentType[] {
    return this.getByCategory(ComponentCategory.PREVIEW);
  },
};
