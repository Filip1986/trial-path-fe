import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Custom validators for dialog configurations
 */
export class ConfigurationValidators {
  /**
   * Validate that min length is less than max length
   */
  static lengthRange(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const minLength: any = control.get('minLength')?.value;
      const maxLength: any = control.get('maxLength')?.value;

      if (minLength && maxLength && minLength > maxLength) {
        return { lengthRange: { min: minLength, max: maxLength } };
      }

      return null;
    };
  }

  /**
   * Validate that min value is less than max value
   */
  static valueRange(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const min: any = control.get('min')?.value;
      const max: any = control.get('max')?.value;

      if (min !== null && max !== null && min > max) {
        return { valueRange: { min, max } };
      }

      return null;
    };
  }

  /**
   * Validate regex pattern
   */
  static regexPattern(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const pattern: any = control.value;

      if (!pattern) {
        return null;
      }

      try {
        new RegExp(pattern);
        return null;
      } catch (e) {
        return { invalidPattern: { pattern } };
      }
    };
  }

  /**
   * Validate unique option values
   */
  static uniqueOptionValues(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || !Array.isArray(control.value)) {
        return null;
      }

      const values: any[] = control.value.map((opt: any): any => opt.value);
      const uniqueValues = new Set(values);

      if (values.length !== uniqueValues.size) {
        return { duplicateValues: true };
      }

      return null;
    };
  }

  /**
   * Validate date range
   */
  static dateRange(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const minDate: any = control.get('minDate')?.value;
      const maxDate: any = control.get('maxDate')?.value;

      if (minDate && maxDate && new Date(minDate) > new Date(maxDate)) {
        return { dateRange: { min: minDate, max: maxDate } };
      }

      return null;
    };
  }

  /**
   * Validate field dependencies
   */
  static fieldDependency(dependentField: string, requiredValue: any): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const dependent: any = control.get(dependentField)?.value;

      if (control.value && dependent !== requiredValue) {
        return {
          fieldDependency: {
            field: dependentField,
            requiredValue,
            actualValue: dependent,
          },
        };
      }

      return null;
    };
  }

  /**
   * Validate conditional requirement
   */
  static conditionalRequired(condition: (control: AbstractControl) => boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (condition(control.parent || control) && !control.value) {
        return { conditionalRequired: true };
      }

      return null;
    };
  }
}

/**
 * Form-level validator compositions
 */
export class FormValidatorCompositions {
  /**
   * Get validators for input text dialogs
   */
  static textInputValidators(): ValidatorFn[] {
    return [ConfigurationValidators.lengthRange(), ConfigurationValidators.regexPattern()];
  }

  /**
   * Get validators for number input dialogs
   */
  static numberInputValidators(): ValidatorFn[] {
    return [ConfigurationValidators.valueRange()];
  }

  /**
   * Get validators for date picker dialogs
   */
  static datePickerValidators(): ValidatorFn[] {
    return [ConfigurationValidators.dateRange()];
  }

  /**
   * Get validators for option-based controls
   */
  static optionControlValidators(): ValidatorFn[] {
    return [ConfigurationValidators.uniqueOptionValues()];
  }
}
