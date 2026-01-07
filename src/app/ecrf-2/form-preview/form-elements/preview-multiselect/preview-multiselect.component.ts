import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  FormLabelPositionEnum,
  FormLabelStyleEnum,
  LibMultiSelectComponent,
  MultiSelectConfig,
  MultiSelectDisplayModeEnum,
} from '@artificial-sense/ui-lib';
import { isMultiSelectControl } from '@core/utils/type-guards';
import { BaseOptionsPreviewComponent } from '../../shared/directives/base-options-preview/base-options-preview.component';
import { Multiselect } from '../../../form-controls/form-elements/multiselect/multiselect.class';
import { PreviewWrapperComponent } from '../../shared/components/preview-wrapper/preview-wrapper.component';
import { IFormControl } from '@core/models/interfaces/form.interfaces';
import { OptionItem } from '@core/models/interfaces/options.interfaces';

@Component({
  selector: 'app-preview-multiselect',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LibMultiSelectComponent, PreviewWrapperComponent],
  templateUrl: './preview-multiselect.component.html',
  styleUrls: ['./preview-multiselect.component.scss'],
})
export class PreviewMultiselectComponent extends BaseOptionsPreviewComponent<
  IFormControl,
  MultiSelectConfig,
  any[]
> {
  /**
   * @inheritdoc
   */
  protected getExpectedTypeName(): string {
    return 'Multiselect';
  }

  /**
   * @inheritdoc
   */
  protected checkControlType(control: IFormControl): boolean {
    return isMultiSelectControl(control);
  }

  /**
   * @inheritdoc
   */
  protected override getDefaultConfig(): MultiSelectConfig {
    return {
      label: 'Multiselect',
      required: false,
      disabled: true,
      options: this.getOptions(),
      placeholder: 'Select options',
      optionLabel: 'label',
      optionValue: 'value',
      display: MultiSelectDisplayModeEnum.COMMA,
      variant: FormComponentVariantEnum.OUTLINED,
      labelStyle: FormLabelStyleEnum.DEFAULT,
      labelPosition: FormLabelPositionEnum.ABOVE,
      size: FormComponentSizeEnum.NORMAL,
    };
  }

  /**
   * @inheritdoc
   */
  protected buildConfig(): MultiSelectConfig {
    // Default configuration for all multiselect controls in preview mode
    const defaultConfig: MultiSelectConfig = this.getDefaultConfig();

    // Return default config if control is missing or not a multiselect
    if (!this.control || !this.isValidControlType()) {
      return defaultConfig;
    }

    // Cast to Multiselect to access specific properties
    const multiselectControl = this.control as Multiselect;

    try {
      // Get configuration from the control if the method exists
      if (
        multiselectControl.toMultiSelectConfig &&
        typeof multiselectControl.toMultiSelectConfig === 'function'
      ) {
        const controlConfig: MultiSelectConfig = multiselectControl.toMultiSelectConfig();

        // Override specific properties for preview mode
        return {
          ...controlConfig,
          disabled: true,
          options: this.getOptions(),
        };
      }

      // Manual configuration if toMultiSelectConfig is not available
      return {
        ...defaultConfig,
        label: multiselectControl.options?.title || multiselectControl.title || defaultConfig.label,
        placeholder: multiselectControl.placeholder || defaultConfig.placeholder,
        optionLabel: multiselectControl.optionLabel || defaultConfig.optionLabel,
        optionValue: multiselectControl.optionValue || defaultConfig.optionValue,
        filter: multiselectControl.filter || false,
        showToggleAll: multiselectControl.showToggleAll || false,
        maxSelectedLabels: multiselectControl.maxSelectedLabels,
        display: multiselectControl.display || defaultConfig.display,
        group: multiselectControl.group || false,
        optionGroupLabel: multiselectControl.optionGroupLabel,
        optionGroupChildren: multiselectControl.optionGroupChildren,
        labelStyle: multiselectControl.labelStyle || defaultConfig.labelStyle,
        labelPosition: multiselectControl.labelPosition || defaultConfig.labelPosition,
        size: multiselectControl.size || defaultConfig.size,
        variant: multiselectControl.variant || defaultConfig.variant,
        helperText: multiselectControl.options?.helperText,
      };
    } catch (error) {
      return this.errorHandler.handleConfigError(
        'Multiselect',
        error,
        defaultConfig,
      ) as MultiSelectConfig;
    }
  }

  /**
   * @inheritdoc
   */
  protected extractOptions(): OptionItem[] {
    try {
      if (!this.control || !isMultiSelectControl(this.control)) {
        return [];
      }

      const multiselectControl = this.control as Multiselect;

      // Return multiselect options if available
      if (multiselectControl.selectOptions && Array.isArray(multiselectControl.selectOptions)) {
        return multiselectControl.selectOptions;
      }

      return [];
    } catch (error) {
      return this.errorHandler.handleOptionsError('Multiselect', error, this.getDefaultOptions());
    }
  }

  /**
   * @inheritdoc
   */
  protected getDefaultValue(): any[] {
    try {
      const options: OptionItem[] = this.getOptions();

      // Return an empty array if no options
      if (!options || options.length === 0) {
        return [];
      }

      // For demonstration, select the first 1-2 non-disabled options
      const selectedOptions: OptionItem[] = options
        .filter((option: OptionItem): boolean => !option.disabled)
        .slice(0, Math.min(2, options.length));

      // Return an array of option values
      return selectedOptions.map((option: OptionItem) => option.value);
    } catch (error) {
      return this.errorHandler.handleValueError('Multiselect', error, []) as any[];
    }
  }
}
