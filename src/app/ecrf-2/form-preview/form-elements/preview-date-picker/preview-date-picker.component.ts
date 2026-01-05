import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  LibDatePickerComponent,
  DatePickerConfig,
  DatePickerModeEnum,
  DatePickerViewEnum,
  DatePickerHourFormatEnum,
  IconDisplayModeEnum,
  FormComponentVariantEnum,
  FormLabelStyleEnum,
  FormLabelPositionEnum,
  FormComponentSizeEnum,
} from '@artificial-sense/ui-lib';
import { isDatePickerControl } from '../../../core/utils/type-guards';
import { BasePreviewComponent } from '../../shared/directives/base-preview/base-preview.component';
import { EcrfDatePickerClass } from '../../../form-controls/form-elements/date-picker';
import { PreviewWrapperComponent } from '../../shared/components/preview-wrapper/preview-wrapper.component';
import { IFormControl } from '../../../core/models/interfaces/form.interfaces';

@Component({
  selector: 'app-preview-date-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LibDatePickerComponent, PreviewWrapperComponent],
  templateUrl: './preview-date-picker.component.html',
  styleUrl: './preview-date-picker.component.scss',
})
export class PreviewDatePickerComponent extends BasePreviewComponent<
  IFormControl,
  DatePickerConfig,
  Date | Date[] | null
> {
  /**
   * @inheritdoc
   */
  protected getExpectedTypeName(): string {
    return 'DatePicker';
  }

  /**
   * @inheritdoc
   */
  protected checkControlType(control: IFormControl): boolean {
    return isDatePickerControl(control);
  }

  /**
   * @inheritdoc
   */
  protected override getDefaultConfig(): DatePickerConfig {
    return {
      label: this.control?.title || 'Date',
      required: false,
      disabled: true, // Always disabled in preview mode
      iconDisplay: IconDisplayModeEnum.BUTTON,
      variant: FormComponentVariantEnum.OUTLINED,
      numberOfMonths: 1,
      showTime: false,
      hourFormat: DatePickerHourFormatEnum.TWENTY_FOUR,
      view: DatePickerViewEnum.DATE,
      labelStyle: FormLabelStyleEnum.DEFAULT,
      labelPosition: FormLabelPositionEnum.ABOVE,
      size: FormComponentSizeEnum.NORMAL,
    };
  }

  /**
   * @inheritdoc
   */
  protected buildConfig(): DatePickerConfig {
    // Default configuration for all date pickers in preview mode
    const defaultConfig: DatePickerConfig = this.getDefaultConfig();

    // Return default config if control is missing or not a date picker
    if (!this.control || !this.isValidControlType()) {
      return defaultConfig;
    }

    // Cast to DatePicker to access specific properties
    const datePickerControl = this.control as EcrfDatePickerClass;

    try {
      // Get configuration from the control if the method exists
      if (
        datePickerControl.toDatePickerConfig &&
        typeof datePickerControl.toDatePickerConfig === 'function'
      ) {
        const controlConfig: DatePickerConfig = datePickerControl.toDatePickerConfig();

        // Override specific properties for preview mode
        return {
          ...controlConfig,
          disabled: true,
        };
      }

      // Manual configuration if toDatePickerConfig is not available
      return {
        ...defaultConfig,
        label: datePickerControl.options?.title || datePickerControl.title || defaultConfig.label,
        placeholder: datePickerControl.placeholder || defaultConfig.placeholder,
        selectionMode: datePickerControl.selectionMode || DatePickerModeEnum.SINGLE,
        dateFormat: datePickerControl.dateFormat || 'mm/dd/yy',
        showTime: datePickerControl.showTime || false,
        hourFormat: datePickerControl.hourFormat || DatePickerHourFormatEnum.TWENTY_FOUR,
        showIcon: datePickerControl.showIcon !== undefined ? datePickerControl.showIcon : true,
        minDate: datePickerControl.minDate || undefined,
        maxDate: datePickerControl.maxDate || undefined,
        labelStyle: datePickerControl.labelStyle || defaultConfig.labelStyle,
        labelPosition: datePickerControl.labelPosition || defaultConfig.labelPosition,
        helperText: datePickerControl.options?.helperText,
      };
    } catch (error) {
      return this.errorHandler.handleConfigError(
        this.getExpectedTypeName(),
        error,
        defaultConfig,
      ) as DatePickerConfig;
    }
  }

  /**
   * @inheritdoc
   */
  protected getDefaultValue(): Date | Date[] | null {
    try {
      // If the control has a specific value, use it
      if (isDatePickerControl(this.control) && this.control.value !== undefined) {
        if (
          this.control.selectionMode === DatePickerModeEnum.MULTIPLE &&
          !Array.isArray(this.control.value)
        ) {
          // If multiple selection mode but value is not an array, return an empty array
          return [];
        }
        return this.control.value;
      }

      // For multiple selection mode, always return an array
      if (
        isDatePickerControl(this.control) &&
        this.control.selectionMode === DatePickerModeEnum.MULTIPLE
      ) {
        return [];
      }

      // Otherwise, return a sample date for single selection mode
      return new Date();
    } catch (error) {
      return this.errorHandler.handleValueError(this.getExpectedTypeName(), error, new Date()) as
        | Date
        | Date[]
        | null;
    }
  }
}
