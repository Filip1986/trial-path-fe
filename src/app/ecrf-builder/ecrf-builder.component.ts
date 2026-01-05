import { Component, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CdkDragDrop,
  DragDropModule,
  CdkDropListGroup,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { TabsModule } from 'primeng/tabs';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { AccordionModule } from 'primeng/accordion';
import { DatePickerModule } from 'primeng/datepicker';
import { TooltipModule } from 'primeng/tooltip';
import { TextareaModule } from 'primeng/textarea';

// eCRF Models
import {
  FormDefinition,
  FormElement,
  FormElementType,
  TextElement,
  NumberElement,
  DateElement,
  TextAreaElement,
  CheckboxElement,
  RadioElement,
  DropdownElement,
  SectionElement,
  OptionElement,
  MultiSelectElement,
  DateTimeElement,
  CanvasLayoutType,
  RowElement,
  ColumnElement,
} from './models/ecrf.models';
import { ColorPicker } from 'primeng/colorpicker';
import { Slider } from 'primeng/slider';

interface FormStatusOption {
  label: string;
  value: string;
}

interface ElementGroup {
  name: string;
  items: ElementToolboxItem[];
}

interface ElementToolboxItem {
  type: FormElementType;
  icon: string;
  label: string;
}

const GRID_COLUMNS = 12;
const DEFAULT_PADDING = 16;

@Component({
  selector: 'app-ecrf-builder',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule, // Add CDK DragDropModule
    CardModule,
    ButtonModule,
    PanelModule,
    TabsModule,
    InputTextModule,
    SelectModule,
    MultiSelectModule,
    DialogModule,
    CheckboxModule,
    RadioButtonModule,
    InputNumberModule,
    AccordionModule,
    TextareaModule,
    DatePickerModule,
    TooltipModule,
    ColorPicker,
    Slider,
    CdkDropListGroup,
  ],
  templateUrl: './ecrf-builder.component.html',
  styleUrl: './ecrf-builder.component.scss',
})
export class EcrfBuilderComponent {
  // Current form being built
  currentForm: FormDefinition = {
    id: this.generateUniqueId(),
    title: 'New eCRF Form',
    description: '',
    version: '1.0.0',
    createdBy: 'current_user',
    createdDate: new Date().toISOString(),
    status: 'draft',
    elements: [],
    layoutType: CanvasLayoutType.LIST,
  };

  // Add flat arrays to store elements
  mainCanvasElements: FormElement[] = [];
  columnElements: Map<string, FormElement[]> = new Map<string, FormElement[]>();

  // Layout options for form canvas - add custom option
  layoutOptions = [
    { label: 'List View', value: 'list' },
    { label: 'Grid View', value: 'grid' },
    { label: 'Flow Layout', value: 'flow' },
    { label: 'Custom Layout', value: 'custom' },
  ];

  // Element groups for the sidebar
  elementGroups: ElementGroup[] = [
    {
      name: 'Basic',
      items: [
        { type: FormElementType.TEXT, icon: 'pi-text-size', label: 'Text' },
        { type: FormElementType.TEXTAREA, icon: 'pi-align-left', label: 'Textarea' },
        { type: FormElementType.NUMBER, icon: 'pi-hashtag', label: 'Number' },
        { type: FormElementType.DATE, icon: 'pi-calendar', label: 'Date' },
        { type: FormElementType.CHECKBOX, icon: 'pi-check-square', label: 'Checkbox' },
        { type: FormElementType.RADIO, icon: 'pi-circle-fill', label: 'Radio' },
        { type: FormElementType.DROPDOWN, icon: 'pi-chevron-down', label: 'Dropdown' },
      ],
    },
    {
      name: 'Advanced',
      items: [
        { type: FormElementType.MULTI_SELECT, icon: 'pi-list', label: 'Multi Select' },
        { type: FormElementType.CALCULATED, icon: 'pi-calculator', label: 'Calculated' },
        { type: FormElementType.ATTACHMENT, icon: 'pi-paperclip', label: 'Attachment' },
        { type: FormElementType.SIGNATURE, icon: 'pi-pencil', label: 'Signature' },
        { type: FormElementType.DATETIME, icon: 'pi-calendar-plus', label: 'Date Time' },
        { type: FormElementType.TIME, icon: 'pi-clock', label: 'Time' },
      ],
    },
    {
      name: 'Layout',
      items: [
        { type: FormElementType.SECTION, icon: 'pi-folder', label: 'Section' },
        { type: FormElementType.TABLE, icon: 'pi-table', label: 'Table' },
        { type: FormElementType.ROW, icon: 'pi-server', label: 'Row' },
        { type: FormElementType.COLUMN, icon: 'pi-columns', label: 'Column' },
      ],
    },
  ];

