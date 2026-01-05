export interface ComponentStyleOption {
  name: string;
  value: '1' | '2' | '3';
}

export type UIVariant = '1' | '2' | '3';

/**
 * Standard style options used across components
 */
export const COMPONENT_STYLE_OPTIONS: ComponentStyleOption[] = [
  { name: '1', value: '1' },
  { name: '2', value: '2' },
  { name: '3', value: '3' },
];
