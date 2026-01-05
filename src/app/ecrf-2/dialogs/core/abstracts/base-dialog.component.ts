import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { ToastManagerService } from '../../../../core/services/toast-manager.service';
import { Preset } from '../../shared/services/preset.service';
import { PresetManagerService } from '../services/preset-manager.service';
import { FormElementType } from '../../../core/models/enums/form.enums';
import { DialogFormBuilder } from '../services/dialog-form-builder.service';
import { DialogConfigFactory } from '../services/dialog-configuration-factory.service';
import { DialogValidationService } from '../services/dialog-validation.service';
import { DialogErrorDisplayService } from '../services/dialog-error-display.service';
import {
  IPresetConfiguration,
  IPresetSupport,
} from '../../../core/models/interfaces/preset.interfaces';
import {
  IDialogBehaviorOption,
  IDialogConfiguration,
  IDialogFieldConfig,
} from '../../../core/models/interfaces/dialog.interfaces';
import { DialogConfigurationRegistry } from '../builders/dialog-configuration-registry';
import {
  IValidationError,
  IValidationResult,
  IValidationWarning,
} from '../../../core/models/interfaces/validation.interfaces';
import {
  ComponentSizeOption,
  ComponentVariantOption,
  LabelPositionOption,
  LabelStyleOption,
} from '../models/dialog.types';
import { ConfirmationService } from 'primeng/api';
import { DialogConfirmationService } from '../services/dialog-confirmation.service';
import {
  CustomValidationContext,
  CustomValidationService,
} from '../services/custom-validation.service';
import { CustomValidationRule } from '../../shared/components/tab-sections/custom-validation-settings/custom-validation-settings.component';

/**
 * Enhanced base component with comprehensive validation support and proper change detection
 */
