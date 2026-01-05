/**
 * Constant definitions for element container IDs and prefixes
 * This eliminates magic strings in container identifiers
 */
export const ELEMENT_CONTAINERS = {
  // Container prefixes
  TOOLBOX_PREFIX: 'toolbox-',
  COLUMN_PREFIX: 'column-',

  // Fixed container IDs
  MAIN_CANVAS: 'main-canvas',
  FORM_CANVAS: 'form-canvas',
  ROOT_CANVAS: 'root-canvas',
  FORM: 'form',
  NO_DROP: 'no-drop',

  // Element group names
  GROUP_BASIC: 'Basic',
  GROUP_ADVANCED: 'Advanced',
  GROUP_LAYOUT: 'Layout',

  // Container types
  TYPE_TOOLBOX: 'toolbox',
  TYPE_ELEMENT: 'element',

  // Specific container IDs
  TOOLBOX_BASIC: 'toolbox-Basic',
  TOOLBOX_ADVANCED: 'toolbox-Advanced',
  TOOLBOX_LAYOUT: 'toolbox-Layout',

  // Column pattern - use with string interpolation
  // Example: `${ELEMENT_CONTAINERS.COLUMN_PATTERN}${columnId}`
  COLUMN_PATTERN: 'column-',

  // Specific element IDs
  // Use with string interpolation
  // Example: `${ELEMENT_CONTAINERS.ELEMENT_ID_PREFIX}${element.id}`
  ELEMENT_ID_PREFIX: 'visual-element-',
  COLUMN_ID_PREFIX: 'visual-column-',
  COLUMN_CONTENT_PREFIX: 'visual-column-content-',
  ROW_ID_PREFIX: 'visual-row-',
};
