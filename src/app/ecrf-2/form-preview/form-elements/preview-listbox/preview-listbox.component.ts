import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  FormLabelPositionEnum,
  FormLabelStyleEnum,
  LibListboxComponent,
  ListBoxConfig,
} from '@artificial-sense/ui-lib';
import { isListBoxControl } from '@core/utils/type-guards';
import { BaseOptionsPreviewComponent } from '../../shared/directives/base-options-preview/base-options-preview.component';
import { ECRFListBoxClass } from '../../../form-controls/form-elements/listbox/listbox.class';
import { PreviewWrapperComponent } from '../../shared/components/preview-wrapper/preview-wrapper.component';
import { IFormControl } from '@core/models/interfaces/form.interfaces';
import { OptionItem } from '@core/models/interfaces/options.interfaces';

@Component({
  selector: 'app-preview-listbox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LibListboxComponent, PreviewWrapperComponent],
  templateUrl: './preview-listbox.component.html',
  styleUrl: './preview-listbox.component.scss',
})
export class PreviewListboxComponent extends BaseOptionsPreviewComponent<
  IFormControl,
  ListBoxConfig,
  any
> {
  /**
   * @inheritdoc
   */
  protected getExpectedTypeName(): string {
    return 'Listbox';
  }

  /**
   * @inheritdoc
   */
  protected checkControlType(control: IFormControl): boolean {
    return isListBoxControl(control);
  }

  /**
   * @inheritdoc
   */
  protected buildConfig(): ListBoxConfig {
    // Default configuration for all listbox controls in preview mode
    const defaultConfig: ListBoxConfig = {
      label: this.control?.title || 'Listbox',
      required: false,
      disabled: true, // Always disabled in preview mode
      options: this.getOptions(),
      variant: FormComponentVariantEnum.OUTLINED,
      labelStyle: FormLabelStyleEnum.DEFAULT,
      labelPosition: FormLabelPositionEnum.ABOVE,
      size: FormComponentSizeEnum.NORMAL,
    };

    // Return default config if control is missing or not a listbox
    if (!this.control || !this.isValidControlType()) {
      return defaultConfig;
    }

    // Cast to Listbox to access specific properties
    const listboxControl = this.control as ECRFListBoxClass;

    try {
      // Get configuration from the control if the method exists
      if (listboxControl.toListBoxConfig && typeof listboxControl.toListBoxConfig === 'function') {
        const controlConfig: ListBoxConfig = listboxControl.toListBoxConfig();

        // Override specific properties for preview mode
        return {
          ...controlConfig,
          disabled: true,
          options: this.getOptions(),
        };
      }

      // Manual configuration if toListBoxConfig is not available
      return {
        ...defaultConfig,
        label: listboxControl.options?.title || listboxControl.title || defaultConfig.label,
        multiple: listboxControl.multiple || false,
        checkbox: listboxControl.checkbox || false,
        filter: listboxControl.filter || false,
        optionLabel: listboxControl.optionLabel || 'label',
        optionValue: listboxControl.optionValue || 'value',
        labelStyle: listboxControl.labelStyle || defaultConfig.labelStyle,
        labelPosition: listboxControl.labelPosition || defaultConfig.labelPosition,
        helperText: listboxControl.options?.helperText,
      };
    } catch (error) {
      return this.errorHandler.handleConfigError(
        this.getExpectedTypeName(),
        error,
        defaultConfig,
      ) as ListBoxConfig;
    }
  }

  /**
   * @inheritdoc
   */
  protected extractOptions(): OptionItem[] {
    try {
      if (!this.control || !isListBoxControl(this.control)) {
        return [];
      }

      const listboxControl = this.control as ECRFListBoxClass;

      // Return listbox options if available
      if (listboxControl.listOptions && Array.isArray(listboxControl.listOptions)) {
        return listboxControl.listOptions;
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
      const options = this.getOptions();

      // If no options, return null
      if (!options || options.length === 0) {
        return null;
      }

      // For multiple selection, return an array of selected values
      if (this.control && isListBoxControl(this.control) && this.control.multiple) {
        // Select the first non-disabled option
        const firstOption = options.find((option) => !option.disabled);
        return firstOption ? [firstOption.value] : [];
      }

      // For a single selection, return a single value
      const firstOption = options.find((option) => !option.disabled);
      return firstOption ? firstOption.value : null;
    } catch (error) {
      return this.errorHandler.handleValueError(this.getExpectedTypeName(), error, null);
    }
  }
}
