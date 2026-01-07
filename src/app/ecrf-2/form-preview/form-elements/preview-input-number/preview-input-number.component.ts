import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  FormLabelPositionEnum,
  FormLabelStyleEnum,
  LibInputNumberComponent,
  InputNumberConfig,
  InputNumberModeEnum,
  InputNumberButtonLayoutEnum,
} from '@artificial-sense/ui-lib';
import { isInputNumberControl } from '@core/utils/type-guards';
import { BasePreviewComponent } from '../../shared/directives/base-preview/base-preview.component';
import { ECRFInputNumberClass } from '../../../form-controls/form-elements/input-number/input-number.class';
import { PreviewWrapperComponent } from '../../shared/components/preview-wrapper/preview-wrapper.component';
import { IFormControl } from '@core/models/interfaces/form.interfaces';

@Component({
  selector: 'app-preview-input-number',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LibInputNumberComponent, PreviewWrapperComponent],
  templateUrl: './preview-input-number.component.html',
  styleUrl: './preview-input-number.component.scss',
})
export class PreviewInputNumberComponent extends BasePreviewComponent<
  IFormControl,
  InputNumberConfig,
  number | null
> {
  /**
   * @inheritdoc
   */
  protected getExpectedTypeName(): string {
    return 'InputNumber';
  }

  /**
   * @inheritdoc
   */
  protected checkControlType(control: IFormControl): boolean {
    return isInputNumberControl(control);
  }

  /**
   * @inheritdoc
   */
  protected override getDefaultConfig(): InputNumberConfig {
    return {
      label: 'Number Input',
      required: false,
      disabled: true, // Always disabled in preview mode
      mode: InputNumberModeEnum.DECIMAL,
      size: FormComponentSizeEnum.NORMAL,
      buttonLayout: InputNumberButtonLayoutEnum.STACKED,
      variant: FormComponentVariantEnum.OUTLINED,
      labelStyle: FormLabelStyleEnum.DEFAULT,
      labelPosition: FormLabelPositionEnum.ABOVE,
    };
  }

  /**
   * @inheritdoc
   */
  protected buildConfig(): InputNumberConfig {
    // Default configuration for all number inputs in preview mode
    const defaultConfig: InputNumberConfig = this.getDefaultConfig();

    // Return default config if control is missing or not an input number
    if (!this.control || !this.isValidControlType()) {
      return defaultConfig;
    }

    // Cast to InputNumber to access specific properties
    const inputNumberControl = this.control as ECRFInputNumberClass;

    try {
      // Get configuration from the control if the method exists
      if (
        inputNumberControl.toInputNumberConfig &&
        typeof inputNumberControl.toInputNumberConfig === 'function'
      ) {
        const controlConfig: InputNumberConfig = inputNumberControl.toInputNumberConfig();

        // Override specific properties for preview mode
        return {
          ...controlConfig,
          disabled: true,
        };
      }

      // Manual configuration if toInputNumberConfig is not available
      return {
        ...defaultConfig,
        label: inputNumberControl.options?.title || inputNumberControl.title || defaultConfig.label,
        placeholder: inputNumberControl.placeholder || defaultConfig.placeholder,
        mode: inputNumberControl.mode || defaultConfig.mode,
        min: inputNumberControl.min,
        max: inputNumberControl.max,
        step: inputNumberControl.step,
        prefix: inputNumberControl.prefix,
        suffix: inputNumberControl.suffix,
        useGrouping: inputNumberControl.useGrouping,
        minFractionDigits: inputNumberControl.minFractionDigits,
        maxFractionDigits: inputNumberControl.maxFractionDigits,
        labelStyle: inputNumberControl.labelStyle || defaultConfig.labelStyle,
        labelPosition: inputNumberControl.labelPosition || defaultConfig.labelPosition,
        helperText: inputNumberControl.options?.helperText,
      };
    } catch (error) {
      return this.errorHandler.handleConfigError(
        this.getExpectedTypeName(),
        error,
        defaultConfig,
      ) as InputNumberConfig;
    }
  }

  /**
   * @inheritdoc
   */
  protected getDefaultValue(): number | null {
    try {
      // If the control has a specific value, use it
      if (this.control && isInputNumberControl(this.control) && this.control.value !== undefined) {
        return this.control.value;
      }

      // Return a sample number value
      return 42;
    } catch (error) {
      return this.errorHandler.handleValueError(this.getExpectedTypeName(), error, 42) as number;
    }
  }
}
