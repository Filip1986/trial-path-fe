import { IconMappingService } from '@core/services/icon-mapping.service';
import {
  FormComponentSizeEnum,
  FormComponentSizeType,
  FormComponentVariantEnum,
  FormComponentVariantType,
  FormLabelPositionEnum,
  FormLabelPositionType,
  FormLabelStyleEnum,
  FormLabelStyleType,
  MultiSelectConfig,
  MultiSelectDisplayModeEnum,
} from '@artificial-sense/ui-lib';
import { IFormControl } from '@core/models/interfaces/form.interfaces';
import { FormElementType } from '@core/models/enums/form.enums';
import { generateUniqueId } from '@core/utils/utils';
import { MultiSelectOptions } from '@core/models/interfaces/multiselect.interfaces';

/**
 * MultiSelect form control class
 * Uses enum values instead of magic strings
 */
export class ECRFMultiSelectClass implements IFormControl<MultiSelectOptions, any[]> {
  readonly id: string;
  readonly iconName: string;
  readonly type: FormElementType = FormElementType.MULTISELECT;
  readonly title: string = 'MultiSelect';

  // Additional properties to store UI configuration
  labelStyle: FormLabelStyleType = FormLabelStyleEnum.DEFAULT;
  labelPosition: FormLabelPositionType = FormLabelPositionEnum.ABOVE;
  display: MultiSelectDisplayModeEnum = MultiSelectDisplayModeEnum.COMMA;
  multiple = true;
  checkbox = false;
  filter = false;
  selectOptions: any[] = [];
  optionLabel?: string;
  optionValue?: string;
  showToggleAll = true;
  maxSelectedLabels?: number;
  group = false;
  optionGroupLabel?: string;
  optionGroupChildren?: string;
  placeholder?: string;
  size: FormComponentSizeType = FormComponentSizeEnum.NORMAL;
  variant: FormComponentVariantType = FormComponentVariantEnum.OUTLINED;

  constructor(
    private iconService?: IconMappingService,
    public options?: MultiSelectOptions,
    public value?: any[],
    id?: string,
  ) {
    // Assign a unique ID
    this.id = id || generateUniqueId(FormElementType.MULTISELECT);

    // Use icon service to get the correct icon
    this.iconName = this.iconService?.getPrimeIcon(FormElementType.MULTISELECT) || 'pi pi-list';

    // Initialize additional properties from options if provided
    if (options?.multiSelectConfig) {
      this.applyMultiSelectConfig(options.multiSelectConfig);
    }

    // Set specific options directly if provided
    if (options) {
      this.labelStyle = options.labelStyle || FormLabelStyleEnum.DEFAULT;
      this.labelPosition = options.labelPosition || FormLabelPositionEnum.ABOVE;
      this.display = options.display || MultiSelectDisplayModeEnum.COMMA;
      this.multiple = options.multiple !== undefined ? options.multiple : true;
      this.checkbox = options.checkbox || false;
      this.filter = options.filter || false;
      this.selectOptions = options.options || options.selectOptions || [];
      this.optionLabel = options.optionLabel;
      this.optionValue = options.optionValue;
      this.showToggleAll = options.showToggleAll !== undefined ? options.showToggleAll : true;
      this.maxSelectedLabels = options.maxSelectedLabels;
      this.group = options.group || false;
      this.optionGroupLabel = options.optionGroupLabel;
      this.optionGroupChildren = options.optionGroupChildren;
      this.size = options.size;
      this.variant = options.variant;
    }
  }

  /**
   * Convert this control to a MultiSelectConfig for the UI library
   * @returns Configuration for a lib-multiselect component
   */
  toMultiSelectConfig(): MultiSelectConfig {
    return {
      label: this.options?.title || this.title,
      required: this.options?.required || false,
      disabled: this.options?.disabled || false,
      placeholder: this.placeholder || 'Select options',
      labelStyle: this.labelStyle,
      labelPosition: this.labelPosition,
      display: this.display,
      filter: this.filter,
      options: this.selectOptions || [],
      optionLabel: this.optionLabel,
      optionValue: this.optionValue,
      showToggleAll: this.showToggleAll,
      maxSelectedLabels: this.maxSelectedLabels,
      group: this.group,
      optionGroupLabel: this.optionGroupLabel,
      optionGroupChildren: this.optionGroupChildren,
      helperText: this.options?.helperText,
      size: this.size,
      variant: this.variant,
      // Include any additional configuration from options
      ...(this.options?.multiSelectConfig || {}),
    };
  }

  /**
   * Apply multiselect configuration settings to this control
   */
  private applyMultiSelectConfig(config: Partial<any>): void {
    if (config['labelStyle']) this.labelStyle = config['labelStyle'];
    if (config['labelPosition']) this.labelPosition = config['labelPosition'];
    if (config['display']) this.display = config['display'];
    if (config['multiple'] !== undefined) this.multiple = config['multiple'];
    if (config['checkbox'] !== undefined) this.checkbox = config['checkbox'];
    if (config['filter'] !== undefined) this.filter = config['filter'];
    if (config['options']) this.selectOptions = config['options'];
    if (config['selectOptions']) this.selectOptions = config['selectOptions'];
    if (config['optionLabel']) this.optionLabel = config['optionLabel'];
    if (config['optionValue']) this.optionValue = config['optionValue'];
    if (config['showToggleAll'] !== undefined) this.showToggleAll = config['showToggleAll'];
    if (config['maxSelectedLabels']) this.maxSelectedLabels = config['maxSelectedLabels'];
    if (config['group'] !== undefined) this.group = config['group'];
    if (config['optionGroupLabel']) this.optionGroupLabel = config['optionGroupLabel'];
    if (config['optionGroupChildren']) this.optionGroupChildren = config['optionGroupChildren'];
    if (config['placeholder']) this.placeholder = config['placeholder'];
    if (config['size']) this.size = config['size'];
    if (config['variant']) this.variant = config['variant'];
  }
}

// Add an alias for backward compatibility
export { ECRFMultiSelectClass as Multiselect, MultiSelectOptions as MultiselectOptions };
