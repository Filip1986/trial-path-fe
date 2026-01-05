export enum LayoutItemType {
  ELEMENT = 'element',
  CONTAINER = 'container',
}

export interface LayoutItem {
  id: string;
  type: LayoutItemType;
  label: string;
  children?: LayoutItem[];
  data?: any;
  // Add more properties as needed (e.g., styling, configuration)
}

/**
 * Creates a new layout item with default values
 * @param type The type of layout item
 * @param label The display label for the item
 * @returns A new layout item with generated ID
 */
export function createLayoutItem(type: LayoutItemType, label: string): LayoutItem {
  return {
    id: generateId(),
    type,
    label,
    children: type === LayoutItemType.CONTAINER ? [] : undefined,
  };
}

/**
 * Generates a unique ID for layout items
 * @returns A unique string ID
 */
function generateId(): string {
  return 'item_' + Math.random().toString(36).substring(2, 9);
}
