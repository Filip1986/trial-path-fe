/**
 * Base interface for all form elements
 */
export interface FormElement {
  id: string;
  type: FormElementType;
  label: string;
  required: boolean;
  order: number;
  visible: boolean;
  description?: string;
  validations?: ValidationRule[];
  conditionalDisplay?: ConditionalRule;
  defaultValue?: string | string[] | number | boolean; // Add a generic defaultValue property
  placeholder?: string;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
  // Layout properties
  columnSpan?: number; // Number of columns this element spans in grid layout
  layoutPosition?: 'start' | 'center' | 'end' | 'full'; // Position hint for flow layout
}

/**
 * Types of form elements supported in the eCRF builder
 */
export enum FormElementType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  DATE = 'date',
  TIME = 'time',
  DATETIME = 'datetime',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  DROPDOWN = 'dropdown',
  MULTI_SELECT = 'multiselect',
  CALCULATED = 'calculated',
  ATTACHMENT = 'attachment',
  SIGNATURE = 'signature',
  TABLE = 'table',
  SECTION = 'section',
  MEDICATION = 'medication',
  LAB_TEST = 'lab_test',
  VITAL_SIGN = 'vital_sign',
  ROW = 'row',
  COLUMN = 'column',
}

/**
 * Canvas layout types
 */
export enum CanvasLayoutType {
  LIST = 'list',
  GRID = 'grid',
  FLOW = 'flow',
  CUSTOM = 'custom', // New layout type for custom row/column layouts
}

/**
 * Interface for a text input element
 */
export interface TextElement extends FormElement {
  type: FormElementType.TEXT;
  placeholder?: string;
  defaultValue?: string;
  maxLength?: number;
}

/**
 * Interface for textarea element
 */
export interface TextAreaElement extends FormElement {
  type: FormElementType.TEXTAREA;
  placeholder?: string;
  defaultValue?: string;
  maxLength?: number;
  rows?: number;
  resize?: boolean; // Allow user to resize the textarea
}

/**
 * Interface for a number element
 */
