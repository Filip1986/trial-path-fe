import { ELEMENT_CONTAINERS } from '../models/consts/element-containers.const';

/**
 * Generate a unique ID for form controls
 * @param type The type of control (will be normalized to a consistent format)
 * @returns A unique ID string
 */
export function generateUniqueId(type: string): string {
  // Normalize the type name to ensure a consistent format
  const normalizedType: string = normalizeControlType(type);

  // Generate a unique random string
  const uniquePart: string = Math.random().toString(36).substring(2, 11);

  // Return the standardized format
  return `${normalizedType}-${uniquePart}`;
}

/**
 * Normalize control type names to a consistent format
 * @param type The control type name to normalize
 * @returns Normalized control type string
 */
export function normalizeControlType(type: string): string {
  // Convert to lowercase
  const lowercaseType: string = type.toLowerCase();

  // Handle special cases
  switch (lowercaseType) {
    case 'textinput':
    case 'text-input':
    case 'text_input':
      return 'text-input';

    case 'textarea':
    case 'text-area':
    case 'text_area':
      return 'text-area';

    case 'checkbox':
    case 'check-box':
    case 'check_box':
      return 'checkbox';

    case 'radiobutton':
    case 'radio-button':
    case 'radio_button':
    case 'radio':
      return 'radio-button';

    // Add other control types as needed

    default:
      // For unknown types, convert camelCase or snake_case to a kebab-case
      return lowercaseType
        .replace(/_/g, '-') // Convert snake_case to a kebab-case
        .replace(/([a-z])([A-Z])/g, '$1-$2') // Convert camelCase to kebab-case
        .toLowerCase();
  }
}

/**
 * Utility function to check if a container ID represents the root container
 */
export function isRootContainerId(containerId: string): boolean {
  return [
    ELEMENT_CONTAINERS.MAIN_CANVAS,
    ELEMENT_CONTAINERS.FORM_CANVAS,
    ELEMENT_CONTAINERS.ROOT_CANVAS,
    ELEMENT_CONTAINERS.FORM,
  ].includes(containerId);
}
