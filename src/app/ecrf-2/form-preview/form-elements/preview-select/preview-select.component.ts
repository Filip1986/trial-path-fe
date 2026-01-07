import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  DEFAULT_SCROLL_HEIGHT,
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  FormLabelPositionEnum,
  FormLabelStyleEnum,
  LibSelectComponent,
  SelectConfig,
} from '@artificial-sense/ui-lib';
import { isSelectControl } from '@core/utils/type-guards';
import { BaseOptionsPreviewComponent } from '../../shared/directives/base-options-preview/base-options-preview.component';
import { ECRFSelectClass } from '../../../form-controls/form-elements/select/select.class';
import { PreviewWrapperComponent } from '../../shared/components/preview-wrapper/preview-wrapper.component';
import { IFormControl } from '@core/models/interfaces/form.interfaces';
import { OptionItem } from '@core/models/interfaces/options.interfaces';

@Component({
  selector: 'app-preview-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LibSelectComponent, PreviewWrapperComponent],
  templateUrl: './preview-select.component.html',
  styleUrl: './preview-select.component.scss',
})
export class PreviewSelectComponent extends BaseOptionsPreviewComponent<
  IFormControl,
  SelectConfig,
  any
> {
  /**
   * @inheritdoc
   */
  protected getExpectedTypeName(): string {
    return 'Select';
  }

  /**
   * @inheritdoc
   */
  protected checkControlType(control: IFormControl): boolean {
    return isSelectControl(control);
  }

  /**
   * @inheritdoc
   */
  protected override getDefaultConfig(): SelectConfig {
    return {
      label: 'Select',
      required: false,
      disabled: true,
      options: this.getOptions(),
      placeholder: 'Select an option',
      optionLabel: 'label',
      optionValue: 'value',
      scrollHeight: DEFAULT_SCROLL_HEIGHT,
      variant: FormComponentVariantEnum.OUTLINED,
      labelStyle: FormLabelStyleEnum.DEFAULT,
      labelPosition: FormLabelPositionEnum.ABOVE,
      size: FormComponentSizeEnum.NORMAL,
    };
  }

  /**
   * @inheritdoc
   */
  protected buildConfig(): SelectConfig {
    // Default configuration for all select controls in preview mode
    const defaultConfig: SelectConfig = this.getDefaultConfig();

    // Return default config if control is missing or not a select
    if (!this.control || !this.isValidControlType()) {
      return defaultConfig;
    }

    // Cast to Select to access specific properties
    const selectControl = this.control as ECRFSelectClass;

    try {
      // Get configuration from the control if the method exists
      if (selectControl.toSelectConfig && typeof selectControl.toSelectConfig === 'function') {
        const controlConfig: SelectConfig = selectControl.toSelectConfig();

        // Override specific properties for preview mode
        return {
          ...controlConfig,
          disabled: true,
          options: this.getOptions(),
        };
      }

      // Manual configuration if toSelectConfig is not available
      return {
        ...defaultConfig,
        label: selectControl.options?.title || selectControl.title || defaultConfig.label,
        placeholder: selectControl.placeholder || defaultConfig.placeholder,
        optionLabel: selectControl.optionLabel || defaultConfig.optionLabel,
        optionValue: selectControl.optionValue || defaultConfig.optionValue,
        filter: selectControl.filter || false,
        showClear: selectControl.showClear || false,
        group: selectControl.group || false,
        labelStyle: selectControl.labelStyle || defaultConfig.labelStyle,
        labelPosition: selectControl.labelPosition || defaultConfig.labelPosition,
        size: selectControl.size || defaultConfig.size,
        variant: selectControl.variant || defaultConfig.variant,
        helperText: selectControl.options?.helperText,
      };
    } catch (error) {
      return this.errorHandler.handleConfigError('Select', error, defaultConfig) as SelectConfig;
    }
  }

  /**
   * @inheritdoc
   */
  protected extractOptions(): OptionItem[] {
    try {
      if (!this.control || !isSelectControl(this.control)) {
        return [];
      }

      const selectControl = this.control as ECRFSelectClass;

      // Return select options if available
      if (selectControl.selectOptions && Array.isArray(selectControl.selectOptions)) {
        return selectControl.selectOptions;
      }

      return [];
    } catch (error) {
      return this.errorHandler.handleOptionsError('Select', error, this.getDefaultOptions());
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
      return this.errorHandler.handleValueError('Select', error, null);
    }
  }
}