export interface NumberElement extends FormElement {
  type: FormElementType.NUMBER;
  placeholder?: string;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

/**
 * Interface for a date element
 */
export interface DateElement extends FormElement {
  type: FormElementType.DATE;
  defaultValue?: string;
  minDate?: string;
  maxDate?: string;
  format?: string;
  showTime?: boolean; // Whether to include time selection
}

/**
 * Interface for a time element
 */
export interface TimeElement extends FormElement {
  type: FormElementType.TIME;
  defaultValue?: string;
  format?: string; // 12h or 24h
}

/**
 * Interface for datetime element
 */
export interface DateTimeElement extends FormElement {
  type: FormElementType.DATETIME;
  defaultValue?: string;
  minDate?: string;
  maxDate?: string;
  format?: string;
  showTime?: boolean;
}

/**
 * Interface for a checkbox element
 */
export interface CheckboxElement extends FormElement {
  type: FormElementType.CHECKBOX;
  defaultChecked?: boolean;
  defaultValue?: boolean;
}

/**
 * Common interface for elements with options
 */
export interface OptionElement extends FormElement {
  options: OptionItem[];
  defaultValue?: string | string[];
  allowOther?: boolean;
}

/**
 * Interface for a radio button element
 */
export interface RadioElement extends OptionElement {
  type: FormElementType.RADIO;
  layout?: 'horizontal' | 'vertical';
}

/**
 * Interface for a dropdown element
 */
export interface DropdownElement extends OptionElement {
  type: FormElementType.DROPDOWN;
  placeholder?: string;
  filter?: boolean;
}

/**
 * Interface for multi-select element
 */
export interface MultiSelectElement extends OptionElement {
  type: FormElementType.MULTI_SELECT;
  placeholder?: string;
  filter?: boolean;
}

/**
 * Interface for calculated field element
 */
export interface CalculatedElement extends FormElement {
  type: FormElementType.CALCULATED;
  formula: string; // e.g., "{field1} + {field2}"
  displayPrecision?: number;
  unit?: string;
}

/**
 * Interface for an attachment element
 */
export interface AttachmentElement extends FormElement {
  type: FormElementType.ATTACHMENT;
  allowedFileTypes?: string[]; // e.g., ["pdf", "jpg", "png"]
  maxFileSize?: number; // in MB
  maxFiles?: number;
}

/**
 * Interface for signature element
 */
export interface SignatureElement extends FormElement {
  type: FormElementType.SIGNATURE;
  signatureType?: 'draw' | 'type';
  instructionText?: string;
}

/**
 * Interface for a section container
 */
export interface SectionElement extends FormElement {
  type: FormElementType.SECTION;
  elements: FormElement[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  // Section specific layout properties
  backgroundColor?: string;
  borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted';
}

/**
 * Interface for a table element
 */
export interface TableElement extends FormElement {
  type: FormElementType.TABLE;
  columns: TableColumn[];
  minRows?: number;
  maxRows?: number;
  allowAddRows?: boolean;
  allowDeleteRows?: boolean;
}

/**
 * Interface for table column
 */
export interface TableColumn {
  id: string;
  type: FormElementType;
  header: string;
  width?: string;
  required?: boolean;
  options?: OptionItem[]; // For dropdown, radio, etc.
  validation?: ValidationRule[];
}

/**
 * Interface for option item (used in Radio, Dropdown, etc.)
 */
export interface OptionItem {
  value: string;
  label: string;
  disabled?: boolean;
  codingValue?: string; // For standardized coding systems like SNOMED, ICD, etc.
}

/**
 * Interface for validation rule
 */
export interface ValidationRule {
  type: ValidationRuleType;
  message: string;
  value?: any;
}

/**
 * Types of validation rules
 */
export enum ValidationRuleType {
  REQUIRED = 'required',
  MIN_LENGTH = 'minLength',
  MAX_LENGTH = 'maxLength',
  PATTERN = 'pattern',
  MIN = 'min',
  MAX = 'max',
  EMAIL = 'email',
  CUSTOM = 'custom',
}

/**
 * Interface for conditional display rule
 */
export interface ConditionalRule {
  fieldId: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
  value: any;
  logicalOperator?: 'AND' | 'OR';
  additionalConditions?: ConditionalRule[];
}

/**
 * Interface for form definition
 */
export interface FormDefinition {
  id: string;
  title: string;
  description?: string;
  version: string;
  createdBy: string;
  createdDate: string;
  updatedBy?: string;
  updatedDate?: string;
  status: 'draft' | 'published' | 'archived';
  elements: FormElement[];
  metadata?: Record<string, any>;
  // Form layout configuration
  layoutType?: CanvasLayoutType;
  gridColumns?: number;
  // Visual theme settings
  theme?: FormThemeSettings;
}

/**
 * Interface for form theme settings
 */
export interface FormThemeSettings {
  primaryColor?: string;
  backgroundColor?: string;
  fontFamily?: string;
  fontSize?: string;
  borderRadius?: string;
  spacing?: 'compact' | 'normal' | 'spacious';
}

/**
 * Interface for a form response (data entered by a user)
 */
export interface FormResponse {
  id: string;
  formDefinitionId: string;
  formVersion: string;
  subject: string; // Subject identifier
  status: 'in_progress' | 'completed' | 'validated' | 'queried';
  values: Record<string, any>; // Map of fieldId to value
  createdBy: string;
  createdDate: string;
  updatedBy?: string;
  updatedDate?: string;
  submittedBy?: string;
  submittedDate?: string;
  queries?: FormQuery[];
}

/**
 * Interface for a query on a form response
 */
export interface FormQuery {
  id: string;
  fieldId: string;
  message: string;
  status: 'open' | 'answered' | 'closed';
  createdBy: string;
  createdDate: string;
  answeredBy?: string;
  answeredDate?: string;
  answer?: string;
}

/**
 * Interface for the library of form templates
 */
export interface FormTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  elements: FormElement[];
  previewImage?: string;
}

/**
 * Interface for exporting/importing form definitions
 */
export interface FormExport {
  formDefinition: FormDefinition;
  exportDate: string;
  exportVersion: string;
  exportedBy: string;
}

/**
 * Interface for a row layout element
 */
export interface RowElement extends FormElement {
  type: FormElementType.ROW;
  columns: ColumnElement[];
  gap?: number; // Gap between columns in pixels
  padding?: number; // Padding inside the row
  backgroundColor?: string;
}

/**
 * Interface for a column layout element
 */
export interface ColumnElement extends FormElement {
  type: FormElementType.COLUMN;
  elements: FormElement[];
  width: number; // Width in a 12-column grid system (1-12)
  backgroundColor?: string;
  padding?: number;
}
