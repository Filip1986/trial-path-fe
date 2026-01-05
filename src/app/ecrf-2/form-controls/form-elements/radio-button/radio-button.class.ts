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
  RadioButtonConfig,
  RadioButtonModeEnum,
} from '@artificial-sense/ui-lib';
import { IFormControl } from '../../../core/models/interfaces/form.interfaces';
import { FormElementType } from '../../../core/models/enums/form.enums';
import { generateUniqueId } from '../../../core/utils/utils';
import { IRadioButtonOptions } from '../../../core/models/interfaces/radio.interfaces';

/**
 * Radio button form control class
 * Uses enum values instead of magic strings
 */
export class ECRFRadioButtonClass implements IFormControl<IRadioButtonOptions, any> {
  readonly id: string;
  readonly iconName: string;
  readonly type: FormElementType = FormElementType.RADIO;
  readonly title: string = 'Radio Button';

  // Additional properties to store UI configuration
  mode: RadioButtonModeEnum = RadioButtonModeEnum.STANDARD;
  size: FormComponentSizeType = FormComponentSizeEnum.NORMAL;
  variant: FormComponentVariantType = FormComponentVariantEnum.OUTLINED;
  name: string;
  radioOptions: Array<{ label: string; value: any }> = [];
  labelStyle: FormLabelStyleType = FormLabelStyleEnum.DEFAULT;
  labelPosition: FormLabelPositionType = FormLabelPositionEnum.ABOVE;

  constructor(
    private iconService?: IconMappingService,
    public options?: IRadioButtonOptions,
    public value?: any,
    id?: string,
  ) {
    // Assign a unique ID
    this.id = id || generateUniqueId(FormElementType.RADIO);

    // Use icon service to get the correct icon
    this.iconName = this.iconService?.getPrimeIcon(FormElementType.RADIO) || 'radio_button_checked';

    // Generate a unique name for the radio group
    this.name = `radio-group-${Math.random().toString(36).substring(2, 9)}`;

    // Initialize additional properties from options if provided
    if (options?.radioButtonConfig) {
      this.applyRadioButtonConfig(options.radioButtonConfig);
    }

    // Set specific options directly if provided
    if (options) {
      this.mode = options.mode || RadioButtonModeEnum.STANDARD;
      this.size = options.size;
      this.variant = options.variant || FormComponentVariantEnum.OUTLINED;
      if (options.name) {
        this.name = options.name;
      }
      if (options.radioOptions) {
        this.radioOptions = [...options.radioOptions];
      }
    }
  }

  /**
   * Convert this control to a RadioButtonConfig for the UI library
   * @returns Configuration for a lib-radio-button component
   */
  toRadioButtonConfig(): RadioButtonConfig {
    return {
      label: this.options?.title || this.title,
      name: this.name,
      required: this.options?.required || false,
      disabled: this.options?.disabled || false,
      mode: this.mode,
      size: this.size,
      variant: this.variant,
      value: this.value,
      labelPosition: this.options?.labelPosition || FormLabelPositionEnum.ABOVE,
      labelStyle: this.options?.labelStyle || FormLabelStyleEnum.DEFAULT,
      // Include any additional configuration from options
      ...(this.options?.radioButtonConfig || {}),
    };
  }

  /**
   * Apply radio button configuration settings to this control
   */
  private applyRadioButtonConfig(config: Partial<RadioButtonConfig>): void {
    if (config.mode) this.mode = config.mode;
    if (config.size) this.size = config.size;
    if (config.variant) this.variant = config.variant;
    if (config.name) this.name = config.name;
  }
}
