import { IconMappingService } from '../../../core/services/icon-mapping.service';
import {
  CheckboxConfig,
  CheckboxModeEnum,
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  FormLabelPositionEnum,
  FormLabelPositionType,
  FormLabelStyleEnum,
  FormLabelStyleType,
} from '@artificial-sense/ui-lib';
import { IFormControl } from '../../../core/models/interfaces/form.interfaces';
import { FormElementType } from '../../../core/models/enums/form.enums';
import { generateUniqueId } from '../../../core/utils/utils';
import { ICheckboxOptions } from '../../../core/models/interfaces/checkbox.interfaces';

/**
 * Checkbox form control class
 * Uses enum values instead of magic strings
 */
export class ECRFCheckboxClass implements IFormControl<ICheckboxOptions, boolean | any[]> {
  readonly id: string;
  readonly iconName: string;
  readonly type: FormElementType = FormElementType.CHECKBOX;
  readonly title: string = 'Checkbox';

  // Additional properties to store UI configuration
  mode: CheckboxModeEnum = CheckboxModeEnum.BINARY;
  size: FormComponentSizeEnum = FormComponentSizeEnum.NORMAL;
  variant: FormComponentVariantEnum = FormComponentVariantEnum.OUTLINED;
  labelPosition: FormLabelPositionType = FormLabelPositionEnum.ABOVE;
  labelStyle: FormLabelStyleType = FormLabelStyleEnum.DEFAULT;
  indeterminate = false;

  constructor(
    private iconService?: IconMappingService,
    public options?: ICheckboxOptions,
    public value: boolean | any[] = false,
    id?: string,
  ) {
    // Assign a unique ID
    this.id = id || generateUniqueId(FormElementType.CHECKBOX);

    // Use icon service to get the correct icon
    this.iconName = this.iconService?.getPrimeIcon(FormElementType.CHECKBOX) || 'check_box';

    // Initialize additional properties from options if provided
    if (options?.checkboxConfig) {
      this.applyCheckboxConfig(options.checkboxConfig);
    }

    // Set specific options directly if provided
    if (options) {
      this.mode = options.mode || CheckboxModeEnum.BINARY;
      this.size = options.size || FormComponentSizeEnum.NORMAL;
      this.variant = options.variant || FormComponentVariantEnum.OUTLINED;

      // Initialize value based on mode
      if (this.mode === CheckboxModeEnum.GROUP && !Array.isArray(this.value)) {
        this.value = [];
      }
    }
  }

  /**
   * Convert this control to a CheckboxConfig for the UI library
   * @returns Configuration for a lib-checkbox component
   */
  toCheckboxConfig(): CheckboxConfig {
    return {
      label: this.options?.title || this.title,
      required: this.options?.required || false,
      disabled: this.options?.disabled || false,
      mode: this.mode,
      size: this.size,
      variant: this.variant,
      indeterminate: this.indeterminate,
      labelStyle: this.labelStyle || FormLabelStyleEnum.DEFAULT,
      labelPosition: this.labelPosition || FormLabelPositionEnum.ABOVE,
      // Include any additional configuration from options
      ...(this.options?.checkboxConfig || {}),
    };
  }

  /**
   * Apply checkbox configuration settings to this control
   */
  private applyCheckboxConfig(config: Partial<CheckboxConfig>): void {
    if (config.mode) this.mode = config.mode;
    if (config.size) this.size = config.size;
    if (config.variant) this.variant = config.variant;
    if (config.indeterminate !== undefined) this.indeterminate = config.indeterminate;
    if (config.labelStyle) this.labelStyle = config.labelStyle;
    if (config.labelPosition) this.labelPosition = config.labelPosition;
  }
}
