import { Directive, OnInit } from '@angular/core';
import { BasePreviewComponent } from '../base-preview/base-preview.component';
import { IFormControl } from '@core/models/interfaces/form.interfaces';
import { OptionItem } from '@core/models/interfaces/options.interfaces';

/**
 * Base component for previewing form controls that have options
 * (select, dropdown, listbox, multiselect, etc.)
 *
 * @template TControl - The type of form control this preview handles
 * @template TConfig - The type of configuration object used by the UI component
 * @template TValue - The type of value displayed in the preview
 */
@Directive()
export abstract class BaseOptionsPreviewComponent<
    TControl extends IFormControl,
    TConfig extends Record<string, any>,
    TValue = any,
  >
  extends BasePreviewComponent<TControl, TConfig, TValue>
  implements OnInit
{
  /**
   * @inheritdoc
   */
  override ngOnInit(): void {
    super.ngOnInit();

    try {
      // Additional validation specific to option-based controls
      this.validateOptions();
    } catch (error) {
      this.errorHandler.handleValidationError(this.getExpectedTypeName(), error);
    }
  }

  /**
   * Gets the options for the control
   *
   * @returns Array of option items
   */
  getOptions(): OptionItem[] {
    try {
      if (!this.control || !this.isValidControlType()) {
        return this.getDefaultOptions();
      }

      return this.extractOptions();
    } catch (error) {
      return this.errorHandler.handleOptionsError(
        this.getExpectedTypeName(),
        error,
        this.getDefaultOptions(),
      );
    }
  }

  /**
   * Validates that the control has options
   *
   * @protected
   */
  protected validateOptions(): void {
    try {
      if (this.control && this.isValidControlType() && this.getOptions().length === 0) {
        this.errorHandler.logWarning(this.getExpectedTypeName(), `Control has no options`);
      }
    } catch (error) {
      this.errorHandler.handleValidationError(this.getExpectedTypeName(), error);
    }
  }

  /**
   * Extracts options from the control
   *
   * @returns Array of option items
   * @protected
   */
  protected abstract extractOptions(): OptionItem[];

  /**
   * Gets default options for when the control is invalid or missing
   *
   * @returns Array of default option items
   * @protected
   */
  protected getDefaultOptions(): OptionItem[] {
    return [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ];
  }
}
