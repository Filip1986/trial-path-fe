import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  FormLabelPositionEnum,
  FormLabelStyleEnum,
  LibTimePickerComponent,
  TimePickerConfig,
  TimePickerHourFormatEnum,
} from '@artificial-sense/ui-lib';
import { isTimePickerControl } from '@core/utils/type-guards';
import { BasePreviewComponent } from '../../shared/directives/base-preview/base-preview.component';
import { EcrfTimePickerClass } from '../../../form-controls/form-elements/time-picker';
import { PreviewWrapperComponent } from '../../shared/components/preview-wrapper/preview-wrapper.component';
import { IFormControl } from '@core/models/interfaces/form.interfaces';

@Component({
  selector: 'app-preview-time-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LibTimePickerComponent, PreviewWrapperComponent],
  templateUrl: './preview-time-picker.component.html',
  styleUrl: './preview-time-picker.component.scss',
})
export class PreviewTimePickerComponent extends BasePreviewComponent<
  IFormControl,
  TimePickerConfig,
  Date | null
> {
  /**
   * @inheritdoc
   */
  protected getExpectedTypeName(): string {
    return 'TimePicker';
  }

  /**
   * @inheritdoc
   */
  protected checkControlType(control: IFormControl): boolean {
    return isTimePickerControl(control);
  }

  /**
   * Get default configuration for time pickers
   * @returns Default configuration for time pickers
   * @protected
   */
  protected override getDefaultConfig(): TimePickerConfig {
    return {
      label: 'Time',
      required: false,
      disabled: true, // Always disabled in preview mode
      hourFormat: TimePickerHourFormatEnum.TWELVE,
      variant: FormComponentVariantEnum.OUTLINED,
      size: FormComponentSizeEnum.NORMAL,
      labelStyle: FormLabelStyleEnum.DEFAULT,
      labelPosition: FormLabelPositionEnum.ABOVE,
    };
  }

  /**
   * @inheritdoc
   */
  protected buildConfig(): TimePickerConfig {
    try {
      // Default configuration for all time pickers in preview mode
      const defaultConfig: TimePickerConfig = this.getDefaultConfig();

      // Return default config if control is missing or not a time picker
      if (!this.control || !this.isValidControlType()) {
        return defaultConfig;
      }

      // Cast to TimePicker to access specific properties
      const timePickerControl = this.control as EcrfTimePickerClass;

      // Get configuration from the control if the method exists
      if (
        timePickerControl.toTimePickerConfig &&
        typeof timePickerControl.toTimePickerConfig === 'function'
      ) {
        const controlConfig: TimePickerConfig = timePickerControl.toTimePickerConfig();

        // Override specific properties for preview mode
        return {
          ...controlConfig,
          disabled: true,
        };
      }

      // Manual configuration if toTimePickerConfig is not available
      return {
        ...defaultConfig,
        label: timePickerControl.options?.title || timePickerControl.title || defaultConfig.label,
        placeholder: timePickerControl.placeholder || defaultConfig.placeholder,
        hourFormat: timePickerControl.hourFormat || defaultConfig.hourFormat,
        labelStyle: timePickerControl.labelStyle || defaultConfig.labelStyle,
        labelPosition: timePickerControl.labelPosition || defaultConfig.labelPosition,
        helperText: timePickerControl.options?.helperText,
      };
    } catch (error) {
      return this.errorHandler.handleConfigError(
        this.getExpectedTypeName(),
        error,
        this.getDefaultConfig(),
      ) as TimePickerConfig;
    }
  }

  /**
   * @inheritdoc
   */
  protected getDefaultValue(): Date | null {
    try {
      // If control has a value, use it
      if (this.control && isTimePickerControl(this.control) && this.control.value !== undefined) {
        return this.control.value as Date;
      }

      // Return current time as the default value
      return new Date();
    } catch (error) {
      return this.errorHandler.handleValueError(
        this.getExpectedTypeName(),
        error,
        new Date(),
      ) as Date;
    }
  }
}
