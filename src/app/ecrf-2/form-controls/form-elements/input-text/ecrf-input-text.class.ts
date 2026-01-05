import { IconMappingService } from '../../../core/services/icon-mapping.service';
import {
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  FormLabelPositionEnum,
  FormLabelStyleEnum,
  InputTextConfig,
  InputTextIconPositionEnum,
  InputTextTypeEnum,
} from '@artificial-sense/ui-lib';
import { IFormControl } from '../../../core/models/interfaces/form.interfaces';
import { FormElementType } from '../../../core/models/enums/form.enums';
import { generateUniqueId } from '../../../core/utils/utils';
import { ITextInputOptions } from '../../../core/models/interfaces/input-text.interfaces';

/**
 * Input text form control class
 * Simplified to handle only basic text input
 */
export class ECRFInputTextClass implements IFormControl<ITextInputOptions, string> {
  readonly id: string;
  readonly iconName: string;
  readonly type: FormElementType = FormElementType.INPUT_TEXT;
  readonly title: string = 'Input Text';
  placeholder = 'Enter text here...';
  maxLength?: number;
  minLength?: number;

  // Additional properties to store UI configuration
  labelStyle: FormLabelStyleEnum = FormLabelStyleEnum.DEFAULT;
  labelPosition: FormLabelPositionEnum = FormLabelPositionEnum.ABOVE;
  iconClass?: string;
  iconPosition: InputTextIconPositionEnum = InputTextIconPositionEnum.LEFT;

  constructor(
    private iconService?: IconMappingService,
    public options?: ITextInputOptions,
    public value?: string,
    id?: string,
  ) {
    // Assign a unique ID
    this.id = id || generateUniqueId(FormElementType.INPUT_TEXT);

    // Use icon service to get the correct icon
    this.iconName = this.iconService?.getPrimeIcon(FormElementType.INPUT_TEXT) || 'text_fields';

    // Initialize additional properties from options if provided
    if (options?.inputConfig) {
      this.applyInputConfig(options.inputConfig);
    }

    // Set specific options directly if provided
    if (options) {
      this.labelStyle = options.labelStyle || FormLabelStyleEnum.DEFAULT;
      this.labelPosition = options.labelPosition || FormLabelPositionEnum.ABOVE;
      this.iconClass = options.iconClass;
      this.iconPosition = options.iconPosition || InputTextIconPositionEnum.LEFT;
    }
  }

  /**
   * Convert this control to an InputTextConfig for the UI library
   * @returns Configuration for a lib-input-text component
   */
  toInputTextConfig(): InputTextConfig {
    return {
      label: this.options?.title || this.title,
      required: this.options?.required || false,
      disabled: this.options?.disabled || false,
      placeholder: this.placeholder,
      autofocus: false,
      type: InputTextTypeEnum.TEXT, // Always standard text type
      labelStyle: this.labelStyle,
      iconPosition: this.iconPosition,
      labelPosition: this.labelPosition,
      icon: this.iconClass,
      maxLength: this.maxLength,
      minLength: this.minLength,
      helperText: this.options?.helperText,
      variant: FormComponentVariantEnum.OUTLINED,
      size: FormComponentSizeEnum.NORMAL,
      // Include any additional configuration from options
      ...(this.options?.inputConfig || {}),
    };
  }

  /**
   * Apply input configuration settings to this control
   */
  private applyInputConfig(config: Partial<InputTextConfig>): void {
    if (config.placeholder) this.placeholder = config.placeholder;
    if (config.maxLength) this.maxLength = config.maxLength;
    if (config.minLength) this.minLength = config.minLength;
    if (config.labelStyle) this.labelStyle = config.labelStyle;
    if (config.labelPosition) this.labelPosition = config.labelPosition;
    if (config.icon) this.iconClass = config.icon;
    if (config.iconPosition) this.iconPosition = config.iconPosition;
  }
}
