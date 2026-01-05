import { IconMappingService } from '../../../core/services/icon-mapping.service';
import {
  InputNumberConfig,
  InputNumberModeEnum,
  InputNumberButtonLayoutEnum,
  InputNumberButtonLayoutType,
  FormComponentVariantType,
  FormComponentSizeType,
  FormLabelStyleType,
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  FormLabelStyleEnum,
  FormLabelPositionEnum,
  FormLabelPositionType,
} from '@artificial-sense/ui-lib';
import { IFormControl } from '../../../core/models/interfaces/form.interfaces';
import { FormElementType } from '../../../core/models/enums/form.enums';
import { generateUniqueId } from '../../../core/utils/utils';
import { InputNumberOptions } from '../../../core/models/interfaces/input-number.interfaces';

/**
 * Input number form control class
 * Uses enum values instead of magic strings
 */
export class ECRFInputNumberClass implements IFormControl<InputNumberOptions, number | null> {
  readonly id: string;
  readonly iconName: string;
  readonly type: FormElementType = FormElementType.INPUT_NUMBER;
  readonly title: string = 'Number Input';

  // Additional properties to store UI configuration
  mode: InputNumberModeEnum = InputNumberModeEnum.DECIMAL;
  min?: number;
  max?: number;
  step = 1;
  prefix?: string;
  suffix?: string;
  currency?: string;
  locale = 'en-US';
  minFractionDigits?: number;
  maxFractionDigits?: number;
  showButtons = true;
  buttonLayout: InputNumberButtonLayoutType = InputNumberButtonLayoutEnum.STACKED;
  useGrouping = true;
  size: FormComponentSizeType = FormComponentSizeEnum.NORMAL;
  variant: FormComponentVariantType = FormComponentVariantEnum.OUTLINED;
  labelStyle: FormLabelStyleType = FormLabelStyleEnum.DEFAULT;
  labelPosition: FormLabelPositionType = FormLabelPositionEnum.ABOVE;
  placeholder?: string;

  constructor(
    private iconService?: IconMappingService,
    public options?: InputNumberOptions,
    public value?: number | null,
    id?: string,
  ) {
    // Assign a unique ID
    this.id = id || generateUniqueId(FormElementType.INPUT_NUMBER);

    // Use icon service to get the correct icon
    this.iconName = this.iconService?.getPrimeIcon(FormElementType.INPUT_NUMBER) || 'pi pi-hashtag';

    // Initialize additional properties from options if provided
    if (options?.inputNumberConfig) {
      this.applyInputNumberConfig(options.inputNumberConfig);
    }

    // Set specific options directly if provided
    if (options) {
      this.mode = options.mode || InputNumberModeEnum.DECIMAL;
      this.min = options.min;
      this.max = options.max;
      this.step = options.step || 1;
      this.prefix = options.prefix;
      this.suffix = options.suffix;
      this.currency = options.currency;
      this.locale = options.locale || 'en-US';
      this.minFractionDigits = options.minFractionDigits;
      this.maxFractionDigits = options.maxFractionDigits;
      this.showButtons = options.showButtons ?? true;
      this.buttonLayout = options.buttonLayout || InputNumberButtonLayoutEnum.STACKED;
      this.useGrouping = options.useGrouping ?? true;
      this.size = options.size || FormComponentSizeEnum.NORMAL;
      this.variant = options.variant || FormComponentVariantEnum.OUTLINED;
      this.labelStyle = options.labelStyle || FormLabelStyleEnum.DEFAULT;
      this.labelPosition = options.labelPosition || FormLabelPositionEnum.ABOVE;
    }
  }

  /**
   * Convert this control to an InputNumberConfig for the UI library
   * @returns Configuration for a lib-input-number component
   */
  toInputNumberConfig(): InputNumberConfig {
    return {
      label: this.options?.title || this.title,
      required: this.options?.required || false,
      disabled: this.options?.disabled || false,
      placeholder: this.placeholder || 'Enter a number',
      mode: this.mode,
      min: this.min,
      max: this.max,
      step: this.step,
      prefix: this.prefix,
      suffix: this.suffix,
      minFractionDigits: this.minFractionDigits,
      maxFractionDigits: this.maxFractionDigits,
      showButtons: this.showButtons,
      buttonLayout: this.buttonLayout,
      useGrouping: this.useGrouping,
      size: this.size,
      variant: this.variant,
      labelStyle: this.labelStyle,
      labelPosition: this.labelPosition,
      helperText: this.options?.helperText,
      // Include any additional configuration from options
      ...(this.options?.inputNumberConfig || {}),
    };
  }

  /**
   * Apply input number configuration settings to this control
   */
  private applyInputNumberConfig(config: Partial<InputNumberConfig>): void {
    if (config.mode !== undefined) this.mode = config.mode;
    if (config.min !== undefined) this.min = config.min;
    if (config.max !== undefined) this.max = config.max;
    if (config.step !== undefined) this.step = config.step;
    if (config.prefix) this.prefix = config.prefix;
    if (config.suffix) this.suffix = config.suffix;
    if (config.minFractionDigits !== undefined) this.minFractionDigits = config.minFractionDigits;
    if (config.maxFractionDigits !== undefined) this.maxFractionDigits = config.maxFractionDigits;
    if (config.showButtons !== undefined) this.showButtons = config.showButtons;
    if (config.buttonLayout) this.buttonLayout = config.buttonLayout;
    if (config.useGrouping !== undefined) this.useGrouping = config.useGrouping;
    if (config.size) this.size = config.size;
    if (config.variant) this.variant = config.variant;
    if (config.labelStyle) this.labelStyle = config.labelStyle;
    if (config.labelPosition) this.labelPosition = config.labelPosition;
    if (config.placeholder) this.placeholder = config.placeholder;
  }
}
