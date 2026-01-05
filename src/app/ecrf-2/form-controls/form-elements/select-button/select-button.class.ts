import { IconMappingService } from '../../../core/services/icon-mapping.service';
import {
  FormComponentSizeEnum,
  FormComponentSizeType,
  FormComponentVariantEnum,
  FormComponentVariantType,
  FormLabelPositionEnum,
  FormLabelPositionType,
  FormLabelStyleEnum,
  FormLabelStyleType,
  SelectButtonConfig,
  SelectButtonOptionType,
} from '@artificial-sense/ui-lib';
import { IFormControl } from '../../../core/models/interfaces/form.interfaces';
import { FormElementType } from '../../../core/models/enums/form.enums';
import { generateUniqueId } from '../../../core/utils/utils';
import { ISelectButtonOptions } from '../../../core/models/interfaces/select-button.interfaces';

/**
 * SelectButton form control class
 */
export class ECRFSelectButtonClass implements IFormControl<ISelectButtonOptions, any> {
  readonly id: string;
  readonly iconName: string;
  readonly type: FormElementType = FormElementType.SELECT_BUTTON;
  readonly title: string = 'Select Button';

  // Options property for IFormControl interface
  options?: ISelectButtonOptions;

  // Additional properties to store UI configuration
  selectButtonOptions: SelectButtonOptionType[] = [];
  optionLabel?: string;
  optionValue?: string;
  optionDisabled?: string;
  multiple = false;
  size: FormComponentSizeType = FormComponentSizeEnum.NORMAL;
  ariaLabelledBy?: string;
  labelPosition?: FormLabelPositionType;
  labelStyle?: FormLabelStyleType;
  variant?: FormComponentVariantType;

  constructor(
    private iconService?: IconMappingService,
    options?: ISelectButtonOptions,
    public value?: any,
    id?: string,
  ) {
    // Assign a unique ID
    this.id = id || generateUniqueId(FormElementType.SELECT_BUTTON);

    // Use icon service to get the correct icon
    this.iconName =
      this.iconService?.getPrimeIcon(FormElementType.SELECT_BUTTON) || 'pi pi-toggle-on';

    // Initialize with default options if none provided
    if (!options || !options.options || options.options.length === 0) {
      this.selectButtonOptions = [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
      ];
    } else {
      this.selectButtonOptions = options.options;
    }

    // Initialize additional properties from options if provided
    if (options?.selectButtonConfig) {
      this.applySelectButtonConfig(options.selectButtonConfig);
    }

    // Set specific options directly if provided
    if (options) {
      this.options = options;
      this.optionLabel = options.optionLabel || 'label';
      this.optionValue = options.optionValue || 'value';
      this.optionDisabled = options.optionDisabled;
      this.multiple = !!options.multiple;
      this.size = options.size || FormComponentSizeEnum.NORMAL;
      this.ariaLabelledBy = options.ariaLabelledBy;
    }
  }

  /**
   * Convert this control to a SelectButtonConfig for the UI library
   * @returns Configuration for a lib-select-button component
   */
  toSelectButtonConfig(): SelectButtonConfig {
    return {
      options: this.selectButtonOptions,
      optionLabel: this.optionLabel,
      optionValue: this.optionValue,
      optionDisabled: this.optionDisabled,
      multiple: this.multiple,
      required: this.options?.required || false,
      disabled: this.options?.disabled || false,
      size: this.size,
      ariaLabelledBy: this.ariaLabelledBy,
      helperText: this.options?.helperText,
      errorMessage: this.options?.errorMessage,
      successMessage: this.options?.successMessage,
      containerClass: this.options?.containerClass,
      labelPosition: this.labelPosition || FormLabelPositionEnum.ABOVE,
      labelStyle: this.labelStyle || FormLabelStyleEnum.DEFAULT,
      variant: this.variant || FormComponentVariantEnum.OUTLINED,
      // Include any additional configuration from options
      ...(this.options?.selectButtonConfig || {}),
    };
  }

  /**
   * Apply select button configuration settings to this control
   */
  private applySelectButtonConfig(config: Partial<SelectButtonConfig>): void {
    if (config.options) this.selectButtonOptions = config.options;
    if (config.optionLabel) this.optionLabel = config.optionLabel;
    if (config.optionValue) this.optionValue = config.optionValue;
    if (config.optionDisabled) this.optionDisabled = config.optionDisabled;
    if (config.multiple !== undefined) this.multiple = config.multiple;
    if (config.size) this.size = config.size;
    if (config.ariaLabelledBy) this.ariaLabelledBy = config.ariaLabelledBy;
  }
}