@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class BaseDialogComponent<T> implements OnInit, IPresetSupport {
  @Input() visible = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() control: T | null = null;
  @Output() save: EventEmitter<T> = new EventEmitter<T>();

  form!: FormGroup;
  isSaving = false;
  hasUnsavedChanges = false;
  formErrors: Record<string, string> = {};

  // Enhanced validation properties
  validationResult: IValidationResult | null = null;
  fieldErrors: Record<string, string[]> = {};
  formMessages: string[] = [];
  enableEnhancedValidation = true;

  // Preset dialog visibility flags
  savePresetDialogVisible = false;
  loadPresetDialogVisible = false;

  // Configuration loaded from registry
  public dialogConfiguration!: IDialogConfiguration;
  protected destroyRef: DestroyRef = inject(DestroyRef);
  protected fb: FormBuilder = inject(FormBuilder);
  protected presetManager: PresetManagerService = inject(PresetManagerService);
  protected toastManager: ToastManagerService = inject(ToastManagerService);
  protected registry: DialogConfigurationRegistry = inject(DialogConfigurationRegistry);
  protected formBuilder: DialogFormBuilder = inject(DialogFormBuilder);
  protected configFactory: DialogConfigFactory = inject(DialogConfigFactory);
  protected confirmationService: ConfirmationService = inject(ConfirmationService);
  protected dialogConfirmationService: DialogConfirmationService =
    inject(DialogConfirmationService);
  protected cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  // Enhanced validation services
  protected validationService: DialogValidationService = inject(DialogValidationService);
  protected errorDisplayService: DialogErrorDisplayService = inject(DialogErrorDisplayService);
  protected customValidationService: CustomValidationService = inject(CustomValidationService);
  protected abstract elementType: FormElementType;
  // Track the initial form state to detect real changes
  private initialFormValue: any = null;
  private isInitializing = false;
  private userHasInteracted = false;

  // Getters for configuration (same as before)
  get basicFields(): IDialogFieldConfig[] {
    return this.configFactory.getBasicFields(this.elementType);
  }

  get behaviorOptions(): IDialogBehaviorOption[] {
    return this.configFactory.getBehaviorOptions(this.elementType);
  }

  get labelStyles(): LabelStyleOption[] {
    return this.configFactory.getLabelStyleOptions();
  }

  get labelPositions(): LabelPositionOption[] {
    return this.configFactory.getLabelPositionOptions();
  }

  get sizes(): ComponentSizeOption[] {
    return this.configFactory.getSizeOptions();
  }

  get variants(): ComponentVariantOption[] {
    return this.configFactory.getVariantOptions();
  }

  // Validation helper methods (keeping existing ones)
  getFieldErrors(fieldName: string): string[] {
    if (!this.validationResult || !this.enableEnhancedValidation) return [];
    return this.errorDisplayService.getFieldErrors(this.validationResult, fieldName);
  }

  hasFieldErrors(fieldName: string): boolean {
    return this.getFieldErrors(fieldName).length > 0;
  }

  getFieldError(fieldName: string): string {
    const errors: string[] = this.getFieldErrors(fieldName);
    return errors.length > 0 ? errors[0] : '';
  }

  getValidationMessages(): string[] {
    if (!this.validationResult || !this.enableEnhancedValidation) return [];
    return this.errorDisplayService.formatValidationResult(this.validationResult);
  }

  getCombinedFieldErrors(fieldNames: string[]): string[] {
    const combinedErrors: string[] = [];
    fieldNames.forEach((fieldName: string): void => {
      const errors: string[] = this.getFieldErrors(fieldName);
      combinedErrors.push(...errors);
    });
    return combinedErrors;
  }

  hasAnyFieldErrors(fieldNames: string[]): boolean {
    return fieldNames.some((fieldName: string): boolean => this.hasFieldErrors(fieldName));
  }

  getBasicFieldErrors(): string[] {
    const basicFieldNames: string[] = this.basicFields.map(
      (field: IDialogFieldConfig): string => field.name,
    );
    return this.getCombinedFieldErrors(basicFieldNames);
  }

  hasBasicFieldErrors(): boolean {
    const basicFieldNames: string[] = this.basicFields.map(
      (field: IDialogFieldConfig): string => field.name,
    );
    return this.hasAnyFieldErrors(basicFieldNames);
  }

  ngOnInit(): void {
    // Load configuration from a registry
    this.dialogConfiguration = this.registry.getConfiguration(this.elementType);

    // Build form
    this.form = this.formBuilder.buildForm(this.elementType);

    // Apply default values from registry
    this.applyRegistryDefaults();

    this.setupFormValidation();
    this.setupValueChangeTracking();

    // Setup enhanced validation if enabled
    if (this.enableEnhancedValidation) {
      this.setupEnhancedValidation();
    }

    // Watch for changes in custom validation rules
    this.form.get('customValidationRules')?.valueChanges.subscribe((): void => {
      this.applyCustomValidationRules();
    });

    setTimeout((): void => {
      this.performEnhancedValidation();
      this.cdr.markForCheck();
    }, 0);
  }

  onDialogShow(): void {
    this.isInitializing = true;
    this.userHasInteracted = false;
    this.hasUnsavedChanges = false;
    this.formErrors = {};
    this.clearValidationState();

    if (this.control) {
      this.patchFormValues();
    } else {
      this.setDefaultValues();
    }

    // Store initial form state after a short delay to ensure all values are set
    setTimeout(() => {
      this.captureInitialFormState();
      this.isInitializing = false;
      this.performEnhancedValidation();
      this.applyCustomValidationRules();
      this.cdr.markForCheck();
    }, 100);
  }

  /**
   * Enhanced save with validation
   */
  onSave(): void {
    // Perform enhanced validation if enabled
    if (this.enableEnhancedValidation) {
      this.performEnhancedValidation();

      if (!this.validationResult?.valid) {
        this.displayValidationErrors();
        return;
      }
    }

    // Fallback to basic form validation
    if (this.form.invalid) {
      this.markAllAsTouched();
      this.showValidationErrors();
      return;
    }

    this.isSaving = true;

    try {
      const result: T = this.buildResult();
      this.save.emit(result);
      this.hasUnsavedChanges = false;
      this.userHasInteracted = false;
      this.hideDialog();
    } catch (error) {
      console.error('Error saving dialog:', error);
      this.isSaving = false;
    }
  }

  /**
   * Enhanced hideDialog with proper PrimeNG confirmation
   */
  async hideDialog(): Promise<void> {
    if (this.hasUnsavedChanges && this.userHasInteracted && !this.isSaving) {
      const shouldClose = await this.dialogConfirmationService.confirmUnsavedChanges();
      if (!shouldClose) {
        return; // User chose to stay
      }
    }

    this.forceClose();
  }

  /**
   * Cancel dialog without saving - now uses proper confirmation
   */
  onCancel(): void {
    this.hideDialog();
  }

  /**
   * Show the save preset dialog
   */
  showSavePresetDialog(): void {
    if (this.form.invalid) {
      this.markAllAsTouched();
      this.showValidationErrors();
      this.toastManager.error('Please fix form errors before saving as a preset');
      return;
    }
    this.savePresetDialogVisible = true;
  }

  /**
   * Show the load preset dialog
   */
  showLoadPresetDialog(): void {
    this.loadPresetDialogVisible = true;
  }

  /**
   * Save the current configuration as a preset
   */
  async onSavePreset(event: {
    name: string;
    description: string;
    configuration: any;
  }): Promise<void> {
    try {
      const presetConfiguration: IPresetConfiguration = this.getConfigurationForPreset();

      if (!this.presetManager.validatePresetConfiguration(presetConfiguration, this.elementType)) {
        this.toastManager.error('Invalid configuration for preset');
        return;
      }

      await this.presetManager.savePreset(
        this.elementType,
        presetConfiguration,
        event.name,
        event.description,
      );

      this.savePresetDialogVisible = false;
    } catch (error) {
      console.error('Error saving preset:', error);
    }
  }

  /**
   * Load a preset configuration
   */
  async onLoadPreset(preset: Preset): Promise<void> {
    try {
      // If there are unsaved changes, confirm before loading preset
      if (this.hasUnsavedChanges && this.userHasInteracted) {
        const shouldProceed = await this.dialogConfirmationService.confirm({
          message: 'Loading a preset will overwrite your current changes. Do you want to continue?',
          header: 'Load Preset',
          icon: 'pi pi-folder-open',
          acceptLabel: 'Load Preset',
          rejectLabel: 'Cancel',
        });

        if (!shouldProceed) {
          return;
        }
      }

      this.isInitializing = true; // Prevent marking as unsaved changes
      this.presetManager.loadPresetIntoComponent(preset, this);
      this.loadPresetDialogVisible = false;

      // After loading preset, capture a new initial state and reset change tracking
      setTimeout(() => {
        this.captureInitialFormState();
        this.hasUnsavedChanges = false;
        this.userHasInteracted = false;
        this.isInitializing = false;
        this.performEnhancedValidation();
        this.cdr.markForCheck();
      }, 100);
    } catch (error) {
      this.isInitializing = false;
      console.error('Error loading preset:', error);
    }
  }

  /**
   * Handle preset deletion
   */
  onPresetDeleted(presetId: string): void {
    this.presetManager.deletePreset(presetId);
  }

  // Abstract methods
  abstract getConfigurationForPreset(): IPresetConfiguration;

  abstract applyPresetConfiguration(config: IPresetConfiguration): void;

  /**
   * Get combined validation tab fields (both standard and custom validation)
   */
  protected getCombinedValidationTabFields(): string[] {
    return [...this.getValidationTabFields(), ...this.getCustomValidationTabFields()];
  }

  /**
   * Get field names for the custom validation tab
   */
  protected getCustomValidationTabFields(): string[] {
    return ['customValidationRules'];
  }

  protected abstract buildResult(): T;

  protected abstract patchFormValues(): void;

  /**
   * Enhanced validation for both standard and custom validation rules
   */
  protected performEnhancedValidation(): void {
    if (!this.enableEnhancedValidation) return;

    // Perform standard validation
    const formData: any = this.form.value;
    this.validationResult = this.validationService.validateConfiguration(
      this.elementType,
      formData,
    );

    // Add custom validation rule validation
    const customValidationSummary = this.validateCustomValidationRules();

    // Merge custom validation errors with standard validation
    if (!customValidationSummary.valid) {
      if (!this.validationResult) {
        this.validationResult = {
          valid: false,
          errors: [],
          warnings: [],
        };
      }

      // Add custom validation errors
      customValidationSummary.errors.forEach((error) => {
        this.validationResult!.errors.push({
          field: 'customValidationRules',
          code: 'CUSTOM_VALIDATION_ERROR',
          message: error,
          severity: 'error',
        });
      });

      this.validationResult.valid = false;
    }

    this.updateFieldErrors();
    this.formMessages = this.getValidationMessages();

    this.cdr.markForCheck();
  }

  /**
   * Apply custom validation rules to the form
   */
  protected applyCustomValidationRules(): void {
    const rules = this.form.get('customValidationRules')?.value as CustomValidationRule[];

    if (rules && rules.length > 0) {
      const context: Partial<CustomValidationContext> = {
        formData: this.form.value,
        elementType: this.elementType.toString(),
      };

      // Apply custom validators to main form fields
      this.basicFields.forEach((field: IDialogFieldConfig): void => {
        const control = this.form.get(field.name);
        if (control) {
          const customValidators: ValidatorFn[] = this.customValidationService.createValidators(
            rules,
            {
              ...context,
              controlName: field.name,
            },
          );

          // Add custom validators to existing validators
          const existingValidators: ValidatorFn[] = control.validator ? [control.validator] : [];
          control.setValidators([...existingValidators, ...customValidators]);
          control.updateValueAndValidity();
        }
      });
    }
  }

  // The rest of the methods remain the same...
  protected onFormValueChange(): void {
    // Mark that the user has interacted if not initializing
    if (!this.isInitializing) {
      this.userHasInteracted = true;
    }

    // Check for real changes
    this.detectRealChanges();

    // Automatically trigger enhanced validation if enabled
    if (this.enableEnhancedValidation) {
      this.performEnhancedValidation();
    }
  }

  protected applyPresetBehaviors(config: IPresetConfiguration): void {
    this.presetManager.applyPresetBehaviors(this.form, this.elementType, config);
  }

  /**
   * Utility methods for child classes
   */
  protected formatEnumLabel(value: string): string {
    return value
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  protected sanitizeName(label: string): string {
    return label
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
  }

  protected setDefaultValues(): void {
    this.form.reset();
    this.applyRegistryDefaults();

    setTimeout((): void => {
      this.performEnhancedValidation();
      this.cdr.markForCheck();
    }, 0);
  }

  /**
   * Check if any fields in a tab have errors
   */
  protected hasTabErrors(fieldNames: string[]): boolean {
    if (!this.enableEnhancedValidation || !this.validationResult) {
      return this.hasAnyFieldErrors(fieldNames);
    }

    return this.validationResult.errors.some(
      (error: IValidationError): boolean =>
        fieldNames.includes(error.field) && error.severity === 'error',
    );
  }

  /**
   * Get error count for specific fields
   */
  protected getTabErrorCount(fieldNames: string[]): number {
    if (!this.enableEnhancedValidation || !this.validationResult) {
      return fieldNames.filter((field: string): boolean => this.hasFieldErrors(field)).length;
    }

    return this.validationResult.errors.filter(
      (error: IValidationError): boolean =>
        fieldNames.includes(error.field) && error.severity === 'error',
    ).length;
  }

  /**
   * Get a warning count for specific fields
   */
  protected getTabWarningCount(fieldNames: string[]): number {
    if (!this.enableEnhancedValidation || !this.validationResult) {
      return 0;
    }

    return this.validationResult.warnings.filter((warning: IValidationWarning): boolean =>
      fieldNames.includes(warning.field),
    ).length;
  }

  /**
   * Get tab-specific field names for validation
   */
  protected getBasicTabFields(): string[] {
    return this.basicFields.map((field: IDialogFieldConfig): string => field.name);
  }

  protected getBehaviorTabFields(): string[] {
    return this.behaviorOptions.map((option: IDialogBehaviorOption): string => option.controlName);
  }

  /**
   * Override the base getValidationTabFields to be more specific
   */
  protected getValidationTabFields(): string[] {
    // Standard validation fields based on element type
    const commonFields: string[] = [];

    // Add fields based on validation type
    if (this.form.get('minLength')) commonFields.push('minLength');
    if (this.form.get('maxLength')) commonFields.push('maxLength');
    if (this.form.get('pattern')) commonFields.push('pattern');
    if (this.form.get('min')) commonFields.push('min');
    if (this.form.get('max')) commonFields.push('max');
    if (this.form.get('minDate')) commonFields.push('minDate');
    if (this.form.get('maxDate')) commonFields.push('maxDate');
    if (this.form.get('step')) commonFields.push('step');

    return commonFields;
  }

  protected getAppearanceTabFields(): string[] {
    return ['labelStyle', 'labelPosition', 'size', 'variant', 'iconClass', 'iconPosition'];
  }

  protected getOptionsTabFields(): string[] {
    return ['options', 'optionLabel', 'optionValue', 'optionGroupLabel', 'optionGroupChildren'];
  }

  /**
   * Get validation summary for display in dialog footer or tabs
   */
  protected getValidationSummary(): {
    valid: boolean;
    errorCount: number;
    warningCount: number;
    criticalErrors: string[];
  } {
    if (!this.validationResult) {
      return {
        valid: this.form.valid,
        errorCount: 0,
        warningCount: 0,
        criticalErrors: [],
      };
    }

    const criticalErrors: string[] = this.validationResult.errors
      .filter((error: IValidationError): boolean => error.severity === 'error')
      .map((error: IValidationError): string => error.message)
      .slice(0, 3);

    return {
      valid: this.validationResult.valid,
      errorCount: this.validationResult.errors.length,
      warningCount: this.validationResult.warnings.length,
      criticalErrors,
    };
  }

  /**
   * Check if the dialog is ready for save (no critical errors)
   */
  protected isReadyForSave(): boolean {
    const summary = this.getValidationSummary();
    return summary.valid && this.form.valid;
  }

  /**
   * Get reference to custom validation component (implement in child components)
   */
  protected getCustomValidationComponent(): any {
    // Child components can override this to return a reference to the custom validation component
    // This allows for direct validation calls
    return null;
  }

  /**
   * Validate custom validation rules configuration
   */
  private validateCustomValidationRules(): { valid: boolean; errors: string[] } {
    const customValidationComponent = this.getCustomValidationComponent();

    if (customValidationComponent) {
      return customValidationComponent.validateCustomRules();
    }

    // Fallback validation if component not available
    const rules = this.form.get('customValidationRules')?.value;
    if (!rules || !Array.isArray(rules)) {
      return { valid: true, errors: [] };
    }

    const errors: string[] = [];

    rules.forEach((rule: any, index: number) => {
      if (!rule.name || rule.name.trim().length < 3) {
        errors.push(`Rule ${index + 1}: Name must be at least 3 characters`);
      }

      if (!rule.errorMessage || rule.errorMessage.trim().length === 0) {
        errors.push(`Rule ${index + 1}: Error message is required`);
      }

      // Type-specific validation
      switch (rule.type) {
        case 'regex':
          if (!rule.pattern) {
            errors.push(`Rule ${index + 1}: Regex pattern is required`);
          } else {
            try {
              new RegExp(rule.pattern);
            } catch {
              errors.push(`Rule ${index + 1}: Invalid regex pattern`);
            }
          }
          break;

        case 'range':
          if (rule.minValue != null && rule.maxValue != null && rule.minValue >= rule.maxValue) {
            errors.push(`Rule ${index + 1}: Minimum value must be less than maximum value`);
          }
          break;

        case 'custom':
          if (!rule.customFunction || rule.customFunction.trim().length === 0) {
            errors.push(`Rule ${index + 1}: Custom function is required`);
          }
          break;

        case 'dependency':
          if (!rule.dependsOn || rule.dependsOn.trim().length === 0) {
            errors.push(`Rule ${index + 1}: Dependency field is required`);
          }
          break;
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Force close without confirmation
   */
  private forceClose(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.resetForm();
  }

  /**
   * Enhanced change detection - only track real user changes
   */
  private detectRealChanges(): void {
    if (this.isInitializing || !this.initialFormValue) {
      return;
    }

    const currentValue = this.form.value;
    const hasRealChanges = !this.deepEqual(this.initialFormValue, currentValue);

    if (hasRealChanges !== this.hasUnsavedChanges) {
      this.hasUnsavedChanges = hasRealChanges;
      this.cdr.markForCheck();
    }
  }

  /**
   * Capture initial form state for change detection
   */
  private captureInitialFormState(): void {
    this.initialFormValue = this.deepClone(this.form.value);
  }

  /**
   * Deep equality check for form values
   */
  private deepEqual(obj1: any, obj2: any): boolean {
    if (obj1 === obj2) return true;

    if (obj1 == null || obj2 == null) return obj1 === obj2;

    if (typeof obj1 !== typeof obj2) return false;

    if (typeof obj1 !== 'object') return obj1 === obj2;

    if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;

    if (Array.isArray(obj1)) {
      if (obj1.length !== obj2.length) return false;
      for (let i = 0; i < obj1.length; i++) {
        if (!this.deepEqual(obj1[i], obj2[i])) return false;
      }
      return true;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
      if (!keys2.includes(key)) return false;
      if (!this.deepEqual(obj1[key], obj2[key])) return false;
    }

    return true;
  }

  /**
   * Deep clone object
   */
  private deepClone(obj: any): any {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (Array.isArray(obj)) return obj.map((item) => this.deepClone(item));

    const cloned: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = this.deepClone(obj[key]);
      }
    }
    return cloned;
  }

  /**
   * Set up enhanced validation tracking
   */
  private setupEnhancedValidation(): void {
    // Track field changes for real-time validation
    Object.keys(this.form.controls).forEach((fieldName: string): void => {
      const control: AbstractControl<any, any> | null = this.form.get(fieldName);
      if (control) {
        control.valueChanges.subscribe((): void => {
          setTimeout((): void => {
            this.updateFieldErrors();
            this.cdr.markForCheck();
          }, 100);
        });
      }
    });
  }

  /**
   * Update field-specific errors from a validation result
   */
  private updateFieldErrors(): void {
    this.fieldErrors = {};

    if (this.validationResult?.errors) {
      this.validationResult.errors.forEach((error: IValidationError): void => {
        if (!this.fieldErrors[error.field]) {
          this.fieldErrors[error.field] = [];
        }
        this.fieldErrors[error.field].push(this.validationService.getErrorMessage(error));
      });
    }
  }

  /**
   * Display validation errors to the user
   */
  private displayValidationErrors(): void {
    this.markAllAsTouched();

    const messages: string[] = this.getValidationMessages();
    if (messages.length > 0) {
      const criticalErrors: string[] = messages
        .filter((msg: string): boolean => msg.includes('❌'))
        .slice(0, 3);
      if (criticalErrors.length > 0) {
        this.toastManager.error(`Please fix the following errors:\n${criticalErrors.join('\n')}`);
      }
    }
  }

  /**
   * Clear validation state
   */
  private clearValidationState(): void {
    this.validationResult = null;
    this.fieldErrors = {};
    this.formMessages = [];
  }

  private applyRegistryDefaults(): void {
    if (this.dialogConfiguration.defaultValues) {
      const defaultsToApply: any = {};

      Object.keys(this.dialogConfiguration.defaultValues).forEach((key: string): void => {
        if (this.form.get(key)) {
          defaultsToApply[key] = this.dialogConfiguration.defaultValues[key];
        }
      });

      this.form.patchValue(defaultsToApply);
    }
  }

  /**
   * Set up validation error tracking
   */
  private setupFormValidation(): void {
    Object.keys(this.form.controls).forEach((key: string): void => {
      const control: AbstractControl<any, any> | null = this.form.get(key);
      if (control) {
        control.statusChanges
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((): void => this.updateFieldError(key, control));
      }
    });
  }

  /**
   * Track form value changes with proper debouncing and change detection
   */
  private setupValueChangeTracking(): void {
    this.form.valueChanges
      .pipe(
        startWith(this.form.value),
        debounceTime(this.dialogConfiguration.previewDebounceTime || 300),
        distinctUntilChanged((prev, curr) => this.deepEqual(prev, curr)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((): void => {
        this.onFormValueChange();
        this.cdr.markForCheck();
      });
  }

  /**
   * Update validation error for a specific field
   */
  private updateFieldError(field: string, control: any): void {
    if (control.errors && control.touched) {
      const errorKey: string = Object.keys(control.errors)[0];
      this.formErrors[field] = this.getErrorMessage(field, errorKey, control.errors[errorKey]);
    } else {
      delete this.formErrors[field];
    }
  }

  /**
   * Get a human-readable error message
   */
  private getErrorMessage(field: string, errorKey: string, errorValue: any): string {
    const messages: Record<string, string> = {
      required: `${field} is required`,
      minlength: `${field} must be at least ${errorValue.requiredLength} characters`,
      maxlength: `${field} cannot exceed ${errorValue.requiredLength} characters`,
      pattern: `${field} has an invalid format`,
      min: `${field} must be at least ${errorValue.min}`,
      max: `${field} cannot exceed ${errorValue.max}`,
    };

    return messages[errorKey] || `${field} is invalid`;
  }

  /**
   * Show all validation errors
   */
  private showValidationErrors(): void {
    Object.keys(this.form.controls).forEach((key: string): void => {
      const control: AbstractControl<any, any> | null = this.form.get(key);
      if (control && control.errors) {
        this.updateFieldError(key, control);
      }
    });
  }

  /**
   * Mark all form fields as touched
   */
  private markAllAsTouched(): void {
    Object.keys(this.form.controls).forEach((key: string): void => {
      this.form.get(key)?.markAsTouched();
    });
  }

  /**
   * Reset form and errors
   */
  private resetForm(): void {
    this.form.reset();
    this.formErrors = {};
    this.hasUnsavedChanges = false;
    this.userHasInteracted = false;
    this.isSaving = false;
    this.initialFormValue = null;
    this.clearValidationState();
  }
}
