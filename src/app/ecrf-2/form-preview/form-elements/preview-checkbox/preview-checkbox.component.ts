import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  LibCheckboxComponent,
  CheckboxConfig,
  CheckboxModeEnum,
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  FormLabelPositionEnum,
  FormLabelStyleEnum,
} from '@artificial-sense/ui-lib';
import { isCheckboxControl } from '../../../core/utils/type-guards';
import { BasePreviewComponent } from '../../shared/directives/base-preview/base-preview.component';
import { ECRFCheckboxClass } from '../../../form-controls/form-elements/checkbox/checkbox.class';
import { PreviewWrapperComponent } from '../../shared/components/preview-wrapper/preview-wrapper.component';
import { IFormControl } from '../../../core/models/interfaces/form.interfaces';

@Component({
  selector: 'app-preview-checkbox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LibCheckboxComponent, PreviewWrapperComponent],
  templateUrl: './preview-checkbox.component.html',
  styleUrl: './preview-checkbox.component.scss',
})
export class PreviewCheckboxComponent extends BasePreviewComponent<
  IFormControl,
  CheckboxConfig,
  boolean | any[]
> {
  protected readonly CheckboxModeEnum: typeof CheckboxModeEnum = CheckboxModeEnum;
  protected readonly FormComponentSizeEnum: typeof FormComponentSizeEnum = FormComponentSizeEnum;
  protected readonly FormComponentVariantEnum: typeof FormComponentVariantEnum =
    FormComponentVariantEnum;
  protected readonly FormLabelPositionEnum: typeof FormLabelPositionEnum = FormLabelPositionEnum;
  protected readonly FormLabelStyleEnum: typeof FormLabelStyleEnum = FormLabelStyleEnum;

  get checkboxControl(): ECRFCheckboxClass | null {
    return this.isValidControlType() ? (this.control as ECRFCheckboxClass) : null;
  }

  /**
   * Check if an option is selected in GROUP mode
   * @param optionValue The option value to check
   * @returns True if the option is selected
   */
  isOptionSelected(optionValue: any): boolean {
    if (!this.control || !this.control.value) return false;

    // Handle array values for GROUP mode
    if (Array.isArray(this.control.value)) {
      return this.control.value.includes(optionValue);
    }

    // Handle single value
    return this.control.value === optionValue;
  }

  /**
   * @inheritdoc
   */
  protected getExpectedTypeName(): string {
    return 'Checkbox';
  }

  /**
   * @inheritdoc
   */
  protected checkControlType(control: IFormControl): boolean {
    return isCheckboxControl(control);
  }

  /**
   * @inheritdoc
   */
  protected override getDefaultConfig(): CheckboxConfig {
    return {
      label: this.control?.title || 'Checkbox',
      required: false,
      disabled: true, // Always disabled in preview mode
      mode: CheckboxModeEnum.BINARY,
      size: FormComponentSizeEnum.NORMAL,
      variant: FormComponentVariantEnum.OUTLINED,
      labelStyle: FormLabelStyleEnum.DEFAULT,
      labelPosition: FormLabelPositionEnum.ABOVE,
    };
  }

  /**
   * @inheritdoc
   */
  protected buildConfig(): CheckboxConfig {
    try {
      // Default configuration for all checkboxes in preview mode
      const defaultConfig: CheckboxConfig = this.getDefaultConfig();

      // Return default config if control is missing or not a checkbox
      if (!this.control || !this.isValidControlType()) {
        return defaultConfig;
      }

      // Cast to Checkbox to access specific properties
      const checkboxControl = this.control as ECRFCheckboxClass;

      // Get configuration from the control if the method exists
      if (
        checkboxControl.toCheckboxConfig &&
        typeof checkboxControl.toCheckboxConfig === 'function'
      ) {
        const controlConfig: CheckboxConfig = checkboxControl.toCheckboxConfig();

        // Override specific properties for preview mode
        return {
          ...controlConfig,
          disabled: true, // Always disable inputs in preview mode
        };
      }

      // Manual configuration if toCheckboxConfig is not available
      return {
        ...defaultConfig,
        label: checkboxControl.options?.title || checkboxControl.title || defaultConfig.label,
        mode: checkboxControl.mode || defaultConfig.mode,
        size: checkboxControl.size || defaultConfig.size,
        variant: checkboxControl.variant || defaultConfig.variant,
        indeterminate: checkboxControl.indeterminate || false,
        labelStyle: checkboxControl.labelStyle || defaultConfig.labelStyle,
        labelPosition: checkboxControl.labelPosition || defaultConfig.labelPosition,
        helperText: checkboxControl.options?.helperText,
      };
    } catch (error) {
      return this.errorHandler.handleConfigError(
        this.getExpectedTypeName(),
        error,
        this.getDefaultConfig(),
      ) as CheckboxConfig;
    }
  }

  /**
   * @inheritdoc
   */
  protected getDefaultValue(): boolean | any[] {
    try {
      // Get appropriate default value based on mode
      const checkboxControl = this.control as ECRFCheckboxClass;
      if (checkboxControl.mode === CheckboxModeEnum.GROUP) {
        return [];
      }

      // Default is unchecked (false) for BINARY mode
      return false;
    } catch (error) {
      return this.errorHandler.handleValueError(
        this.getExpectedTypeName(),
        error,
        false,
      ) as boolean;
    }
  }
}
