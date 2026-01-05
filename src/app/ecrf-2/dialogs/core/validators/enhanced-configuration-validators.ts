import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Enhanced configuration validators with better error messages
 */
export class EnhancedConfigurationValidators {
  /**
   * Context-aware required validator
   */
  static requiredWithContext(fieldName: string, context?: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || (typeof control.value === 'string' && !control.value.trim())) {
        return {
          required: {
            field: fieldName,
            message: context || `${fieldName} is required`,
            severity: 'error',
          },
        };
      }
      return null;
    };
  }

  /**
   * Enhanced range validator with context
   */
  static rangeWithContext(minField: string, maxField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const min: any = control.get(minField)?.value;
      const max: any = control.get(maxField)?.value;

      if (min !== null && max !== null && min > max) {
        return {
          rangeError: {
            field: maxField,
            message: `Maximum ${maxField} must be greater than minimum ${minField}`,
            context: { min, max, minField, maxField },
            severity: 'error',
          },
        };
      }
      return null;
    };
  }

  /**
   * Async validator for unique option values
   */
  static uniqueOptionValues(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || !Array.isArray(control.value)) {
        return null;
      }

      const values: any[] = control.value.map((option: any): any => option.value);
      const duplicates: any[] = values.filter(
        (value: any, index: number): boolean => values.indexOf(value) !== index,
      );

      if (duplicates.length > 0) {
        return {
          duplicateValues: {
            field: 'options',
            message: 'Option values must be unique',
            context: { duplicates: [...new Set(duplicates)] },
            severity: 'error',
          },
        };
      }

      return null;
    };
  }

  /**
   * Smart pattern validator with suggestions
   */
  static smartPattern(fieldName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      try {
        new RegExp(control.value);
        return null;
      } catch (error: any) {
        const commonPatterns = {
          email: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          phone: '^\\+?[1-9]\\d{1,14}$',
          url: '^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$',
        };

        return {
          invalidPattern: {
            field: fieldName,
            message: 'Invalid regular expression pattern',
            context: {
              error: error.message,
              suggestions: commonPatterns,
            },
            severity: 'error',
          },
        };
      }
    };
  }
}
