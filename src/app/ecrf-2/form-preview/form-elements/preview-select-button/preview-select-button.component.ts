import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  FormLabelPositionEnum,
  FormLabelStyleEnum,
  LibSelectButtonComponent,
  SelectButtonConfig,
  SelectButtonOptionType,
} from '@artificial-sense/ui-lib';
import { isSelectButtonControl } from '../../../core/utils/type-guards';
import { BaseOptionsPreviewComponent } from '../../shared/directives/base-options-preview/base-options-preview.component';
import { ECRFSelectButtonClass } from '../../../form-controls/form-elements/select-button/select-button.class';
import { PreviewWrapperComponent } from '../../shared/components/preview-wrapper/preview-wrapper.component';
import { IFormControl } from '../../../core/models/interfaces/form.interfaces';
import { OptionItem } from '../../../core/models/interfaces/options.interfaces';

@Component({
  selector: 'app-preview-select-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LibSelectButtonComponent, PreviewWrapperComponent],
  templateUrl: './preview-select-button.component.html',
  styleUrl: './preview-select-button.component.scss',
})
export class PreviewSelectButtonComponent extends BaseOptionsPreviewComponent<
  IFormControl,
  SelectButtonConfig,
  any
> {
  /**
   * @inheritdoc
   */
  protected getExpectedTypeName(): string {
    return 'SelectButton';
  }

  /**
   * @inheritdoc
   */
  protected checkControlType(control: IFormControl): boolean {
    try {
      return isSelectButtonControl(control);
    } catch (error) {
      this.errorHandler.handleValidationError(this.getExpectedTypeName(), error);
      return false;
    }
  }

  /**
   * @inheritdoc
   */
  protected override getDefaultConfig(): SelectButtonConfig {
    return {
      options: this.getOptions(),
      multiple: false,
      required: false,
      disabled: true, // Always disabled in preview mode
      size: FormComponentSizeEnum.NORMAL,
      variant: FormComponentVariantEnum.OUTLINED,
      labelStyle: FormLabelStyleEnum.DEFAULT,
      labelPosition: FormLabelPositionEnum.ABOVE,
    };
  }

  /**
   * @inheritdoc
   */
  protected buildConfig(): SelectButtonConfig {
    try {
      // Default configuration for all select buttons in preview mode
      const defaultConfig: SelectButtonConfig = this.getDefaultConfig();

      // Return the default config if control is missing or not a select button
      if (!this.control || !this.isValidControlType()) {
        return defaultConfig;
      }

      // Cast to SelectButton to access specific properties
      const selectButtonControl = this.control as ECRFSelectButtonClass;

      // Get configuration from the control if the method exists
      if (
        selectButtonControl.toSelectButtonConfig &&
        typeof selectButtonControl.toSelectButtonConfig === 'function'
      ) {
        const controlConfig: SelectButtonConfig = selectButtonControl.toSelectButtonConfig();

        // Override specific properties for preview mode
        return {
          ...controlConfig,
          disabled: true,
          options: this.getOptions(),
        };
      }

      // Manual configuration if toSelectButtonConfig is not available
      return {
        ...defaultConfig,
        options: this.getOptions(),
        multiple: selectButtonControl.multiple || defaultConfig.multiple,
        optionLabel: selectButtonControl.optionLabel || 'label',
        optionValue: selectButtonControl.optionValue || 'value',
        optionDisabled: selectButtonControl.optionDisabled || 'disabled',
        size: selectButtonControl.size || defaultConfig.size,
        variant: selectButtonControl.variant || defaultConfig.variant,
        labelStyle: selectButtonControl.labelStyle || defaultConfig.labelStyle,
        labelPosition: selectButtonControl.labelPosition || defaultConfig.labelPosition,
        helperText: selectButtonControl.options?.helperText,
      };
    } catch (error) {
      return this.errorHandler.handleConfigError(
        this.getExpectedTypeName(),
        error,
        this.getDefaultConfig(),
      ) as SelectButtonConfig;
    }
  }

  /**
   * @inheritdoc
   */
  protected extractOptions(): OptionItem[] {
    try {
      if (!this.control || !isSelectButtonControl(this.control)) {
        return [];
      }

      const selectButtonControl = this.control as ECRFSelectButtonClass;

      // Return select button options if available
      if (
        selectButtonControl.selectButtonOptions &&
        Array.isArray(selectButtonControl.selectButtonOptions)
      ) {
        // Map the SelectButtonOptionType to OptionItem interface
        return selectButtonControl.selectButtonOptions.map((option: SelectButtonOptionType) => ({
          label: option.label || '', // Ensure the label is always a string
          value: option.value,
          disabled: option.disabled || false,
          group: option['group'],
        }));
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

      // If multiple selection is enabled, return an array
      if (this.control && isSelectButtonControl(this.control) && this.control.multiple) {
        // Return the first non-disabled option
        const firstOption: OptionItem | undefined = options.find(
          (option: OptionItem): boolean => !option.disabled,
        );
        return firstOption ? [firstOption.value] : [];
      }

      // For single selection, return a single value
      // If no options available, return null
      if (!options || options.length === 0) {
        return null;
      }

      // Return the value of the first non-disabled option
      const firstOption: OptionItem | undefined = options.find(
        (option: OptionItem): boolean => !option.disabled,
      );
      return firstOption ? firstOption.value : null;
    } catch (error) {
      return this.errorHandler.handleValueError(
        this.getExpectedTypeName(),
        error,
        this.control && isSelectButtonControl(this.control) && this.control.multiple ? [] : null,
      );
    }
  }
}
