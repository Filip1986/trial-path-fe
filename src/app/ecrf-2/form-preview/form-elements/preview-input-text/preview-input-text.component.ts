import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  FormLabelPositionEnum,
  FormLabelStyleEnum,
  LibInputTextComponent,
  InputTextConfig,
  InputTextTypeEnum,
} from '@artificial-sense/ui-lib';
import { isTextInputControl } from '../../../core/utils/type-guards';
import { BasePreviewComponent } from '../../shared/directives/base-preview/base-preview.component';
import { PreviewWrapperComponent } from '../../shared/components/preview-wrapper/preview-wrapper.component';
import { ECRFInputTextClass } from '../../../form-controls/form-elements/input-text/ecrf-input-text.class';
import { IFormControl } from '../../../core/models/interfaces/form.interfaces';

@Component({
  selector: 'app-preview-text-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LibInputTextComponent, PreviewWrapperComponent],
  templateUrl: './preview-input-text.component.html',
  styleUrl: './preview-input-text.component.scss',
})
export class PreviewInputTextComponent extends BasePreviewComponent<
  IFormControl,
  InputTextConfig,
  string
> {
  /**
   * @inheritdoc
   */
  protected getExpectedTypeName(): string {
    return 'TextInput';
  }

  /**
   * @inheritdoc
   */
  protected checkControlType(control: IFormControl): boolean {
    return isTextInputControl(control);
  }

  /**
   * @inheritdoc
   */
  protected override getDefaultConfig(): InputTextConfig {
    return {
      label: 'Text Field',
      required: false,
      disabled: true,
      autofocus: false,
      type: InputTextTypeEnum.TEXT,
      variant: FormComponentVariantEnum.OUTLINED,
      labelStyle: FormLabelStyleEnum.DEFAULT,
      labelPosition: FormLabelPositionEnum.ABOVE,
      size: FormComponentSizeEnum.NORMAL,
    };
  }

  /**
   * @inheritdoc
   */
  protected buildConfig(): InputTextConfig {
    // Default configuration for all input texts in preview mode
    const defaultConfig: InputTextConfig = this.getDefaultConfig();

    // Return default config if control is missing or not an input text
    if (!this.control || !this.isValidControlType()) {
      return defaultConfig;
    }

    // Cast to TextInput to access specific properties
    const textInput = this.control as ECRFInputTextClass;

    try {
      // Get configuration from the control if the method exists
      if (textInput.toInputTextConfig && typeof textInput.toInputTextConfig === 'function') {
        const controlConfig: InputTextConfig = textInput.toInputTextConfig();

        // Override specific properties for preview mode
        return {
          ...controlConfig,
          disabled: true,
          autofocus: false,
        };
      }

      // Manual configuration if toInputTextConfig is not available
      return {
        ...defaultConfig,
        label: textInput.options?.title || textInput.title || defaultConfig.label,
        placeholder: textInput.placeholder || defaultConfig.placeholder,
        type: InputTextTypeEnum.TEXT,
        minLength: textInput.minLength,
        maxLength: textInput.maxLength,
        iconPosition: textInput.iconPosition,
        labelStyle: textInput.labelStyle || defaultConfig.labelStyle,
        labelPosition: textInput.labelPosition || defaultConfig.labelPosition,
        helperText: textInput.options?.helperText,
      };
    } catch (error) {
      // Use the error handler service
      return this.errorHandler.handleConfigError(
        'TextInput',
        error,
        defaultConfig,
      ) as InputTextConfig;
    }
  }

  /**
   * @inheritdoc
   */
  protected getDefaultValue(): string {
    try {
      // Simplified default value - always "Sample text"
      return 'Sample text';
    } catch (error) {
      return this.errorHandler.handleValueError('TextInput', error, 'Sample text') as string;
    }
  }
}
