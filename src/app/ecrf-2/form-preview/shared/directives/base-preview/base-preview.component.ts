import { Directive, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { PreviewErrorHandlerService } from '../../services/preview-error-handler.service';
import { IFormControl } from '../../../../core/models/interfaces/form.interfaces';

/**
 * Base component for all form control preview components.
 * Provides common functionality and type safety.
 *
 * @template TControl - The type of form control this preview handles
 * @template TConfig - The type of configuration object used by the UI component
 * @template TValue - The type of value displayed in the preview
 */
@Directive()
export abstract class BasePreviewComponent<
    TControl extends IFormControl,
    TConfig extends Record<string, any>,
    TValue = any,
  >
  implements OnInit, OnChanges
{
  /**
   * The form control to preview
   */
  @Input() control!: TControl;
  /**
   * The value to display in the preview
   * If not provided, a default value will be generated
   */
  @Input() value?: TValue;

  // Inject the error handler service
  protected errorHandler: PreviewErrorHandlerService = inject(PreviewErrorHandlerService);

  private valueCache: TValue | null = null;
  private shouldRefreshValue = true;
  /**
   * Cache for component configuration
   * @private
   */
  private configCache: TConfig | null = null;

  /**
   * Lifecycle hook - performs validation when the component initializes
   */
  ngOnInit(): void {
    try {
      this.validateInputs();
    } catch (error) {
      this.errorHandler.handleValidationError(this.getExpectedTypeName(), error);
    }
  }

  /**
   * Lifecycle hook - clears cache when inputs change
   */
  ngOnChanges(changes: SimpleChanges): void {
    try {
      // Clear config cache if control or related inputs change
      if (changes['control'] || this.shouldInvalidateCache(changes)) {
        this.configCache = null;
        this.valueCache = null;
        this.shouldRefreshValue = true;
      }
    } catch (error) {
      this.errorHandler.handleValidationError(this.getExpectedTypeName(), error);
    }
  }

  /**
   * Gets the configuration for the UI component
   * Uses caching for performance
   *
   * @returns Configuration object for the UI component
   */
  getConfig(): TConfig {
    try {
      if (!this.configCache) {
        this.configCache = this.buildConfig();
      }
      return this.configCache;
    } catch (error) {
      const defaultConfig: TConfig = this.getDefaultConfig();
      return this.errorHandler.handleConfigError(
        this.getExpectedTypeName(),
        error,
        defaultConfig,
      ) as TConfig;
    }
  }

  /**
   * Gets the value to display in the preview
   * Uses the provided value or generates a default
   *
   * @returns The value to display
   */
  getPreviewValue(): TValue {
    try {
      if (this.valueCache === null || this.shouldRefreshValue) {
        this.valueCache = this.hasValue() ? (this.value as TValue) : this.getDefaultValue();
        this.shouldRefreshValue = false;
      }
      return this.valueCache;
    } catch (error) {
      const defaultValue: TValue = this.getFallbackValue();
      return this.errorHandler.handleValueError(
        this.getExpectedTypeName(),
        error,
        defaultValue,
      ) as TValue;
    }
  }

  /**
   * Checks if the control is of the expected type
   *
   * @returns True if the control is of the expected type
   */
  isValidControlType(): boolean {
    try {
      return (
        this.control !== undefined && this.control !== null && this.checkControlType(this.control)
      );
    } catch (error) {
      this.errorHandler.handleValidationError(this.getExpectedTypeName(), error);
      return false;
    }
  }

  /**
   * Validates that the required inputs are provided
   * @protected
   */
  protected validateInputs(): void {
    if (!this.control) {
      this.errorHandler.logWarning(this.getExpectedTypeName(), 'No control provided');
      return;
    }

    if (!this.isValidControlType()) {
      this.errorHandler.logWarning(
        this.getExpectedTypeName(),
        `Control type mismatch. Expected ${this.getExpectedTypeName()}, got ${this.control.type}`,
      );
    }
  }

  /**
   * Checks if additional changes should invalidate the configuration cache
   * Override in child classes if needed
   *
   * @param changes SimpleChanges object from ngOnChanges
   * @returns True if cache should be invalidated
   * @protected
   */
  protected shouldInvalidateCache(changes: SimpleChanges): boolean {
    // By default, invalidate cache on any input change
    return Object.keys(changes).length > 0;
  }

  /**
   * Checks if the component has a valid input value
   *
   * @returns True if the component has a valid value
   * @protected
   */
  protected hasValue(): boolean {
    return this.value !== undefined && this.value !== null;
  }

  /**
   * Gets fallback value in case of error
   * @protected
   */
  protected getFallbackValue(): TValue {
    try {
      return this.getDefaultValue();
    } catch {
      // If even the default value getter fails, return a simple value based on type
      return null as unknown as TValue;
    }
  }

  /**
   * Gets default configuration in case of error
   * @protected
   */
  protected getDefaultConfig(): TConfig {
    // This should be overridden in child classes but provide a minimum implementation
    return {} as TConfig;
  }

  /**
   * Gets the name of the expected control type for error messages
   *
   * @returns The name of the expected control type
   * @protected
   */
  protected abstract getExpectedTypeName(): string;

  /**
   * Checks if the provided control is of the expected type
   *
   * @param control The control to check
   * @returns True if the control is of the expected type
   * @protected
   */
  protected abstract checkControlType(control: IFormControl): boolean;

  /**
   * Builds the configuration object for the UI component
   * Must be implemented by child classes
   *
   * @returns Configuration object
   * @protected
   */
  protected abstract buildConfig(): TConfig;

  /**
   * Gets a default value for the preview when no value is provided
   * Must be implemented by child classes
   *
   * @returns Default value appropriate for the control type
   * @protected
   */
  protected abstract getDefaultValue(): TValue;
}
