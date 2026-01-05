import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  FormLabelPositionEnum,
  FormLabelStyleEnum,
  LibRadioButtonComponent,
  RadioButtonConfig,
  RadioButtonModeEnum,
} from '@artificial-sense/ui-lib';
import { isRadioButtonControl } from '../../../core/utils/type-guards';
import { BaseOptionsPreviewComponent } from '../../shared/directives/base-options-preview/base-options-preview.component';
import { ECRFRadioButtonClass } from '../../../form-controls/form-elements/radio-button/radio-button.class';
import { PreviewWrapperComponent } from '../../shared/components/preview-wrapper/preview-wrapper.component';
import { IFormControl } from '../../../core/models/interfaces/form.interfaces';
import { OptionItem } from '../../../core/models/interfaces/options.interfaces';

@Component({
  selector: 'app-preview-radio-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LibRadioButtonComponent, PreviewWrapperComponent],
  templateUrl: './preview-radio-button.component.html',
  styleUrl: './preview-radio-button.component.scss',
})
export class PreviewRadioButtonComponent extends BaseOptionsPreviewComponent<
  IFormControl,
  RadioButtonConfig,
  any
> {
  /**
   * Create a config for a specific radio option
   * This method doesn't override the base class method
   */
  getOptionConfig(option: OptionItem): RadioButtonConfig {
    try {
      const baseConfig: RadioButtonConfig = this.getConfig();

      return {
        ...baseConfig,
        label: option?.label || '',
        value: option?.value,
      };
    } catch (error) {
      return this.errorHandler.handleConfigError(
        this.getExpectedTypeName(),
        error,
        this.getDefaultOptionConfig(),
      ) as RadioButtonConfig;
    }
  }

  /**
   * @inheritdoc
   */
  protected getExpectedTypeName(): string {
    return 'RadioButton';
  }

  /**
   * @inheritdoc
   */
  protected checkControlType(control: IFormControl): boolean {
    try {
      return isRadioButtonControl(control);
    } catch (error) {
      this.errorHandler.handleValidationError(this.getExpectedTypeName(), error);
      return false;
    }
  }

  /**
   * @inheritdoc
   */
  protected override getDefaultConfig(): RadioButtonConfig {
    return {
      label: 'Radio Button',
      name: 'radio-group',
      required: false,
      disabled: true,
      mode: RadioButtonModeEnum.STANDARD,
      variant: FormComponentVariantEnum.OUTLINED,
      size: FormComponentSizeEnum.NORMAL,
      labelStyle: FormLabelStyleEnum.DEFAULT,
      labelPosition: FormLabelPositionEnum.ABOVE,
    };
  }

  /**
   * @inheritdoc
   */
  protected buildConfig(): RadioButtonConfig {
    try {
      // Default configuration for all radio buttons in preview mode
      const defaultConfig: RadioButtonConfig = this.getDefaultConfig();

      // Return default config if control is missing or not a radio button
      if (!this.control || !this.isValidControlType()) {
        return defaultConfig;
      }

      // Cast to RadioButton to access specific properties
      const radioButtonControl = this.control as ECRFRadioButtonClass;

      // Get configuration from the control if the method exists
      if (
        radioButtonControl.toRadioButtonConfig &&
        typeof radioButtonControl.toRadioButtonConfig === 'function'
      ) {
        const controlConfig: RadioButtonConfig = radioButtonControl.toRadioButtonConfig();

        // Override specific properties for preview mode
        return {
          ...controlConfig,
          disabled: true,
        };
      }

      // Manual configuration if toRadioButtonConfig is not available
      return {
        ...defaultConfig,
        label: radioButtonControl.options?.title || radioButtonControl.title || defaultConfig.label,
        name: radioButtonControl.name || defaultConfig.name,
        mode: radioButtonControl.mode || defaultConfig.mode,
        size: radioButtonControl.size || defaultConfig.size,
        variant: radioButtonControl.variant || defaultConfig.variant,
        labelStyle: radioButtonControl.labelStyle || defaultConfig.labelStyle,
        labelPosition: radioButtonControl.labelPosition || defaultConfig.labelPosition,
        helperText: radioButtonControl.options?.helperText,
      };
    } catch (error) {
      return this.errorHandler.handleConfigError(
        this.getExpectedTypeName(),
        error,
        this.getDefaultConfig(),
      ) as RadioButtonConfig;
    }
  }

  /**
   * @inheritdoc
   */
  protected extractOptions(): OptionItem[] {
    try {
      if (!this.control || !isRadioButtonControl(this.control)) {
        return [];
      }

      const radioButtonControl = this.control as ECRFRadioButtonClass;

      // Return radio options if available
      if (radioButtonControl.radioOptions && Array.isArray(radioButtonControl.radioOptions)) {
        return radioButtonControl.radioOptions;
      }

      return [];
    } catch (error) {
      return this.errorHandler.handleOptionsError(
        this.getExpectedTypeName(),
        error,
        this.getDefaultOptions(),
      );
    }
  }

  /**
   * @inheritdoc
   */
  protected getDefaultValue(): any {
    try {
      const options: OptionItem[] = this.getOptions();

      // If no options, return null
      if (!options || options.length === 0) {
        return null;
      }

      // Return the value of the first non-disabled option
      const firstOption: OptionItem | undefined = options.find(
        (option: OptionItem): boolean => !option.disabled,
      );
      return firstOption ? firstOption.value : null;
    } catch (error) {
      return this.errorHandler.handleValueError(this.getExpectedTypeName(), error, null);
    }
  }

  /**
   * Get default option config for fallback in error cases
   */
  private getDefaultOptionConfig(): RadioButtonConfig {
    return {
      label: 'Option',
      name: 'radio-group',
      required: false,
      disabled: true,
      mode: RadioButtonModeEnum.STANDARD,
      variant: FormComponentVariantEnum.OUTLINED,
      size: FormComponentSizeEnum.NORMAL,
      labelStyle: FormLabelStyleEnum.DEFAULT,
      labelPosition: FormLabelPositionEnum.ABOVE,
    };
  }
}
