import { IconMappingService } from '../../../core/services/icon-mapping.service';
import {
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  FormLabelPositionEnum,
  FormLabelPositionType,
  FormLabelStyleEnum,
  FormLabelStyleType,
  ListBoxConfig,
} from '@artificial-sense/ui-lib';
import { IFormControl } from '../../../core/models/interfaces/form.interfaces';
import { FormElementType } from '../../../core/models/enums/form.enums';
import { generateUniqueId } from '../../../core/utils/utils';
import { IListBoxOptions } from '../../../core/models/interfaces/list-box.interfaces';

/**
 * Listbox form control class
 * Uses enum values instead of magic strings
 */
export class ECRFListBoxClass implements IFormControl<IListBoxOptions, any> {
  readonly id: string;
  readonly iconName: string;
  readonly type: FormElementType = FormElementType.LIST_BOX;
  readonly title: string = 'Listbox';

  // Additional properties to store UI configuration
  labelStyle: FormLabelStyleType = FormLabelStyleEnum.DEFAULT;
  labelPosition: FormLabelPositionType = FormLabelPositionEnum.ABOVE;
  multiple = false;
  checkbox = false;
  filter = false;
  listOptions: any[] = [];
  optionLabel?: string;
  optionValue?: string;
  placeholder?: string;

  constructor(
    private iconService?: IconMappingService,
    public options?: IListBoxOptions,
    public value?: any,
    id?: string,
  ) {
    // Assign a unique ID
    this.id = id || generateUniqueId(FormElementType.LIST_BOX);

    // Use icon service to get the correct icon
    this.iconName = this.iconService?.getPrimeIcon(FormElementType.LIST_BOX) || 'pi pi-list';

    // Initialize additional properties from options if provided
    if (options?.listboxConfig) {
      this.applyListboxConfig(options.listboxConfig);
    }

    // Set specific options directly if provided
    if (options) {
      this.labelStyle = options.labelStyle || FormLabelStyleEnum.DEFAULT;
      this.labelPosition = options.labelPosition || FormLabelPositionEnum.ABOVE;
      this.multiple = options.multiple || false;
      this.checkbox = options.checkbox || false;
      this.filter = options.filter || false;
      this.listOptions = options.listOptions || [];
      this.optionLabel = options.optionLabel;
      this.optionValue = options.optionValue;
    }
  }

  /**
   * Convert this control to a ListboxConfig for the UI library
   * @returns Configuration for a lib-listbox component
   */
  toListBoxConfig(): ListBoxConfig {
    return {
      label: this.options?.title || this.title,
      required: this.options?.required || false,
      disabled: this.options?.disabled || false,
      placeholder: this.placeholder || 'Select option',
      labelStyle: this.labelStyle,
      labelPosition: this.labelPosition,
      multiple: this.multiple,
      checkbox: this.checkbox,
      filter: this.filter,
      options: this.listOptions || [],
      optionLabel: this.optionLabel,
      optionValue: this.optionValue,
      helperText: this.options?.helperText,
      variant: FormComponentVariantEnum.OUTLINED,
      size: FormComponentSizeEnum.NORMAL,
      // Include any additional configuration from options
      ...(this.options?.listboxConfig || {}),
    };
  }

  /**
   * Apply listbox configuration settings to this control
   */
  private applyListboxConfig(config: Partial<ListBoxConfig>): void {
    if (config.labelStyle) this.labelStyle = config.labelStyle;
    if (config.labelPosition) this.labelPosition = config.labelPosition;
    if (config.multiple !== undefined) this.multiple = config.multiple;
    if (config.checkbox !== undefined) this.checkbox = config.checkbox;
    if (config.filter !== undefined) this.filter = config.filter;
    if (config.options) this.listOptions = config.options;
    if (config.optionLabel) this.optionLabel = config.optionLabel;
    if (config.optionValue) this.optionValue = config.optionValue;
    if (config.placeholder) this.placeholder = config.placeholder;
  }
}
