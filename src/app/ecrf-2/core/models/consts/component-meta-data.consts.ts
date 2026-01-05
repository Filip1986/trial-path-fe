// Mapping of component types to their metadata
import { ComponentType } from '../enums/component-types.enum';
import { IComponentMetadata } from '../interfaces/component-meta-data.interface';
import { ComponentCategory } from '../enums/component-category.enum';

export const COMPONENT_METADATA: Record<ComponentType, IComponentMetadata> = {
  // Container Components
  [ComponentType.FORM_CONTAINER]: {
    type: ComponentType.FORM_CONTAINER,
    category: ComponentCategory.CONTAINER,
    displayName: 'Form Container',
    description: 'Main container for form elements',
  },
  [ComponentType.COLUMNS]: {
    type: ComponentType.COLUMNS,
    category: ComponentCategory.LAYOUT,
    displayName: 'Columns',
    description: 'Multi-column layout container',
    icon: 'pi pi-columns',
  },

  // Form Control Components
  [ComponentType.TEXT_INPUT]: {
    type: ComponentType.TEXT_INPUT,
    category: ComponentCategory.FORM_CONTROL,
    displayName: 'Input Text',
    description: 'Single-line input text field',
    icon: 'pi pi-pencil',
  },
  [ComponentType.TEXT_AREA]: {
    type: ComponentType.TEXT_AREA,
    category: ComponentCategory.FORM_CONTROL,
    displayName: 'Text Area',
    description: 'Multi-line input text field',
    icon: 'pi pi-align-left',
  },
  [ComponentType.CHECKBOX]: {
    type: ComponentType.CHECKBOX,
    category: ComponentCategory.FORM_CONTROL,
    displayName: 'Checkbox',
    description: 'Boolean selection control',
    icon: 'pi pi-check-square',
  },
  [ComponentType.RADIO]: {
    type: ComponentType.RADIO,
    category: ComponentCategory.FORM_CONTROL,
    displayName: 'Radio Button',
    description: 'Single selection from multiple options',
    icon: 'pi pi-circle-on',
  },
  [ComponentType.DATE_PICKER]: {
    type: ComponentType.DATE_PICKER,
    category: ComponentCategory.FORM_CONTROL,
    displayName: 'Date Picker',
    description: 'Date selection control',
    icon: 'pi pi-calendar',
  },
  [ComponentType.TIME_PICKER]: {
    type: ComponentType.TIME_PICKER,
    category: ComponentCategory.FORM_CONTROL,
    displayName: 'Time Picker',
    description: 'Time selection control',
    icon: 'pi pi-clock',
  },
  [ComponentType.NUMBER_INPUT]: {
    type: ComponentType.NUMBER_INPUT,
    category: ComponentCategory.FORM_CONTROL,
    displayName: 'Input Number',
    description: 'Numeric input field',
    icon: 'pi pi-hashtag',
  },
  [ComponentType.DROPDOWN]: {
    type: ComponentType.DROPDOWN,
    category: ComponentCategory.FORM_CONTROL,
    displayName: 'Dropdown',
    description: 'Single selection dropdown',
    icon: 'pi pi-chevron-down',
  },
  [ComponentType.MULTISELECT]: {
    type: ComponentType.MULTISELECT,
    category: ComponentCategory.FORM_CONTROL,
    displayName: 'Multi-Select',
    description: 'Multiple selection control',
    icon: 'pi pi-list',
  },
  [ComponentType.LIST_BOX]: {
    type: ComponentType.LIST_BOX,
    category: ComponentCategory.FORM_CONTROL,
    displayName: 'ListBox',
    description: 'List selection control',
    icon: 'pi pi-list',
  },
  [ComponentType.SELECT_BUTTON]: {
    type: ComponentType.SELECT_BUTTON,
    category: ComponentCategory.FORM_CONTROL,
    displayName: 'Select Button',
    description: 'Button-style selection control',
    icon: 'pi pi-toggle-on',
  },

  // Dialog Components
  [ComponentType.TEXT_INPUT_DIALOG]: {
    type: ComponentType.TEXT_INPUT_DIALOG,
    category: ComponentCategory.DIALOG,
    displayName: 'Input Text Dialog',
    description: 'Configuration dialog for input text',
  },
  [ComponentType.TEXTAREA_DIALOG]: {
    type: ComponentType.TEXTAREA_DIALOG,
    category: ComponentCategory.DIALOG,
    displayName: 'Text Area Dialog',
    description: 'Configuration dialog for text area',
  },
  [ComponentType.CHECKBOX_DIALOG]: {
    type: ComponentType.CHECKBOX_DIALOG,
    category: ComponentCategory.DIALOG,
    displayName: 'Checkbox Dialog',
    description: 'Configuration dialog for checkbox',
  },
  [ComponentType.RADIO_DIALOG]: {
    type: ComponentType.RADIO_DIALOG,
    category: ComponentCategory.DIALOG,
    displayName: 'Radio Dialog',
    description: 'Configuration dialog for radio button',
  },
  [ComponentType.DATE_PICKER_DIALOG]: {
    type: ComponentType.DATE_PICKER_DIALOG,
    category: ComponentCategory.DIALOG,
    displayName: 'Date Picker Dialog',
    description: 'Configuration dialog for date picker',
  },
  [ComponentType.TIME_PICKER_DIALOG]: {
    type: ComponentType.TIME_PICKER_DIALOG,
    category: ComponentCategory.DIALOG,
    displayName: 'Time Picker Dialog',
    description: 'Configuration dialog for time picker',
  },
  [ComponentType.INPUT_NUMBER_DIALOG]: {
    type: ComponentType.INPUT_NUMBER_DIALOG,
    category: ComponentCategory.DIALOG,
    displayName: 'Input Number Dialog',
    description: 'Configuration dialog for input number',
  },
  [ComponentType.MULTISELECT_DIALOG]: {
    type: ComponentType.MULTISELECT_DIALOG,
    category: ComponentCategory.DIALOG,
    displayName: 'Multi-Select Dialog',
    description: 'Configuration dialog for multi-select',
  },
  [ComponentType.SELECT_DIALOG]: {
    type: ComponentType.SELECT_DIALOG,
    category: ComponentCategory.DIALOG,
    displayName: 'Select Dialog',
    description: 'Configuration dialog for dropdown select',
  },
  [ComponentType.SELECT_BUTTON_DIALOG]: {
    type: ComponentType.SELECT_BUTTON_DIALOG,
    category: ComponentCategory.DIALOG,
    displayName: 'Select Button Dialog',
    description: 'Configuration dialog for select button',
  },
  [ComponentType.LIST_BOX_DIALOG]: {
    type: ComponentType.LIST_BOX_DIALOG,
    category: ComponentCategory.DIALOG,
    displayName: 'ListBox Dialog',
    description: 'Configuration dialog for listBox',
  },

  // Preview Components
  [ComponentType.PREVIEW_TEXT_INPUT]: {
    type: ComponentType.PREVIEW_TEXT_INPUT,
    category: ComponentCategory.PREVIEW,
    displayName: 'Input Text Preview',
    description: 'Preview component for input text',
  },
  [ComponentType.PREVIEW_TEXTAREA]: {
    type: ComponentType.PREVIEW_TEXTAREA,
    category: ComponentCategory.PREVIEW,
    displayName: 'Text Area Preview',
    description: 'Preview component for text area',
  },
  [ComponentType.PREVIEW_CHECKBOX]: {
    type: ComponentType.PREVIEW_CHECKBOX,
    category: ComponentCategory.PREVIEW,
    displayName: 'Checkbox Preview',
    description: 'Preview component for checkbox',
  },
  [ComponentType.PREVIEW_RADIO]: {
    type: ComponentType.PREVIEW_RADIO,
    category: ComponentCategory.PREVIEW,
    displayName: 'Radio Preview',
    description: 'Preview component for radio button',
  },
  [ComponentType.PREVIEW_DATE_PICKER]: {
    type: ComponentType.PREVIEW_DATE_PICKER,
    category: ComponentCategory.PREVIEW,
    displayName: 'Date Picker Preview',
    description: 'Preview component for date picker',
  },
  [ComponentType.PREVIEW_TIME_PICKER]: {
    type: ComponentType.PREVIEW_TIME_PICKER,
    category: ComponentCategory.PREVIEW,
    displayName: 'Time Picker Preview',
    description: 'Preview component for time picker',
  },
  [ComponentType.PREVIEW_INPUT_NUMBER]: {
    type: ComponentType.PREVIEW_INPUT_NUMBER,
    category: ComponentCategory.PREVIEW,
    displayName: 'Input Number Preview',
    description: 'Preview component for input number',
  },
  [ComponentType.PREVIEW_MULTISELECT]: {
    type: ComponentType.PREVIEW_MULTISELECT,
    category: ComponentCategory.PREVIEW,
    displayName: 'Multi-Select Preview',
    description: 'Preview component for multi-select',
  },
  [ComponentType.PREVIEW_SELECT]: {
    type: ComponentType.PREVIEW_SELECT,
    category: ComponentCategory.PREVIEW,
    displayName: 'Select Preview',
    description: 'Preview component for dropdown select',
  },
  [ComponentType.PREVIEW_SELECT_BUTTON]: {
    type: ComponentType.PREVIEW_SELECT_BUTTON,
    category: ComponentCategory.PREVIEW,
    displayName: 'Select Button Preview',
    description: 'Preview component for select button',
  },
  [ComponentType.PREVIEW_LIST_BOX]: {
    type: ComponentType.PREVIEW_LIST_BOX,
    category: ComponentCategory.PREVIEW,
    displayName: 'ListBox Preview',
    description: 'Preview component for listBox',
  },
  [ComponentType.PREVIEW_COLUMNS]: {
    type: ComponentType.PREVIEW_COLUMNS,
    category: ComponentCategory.PREVIEW,
    displayName: 'Columns Preview',
    description: 'Preview component for columns layout',
  },

  // Special Components
  [ComponentType.FORM_PREVIEW]: {
    type: ComponentType.FORM_PREVIEW,
    category: ComponentCategory.UTILITY,
    displayName: 'Form Preview',
    description: 'Complete form preview component',
  },
  [ComponentType.RADIO_GROUP]: {
    type: ComponentType.RADIO_GROUP,
    category: ComponentCategory.FORM_CONTROL,
    displayName: 'Radio Group',
    description: 'Container for radio buttons',
  },
};