  // Form status options
  formStatusOptions: FormStatusOption[] = [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
    { label: 'Archived', value: 'archived' },
  ];

  // Make FormElementType available to the template
  FormElementType = FormElementType;

  gridColumns = 2;
  // Element width configuration (store with an element)
  elementWidths: Record<string, number> = {}; // elementId -> column span
  // Dialog visibility flags
  showElementConfigDialog = false;
  // Currently edited element
  currentElement: FormElement | null = null;

  // State for layout configuration dialog
  showLayoutConfigDialog = false;
  currentLayoutElement: RowElement | ColumnElement | null = null;

  constructor(private viewContainerRef: ViewContainerRef) {}

  // Canvas layout configuration
  get canvasLayoutType(): 'flow' | 'grid' | 'list' | 'custom' {
    return this.currentForm.layoutType as 'flow' | 'grid' | 'list';
  }

  set canvasLayoutType(value: 'flow' | 'grid' | 'list') {
    this.currentForm.layoutType = value as CanvasLayoutType;
    this.onLayoutChange();
  }

  /**
   * Gets elements belonging to a specific column
   * @param columnId The column ID
   * @returns Array of form elements in the column
   */
  getColumnElements(columnId: string): FormElement[] {
    if (!this.columnElements.has(columnId)) {
      this.columnElements.set(columnId, []);
    }
    return this.columnElements.get(columnId) || [];
  }

  /**
   * Unified drop handler for all drop zones
   * @param event The drag drop event
   */
  onDrop(event: CdkDragDrop<any[]>): void {
    console.log('Drop event:', {
      previousContainer: event.previousContainer.id,
      targetContainer: event.container.id,
      data: event.item.data,
    });

    if (event.previousContainer === event.container) {
      // Simple reordering within the same container
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Handle different source containers
      const dragData = event.item.data;

      if (dragData.type === 'toolbox') {
        // Create a new element from toolbox
        const newElement = this.createNewElement(dragData.item.type);

        // Add directly to the target container
        event.container.data.splice(event.currentIndex, 0, newElement);

        // Open configuration dialog for the new element
        setTimeout(() => this.editElement(newElement), 0);
      } else {
        // Move existing element between containers
        const element = dragData.element;
        const sourceContainerId = dragData.containerId;

        // Remove element from source container data array
        if (sourceContainerId === 'main-canvas') {
          this.mainCanvasElements = this.mainCanvasElements.filter((el) => el.id !== element.id);
        } else if (sourceContainerId.startsWith('column-')) {
          const columnId = sourceContainerId.replace('column-', '');
          const columnElements = this.getColumnElements(columnId);
          this.columnElements.set(
            columnId,
            columnElements.filter((el) => el.id !== element.id),
          );
        }

        // Add to target container
        event.container.data.splice(event.currentIndex, 0, element);
      }
    }

    // Update the form definition to keep it in sync with our flat arrays
    this.updateFormDefinition();
  }

