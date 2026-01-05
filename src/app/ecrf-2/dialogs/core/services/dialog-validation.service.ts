import { Injectable } from '@angular/core';
import { FormElementType } from '../../../core/models/enums/form.enums';
import {
  IValidationError,
  IValidationResult,
  ValidationRule, // Changed from IValidationRule to ValidationRule
  IValidationWarning,
} from '../../../core/models/interfaces/validation.interfaces';

/**
 * Context-aware validation service
 */
@Injectable({
  providedIn: 'root',
})
export class DialogValidationService {
  private validationRules: Map<FormElementType, ValidationRule[]> = new Map<
    FormElementType,
    ValidationRule[]
  >();

  constructor() {
    this.registerDefaultRules();
  }

  /**
   * Validate form configuration
   */
  validateConfiguration(elementType: FormElementType, formData: any): IValidationResult {
    const rules: ValidationRule[] = this.validationRules.get(elementType) || [];
    const errors: IValidationError[] = [];
    const warnings: IValidationWarning[] = [];

    for (const rule of rules) {
      try {
        const result = rule.validate(formData);
        if (result.errors) {
          errors.push(...result.errors);
        }
        if (result.warnings) {
          warnings.push(...result.warnings);
        }
      } catch (error: any) {
        errors.push({
          field: 'general',
          code: 'VALIDATION_ERROR',
          message: `Validation rule failed: ${error.message}`,
          severity: 'error',
          context: { rule: rule.name, error },
        });
      }
    }

    return {
      valid: errors.filter((e: IValidationError): boolean => e.severity === 'error').length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Register validation rule for an element type
   */
  registerRule(elementType: FormElementType, rule: ValidationRule): void {
    if (!this.validationRules.has(elementType)) {
      this.validationRules.set(elementType, []);
    }
    this.validationRules.get(elementType)?.push(rule);
  }

  /**
   * Get a human-readable error message
   */
  getErrorMessage(error: IValidationError): string {
    const templates: Record<string, string> = {
      REQUIRED: `${error.field} is required`,
      MIN_LENGTH: `${error.field} must be at least ${error.context?.min} characters`,
      MAX_LENGTH: `${error.field} cannot exceed ${error.context?.max} characters`,
      MIN_VALUE: `${error.field} must be at least ${error.context?.min}`,
      MAX_VALUE: `${error.field} cannot exceed ${error.context?.max}`,
      INVALID_PATTERN: `${error.field} format is invalid`,
      RANGE_ERROR: `Minimum value cannot be greater than maximum value`,
      DUPLICATE_OPTIONS: `Duplicate option values are not allowed`,
      MISSING_OPTIONS: `At least ${error.context?.min} option(s) required`,
    };

    return templates[error.code] || error.message || `${error.field} is invalid`;
  }

  private registerDefaultRules(): void {
    // Input Text Rules
    this.registerRule(FormElementType.INPUT_TEXT, {
      name: 'inputTextValidation',
      validate: (data: any) => {
        const errors: IValidationError[] = [];
        const warnings: IValidationWarning[] = [];

        // Label validation
        if (!data.label?.trim()) {
          errors.push({
            field: 'label',
            code: 'REQUIRED',
            message: 'Label is required',
            severity: 'error',
          });
        }

        // Length validation
        if (data.minLength && data.maxLength && data.minLength > data.maxLength) {
          errors.push({
            field: 'maxLength',
            code: 'RANGE_ERROR',
            message: 'Maximum length must be greater than minimum length',
            severity: 'error',
            context: { min: data.minLength, max: data.maxLength },
          });
        }

        // Pattern validation
        if (data.pattern) {
          try {
            new RegExp(data.pattern);
          } catch {
            errors.push({
              field: 'pattern',
              code: 'INVALID_PATTERN',
              message: 'Invalid regular expression pattern',
              severity: 'error',
            });
          }
        }

        // Accessibility warnings
        if (!data.helperText && data.required) {
          warnings.push({
            field: 'helperText',
            message: 'Consider adding helper text for required fields',
            suggestion: 'Add descriptive help text to improve accessibility',
          });
        }

        return { errors, warnings };
      },
    });

    this.registerRule(FormElementType.TEXT_AREA, {
      name: 'textareaValidation',
      validate: (data: any) => {
        const errors: IValidationError[] = [];
        const warnings: IValidationWarning[] = [];

        // Label validation
        if (!data.label?.trim()) {
          errors.push({
            field: 'label',
            code: 'REQUIRED',
            message: 'Label is required',
            severity: 'error',
          });
        }

        // Length validation
        if (data.minLength && data.maxLength && data.minLength > data.maxLength) {
          errors.push({
            field: 'maxLength',
            code: 'RANGE_ERROR',
            message: 'Maximum length must be greater than minimum length',
            severity: 'error',
            context: { min: data.minLength, max: data.maxLength },
          });
        }

        // Dimension validation
        if (data.rows && data.rows < 1) {
          errors.push({
            field: 'rows',
            code: 'MIN_VALUE',
            message: 'Rows must be at least 1',
            severity: 'error',
            context: { min: 1 },
          });
        }

        if (data.rows && data.rows > 50) {
          warnings.push({
            field: 'rows',
            message: 'Very large row count may impact user experience',
            suggestion: 'Consider using fewer rows or enabling auto-resize',
          });
        }

        if (data.cols && data.cols < 1) {
          errors.push({
            field: 'cols',
            code: 'MIN_VALUE',
            message: 'Columns must be at least 1',
            severity: 'error',
            context: { min: 1 },
          });
        }

        // Auto-resize logic validation
        if (data.autoResize && (data.rows > 3 || data.cols)) {
          warnings.push({
            field: 'autoResize',
            message: 'Auto-resize is enabled with fixed dimensions',
            suggestion: 'Auto-resize works best without fixed row/column constraints',
          });
        }

        // Accessibility warnings
        if (!data.helperText && data.required) {
          warnings.push({
            field: 'helperText',
            message: 'Consider adding helper text for required fields',
            suggestion: 'Add descriptive help text to improve accessibility',
          });
        }

        // Usability suggestions
        if (!data.placeholder) {
          warnings.push({
            field: 'placeholder',
            message: 'Consider adding placeholder text',
            suggestion: 'Placeholder text helps users understand what to enter',
          });
        }

        return { errors, warnings };
      },
    });

    // Options-based controls validation
    this.registerRule(FormElementType.MULTISELECT, {
      name: 'multiselectValidation',
      validate: (data: any) => {
        const errors: IValidationError[] = [];
        const warnings: IValidationWarning[] = [];

        // Label validation
        if (!data.label?.trim()) {
          errors.push({
            field: 'label',
            code: 'REQUIRED',
            message: 'Label is required',
            severity: 'error',
          });
        }

        // Options validation - inherited from options-based controls
        if (!data.options || data.options.length === 0) {
          errors.push({
            field: 'options',
            code: 'MISSING_OPTIONS',
            message: 'At least one option is required',
            severity: 'error',
            context: { min: 1 },
          });
        } else {
          // Check for duplicate values
          const values = data.options.map((opt: any) => opt.value);
          const uniqueValues = new Set(values);
          if (values.length !== uniqueValues.size) {
            errors.push({
              field: 'options',
              code: 'DUPLICATE_OPTIONS',
              message: 'Option values must be unique',
              severity: 'error',
            });
          }

          // Check for empty labels
          const emptyLabels = data.options.filter((opt: any) => !opt.label?.trim());
          if (emptyLabels.length > 0) {
            warnings.push({
              field: 'options',
              message: 'Some options have empty labels',
              suggestion: 'Consider adding descriptive labels for all options',
            });
          }

          // Too many options warnings
          if (data.options.length > 20) {
            warnings.push({
              field: 'options',
              message: 'Large number of options may overwhelm users',
              suggestion: 'Consider grouping options or using a different approach for better UX',
            });
          }
        }

        // Display mode validation
        if (data.display === 'CHIP') {
          if (!data.maxSelectedLabels || data.maxSelectedLabels < 1) {
            warnings.push({
              field: 'maxSelectedLabels',
              message: 'Chip display mode should specify max selected labels',
              suggestion: 'Set a reasonable limit (e.g., 3-5) to prevent UI overflow',
            });
          }

          if (data.maxSelectedLabels > 10) {
            warnings.push({
              field: 'maxSelectedLabels',
              message: 'Too many chip labels may clutter the interface',
              suggestion: 'Consider using comma display for large selections',
            });
          }
        }

        // Group validation
        if (data.group) {
          if (!data.optionGroupLabel?.trim()) {
            errors.push({
              field: 'optionGroupLabel',
              code: 'REQUIRED',
              message: 'Group label field is required when grouping is enabled',
              severity: 'error',
            });
          }

          if (!data.optionGroupChildren?.trim()) {
            errors.push({
              field: 'optionGroupChildren',
              code: 'REQUIRED',
              message: 'Group children field is required when grouping is enabled',
              severity: 'error',
            });
          }

          // Warning if simple options are used with grouping
          if (data.options && data.options.length > 0) {
            const hasSimpleOptions = data.options.some(
              (opt: any) => typeof opt === 'object' && !opt[data.optionGroupChildren],
            );

            if (hasSimpleOptions) {
              warnings.push({
                field: 'group',
                message: 'Grouping is enabled but options appear to be simple objects',
                suggestion: 'Ensure your data structure matches the grouping configuration',
              });
            }
          }
        }

        // Filter validation
        if (data.filter && (!data.options || data.options.length < 5)) {
          warnings.push({
            field: 'filter',
            message: 'Filter is most useful with larger option sets',
            suggestion: 'Consider disabling filter for small option lists (< 5 items)',
          });
        }

        // Toggle all validation
        if (!data.showToggleAll && data.options && data.options.length > 10) {
          warnings.push({
            field: 'showToggleAll',
            message: 'Toggle All can improve UX with many options',
            suggestion: 'Consider enabling Toggle All for better user experience with large lists',
          });
        }

        // Option label/value field validation
        if (data.optionLabel && data.optionValue && data.optionLabel === data.optionValue) {
          warnings.push({
            field: 'optionValue',
            message: 'Option label and value fields are the same',
            suggestion:
              'Consider using different fields for label and value for better data handling',
          });
        }

        // Accessibility warnings
        if (!data.helperText && data.required) {
          warnings.push({
            field: 'helperText',
            message: 'Consider adding helper text for required multiselect fields',
            suggestion: 'Add descriptive help text to improve accessibility and user guidance',
          });
        }

        // Multiple selection validation
        if (!data.multiple) {
          warnings.push({
            field: 'multiple',
            message: 'Multiselect should typically allow multiple selections',
            suggestion:
              'Consider using a regular Select component if only single selection is needed',
          });
        }

        // Placeholder validation
        if (!data.placeholder) {
          warnings.push({
            field: 'placeholder',
            message: 'Consider adding placeholder text',
            suggestion: 'Placeholder text helps users understand they can select multiple options',
          });
        }

        // Performance warnings
        if (data.options && data.options.length > 100) {
          warnings.push({
            field: 'options',
            message: 'Very large option lists may impact performance',
            suggestion:
              'Consider implementing virtual scrolling or pagination for better performance',
          });
        }

        // UX recommendations based on option count
        if (data.options && data.options.length > 50 && !data.filter) {
          warnings.push({
            field: 'filter',
            message: 'Large option lists benefit from filtering',
            suggestion: 'Enable filter to help users find options quickly',
          });
        }

        // Display mode recommendations
        if (!data.display) {
          warnings.push({
            field: 'display',
            message: 'Consider specifying a display mode',
            suggestion: 'Choose between COMMA (compact) or CHIP (visual) display modes',
          });
        }

        // Size and variant recommendations
        if (data.options && data.options.length > 10 && data.size === 'SMALL') {
          warnings.push({
            field: 'size',
            message: 'Small size may be difficult to use with many options',
            suggestion: 'Consider using NORMAL or LARGE size for better usability',
          });
        }

        // Grouping logic validation
        if (data.group && data.optionGroupLabel && data.optionGroupChildren) {
          // Check if the field names make sense
          const commonLabelFields = ['label', 'name', 'title', 'text', 'category', 'group'];
          const commonChildrenFields = ['children', 'items', 'options', 'values', 'list'];

          const labelFieldValid = commonLabelFields.some((field) =>
            data.optionGroupLabel.toLowerCase().includes(field),
          );
          const childrenFieldValid = commonChildrenFields.some((field) =>
            data.optionGroupChildren.toLowerCase().includes(field),
          );

          if (!labelFieldValid) {
            warnings.push({
              field: 'optionGroupLabel',
              message: 'Group label field name may not match common patterns',
              suggestion:
                'Ensure the field name matches your data structure (e.g., "label", "name", "category")',
            });
          }

          if (!childrenFieldValid) {
            warnings.push({
              field: 'optionGroupChildren',
              message: 'Group children field name may not match common patterns',
              suggestion:
                'Ensure the field name matches your data structure (e.g., "children", "items", "options")',
            });
          }
        }

        // Selection limit recommendations
        if (data.maxSelectedLabels && data.maxSelectedLabels === 1 && data.multiple) {
          warnings.push({
            field: 'maxSelectedLabels',
            message: 'Max selected labels of 1 with multiple selection enabled',
            suggestion:
              'Consider if single selection would be more appropriate, or increase the limit',
          });
        }

        // Toggle all with grouping
        if (data.showToggleAll && data.group) {
          warnings.push({
            field: 'showToggleAll',
            message: 'Toggle All behavior may be unclear with grouped options',
            suggestion: 'Consider how Toggle All should work with grouped data structure',
          });
        }

        // Required field with no default selection
        if (data.required && (!data.options || data.options.every((opt: any) => !opt.selected))) {
          warnings.push({
            field: 'required',
            message: 'Required field has no default selection',
            suggestion: 'Consider pre-selecting some options or providing clear guidance to users',
          });
        }

        return { errors, warnings };
      },
    });

    // Number input validation
    this.registerRule(FormElementType.INPUT_NUMBER, {
      name: 'enhancedNumberInputValidation',
      validate: (data: any) => {
        const errors: IValidationError[] = [];
        const warnings: IValidationWarning[] = [];

        // Label validation
        if (!data.label?.trim()) {
          errors.push({
            field: 'label',
            code: 'REQUIRED',
            message: 'Label is required',
            severity: 'error',
          });
        }

        // Min/Max range validation
        if (data.min !== null && data.max !== null && data.min > data.max) {
          errors.push({
            field: 'max',
            code: 'RANGE_ERROR',
            message: 'Maximum value must be greater than minimum value',
            severity: 'error',
            context: { min: data.min, max: data.max },
          });
        }

        // Step validation
        if (data.step !== null && data.step !== undefined) {
          if (data.step <= 0) {
            errors.push({
              field: 'step',
              code: 'MIN_VALUE',
              message: 'Step must be greater than 0',
              severity: 'error',
              context: { min: 0 },
            });
          }

          // Check if step makes sense with min/max range
          if (data.min !== null && data.max !== null && data.step > data.max - data.min) {
            warnings.push({
              field: 'step',
              message: 'Step value is larger than the min/max range',
              suggestion: 'Consider reducing the step value for better user experience',
            });
          }
        }

        // Fraction digits validation
        if (data.minFractionDigits !== null && data.maxFractionDigits !== null) {
          if (data.minFractionDigits > data.maxFractionDigits) {
            errors.push({
              field: 'maxFractionDigits',
              code: 'RANGE_ERROR',
              message:
                'Maximum fraction digits must be greater than or equal to minimum fraction digits',
              severity: 'error',
              context: { min: data.minFractionDigits, max: data.maxFractionDigits },
            });
          }
        }

        if (data.minFractionDigits > 10) {
          warnings.push({
            field: 'minFractionDigits',
            message: 'High minimum fraction digits may impact readability',
            suggestion: 'Consider using fewer decimal places for better user experience',
          });
        }

        if (data.maxFractionDigits > 10) {
          warnings.push({
            field: 'maxFractionDigits',
            message: 'High maximum fraction digits may impact readability',
            suggestion: 'Consider using fewer decimal places for better user experience',
          });
        }

        // Mode-specific validation
        if (data.mode === 'CURRENCY') {
          if (!data.prefix && !data.suffix) {
            warnings.push({
              field: 'mode',
              message: 'Currency mode typically needs a currency symbol',
              suggestion: 'Consider adding a prefix (e.g., "$") or suffix for currency display',
            });
          }
        }

        // Prefix/Suffix validation
        if (data.prefix && data.suffix) {
          warnings.push({
            field: 'suffix',
            message: 'Using both prefix and suffix may clutter the display',
            suggestion: 'Consider using either prefix or suffix, but not both',
          });
        }

        if (data.prefix && data.prefix.length > 5) {
          warnings.push({
            field: 'prefix',
            message: 'Long prefix may impact input usability',
            suggestion: 'Keep prefix short (1-3 characters) for better user experience',
          });
        }

        if (data.suffix && data.suffix.length > 5) {
          warnings.push({
            field: 'suffix',
            message: 'Long suffix may impact input usability',
            suggestion: 'Keep suffix short (1-3 characters) for better user experience',
          });
        }

        // Grouping validation
        if (data.useGrouping === false && (data.min > 9999 || data.max > 9999)) {
          warnings.push({
            field: 'useGrouping',
            message: 'Large numbers benefit from thousand separators',
            suggestion: 'Consider enabling grouping for better readability of large numbers',
          });
        }

        // Range reasonableness checks
        if (data.min !== null && data.max !== null) {
          const range = data.max - data.min;
          if (range > 1000000) {
            warnings.push({
              field: 'max',
              message: 'Very large number range may impact user experience',
              suggestion: 'Consider if such a wide range is necessary for your use case',
            });
          }

          if (range < 1 && data.step && data.step >= range) {
            warnings.push({
              field: 'step',
              message: 'Step size is too large for the specified range',
              suggestion: 'Reduce step size to allow meaningful increments within the range',
            });
          }
        }

        // Negative number handling
        if (data.min !== null && data.min < 0 && data.mode === 'CURRENCY') {
          warnings.push({
            field: 'min',
            message: 'Currency fields with negative values may need special formatting',
            suggestion: 'Consider how negative currency values should be displayed to users',
          });
        }

        // Decimal mode with integer constraints
        if (data.mode === 'DECIMAL' && data.maxFractionDigits === 0) {
          warnings.push({
            field: 'maxFractionDigits',
            message: 'Decimal mode with no fraction digits may confuse users',
            suggestion: 'Consider using integer constraints or allowing decimal places',
          });
        }

        // Accessibility and UX warnings
        if (!data.helperText && data.required) {
          warnings.push({
            field: 'helperText',
            message: 'Consider adding helper text for required number fields',
            suggestion: 'Add descriptive help text to improve accessibility and user guidance',
          });
        }

        // Placeholder validation
        if (!data.placeholder && (data.min !== null || data.max !== null)) {
          warnings.push({
            field: 'placeholder',
            message: 'Consider adding placeholder text to show expected range',
            suggestion: `Add placeholder like "Enter value between ${data.min || 'any'} and ${data.max || 'any'}"`,
          });
        }

        // Complex formatting warnings
        if (data.prefix && data.suffix && data.useGrouping && data.maxFractionDigits > 2) {
          warnings.push({
            field: 'maxFractionDigits',
            message: 'Complex formatting may overwhelm users',
            suggestion: 'Simplify number formatting for better user experience',
          });
        }

        // Performance considerations for very precise decimals
        if (data.maxFractionDigits > 15) {
          warnings.push({
            field: 'maxFractionDigits',
            message: 'Very high precision may cause floating-point precision issues',
            suggestion: 'Consider if such high precision is actually needed',
          });
        }

        // Step increment usability
        if (data.step && data.step < 0.001) {
          warnings.push({
            field: 'step',
            message: 'Very small step increments may be difficult for users to control',
            suggestion: 'Consider using a larger step value for better usability',
          });
        }

        // Min/Max boundary recommendations
        if (data.min === 0 && data.step && data.step % 1 !== 0) {
          // Zero minimums with decimal steps
          warnings.push({
            field: 'min',
            message: 'Zero minimum with decimal steps may cause precision issues',
            suggestion: 'Consider setting a small positive minimum or using integer steps',
          });
        }

        return { errors, warnings };
      },
    });

    this.registerRule(FormElementType.CHECKBOX, {
      name: 'checkboxValidation',
      validate: (data: any) => {
        const errors: IValidationError[] = [];
        const warnings: IValidationWarning[] = [];

        // Label validation
        if (!data.label?.trim()) {
          errors.push({
            field: 'label',
            code: 'REQUIRED',
            message: 'Label is required',
            severity: 'error',
          });
        }

        // Mode-specific validation
        if (data.mode === 'GROUP') {
          // Group mode requires options
          if (!data.options || data.options.length === 0) {
            errors.push({
              field: 'options',
              code: 'MISSING_OPTIONS',
              message: 'At least one option is required for GROUP mode',
              severity: 'error',
              context: { min: 1 },
            });
          } else {
            // Check for duplicate values in group mode
            const values = data.options.map((opt: any) => opt.value);
            const uniqueValues = new Set(values);
            if (values.length !== uniqueValues.size) {
              errors.push({
                field: 'options',
                code: 'DUPLICATE_OPTIONS',
                message: 'Option values must be unique',
                severity: 'error',
              });
            }

            // Check for empty labels
            const emptyLabels = data.options.filter((opt: any) => !opt.label?.trim());
            if (emptyLabels.length > 0) {
              warnings.push({
                field: 'options',
                message: 'Some options have empty labels',
                suggestion: 'Consider adding descriptive labels for all options',
              });
            }
          }

          // Group title suggestion
          if (!data.groupTitle?.trim()) {
            warnings.push({
              field: 'groupTitle',
              message: 'Consider adding a group title for better organization',
              suggestion: 'A clear group title helps users understand related checkboxes',
            });
          }
        }

        // Binary mode with indeterminate state
        if (data.mode === 'BINARY' && data.indeterminate) {
          warnings.push({
            field: 'indeterminate',
            message: 'Indeterminate state may confuse users',
            suggestion:
              'Use indeterminate state sparingly, typically for parent-child relationships',
          });
        }

        // Accessibility warnings
        if (!data.helperText && data.required) {
          warnings.push({
            field: 'helperText',
            message: 'Consider adding helper text for required fields',
            suggestion: 'Add descriptive help text to improve accessibility',
          });
        }

        // Usability recommendations
        if (data.mode === 'GROUP' && data.options && data.options.length > 7) {
          warnings.push({
            field: 'options',
            message: 'Large number of options may overwhelm users',
            suggestion: 'Consider grouping options or using a different input type for better UX',
          });
        }

        return { errors, warnings };
      },
    });

    this.registerRule(FormElementType.DATE_PICKER, {
      name: 'datePickerValidation',
      validate: (data: any) => {
        const errors: IValidationError[] = [];
        const warnings: IValidationWarning[] = [];

        // Label validation
        if (!data.label?.trim()) {
          errors.push({
            field: 'label',
            code: 'REQUIRED',
            message: 'Label is required',
            severity: 'error',
          });
        }

        // Date format validation
        if (data.dateFormat) {
          const validDateFormats = [
            'mm/dd/yy',
            'dd/mm/yy',
            'yy-mm-dd',
            'mm-dd-yy',
            'dd-mm-yy',
            'mm/dd/yyyy',
            'dd/mm/yyyy',
            'yyyy-mm-dd',
            'mm-dd-yyyy',
            'dd-mm-yyyy',
          ];

          if (
            !validDateFormats.some((format) =>
              data.dateFormat.toLowerCase().includes(format.toLowerCase()),
            )
          ) {
            warnings.push({
              field: 'dateFormat',
              message: 'Date format may not be recognized',
              suggestion: 'Consider using standard formats like mm/dd/yy or dd/mm/yyyy',
            });
          }
        }

        // Date range validation
        if (data.minDate && data.maxDate) {
          const minDate = new Date(data.minDate);
          const maxDate = new Date(data.maxDate);

          if (minDate >= maxDate) {
            errors.push({
              field: 'maxDate',
              code: 'RANGE_ERROR',
              message: 'Maximum date must be after minimum date',
              severity: 'error',
              context: { minDate: data.minDate, maxDate: data.maxDate },
            });
          }

          // Check if date range is reasonable
          const daysDiff = Math.abs(maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
          if (daysDiff > 36500) {
            // More than 100 years
            warnings.push({
              field: 'maxDate',
              message: 'Very large date range may impact user experience',
              suggestion: 'Consider limiting the date range to a more reasonable period',
            });
          }
        }

        // Selection mode validation
        if (data.selectionMode === 'RANGE' && !data.placeholder) {
          warnings.push({
            field: 'placeholder',
            message: 'Range selection benefits from clear placeholder text',
            suggestion: 'Add placeholder like "Select start and end dates"',
          });
        }

        if (data.selectionMode === 'MULTIPLE' && !data.helperText) {
          warnings.push({
            field: 'helperText',
            message: 'Multiple selection may need explanation',
            suggestion: 'Add helper text explaining how to select multiple dates',
          });
        }

        // Time-related validation
        if (data.showTime) {
          if (!data.hourFormat) {
            warnings.push({
              field: 'hourFormat',
              message: 'Hour format should be specified when showing time',
              suggestion: 'Choose between 12-hour or 24-hour format',
            });
          }

          if (!data.dateFormat?.includes('h') && !data.dateFormat?.includes('H')) {
            warnings.push({
              field: 'dateFormat',
              message: 'Date format should include time when showTime is enabled',
              suggestion: 'Consider formats like "mm/dd/yy h:mm tt" for time display',
            });
          }
        }

        // Icon and UX validation
        if (!data.showIcon) {
          warnings.push({
            field: 'showIcon',
            message: 'Date picker icon improves user experience',
            suggestion: 'Consider enabling the calendar icon for better usability',
          });
        }

        // View validation
        if (data.view === 'YEAR' && (data.minDate || data.maxDate)) {
          const minYear = data.minDate ? new Date(data.minDate).getFullYear() : null;
          const maxYear = data.maxDate ? new Date(data.maxDate).getFullYear() : null;
          const currentYear = new Date().getFullYear();

          if (minYear && maxYear && maxYear - minYear > 50) {
            warnings.push({
              field: 'view',
              message: 'Year view with large range may be difficult to navigate',
              suggestion:
                'Consider using DATE view for better user experience with large date ranges',
            });
          }
        }

        // Accessibility warnings
        if (!data.helperText && data.required) {
          warnings.push({
            field: 'helperText',
            message: 'Consider adding helper text for required date fields',
            suggestion: 'Add descriptive help text to improve accessibility',
          });
        }

        // Usability suggestions
        if (!data.placeholder) {
          warnings.push({
            field: 'placeholder',
            message: 'Consider adding placeholder text',
            suggestion: 'Placeholder text helps users understand the expected date format',
          });
        }

        // Validation for past/future date restrictions
        if (data.minDate) {
          const minDate = new Date(data.minDate);
          const today = new Date();
          const daysDiff = Math.floor(
            (minDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
          );

          if (daysDiff > 365) {
            warnings.push({
              field: 'minDate',
              message: 'Minimum date is far in the future',
              suggestion: 'Ensure the minimum date range makes sense for your use case',
            });
          }
        }

        if (data.maxDate) {
          const maxDate = new Date(data.maxDate);
          const today = new Date();
          const daysDiff = Math.floor(
            (today.getTime() - maxDate.getTime()) / (1000 * 60 * 60 * 24),
          );

          if (daysDiff > 365) {
            warnings.push({
              field: 'maxDate',
              message: 'Maximum date is far in the past',
              suggestion: 'Ensure the maximum date range makes sense for your use case',
            });
          }
        }

        return { errors, warnings };
      },
    });

    this.registerRule(FormElementType.RADIO, {
      name: 'radioButtonValidation',
      validate: (data: any) => {
        const errors: IValidationError[] = [];
        const warnings: IValidationWarning[] = [];

        // Label validation
        if (!data.label?.trim()) {
          errors.push({
            field: 'label',
            code: 'REQUIRED',
            message: 'Label is required',
            severity: 'error',
          });
        }

        // Name validation (crucial for radio button groups)
        if (!data.name?.trim()) {
          errors.push({
            field: 'name',
            code: 'REQUIRED',
            message: 'Group name is required',
            severity: 'error',
          });
        } else {
          // Validate name format (should be valid HTML name attribute)
          const namePattern = /^[a-zA-Z][a-zA-Z0-9_-]*$/;
          if (!namePattern.test(data.name)) {
            warnings.push({
              field: 'name',
              message: 'Group name should be a valid identifier',
              suggestion:
                'Use letters, numbers, underscores, and hyphens only. Start with a letter.',
            });
          }

          // Check for common naming conflicts
          const reservedNames = ['submit', 'reset', 'button', 'form', 'input'];
          if (reservedNames.includes(data.name.toLowerCase())) {
            warnings.push({
              field: 'name',
              message: 'Group name conflicts with HTML reserved words',
              suggestion: 'Consider using a more specific name to avoid conflicts',
            });
          }
        }

        // Options validation
        if (!data.options || data.options.length === 0) {
          errors.push({
            field: 'options',
            code: 'MISSING_OPTIONS',
            message: 'At least two options are required for radio buttons',
            severity: 'error',
            context: { min: 2 },
          });
        } else {
          // Minimum options check
          if (data.options.length < 2) {
            warnings.push({
              field: 'options',
              message: 'Radio buttons typically need at least 2 options',
              suggestion: 'Add more options or consider using a checkbox for single yes/no choices',
            });
          }

          // Maximum options check for usability
          if (data.options.length > 8) {
            warnings.push({
              field: 'options',
              message: 'Large number of radio button options may overwhelm users',
              suggestion: 'Consider using a select dropdown for more than 8 options',
            });
          }

          // Check for duplicate values
          const values = data.options.map((opt: any) => opt.value);
          const uniqueValues = new Set(values);
          if (values.length !== uniqueValues.size) {
            errors.push({
              field: 'options',
              code: 'DUPLICATE_OPTIONS',
              message: 'Option values must be unique within the radio button group',
              severity: 'error',
            });
          }

          // Check for empty labels
          const emptyLabels = data.options.filter((opt: any) => !opt.label?.trim());
          if (emptyLabels.length > 0) {
            warnings.push({
              field: 'options',
              message: 'Some options have empty labels',
              suggestion: 'Add descriptive labels for all radio button options',
            });
          }

          // Check for very similar labels
          const labels = data.options.map((opt: any) => opt.label?.toLowerCase()?.trim());
          const similarLabels = labels.filter((label: any, index: any) =>
            labels.some(
              (otherLabel: any, otherIndex: any) =>
                index !== otherIndex &&
                label &&
                otherLabel &&
                (label === otherLabel || Math.abs(label.length - otherLabel.length) <= 2),
            ),
          );

          if (similarLabels.length > 0) {
            warnings.push({
              field: 'options',
              message: 'Some option labels are very similar',
              suggestion: 'Make option labels more distinct to avoid user confusion',
            });
          }

          // Check for disabled options
          const disabledCount = data.options.filter((opt: any) => opt.disabled).length;
          if (disabledCount === data.options.length) {
            errors.push({
              field: 'options',
              code: 'ALL_DISABLED',
              message: 'All radio button options are disabled',
              severity: 'error',
            });
          } else if (disabledCount > 0 && disabledCount === data.options.length - 1) {
            warnings.push({
              field: 'options',
              message: 'Only one option is enabled',
              suggestion:
                'Consider if radio buttons are the best choice when only one option is selectable',
            });
          }
        }

        // Mode validation
        if (data.mode && data.mode !== 'STANDARD') {
          warnings.push({
            field: 'mode',
            message: 'Non-standard radio button modes may confuse users',
            suggestion: 'Stick to standard mode unless you have specific design requirements',
          });
        }

        // Size validation with options count
        if (data.options && data.options.length > 5 && data.size === 'SMALL') {
          warnings.push({
            field: 'size',
            message: 'Small size may be hard to use with many options',
            suggestion:
              'Consider using normal or large size for better accessibility with multiple options',
          });
        }

        // Required field validation
        if (data.required && (!data.options || data.options.every((opt: any) => !opt.selected))) {
          warnings.push({
            field: 'required',
            message: 'Required radio button group has no default selection',
            suggestion: 'Consider pre-selecting one option or providing clear guidance to users',
          });
        }

        // Accessibility warnings
        if (!data.helperText && data.required) {
          warnings.push({
            field: 'helperText',
            message: 'Consider adding helper text for required radio button groups',
            suggestion: 'Add descriptive help text to improve accessibility and user guidance',
          });
        }

        // Label length validation
        if (data.label && data.label.length > 100) {
          warnings.push({
            field: 'label',
            message: 'Very long labels may impact layout',
            suggestion: 'Consider shorter, more concise labels for better user experience',
          });
        }

        // Option label length validation
        if (data.options) {
          const longLabels = data.options.filter((opt: any) => opt.label && opt.label.length > 50);
          if (longLabels.length > 0) {
            warnings.push({
              field: 'options',
              message: 'Some option labels are very long',
              suggestion: 'Keep option labels concise for better readability and layout',
            });
          }
        }

        // Variant validation
        if (data.variant && data.variant !== 'OUTLINED') {
          warnings.push({
            field: 'variant',
            message: 'Non-standard variants may affect radio button visibility',
            suggestion: 'Ensure the selected variant maintains good contrast and usability',
          });
        }

        // Label positioning with radio buttons
        if (data.labelPosition === 'LEFT' && data.options && data.options.length > 4) {
          warnings.push({
            field: 'labelPosition',
            message: 'Left-positioned labels with many options may create layout issues',
            suggestion: 'Consider using top positioning for groups with multiple options',
          });
        }

        // Group naming conventions
        if (data.name && data.label) {
          const nameWords = data.name.toLowerCase().split(/[-_]/);
          const labelWords = data.label.toLowerCase().split(/\s+/);
          const hasCommonWords = nameWords.some((word: any) =>
            labelWords.some(
              (labelWord: any) => labelWord.includes(word) || word.includes(labelWord),
            ),
          );

          if (!hasCommonWords) {
            warnings.push({
              field: 'name',
              message: 'Group name and label seem unrelated',
              suggestion: 'Consider making the name relate to the label for better maintainability',
            });
          }
        }

        return { errors, warnings };
      },
    });

    // Select validation - similar to multiselect but adapted for single selection
    this.registerRule(FormElementType.SELECT, {
      name: 'selectValidation',
      validate: (data: any) => {
        const errors: IValidationError[] = [];
        const warnings: IValidationWarning[] = [];

        // Label validation
        if (!data.label?.trim()) {
          errors.push({
            field: 'label',
            code: 'REQUIRED',
            message: 'Label is required',
            severity: 'error',
          });
        }

        // Options validation
        if (!data.options || data.options.length === 0) {
          errors.push({
            field: 'options',
            code: 'MISSING_OPTIONS',
            message: 'At least one option is required',
            severity: 'error',
            context: { min: 1 },
          });
        } else {
          // Check for duplicate values
          const values = data.options.map((opt: any) => opt.value);
          const uniqueValues = new Set(values);
          if (values.length !== uniqueValues.size) {
            errors.push({
              field: 'options',
              code: 'DUPLICATE_OPTIONS',
              message: 'Option values must be unique',
              severity: 'error',
            });
          }

          // Check for empty labels
          const emptyLabels = data.options.filter((opt: any) => !opt.label?.trim());
          if (emptyLabels.length > 0) {
            warnings.push({
              field: 'options',
              message: 'Some options have empty labels',
              suggestion: 'Consider adding descriptive labels for all options',
            });
          }

          // Too many options warnings for dropdown (different threshold than multiselect)
          if (data.options.length > 15) {
            warnings.push({
              field: 'options',
              message: 'Large number of options may make dropdown difficult to navigate',
              suggestion: 'Consider grouping options or using a different input type for better UX',
            });
          }

          // Very few options suggestion
          if (data.options.length === 1) {
            warnings.push({
              field: 'options',
              message: 'Single option in dropdown may confuse users',
              suggestion: 'Consider using a different input type or adding more options',
            });
          }
        }

        // Group validation
        if (data.group) {
          if (!data.optionGroupLabel?.trim()) {
            errors.push({
              field: 'optionGroupLabel',
              code: 'REQUIRED',
              message: 'Group label field is required when grouping is enabled',
              severity: 'error',
            });
          }

          if (!data.optionGroupChildren?.trim()) {
            errors.push({
              field: 'optionGroupChildren',
              code: 'REQUIRED',
              message: 'Group children field is required when grouping is enabled',
              severity: 'error',
            });
          }

          // Warning if simple options are used with grouping
          if (data.options && data.options.length > 0) {
            const hasSimpleOptions = data.options.some(
              (opt: any) => typeof opt === 'object' && !opt[data.optionGroupChildren],
            );

            if (hasSimpleOptions) {
              warnings.push({
                field: 'group',
                message: 'Grouping is enabled but options appear to be simple objects',
                suggestion: 'Ensure your data structure matches the grouping configuration',
              });
            }
          }
        }

        // Filter validation
        if (data.filter && (!data.options || data.options.length < 8)) {
          warnings.push({
            field: 'filter',
            message: 'Filter is most useful with larger option sets',
            suggestion: 'Consider disabling filter for small option lists (< 8 items)',
          });
        }

        // Show clear validation
        if (!data.showClear && data.required) {
          warnings.push({
            field: 'showClear',
            message: 'Clear button can be helpful even for required fields',
            suggestion: 'Users may want to change their selection easily',
          });
        }

        // Option label/value field validation
        if (data.optionLabel && data.optionValue && data.optionLabel === data.optionValue) {
          warnings.push({
            field: 'optionValue',
            message: 'Option label and value fields are the same',
            suggestion:
              'Consider using different fields for label and value for better data handling',
          });
        }

        // Accessibility warnings
        if (!data.helperText && data.required) {
          warnings.push({
            field: 'helperText',
            message: 'Consider adding helper text for required select fields',
            suggestion: 'Add descriptive help text to improve accessibility and user guidance',
          });
        }

        // Placeholder validation
        if (!data.placeholder) {
          warnings.push({
            field: 'placeholder',
            message: 'Consider adding placeholder text',
            suggestion: 'Placeholder text helps users understand what to select',
          });
        }

        // Performance warnings
        if (data.options && data.options.length > 100) {
          warnings.push({
            field: 'options',
            message: 'Very large option lists may impact performance',
            suggestion:
              'Consider implementing virtual scrolling or pagination for better performance',
          });
        }

        // UX recommendations based on option count
        if (data.options && data.options.length > 20 && !data.filter) {
          warnings.push({
            field: 'filter',
            message: 'Large option lists benefit from filtering',
            suggestion: 'Enable filter to help users find options quickly',
          });
        }

        // Size recommendations
        if (data.options && data.options.length > 10 && data.size === 'SMALL') {
          warnings.push({
            field: 'size',
            message: 'Small size may be difficult to use with many options',
            suggestion: 'Consider using NORMAL or LARGE size for better usability',
          });
        }

        // Grouping logic validation - similar to multiselect
        if (data.group && data.optionGroupLabel && data.optionGroupChildren) {
          const commonLabelFields = ['label', 'name', 'title', 'text', 'category', 'group'];
          const commonChildrenFields = ['children', 'items', 'options', 'values', 'list'];

          const labelFieldValid = commonLabelFields.some((field) =>
            data.optionGroupLabel.toLowerCase().includes(field),
          );
          const childrenFieldValid = commonChildrenFields.some((field) =>
            data.optionGroupChildren.toLowerCase().includes(field),
          );

          if (!labelFieldValid) {
            warnings.push({
              field: 'optionGroupLabel',
              message: 'Group label field name may not match common patterns',
              suggestion:
                'Ensure the field name matches your data structure (e.g., "label", "name", "category")',
            });
          }

          if (!childrenFieldValid) {
            warnings.push({
              field: 'optionGroupChildren',
              message: 'Group children field name may not match common patterns',
              suggestion:
                'Ensure the field name matches your data structure (e.g., "children", "items", "options")',
            });
          }
        }

        // Required field with no default selection
        if (data.required && (!data.options || data.options.every((opt: any) => !opt.selected))) {
          warnings.push({
            field: 'required',
            message: 'Required field has no default selection',
            suggestion: 'Consider pre-selecting an option or providing clear guidance to users',
          });
        }

        // Single vs Multiple selection context (Select is always single)
        if (data.multiple === true) {
          warnings.push({
            field: 'multiple',
            message: 'Select component should use single selection',
            suggestion: 'Consider using MultiSelect component for multiple selections',
          });
        }

        return { errors, warnings };
      },
    });

    this.registerRule(FormElementType.SELECT_BUTTON, {
      name: 'selectButtonValidation',
      validate: (data: any) => {
        const errors: IValidationError[] = [];
        const warnings: IValidationWarning[] = [];

        // Label validation
        if (!data.label?.trim()) {
          errors.push({
            field: 'label',
            code: 'REQUIRED',
            message: 'Label is required',
            severity: 'error',
          });
        }

        // Options validation
        if (!data.options || data.options.length === 0) {
          errors.push({
            field: 'options',
            code: 'MISSING_OPTIONS',
            message: 'At least two options are required for select button',
            severity: 'error',
            context: { min: 2 },
          });
        } else {
          // Minimum options check
          if (data.options.length < 2) {
            warnings.push({
              field: 'options',
              message: 'Select buttons typically need at least 2 options',
              suggestion: 'Add more options or consider using a different input type',
            });
          }

          // Maximum options check for usability
          if (data.options.length > 10) {
            warnings.push({
              field: 'options',
              message: 'Large number of select button options may overwhelm users',
              suggestion: 'Consider using a dropdown or multiselect for more than 10 options',
            });
          }

          // Check for duplicate values
          const values = data.options.map((opt: any) => opt.value);
          const uniqueValues = new Set(values);
          if (values.length !== uniqueValues.size) {
            errors.push({
              field: 'options',
              code: 'DUPLICATE_OPTIONS',
              message: 'Option values must be unique',
              severity: 'error',
            });
          }

          // Check for empty labels
          const emptyLabels = data.options.filter((opt: any) => !opt.label?.trim());
          if (emptyLabels.length > 0) {
            warnings.push({
              field: 'options',
              message: 'Some options have empty labels',
              suggestion: 'Add descriptive labels for all select button options',
            });
          }

          // Check for very long labels that might break layout
          const longLabels = data.options.filter((opt: any) => opt.label && opt.label.length > 30);
          if (longLabels.length > 0) {
            warnings.push({
              field: 'options',
              message: 'Some option labels are very long and may affect button layout',
              suggestion: 'Keep option labels concise for better button appearance',
            });
          }

          // Check for disabled options
          const disabledCount = data.options.filter((opt: any) => opt.disabled).length;
          if (disabledCount === data.options.length) {
            errors.push({
              field: 'options',
              code: 'ALL_DISABLED',
              message: 'All select button options are disabled',
              severity: 'error',
            });
          } else if (disabledCount > 0 && disabledCount === data.options.length - 1) {
            warnings.push({
              field: 'options',
              message: 'Only one option is enabled',
              suggestion:
                'Consider if select button is the best choice when only one option is selectable',
            });
          }
        }

        // Multiple selection validation
        if (data.multiple && data.options && data.options.length > 6) {
          warnings.push({
            field: 'multiple',
            message: 'Multiple selection with many options may be confusing',
            suggestion: 'Consider using a multiselect component for better UX with many options',
          });
        }

        // Option field validation
        if (data.optionLabel && data.optionValue && data.optionLabel === data.optionValue) {
          warnings.push({
            field: 'optionValue',
            message: 'Option label and value fields are the same',
            suggestion:
              'Consider using different fields for label and value for better data handling',
          });
        }

        // Required field with no default selection
        if (data.required && data.options && data.options.every((opt: any) => !opt.selected)) {
          warnings.push({
            field: 'required',
            message: 'Required field has no default selection',
            suggestion: 'Consider pre-selecting an option or providing clear guidance to users',
          });
        }

        // Size validation with multiple options
        if (data.options && data.options.length > 5 && data.size === 'SMALL') {
          warnings.push({
            field: 'size',
            message: 'Small size may be hard to use with many options',
            suggestion:
              'Consider using normal or large size for better accessibility with multiple options',
          });
        }

        // Accessibility warnings
        if (!data.helperText && data.required) {
          warnings.push({
            field: 'helperText',
            message: 'Consider adding helper text for required select button fields',
            suggestion: 'Add descriptive help text to improve accessibility and user guidance',
          });
        }

        // Layout considerations
        if (data.options && data.options.length > 4) {
          warnings.push({
            field: 'options',
            message: 'Many select buttons may create layout challenges',
            suggestion: 'Consider how buttons will wrap on smaller screens',
          });
        }

        // Single vs multiple selection logic
        if (!data.multiple && data.options && data.options.length > 8) {
          warnings.push({
            field: 'multiple',
            message: 'Single selection with many options may be better as a dropdown',
            suggestion: 'Consider using a select dropdown for single selection with many options',
          });
        }

        // Variant validation
        if (data.variant && data.variant !== 'OUTLINED') {
          warnings.push({
            field: 'variant',
            message: 'Non-standard variants may affect button visibility and accessibility',
            suggestion: 'Ensure the selected variant maintains good contrast and usability',
          });
        }

        // Option disabled field validation
        if (data.optionDisabled && !data.optionDisabled.trim()) {
          warnings.push({
            field: 'optionDisabled',
            message: 'Empty disabled field name may cause issues',
            suggestion: 'Specify a valid field name or leave blank if not using disabled states',
          });
        }

        // Label positioning with select buttons
        if (data.labelPosition === 'LEFT' && data.options && data.options.length > 4) {
          warnings.push({
            field: 'labelPosition',
            message: 'Left-positioned labels with many buttons may create layout issues',
            suggestion: 'Consider using top positioning for groups with multiple buttons',
          });
        }

        return { errors, warnings };
      },
    });

    this.registerRule(FormElementType.TIME_PICKER, {
      name: 'timePickerValidation',
      validate: (data: any) => {
        const errors: IValidationError[] = [];
        const warnings: IValidationWarning[] = [];

        // Label validation
        if (!data.label?.trim()) {
          errors.push({
            field: 'label',
            code: 'REQUIRED',
            message: 'Label is required',
            severity: 'error',
          });
        }

        // Hour format validation
        if (!data.format) {
          warnings.push({
            field: 'format',
            message: 'Consider specifying an hour format',
            suggestion: 'Choose between 12-hour or 24-hour format for consistency',
          });
        }

        // Step minute validation
        if (data.stepMinute !== null && data.stepMinute !== undefined) {
          if (data.stepMinute < 1 || data.stepMinute > 60) {
            errors.push({
              field: 'stepMinute',
              code: 'RANGE_ERROR',
              message: 'Minute step must be between 1 and 60',
              severity: 'error',
              context: { min: 1, max: 60, value: data.stepMinute },
            });
          }

          // Check if step makes sense for minutes
          if (data.stepMinute > 30) {
            warnings.push({
              field: 'stepMinute',
              message: 'Large minute steps may limit time selection precision',
              suggestion:
                'Consider using smaller steps (1, 5, 10, 15, or 30) for better user experience',
            });
          }

          // Check for non-divisible step values
          if (60 % data.stepMinute !== 0) {
            warnings.push({
              field: 'stepMinute',
              message: "Minute step doesn't divide evenly into 60",
              suggestion:
                'Consider using divisible values (1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30) for consistent intervals',
            });
          }
        }

        // Step second validation
        if (data.stepSecond !== null && data.stepSecond !== undefined) {
          if (data.stepSecond < 1 || data.stepSecond > 60) {
            errors.push({
              field: 'stepSecond',
              code: 'RANGE_ERROR',
              message: 'Second step must be between 1 and 60',
              severity: 'error',
              context: { min: 1, max: 60, value: data.stepSecond },
            });
          }

          // Check if seconds are enabled when step is defined
          if (!data.showSeconds) {
            warnings.push({
              field: 'stepSecond',
              message: 'Second step is configured but seconds are not shown',
              suggestion: 'Enable "Show Seconds" or remove the second step configuration',
            });
          }

          // Check for large second steps
          if (data.stepSecond > 30) {
            warnings.push({
              field: 'stepSecond',
              message: 'Large second steps may limit time precision',
              suggestion:
                'Consider using smaller steps (1, 5, 10, 15, or 30) for better user experience',
            });
          }

          // Check for non-divisible step values
          if (60 % data.stepSecond !== 0) {
            warnings.push({
              field: 'stepSecond',
              message: "Second step doesn't divide evenly into 60",
              suggestion:
                'Consider using divisible values (1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30) for consistent intervals',
            });
          }
        }

        // Show seconds validation
        if (data.showSeconds) {
          if (!data.stepSecond) {
            warnings.push({
              field: 'showSeconds',
              message: 'Seconds are shown but no second step is configured',
              suggestion: 'Consider setting a second step value for better user control',
            });
          }

          // Warning about complexity
          if (data.format === 'TWELVE') {
            warnings.push({
              field: 'showSeconds',
              message: 'Showing seconds with 12-hour format may appear cluttered',
              suggestion: 'Consider if second precision is necessary for your use case',
            });
          }
        }

        // Format-specific validation
        if (data.format === 'TWELVE') {
          // 12-hour format recommendations
          if (!data.placeholder || !data.placeholder.toLowerCase().includes('am')) {
            warnings.push({
              field: 'placeholder',
              message: 'Consider adding AM/PM indication in placeholder for 12-hour format',
              suggestion: 'Add placeholder like "Select time (e.g., 2:30 PM)" for clarity',
            });
          }
        } else if (data.format === 'TWENTY_FOUR') {
          // 24-hour format recommendations
          if (!data.placeholder || !data.placeholder.includes('24')) {
            warnings.push({
              field: 'placeholder',
              message: 'Consider indicating 24-hour format in placeholder',
              suggestion: 'Add placeholder like "Select time (24-hour format)" for clarity',
            });
          }
        }

        // Icon display validation
        if (!data.showIcon) {
          warnings.push({
            field: 'showIcon',
            message: 'Time picker icon improves user experience',
            suggestion: 'Consider enabling the clock icon for better usability and recognition',
          });
        }

        // Accessibility warnings
        if (!data.helperText && data.required) {
          warnings.push({
            field: 'helperText',
            message: 'Consider adding helper text for required time fields',
            suggestion: 'Add descriptive help text to improve accessibility and user guidance',
          });
        }

        // Placeholder validation
        if (!data.placeholder) {
          warnings.push({
            field: 'placeholder',
            message: 'Consider adding placeholder text',
            suggestion: 'Placeholder text helps users understand the expected time format',
          });
        }

        // Label length validation
        if (data.label && data.label.length > 50) {
          warnings.push({
            field: 'label',
            message: 'Long labels may impact layout',
            suggestion: 'Consider shorter, more concise labels for better user experience',
          });
        }

        // Helper text validation
        if (data.helperText && data.helperText.length > 200) {
          warnings.push({
            field: 'helperText',
            message: 'Very long helper text may overwhelm users',
            suggestion: 'Keep helper text concise and focused on essential information',
          });
        }

        // Size recommendations
        if (data.showSeconds && data.size === 'SMALL') {
          warnings.push({
            field: 'size',
            message: 'Small size may be difficult to use with seconds display',
            suggestion:
              'Consider using normal or large size when showing seconds for better usability',
          });
        }

        // Format consistency with step values
        if (data.format === 'TWELVE' && data.stepMinute && data.stepMinute < 5) {
          warnings.push({
            field: 'stepMinute',
            message: 'Very precise time steps may not align with typical 12-hour format usage',
            suggestion: 'Consider 5 or 15-minute steps for 12-hour format, which are more common',
          });
        }

        // Performance and UX considerations
        if (data.stepMinute === 1 && data.stepSecond === 1) {
          warnings.push({
            field: 'stepSecond',
            message: 'Very precise time control may be overwhelming for users',
            suggestion: 'Consider if such precision is necessary for your use case',
          });
        }

        // Step relationship validation
        if (data.stepMinute && data.stepSecond && data.stepMinute < data.stepSecond) {
          warnings.push({
            field: 'stepSecond',
            message: 'Second step is larger than minute step',
            suggestion: 'Typically, second steps should be smaller or equal to minute steps',
          });
        }

        // Required field validation
        if (data.required && !data.placeholder && !data.helperText) {
          warnings.push({
            field: 'required',
            message: 'Required time field has no guidance for users',
            suggestion: 'Add placeholder text or helper text to guide users on the expected format',
          });
        }

        // Label positioning with complex time formats
        if (data.labelPosition === 'LEFT' && data.showSeconds) {
          warnings.push({
            field: 'labelPosition',
            message: 'Left-positioned labels with seconds display may create layout issues',
            suggestion: 'Consider using top positioning for complex time inputs',
          });
        }

        // Disabled state validation
        if (data.disabled && data.required) {
          warnings.push({
            field: 'disabled',
            message: 'Field is both required and disabled',
            suggestion: 'Required fields should typically be enabled for user interaction',
          });
        }

        return { errors, warnings };
      },
    });

    // Add this validation rule to your DialogValidationService.registerDefaultRules() method

    this.registerRule(FormElementType.LIST_BOX, {
      name: 'listboxValidation',
      validate: (data: any) => {
        const errors: IValidationError[] = [];
        const warnings: IValidationWarning[] = [];

        // Label validation
        if (!data.label?.trim()) {
          errors.push({
            field: 'label',
            code: 'REQUIRED',
            message: 'Label is required',
            severity: 'error',
          });
        }

        // Options validation
        if (!data.options || data.options.length === 0) {
          errors.push({
            field: 'options',
            code: 'MISSING_OPTIONS',
            message: 'At least one option is required',
            severity: 'error',
            context: { min: 1 },
          });
        } else {
          // Check for duplicate values
          const values = data.options.map((opt: any) => opt.value);
          const uniqueValues = new Set(values);
          if (values.length !== uniqueValues.size) {
            errors.push({
              field: 'options',
              code: 'DUPLICATE_OPTIONS',
              message: 'Option values must be unique',
              severity: 'error',
            });
          }

          // Check for empty labels
          const emptyLabels = data.options.filter((opt: any) => !opt.label?.trim());
          if (emptyLabels.length > 0) {
            warnings.push({
              field: 'options',
              message: 'Some options have empty labels',
              suggestion: 'Consider adding descriptive labels for all options',
            });
          }

          // Too many options warnings
          if (data.options.length > 20) {
            warnings.push({
              field: 'options',
              message: 'Large number of options may overwhelm users',
              suggestion: 'Consider grouping options or using pagination for better UX',
            });
          }
        }

        // Multiple selection with checkbox validation
        if (data.checkbox && !data.multiple) {
          warnings.push({
            field: 'checkbox',
            message: 'Checkboxes are typically used with multiple selection',
            suggestion: 'Enable multiple selection or consider not showing checkboxes',
          });
        }

        // Filter validation
        if (data.filter && (!data.options || data.options.length < 5)) {
          warnings.push({
            field: 'filter',
            message: 'Filter is most useful with larger option sets',
            suggestion: 'Consider disabling filter for small option lists (< 5 items)',
          });
        }

        // Group validation
        if (data.group) {
          if (!data.optionGroupLabel?.trim()) {
            errors.push({
              field: 'optionGroupLabel',
              code: 'REQUIRED',
              message: 'Group label field is required when grouping is enabled',
              severity: 'error',
            });
          }

          if (!data.optionGroupChildren?.trim()) {
            errors.push({
              field: 'optionGroupChildren',
              code: 'REQUIRED',
              message: 'Group children field is required when grouping is enabled',
              severity: 'error',
            });
          }

          // Warning if simple options are used with grouping
          if (data.options && data.options.length > 0) {
            const hasSimpleOptions = data.options.some(
              (opt: any) => typeof opt === 'object' && !opt[data.optionGroupChildren],
            );

            if (hasSimpleOptions) {
              warnings.push({
                field: 'group',
                message: 'Grouping is enabled but options appear to be simple objects',
                suggestion: 'Ensure your data structure matches the grouping configuration',
              });
            }
          }
        }

        // Option label/value field validation
        if (data.optionLabel && data.optionValue && data.optionLabel === data.optionValue) {
          warnings.push({
            field: 'optionValue',
            message: 'Option label and value fields are the same',
            suggestion:
              'Consider using different fields for label and value for better data handling',
          });
        }

        // Accessibility warnings
        if (!data.helperText && data.required) {
          warnings.push({
            field: 'helperText',
            message: 'Consider adding helper text for required listbox fields',
            suggestion: 'Add descriptive help text to improve accessibility and user guidance',
          });
        }

        // Multiple selection recommendations
        if (!data.multiple && data.options && data.options.length > 10) {
          warnings.push({
            field: 'multiple',
            message: 'Large option lists may benefit from multiple selection',
            suggestion: 'Consider enabling multiple selection for better user experience',
          });
        }

        // Performance warnings
        if (data.options && data.options.length > 100) {
          warnings.push({
            field: 'options',
            message: 'Very large option lists may impact performance',
            suggestion:
              'Consider implementing virtual scrolling or pagination for better performance',
          });
        }

        // UX recommendations based on option count
        if (data.options && data.options.length > 30 && !data.filter) {
          warnings.push({
            field: 'filter',
            message: 'Large option lists benefit from filtering',
            suggestion: 'Enable filter to help users find options quickly',
          });
        }

        // Checkbox with single selection
        if (data.checkbox && !data.multiple) {
          warnings.push({
            field: 'checkbox',
            message: 'Checkboxes with single selection may confuse users',
            suggestion:
              'Consider using radio buttons for single selection or enable multiple selection',
          });
        }

        // Size recommendations
        if (
          data.multiple &&
          data.checkbox &&
          data.options &&
          data.options.length > 10 &&
          data.size === 'SMALL'
        ) {
          warnings.push({
            field: 'size',
            message: 'Small size may be difficult to use with many options and checkboxes',
            suggestion: 'Consider using NORMAL or LARGE size for better usability',
          });
        }

        // Required field validation
        if (data.required && (!data.options || data.options.every((opt: any) => !opt.selected))) {
          warnings.push({
            field: 'required',
            message: 'Required field has no default selection',
            suggestion: 'Consider pre-selecting some options or providing clear guidance to users',
          });
        }

        return { errors, warnings };
      },
    });
  }
}
