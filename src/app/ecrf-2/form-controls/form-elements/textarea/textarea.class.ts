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
  TextareaConfig,
} from '@artificial-sense/ui-lib';
import { IFormControl } from '@core/models/interfaces/form.interfaces';
import { FormElementType } from '@core/models/enums/form.enums';
import { generateUniqueId } from '@core/utils/utils';
import { ITextAreaOptions } from '@core/models/interfaces/text-area.interfaces';

/**
 * Text area form control class
 * Uses enum values instead of magic strings
 */
export class ECRFTextAreaClass implements IFormControl<ITextAreaOptions, string> {
  readonly id: string;
  readonly iconName: string;
  readonly type: FormElementType = FormElementType.TEXT_AREA;
  readonly title: string = 'Text Area';
  placeholder = 'Enter text here...';
  rows = 3;
  cols?: number;
  autoResize = false;
  maxLength?: number;
  minLength?: number;
  size: FormComponentSizeType = FormComponentSizeEnum.NORMAL;
  variant: FormComponentVariantType = FormComponentVariantEnum.OUTLINED;

  // Additional properties to store UI configuration
  labelStyle: FormLabelStyleType = FormLabelStyleEnum.DEFAULT;
  labelPosition: FormLabelPositionType = FormLabelPositionEnum.ABOVE;

  constructor(
    private iconService?: IconMappingService,
    public options?: ITextAreaOptions,
    public value?: string,
    id?: string,
  ) {
    // Assign a unique ID
    this.id = id || generateUniqueId(FormElementType.TEXT_AREA);

    // Use icon service to get the correct icon
    this.iconName = this.iconService?.getPrimeIcon(FormElementType.TEXT_AREA) || 'align_left';

    // Initialize additional properties from options if provided
    if (options?.textareaConfig) {
      this.applyTextAreaConfig(options.textareaConfig);
    }

    // Set specific options directly if provided
    if (options) {
      this.labelStyle = options.labelStyle || FormLabelStyleEnum.DEFAULT;
      this.labelPosition = options.labelPosition || FormLabelPositionEnum.ABOVE;
      this.rows = options.rows || 3;
      this.cols = options.cols;
      this.autoResize = options.autoResize || false;
    }
  }

  /**
   * Convert this control to a TextareaConfig for the UI library
   * @returns Configuration for a lib-textarea component
   */
  toTextareaConfig(): TextareaConfig {
    return {
      label: this.options?.title || this.title,
      required: this.options?.required || false,
      disabled: this.options?.disabled || false,
      placeholder: this.placeholder || 'Enter text here...',
      autofocus: false,
      labelStyle: this.labelStyle,
      labelPosition: this.labelPosition,
      rows: this.rows || 3,
      cols: this.cols || 30,
      autoResize: this.autoResize || false,
      maxLength: this.maxLength,
      minLength: this.minLength,
      helperText: this.options?.helperText,
      size: this.options?.size || FormComponentSizeEnum.NORMAL,
      variant: this.options?.variant || FormComponentVariantEnum.OUTLINED,
      // Include any additional configuration from options
      ...(this.options?.textareaConfig || {}),
    };
  }

  /**
   * Apply textarea configuration settings to this control
   */
  private applyTextAreaConfig(config: Partial<TextareaConfig>): void {
    if (config.placeholder) this.placeholder = config.placeholder;
    if (config.rows) this.rows = config.rows;
    if (config.cols) this.cols = config.cols;
    if (config.autoResize !== undefined) this.autoResize = config.autoResize;
    if (config.maxLength) this.maxLength = config.maxLength;
    if (config.minLength) this.minLength = config.minLength;
    if (config.labelStyle) this.labelStyle = config.labelStyle;
    if (config.labelPosition) this.labelPosition = config.labelPosition;
  }
}