  /**
   * Format element type strings for display
   * @param type Element type to format
   * @returns Formatted element type string
   */
  formatElementType(type: FormElementType): string {
    // Convert from camelCase or snake_case to Title Case with spaces
    return type
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^\w/, (c) => c.toUpperCase());
  }

  /**
   * Get icon class for an element type
   * @param type Element type to get icon for
   * @returns PrimeNG icon class
   */
  getElementIcon(type: FormElementType): string {
    const iconMap: Record<FormElementType, string> = {
      [FormElementType.TEXT]: 'pi-text-size',
      [FormElementType.TEXTAREA]: 'pi-align-left',
      [FormElementType.NUMBER]: 'pi-hashtag',
      [FormElementType.DATE]: 'pi-calendar',
      [FormElementType.TIME]: 'pi-clock',
      [FormElementType.DATETIME]: 'pi-calendar-plus',
      [FormElementType.CHECKBOX]: 'pi-check-square',
      [FormElementType.RADIO]: 'pi-circle-fill',
      [FormElementType.DROPDOWN]: 'pi-chevron-down',
      [FormElementType.MULTI_SELECT]: 'pi-list',
      [FormElementType.CALCULATED]: 'pi-calculator',
      [FormElementType.ATTACHMENT]: 'pi-paperclip',
      [FormElementType.SIGNATURE]: 'pi-pencil',
      [FormElementType.TABLE]: 'pi-table',
      [FormElementType.SECTION]: 'pi-folder',
      [FormElementType.MEDICATION]: 'pi-heart',
      [FormElementType.LAB_TEST]: 'pi-chart-bar',
      [FormElementType.VITAL_SIGN]: 'pi-heart-fill',
      [FormElementType.ROW]: 'pi-heart-fill',
      [FormElementType.COLUMN]: 'pi-heart-fill',
    };

    return iconMap[type] || 'pi-circle';
  }

  /**
   * Creates a new form element based on the specified type
   * @param elementType The type of element to create
   * @returns A new form element
   */
  createNewElement(elementType: FormElementType): FormElement {
    // Create base element properties
    const baseElement = this.createBaseElement(elementType);

    // Create a type-specific element
    switch (elementType) {
      case FormElementType.TEXT:
        return {
          ...baseElement,
          placeholder: 'Enter text...',
          maxLength: 100,
        } as TextElement;

      case FormElementType.TEXTAREA:
        return {
          ...baseElement,
          placeholder: 'Enter text...',
          maxLength: 500,
          rows: 3,
          resize: true,
        } as TextAreaElement;

      case FormElementType.NUMBER:
        return {
          ...baseElement,
          placeholder: 'Enter number...',
          min: 0,
          max: 100,
          step: 1,
        } as NumberElement;

      case FormElementType.DATE:
        return {
          ...baseElement,
          format: 'MM/dd/yyyy',
          showTime: false,
        } as DateElement;

      case FormElementType.CHECKBOX:
        return {
          ...baseElement,
          defaultChecked: false,
        } as CheckboxElement;

      case FormElementType.RADIO:
        return {
          ...baseElement,
          options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
          ],
          layout: 'vertical',
          allowOther: false,
        } as RadioElement;

      case FormElementType.DROPDOWN:
        return {
          ...baseElement,
          options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' },
          ],
          placeholder: 'Select an option',
          filter: false,
          allowOther: false,
        } as DropdownElement;

      case FormElementType.MULTI_SELECT:
        return {
          ...baseElement,
          options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' },
          ],
          placeholder: 'Select options',
          filter: false,
        } as MultiSelectElement;

      case FormElementType.SECTION:
        return {
          ...baseElement,
          elements: [],
          collapsible: true,
          defaultCollapsed: false,
        } as SectionElement;

      case FormElementType.ROW: {
        const defaultColumn: ColumnElement = {
          id: this.generateUniqueId(),
          type: FormElementType.COLUMN,
          label: 'Column',
          required: false,
          order: 1,
          visible: true,
          elements: [],
          width: 12, // Full width by default
        };

        return {
          ...baseElement,
          columns: [defaultColumn],
          gap: 16, // Default gap in pixels
          padding: DEFAULT_PADDING, // Default padding in pixels
        } as RowElement;
      }

      case FormElementType.COLUMN:
        return {
          ...baseElement,
          elements: [],
          width: 6, // Default to half-width
          padding: DEFAULT_PADDING, // Default padding in pixels
        } as ColumnElement;

      default:
        return baseElement;
    }
  }

  /**
   * Determine default width for an element based on its type
   * @param elementType The type of form element
   * @returns Default column span width (1-gridColumns)
   */
  getDefaultElementWidth(elementType: FormElementType): number {
    // Certain elements like sections should take full width by default
    switch (elementType) {
      case FormElementType.SECTION:
      case FormElementType.TABLE:
      case FormElementType.TEXTAREA:
        return this.gridColumns; // Full width
      case FormElementType.TEXT:
      case FormElementType.DATE:
      case FormElementType.DROPDOWN:
        return Math.min(1, this.gridColumns); // Single column or full width if fewer columns available
      default:
        // For other elements, use half-width in grid layout if we have at least 2 columns
        return this.gridColumns >= 2 ? Math.floor(this.gridColumns / 2) : 1;
    }
  }

  /**
   * Open dialog to edit an element
   * @param element The element to edit
   */
  editElement(element: FormElement): void {
    this.currentElement = { ...element };
    this.showElementConfigDialog = true;
  }

  /**
   * Save changes to an element configuration
   */
  saveElementConfiguration(): void {
    if (!this.currentElement) return;

    // Find and update the element in the form
    const elementIndex = this.currentForm.elements.findIndex(
      (el) => el.id === this.currentElement?.id,
    );

    if (elementIndex !== -1) {
      this.currentForm.elements[elementIndex] = { ...this.currentElement };
    }

    // Close the dialog
    this.showElementConfigDialog = false;
    this.currentElement = null;
  }

  /**
   * Get layout class for an individual element
   * @param element The form element
   * @returns CSS classes for the element based on layout
   */
  getElementLayoutClass(element: FormElement): string {
    switch (this.canvasLayoutType) {
      case 'grid': {
        const colSpan = this.elementWidths[element.id] || 1;
        return `col-${(12 / this.gridColumns) * colSpan} mb-3`;
      }
      case 'flow':
        // Flow layout - elements will take their natural width
        return 'p-2 form-element-flow-item';
      case 'list':
      default:
        return 'mb-3';
    }
  }

  /**
   * Handle layout type change
   */
  onLayoutChange(): void {
    if (this.canvasLayoutType === 'custom') {
      // If switching to custom layout and there are no rows,
      // suggest adding rows to the user
      if (!this.currentForm.elements.some((el) => el.type === FormElementType.ROW)) {
        // You could show a toast or dialog here suggesting to add rows
        console.log('Custom layout selected. Drag Row elements to start building your layout.');
      }
    }

    // When switching layouts, we might need to adjust element widths
    if (this.canvasLayoutType === 'grid') {
      // Make sure all elements have a width set when switching to grid
      this.currentForm.elements.forEach((element) => {
        if (!this.elementWidths[element.id]) {
          this.elementWidths[element.id] = this.getDefaultElementWidth(element.type);
        }
      });
    }
  }

  /**
   * Handle change in grid columns number
   */
  onGridColumnsChange(): void {
    // Adjust elements that might be too wide for the new grid
    this.currentForm.elements.forEach((element) => {
      if (this.elementWidths[element.id] > this.gridColumns) {
        this.elementWidths[element.id] = this.gridColumns;
      }
    });
  }

  /**
   * Clear all elements from the form canvas
   */
  clearCanvas(): void {
    if (
      confirm('Are you sure you want to clear all elements from the form? This cannot be undone.')
    ) {
      this.mainCanvasElements = [];
      this.columnElements.clear();
      this.updateFormDefinition();
    }
  }

  /**
   * Save the form definition
   */
  saveFormDefinition(): void {
    // Update timestamp
    this.currentForm.updatedDate = new Date().toISOString();

    // Ensure form definition is in sync with flat arrays
    this.updateFormDefinition();

    // TODO: Implement actual saving logic
    console.log('Saving form definition:', this.currentForm);
    console.log('Column elements:', this.columnElements);

    // Show success message or handle errors
    alert('Form saved successfully!');
  }

  /**
   * Type guard to check if an element has options
   * @param element The element to check
   * @returns True if the element has options (DropdownElement, RadioElement, etc.)
   */
  hasOptions(element: FormElement | null): element is OptionElement {
    return (
      element?.type === FormElementType.DROPDOWN ||
      element?.type === FormElementType.RADIO ||
      element?.type === FormElementType.MULTI_SELECT
    );
  }

  /**
   * Type guard to check if an element is a textarea
   * @param element The element to check
   * @returns True if the element is a textarea
   */
  isTextAreaElement(element: FormElement | null): element is TextAreaElement {
    return element?.type === FormElementType.TEXTAREA;
  }

  /**
   * Type guard to check if an element supports a layout property
   * @param element The form element to check
   * @returns True if the element supports layout configuration
   */
  hasLayoutSupport(element: FormElement | null): element is RadioElement {
    return element?.type === FormElementType.RADIO;
  }

  /**
   * Type guard to check if an element supports an 'allowOther' property
   * @param element The form element to check
   * @returns True if the element supports 'allowOther'
   */
  hasAllowOtherSupport(element: FormElement | null): element is OptionElement {
    return element?.type === FormElementType.DROPDOWN || element?.type === FormElementType.RADIO;
  }

  /**
   * Type guard to check if an element supports a 'filter' property
   * @param element The form element to check
   * @returns True if the element supports filtering
   */
  hasFilterSupport(element: FormElement | null): element is DropdownElement | MultiSelectElement {
    return (
      element?.type === FormElementType.DROPDOWN || element?.type === FormElementType.MULTI_SELECT
    );
  }

  /**
   * Type guard to check if an element supports a 'showTime' property
   * @param element The form element to check
   * @returns True if the element supports showing time
   */
  hasShowTimeSupport(element: FormElement | null): element is DateElement | DateTimeElement {
    return element?.type === FormElementType.DATE || element?.type === FormElementType.DATETIME;
  }

  /**
   * Type guard to check if an element supports a format property
   * @param element The form element to check
   * @returns True if the element supports format configuration
   */
  hasFormatSupport(element: FormElement | null): element is DateElement | DateTimeElement {
    return element?.type === FormElementType.DATE || element?.type === FormElementType.DATETIME;
  }

  /**
   * Type guard to check if an element is a number element
   * @param element The element to check
   * @returns True if the element is a number element
   */
  isNumberElement(element: FormElement | null): element is NumberElement {
    return element?.type === FormElementType.NUMBER;
  }

  /**
   * Type guard to check if an element is a textarea with resize support
   * @param element The element to check
   * @returns True if the element is a textarea
   */
  isTextAreaElementWithResize(element: FormElement | null): element is TextAreaElement {
    return element?.type === FormElementType.TEXTAREA;
  }

  /**
   * Handles printing the current form
   * Creates a print-friendly view and uses the browser's print functionality
   */
  printForm(): void {
    // Store the original page title
    const originalTitle = document.title;

    // Set page title to form title for the print output
    document.title = this.currentForm.title || 'eCRF Form';

    // Create and append a print-only stylesheet if needed
    // For more complex scenarios, consider using a dedicated print service

    // Add a nice printed header with the form title
    const formCanvas = document.querySelector('.form-canvas');
    const titleElement = document.createElement('h1');
    titleElement.className = 'print-form-title print-only';
    titleElement.textContent = this.currentForm.title;

    // Add form description if available
    let descriptionElement = null;
    if (this.currentForm.description) {
      descriptionElement = document.createElement('p');
      descriptionElement.className = 'print-only';
      descriptionElement.textContent = this.currentForm.description;
      descriptionElement.style.marginBottom = '20px';
    }

    // Add a date and version footer
    const footerElement = document.createElement('div');
    footerElement.className = 'print-only';
    footerElement.style.marginTop = '30px';
    footerElement.style.borderTop = '1px solid #ccc';
    footerElement.style.paddingTop = '10px';
    footerElement.style.fontSize = '9pt';
    footerElement.style.color = '#666';
    footerElement.innerHTML = `
    <div style="display: flex; justify-content: space-between;">
      <div>Form Version: ${this.currentForm.version}</div>
      <div>Printed: ${new Date().toLocaleDateString()}</div>
    </div>
  `;

    // Add elements to the DOM
    if (formCanvas) {
      formCanvas.insertBefore(titleElement, formCanvas.firstChild);
      if (descriptionElement) {
        formCanvas.insertBefore(descriptionElement, formCanvas.children[1]);
      }
      formCanvas.appendChild(footerElement);
    }

    // Use setTimeout to ensure the DOM is updated before printing
    setTimeout(() => {
      // Trigger browser print dialog
      window.print();

      // After printing, restore the original document state
      setTimeout(() => {
        document.title = originalTitle;

        // Remove the print-only elements we added
        if (formCanvas) {
          formCanvas.removeChild(titleElement);
          if (descriptionElement) {
            formCanvas.removeChild(descriptionElement);
          }
          formCanvas.removeChild(footerElement);
        }
      }, 500);
    }, 300);
  }

  /**
   * Adds a column to a row
   * @param row The row to add a column to
   */
  addColumnToRow(row: RowElement): void {
    const newColumn: ColumnElement = {
      id: this.generateUniqueId(),
      type: FormElementType.COLUMN,
      label: `Column ${row.columns.length + 1}`,
      required: false,
      order: row.columns.length + 1,
      visible: true,
      elements: [],
      width: 6,
      padding: DEFAULT_PADDING,
    };

    row.columns.push(newColumn);
    this.adjustColumnWidths(row);

    // Initialize column element array
    this.columnElements.set(newColumn.id, []);
  }

  /**
   * Removes a column from a row
   * @param row The row containing the column
   * @param columnIndex The index of the column to remove
   */
  removeColumnFromRow(row: RowElement, columnIndex: number): void {
    if (row.columns.length <= 1) {
      return;
    }

    const columnId = row.columns[columnIndex].id;

    // Remove column elements
    this.columnElements.delete(columnId);

    // Remove column from row
    row.columns.splice(columnIndex, 1);
    this.adjustColumnWidths(row);
  }

  /**
   * Adjusts column widths to ensure they add up to 12
   * @param row The row containing columns to adjust
   */
  adjustColumnWidths(row: RowElement): void {
    this.distributeWidths(row.columns, GRID_COLUMNS);
  }

  /**
   * Type guard to check if an element is a row
   * @param element The element to check
   * @returns True if the element is a row
   */
  isRowElement(element: FormElement | null): element is RowElement {
    return element?.type === FormElementType.ROW;
  }

  /**
   * Type guard to check if an element is a column
   * @param element The element to check
   * @returns True if the element is a column
   */
  isColumnElement(element: FormElement | null): element is ColumnElement {
    return element?.type === FormElementType.COLUMN;
  }

  /**
   * Opens the layout configuration dialog
   * @param element The row or column element to configure
   */
  configureLayoutElement(element: RowElement | ColumnElement): void {
    this.currentLayoutElement = element;
    this.showLayoutConfigDialog = true;
  }

  /**
   * Saves layout configuration changes
   */
  saveLayoutConfiguration(): void {
    // Layout changes are already applied via two-way binding
    this.showLayoutConfigDialog = false;
    this.currentLayoutElement = null;
  }

  /**
   * Gets the column width as a percentage for CSS
   * @param column The column element
   * @returns CSS width string (e.g., '33.3%')
   */
  getColumnWidthPercentage(column: ColumnElement): string {
    return `${(column.width / 12) * 100}%`;
  }

  /**
   * Removes an element from a container
   * @param elementId ID of the element to remove
   * @param containerId ID of the container
   */
  removeElement(elementId: string, containerId: string): void {
    if (containerId === 'main-canvas') {
      this.mainCanvasElements = this.mainCanvasElements.filter((el) => el.id !== elementId);
    } else if (containerId.startsWith('column-')) {
      const columnId = containerId.replace('column-', '');
      const columnElements = this.getColumnElements(columnId);
      this.columnElements.set(
        columnId,
        columnElements.filter((el) => el.id !== elementId),
      );
    }

    this.updateFormDefinition();
  }

  /**
   * Determines if a drop zone is a column
   * @param id The drop zone ID
   * @returns True if the drop zone is a column
   */
  isColumnDropZone(id: string): boolean {
    return id.startsWith('column-');
  }

  /**
   * Updates the form definition based on the flat arrays
   */
  private updateFormDefinition(): void {
    // Clear existing elements
    this.currentForm.elements = [...this.mainCanvasElements];

    // Sync order properties
    this.currentForm.elements.forEach((element, index) => {
      element.order = index + 1;
    });
  }

  private distributeWidths(columns: ColumnElement[], totalWidth: number): void {
    const equalWidth = Math.floor(totalWidth / columns.length);
    columns.forEach((column, index) => {
      column.width =
        index === columns.length - 1 ? totalWidth - equalWidth * (columns.length - 1) : equalWidth;
    });
  }

  private createBaseElement(elementType: FormElementType): FormElement {
    return {
      id: this.generateUniqueId(),
      type: elementType,
      label: this.getDefaultLabel(elementType),
      required: false,
      order: this.getNextElementOrder(),
      visible: true,
      description: '',
    };
  }

  /**
   * Generates a default label for a form element based on its type.
   * @param elementType The type of the form element.
   * @returns A default label string.
   */
  private getDefaultLabel(elementType: FormElementType): string {
    return `New ${this.formatElementType(elementType)}`;
  }

  /**
   * Calculates the next order value for a new form element.
   * @returns The next order number.
   */
  private getNextElementOrder(): number {
    return this.currentForm.elements.length + 1;
  }

  /**
   * Generate a unique ID for form elements
   * @returns A unique string identifier
   */
  private generateUniqueId(): string {
    return `element_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
