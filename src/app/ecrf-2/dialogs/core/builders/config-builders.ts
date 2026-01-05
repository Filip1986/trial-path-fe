import {
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  FormLabelPositionEnum,
  FormLabelStyleEnum,
  InputTextConfig,
  InputTextTypeEnum,
} from '@artificial-sense/ui-lib';

/**
 * Factory for creating standard input configurations
 */
export class DialogConfigBuilder {
  /**
   * Create a standard label input configuration
   */
  static createLabelConfig(overrides?: Partial<InputTextConfig>): InputTextConfig {
    return {
      required: true,
      autofocus: true,
      label: 'Field Label',
      placeholder: 'Enter field label',
      disabled: false,
      type: InputTextTypeEnum.TEXT,
      labelStyle: FormLabelStyleEnum.DEFAULT,
      labelPosition: FormLabelPositionEnum.ABOVE,
      minLength: 1,
      helperText: 'Label that will be displayed for this field',
      variant: FormComponentVariantEnum.OUTLINED,
      size: FormComponentSizeEnum.NORMAL,
      ...overrides,
    };
  }

  /**
   * Create a standard placeholder input configuration
   */
  static createPlaceholderConfig(overrides?: Partial<InputTextConfig>): InputTextConfig {
    return {
      required: false,
      autofocus: false,
      label: 'Placeholder',
      placeholder: 'Enter placeholder text',
      disabled: false,
      type: InputTextTypeEnum.TEXT,
      labelStyle: FormLabelStyleEnum.DEFAULT,
      labelPosition: FormLabelPositionEnum.ABOVE,
      variant: FormComponentVariantEnum.OUTLINED,
      size: FormComponentSizeEnum.NORMAL,
      ...overrides,
    };
  }

  /**
   * Create a standard helper input text configuration
   */
  static createHelperTextConfig(overrides?: Partial<InputTextConfig>): InputTextConfig {
    return {
      required: false,
      autofocus: false,
      label: 'Helper Text',
      placeholder: 'Enter helper text',
      disabled: false,
      type: InputTextTypeEnum.TEXT,
      labelStyle: FormLabelStyleEnum.DEFAULT,
      labelPosition: FormLabelPositionEnum.ABOVE,
      variant: FormComponentVariantEnum.OUTLINED,
      size: FormComponentSizeEnum.NORMAL,
      ...overrides,
    };
  }

  /**
   * Create a standard input number configuration
   */
  static createNumberConfig(
    label: string,
    min?: number,
    max?: number,
    overrides?: Partial<InputTextConfig>,
  ): InputTextConfig {
    return {
      required: false,
      autofocus: false,
      label,
      placeholder: String(min ?? ''),
      disabled: false,
      type: InputTextTypeEnum.NUMBER,
      labelStyle: FormLabelStyleEnum.DEFAULT,
      labelPosition: FormLabelPositionEnum.ABOVE,
      variant: FormComponentVariantEnum.OUTLINED,
      size: FormComponentSizeEnum.NORMAL,
      min,
      max,
      ...overrides,
    };
  }

  /**
   * Create a standard input text configuration
   */
  static createTextConfig(
    label: string,
    placeholder: string,
    overrides?: Partial<InputTextConfig>,
  ): InputTextConfig {
    return {
      required: false,
      autofocus: false,
      label,
      placeholder,
      disabled: false,
      type: InputTextTypeEnum.TEXT,
      labelStyle: FormLabelStyleEnum.DEFAULT,
      labelPosition: FormLabelPositionEnum.ABOVE,
      variant: FormComponentVariantEnum.OUTLINED,
      size: FormComponentSizeEnum.NORMAL,
      ...overrides,
    };
  }
}
