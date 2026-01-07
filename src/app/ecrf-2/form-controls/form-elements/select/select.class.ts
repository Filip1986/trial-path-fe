import { IconMappingService } from '@core/services/icon-mapping.service';
import {
  DEFAULT_SCROLL_HEIGHT,
  FormComponentSizeEnum,
  FormComponentSizeType,
  FormComponentVariantEnum,
  FormComponentVariantType,
  FormLabelPositionEnum,
  FormLabelPositionType,
  FormLabelStyleEnum,
  FormLabelStyleType,
  SelectConfig,
} from '@artificial-sense/ui-lib';
import { IFormControl } from '@core/models/interfaces/form.interfaces';
import { FormElementType } from '@core/models/enums/form.enums';
import { generateUniqueId } from '@core/utils/utils';
import { ISelectOptions } from '@core/models/interfaces/select.interfaces';

/**
 * Select form control class
 * Uses enum values instead of magic strings
 */
export class ECRFSelectClass implements IFormControl<ISelectOptions, any> {
  readonly id: string;
  readonly iconName: string;
  readonly type: FormElementType = FormElementType.SELECT;
  readonly title: string = 'Select';

  // Options property for IFormControl interface
  options?: ISelectOptions;

  // Additional properties to store UI configuration
  labelStyle: FormLabelStyleType = FormLabelStyleEnum.DEFAULT;
  labelPosition: FormLabelPositionType = FormLabelPositionEnum.ABOVE;
  size: FormComponentSizeType = FormComponentSizeEnum.NORMAL;
  variant: FormComponentVariantType = FormComponentVariantEnum.OUTLINED;
  placeholder?: string;
  selectOptions: any[] = []; // The actual select dropdown options
  optionLabel?: string;
  optionValue?: string;
  filter = false;
  showClear = false;
  group = false;
  optionGroupLabel?: string;
  optionGroupChildren?: string;

  constructor(
    private iconService?: IconMappingService,
    options?: ISelectOptions,
    public value?: any,
    id?: string,
  ) {
    // Assign a unique ID
    this.id = id || generateUniqueId(FormElementType.SELECT);

    // Use icon service to get the correct icon
    this.iconName = this.iconService?.getPrimeIcon(FormElementType.SELECT) || 'pi pi-chevron-down';

    // Initialize with default options if none provided
    if (!options || !options.selectOptions || options.selectOptions.length === 0) {
      this.selectOptions = [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
      ];
    } else {
      this.selectOptions = options.selectOptions;
    }

    // Initialize additional properties from selectOptions if provided
    if (options?.selectConfig) {
      this.applySelectConfig(options.selectConfig);
    }

    // Set specific options directly if provided
    if (options) {
      this.options = options; // Store the form control configuration
      this.labelStyle = options.labelStyle || FormLabelStyleEnum.DEFAULT;
      this.labelPosition = options.labelPosition || FormLabelPositionEnum.ABOVE;
      this.size = options.size || FormComponentSizeEnum.NORMAL;
      this.variant = options.variant || FormComponentVariantEnum.OUTLINED;
      this.optionLabel = options.optionLabel || 'label';
      this.optionValue = options.optionValue || 'value';
      this.filter = !!options.filter;
      this.showClear = !!options.showClear;
      this.group = !!options.group;
      this.optionGroupLabel = options.optionGroupLabel;
      this.optionGroupChildren = options.optionGroupChildren;
    }
  }

  /**
   * Convert this control to a SelectConfig for the UI library
   * @returns Configuration for a lib-select component
   */
  toSelectConfig(): SelectConfig {
    const config: SelectConfig = {
      label: this.options?.title || this.title,
      required: this.options?.required || false,
      disabled: this.options?.disabled || false,
      placeholder: this.placeholder || 'Select an option',
      labelStyle: this.labelStyle,
      labelPosition: this.labelPosition,
      size: this.size,
      variant: this.variant,
      options: this.selectOptions, // Use selectOptions instead of this.options
      optionLabel: this.optionLabel || 'label',
      optionValue: this.optionValue || 'value',
      filter: this.filter,
      showClear: this.showClear,
      group: this.group,
      optionGroupLabel: this.optionGroupLabel,
      optionGroupChildren: this.optionGroupChildren,
      helperText: this.options?.helperText,
      scrollHeight: DEFAULT_SCROLL_HEIGHT,
      // Include any additional configuration from options
      ...(this.options?.selectConfig || {}),
    };

    // Ensure options have proper structure
    if (config.options && config.options.length > 0) {
      // Check if options are already in the correct format
      if (
        typeof config.options[0] === 'object' &&
        'label' in config.options[0] &&
        'value' in config.options[0]
      ) {
        // Options are already in the correct format
      } else {
        // Options might need transformation
        console.warn('Select options may not be in the correct format:', config.options);
      }
    }

    return config;
  }

  /**
   * Apply select configuration settings to this control
   */
  private applySelectConfig(config: Partial<SelectConfig>): void {
    if (config.labelStyle) this.labelStyle = config.labelStyle;
    if (config.labelPosition) this.labelPosition = config.labelPosition;
    if (config.size) this.size = config.size;
    if (config.variant) this.variant = config.variant;
    if (config.placeholder) this.placeholder = config.placeholder;
    if (config.options) this.selectOptions = config.options; // Changed this line
    if (config.optionLabel) this.optionLabel = config.optionLabel;
    if (config.optionValue) this.optionValue = config.optionValue;
    if (config.filter !== undefined) this.filter = config.filter;
    if (config.showClear !== undefined) this.showClear = config.showClear;
    if (config.group !== undefined) this.group = config.group;
    if (config.optionGroupLabel) this.optionGroupLabel = config.optionGroupLabel;
    if (config.optionGroupChildren) this.optionGroupChildren = config.optionGroupChildren;
  }
}
