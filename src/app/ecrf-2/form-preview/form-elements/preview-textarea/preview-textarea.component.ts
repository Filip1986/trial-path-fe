import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  FormLabelPositionEnum,
  FormLabelStyleEnum,
  LibTextareaComponent,
  TextareaConfig,
} from '@artificial-sense/ui-lib';
import { isTextAreaControl } from '@core/utils/type-guards';
import { BasePreviewComponent } from '../../shared/directives/base-preview/base-preview.component';
import { ECRFTextAreaClass } from '../../../form-controls/form-elements/textarea/textarea.class';
import { PreviewWrapperComponent } from '../../shared/components/preview-wrapper/preview-wrapper.component';
import { IFormControl } from '@core/models/interfaces/form.interfaces';

@Component({
  selector: 'app-preview-textarea',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LibTextareaComponent, PreviewWrapperComponent],
  templateUrl: './preview-textarea.component.html',
  styleUrl: './preview-textarea.component.scss',
})
export class PreviewTextareaComponent extends BasePreviewComponent<
  IFormControl,
  TextareaConfig,
  string
> {
  /**
   * @inheritdoc
   */
  protected getExpectedTypeName(): string {
    return 'TextArea';
  }

  /**
   * @inheritdoc
   */
  protected checkControlType(control: IFormControl): boolean {
    return isTextAreaControl(control);
  }

  /**
   * @inheritdoc
   */
  protected override getDefaultConfig(): TextareaConfig {
    return {
      label: 'Text Area',
      required: false,
      disabled: true, // Always disabled in preview mode
      autofocus: false,
      rows: 3,
      size: FormComponentSizeEnum.NORMAL,
      variant: FormComponentVariantEnum.OUTLINED,
      labelStyle: FormLabelStyleEnum.DEFAULT,
      labelPosition: FormLabelPositionEnum.ABOVE,
    };
  }

  /**
   * @inheritdoc
   */
  protected buildConfig(): TextareaConfig {
    // Get the default configuration
    const defaultConfig: TextareaConfig = this.getDefaultConfig();

    // Return default config if control is missing or not a textarea
    if (!this.control || !this.isValidControlType()) {
      return defaultConfig;
    }

    // Cast to TextArea to access specific properties
    const textAreaControl = this.control as ECRFTextAreaClass;

    try {
      // Get configuration from the control if the method exists
      if (
        textAreaControl.toTextareaConfig &&
        typeof textAreaControl.toTextareaConfig === 'function'
      ) {
        const controlConfig: TextareaConfig = textAreaControl.toTextareaConfig();

        // Override specific properties for preview mode
        return {
          ...controlConfig,
          disabled: true,
          autofocus: false,
        };
      }

      // Manual configuration if toTextareaConfig is not available
      return {
        ...defaultConfig,
        label: textAreaControl.options?.title || textAreaControl.title || defaultConfig.label,
        placeholder: textAreaControl.placeholder || defaultConfig.placeholder,
        rows: textAreaControl.rows || defaultConfig.rows,
        cols: textAreaControl.cols,
        autoResize: textAreaControl.autoResize || false,
        minLength: textAreaControl.minLength,
        maxLength: textAreaControl.maxLength,
        labelStyle: textAreaControl.labelStyle || defaultConfig.labelStyle,
        labelPosition: textAreaControl.labelPosition || defaultConfig.labelPosition,
        helperText: textAreaControl.options?.helperText,
      };
    } catch (error) {
      return this.errorHandler.handleConfigError(
        this.getExpectedTypeName(),
        error,
        defaultConfig,
      ) as TextareaConfig;
    }
  }

  /**
   * @inheritdoc
   */
  protected getDefaultValue(): string {
    try {
      // You can add custom logic here to generate appropriate placeholder text
      return 'Sample text area content';
    } catch (error) {
      return this.errorHandler.handleValueError(
        this.getExpectedTypeName(),
        error,
        'Sample text area content',
      ) as string;
    }
  }
}
