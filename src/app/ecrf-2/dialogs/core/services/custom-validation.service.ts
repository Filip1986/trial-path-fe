import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomValidationRule } from '../../shared/components/tab-sections/custom-validation-settings/custom-validation-settings.component';

export interface CustomValidationResult {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
  ruleId?: string;
  ruleName?: string;
}

export interface CustomValidationContext {
  value: any;
  formData: Record<string, any>;
  controlName: string;
  elementType?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CustomValidationService {
  private validationResults = new BehaviorSubject<Record<string, CustomValidationResult>>({});
  public validationResults$ = this.validationResults.asObservable();

  /**
   * Create Angular validators from custom validation rules
   */
  createValidators(
    rules: CustomValidationRule[],
    context?: Partial<CustomValidationContext>,
  ): ValidatorFn[] {
    if (!rules || rules.length === 0) {
      return [];
    }

    // Sort rules by priority
    const sortedRules: CustomValidationRule[] = [...rules]
      .filter((rule: CustomValidationRule): boolean => rule.enabled)
      .sort(
        (a: CustomValidationRule, b: CustomValidationRule): number =>
          (a.priority || 0) - (b.priority || 0),
      );

    return sortedRules.map(
      (rule: CustomValidationRule): ValidatorFn => this.createSingleValidator(rule, context),
    );
  }

  /**
   * Create a single validator from a custom validation rule
   */
  createSingleValidator(
    rule: CustomValidationRule,
    context?: Partial<CustomValidationContext>,
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // Skip validation if disabled or if empty and skipIfEmpty is true
      if (!rule.enabled || (rule.skipIfEmpty && this.isEmpty(control.value))) {
        return null;
      }

      const validationContext: CustomValidationContext = {
        value: control.value,
        formData: context?.formData || {},
        controlName: context?.controlName || '',
        elementType: context?.elementType,
      };

      try {
        const result: CustomValidationResult = this.validateRule(rule, validationContext);

        if (!result.valid) {
          // Update validation results
          this.updateValidationResult(validationContext.controlName, result);

          return {
            [rule.id]: {
              message: rule.errorMessage,
              type: rule.errorType,
              ruleName: rule.name,
              ruleId: rule.id,
            },
          };
        }

        // Clear any previous errors for this rule
        this.clearValidationResult(validationContext.controlName, rule.id);
        return null;
      } catch (error: any) {
        console.error(`Error in custom validation rule "${rule.name}":`, error);

        return {
          [rule.id]: {
            message: `Validation error: ${error.message}`,
            type: 'error',
            ruleName: rule.name,
            ruleId: rule.id,
          },
        };
      }
    };
  }

  /**
   * Validate a single rule against a context
   */
  validateRule(
    rule: CustomValidationRule,
    context: CustomValidationContext,
  ): CustomValidationResult {
    switch (rule.type) {
      case 'regex':
        return this.validateRegex(rule, context);

      case 'range':
        return this.validateRange(rule, context);

      case 'custom':
        return this.validateCustomFunction(rule, context);

      case 'dependency':
        return this.validateDependency(rule, context);

      default:
        return {
          valid: false,
          errors: [`Unknown validation type: ${rule.type}`],
          ruleId: rule.id,
          ruleName: rule.name,
        };
    }
  }

  /**
   * Test a validation rule without applying it
   */
  testRule(
    rule: CustomValidationRule,
    testValue: any,
    formData: Record<string, any> = {},
  ): CustomValidationResult {
    const context: CustomValidationContext = {
      value: testValue,
      formData,
      controlName: 'test',
    };

    return this.validateRule(rule, context);
  }

  /**
   * Get validation results for a control
   */
  getValidationResults(controlName: string): Observable<CustomValidationResult | undefined> {
    return new Observable((observer) => {
      this.validationResults$.subscribe((results) => {
        observer.next(results[controlName]);
      });
    });
  }

  /**
   * Clear all validation results
   */
  clearAllValidationResults(): void {
    this.validationResults.next({});
  }

  /**
   * Clear validation results for a specific control
   */
  clearValidationResult(controlName: string, ruleId?: string): void {
    const currentResults = this.validationResults.value;

    if (ruleId) {
      // Clear specific rule result
      if (currentResults[controlName]) {
        delete currentResults[controlName];
        this.validationResults.next({ ...currentResults });
      }
    } else {
      // Clear all results for control
      if (currentResults[controlName]) {
        delete currentResults[controlName];
        this.validationResults.next({ ...currentResults });
      }
    }
  }

  /**
   * Validate multiple rules against a value
   */
  validateMultipleRules(
    rules: CustomValidationRule[],
    context: CustomValidationContext,
  ): CustomValidationResult {
    const allResults: CustomValidationResult[] = [];

    for (const rule of rules.filter((r) => r.enabled)) {
      const result = this.validateRule(rule, context);
      allResults.push(result);
    }

    const errors: string[] = [];
    const warnings: string[] = [];
    let valid = true;

    allResults.forEach((result) => {
      if (!result.valid) {
        valid = false;
        if (result.errors) {
          errors.push(...result.errors);
        }
      }
      if (result.warnings) {
        warnings.push(...result.warnings);
      }
    });

    return {
      valid,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  /**
   * Get built-in validation rule templates
   */
  getValidationRuleTemplates(): Partial<CustomValidationRule>[] {
    return [
      {
        name: 'Email Validation',
        type: 'regex',
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        errorMessage: 'Please enter a valid email address',
        description: 'Validates email address format',
      },
      {
        name: 'Phone Number',
        type: 'regex',
        pattern: '^\\+?[1-9]\\d{1,14}$',
        errorMessage: 'Please enter a valid phone number',
        description: 'Validates international phone number format',
      },
      {
        name: 'Age Range',
        type: 'range',
        minValue: 18,
        maxValue: 120,
        errorMessage: 'Age must be between 18 and 120',
        description: 'Validates age is within acceptable range',
      },
      {
        name: 'Required if Married',
        type: 'dependency',
        dependsOn: 'maritalStatus',
        errorMessage: 'This field is required when marital status is married',
        description: 'Makes field required based on marital status',
      },
    ];
  }

  /**
   * Validate regex pattern
   */
  private validateRegex(
    rule: CustomValidationRule,
    context: CustomValidationContext,
  ): CustomValidationResult {
    if (!rule.pattern) {
      return {
        valid: false,
        errors: ['No regex pattern specified'],
        ruleId: rule.id,
        ruleName: rule.name,
      };
    }

    try {
      const regex = new RegExp(rule.pattern);
      const isValid: boolean = regex.test(String(context.value || ''));

      return {
        valid: isValid,
        errors: isValid ? undefined : [rule.errorMessage],
        ruleId: rule.id,
        ruleName: rule.name,
      };
    } catch (error: any) {
      return {
        valid: false,
        errors: [`Invalid regex pattern: ${error.message}`],
        ruleId: rule.id,
        ruleName: rule.name,
      };
    }
  }

  /**
   * Validate numeric range
   */
  private validateRange(
    rule: CustomValidationRule,
    context: CustomValidationContext,
  ): CustomValidationResult {
    const numericValue = Number(context.value);

    if (isNaN(numericValue)) {
      return {
        valid: false,
        errors: ['Value must be a number for range validation'],
        ruleId: rule.id,
        ruleName: rule.name,
      };
    }

    const errors: string[] = [];

    if (rule.minValue != null && numericValue < rule.minValue) {
      errors.push(`Value must be at least ${rule.minValue}`);
    }

    if (rule.maxValue != null && numericValue > rule.maxValue) {
      errors.push(`Value must not exceed ${rule.maxValue}`);
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
      ruleId: rule.id,
      ruleName: rule.name,
    };
  }

  /**
   * Validate using a custom JavaScript function
   */
  private validateCustomFunction(
    rule: CustomValidationRule,
    context: CustomValidationContext,
  ): CustomValidationResult {
    if (!rule.customFunction) {
      return {
        valid: false,
        errors: ['No custom function specified'],
        ruleId: rule.id,
        ruleName: rule.name,
      };
    }

    try {
      // Create a safe execution context
      const validationFunction = new Function(
        'value',
        'formData',
        'context',
        `
        ${rule.customFunction}

        // If the function doesn't return anything, assume it's meant to return the result
        if (typeof validate === 'function') {
          return validate(value, formData, context);
        }

        // Try to execute the function directly if it's a direct return statement
        return (${rule.customFunction})(value, formData, context);
      `,
      );

      const result = validationFunction(context.value, context.formData, context);

      // Handle different return types
      if (typeof result === 'boolean') {
        return {
          valid: result,
          errors: result ? undefined : [rule.errorMessage],
          ruleId: rule.id,
          ruleName: rule.name,
        };
      }

      if (typeof result === 'object' && result !== null) {
        return {
          valid: result.valid !== false,
          errors: result.errors || (!result.valid ? [rule.errorMessage] : undefined),
          warnings: result.warnings,
          ruleId: rule.id,
          ruleName: rule.name,
        };
      }

      // If a result is a string, treat as an error message
      if (typeof result === 'string') {
        return {
          valid: false,
          errors: [result],
          ruleId: rule.id,
          ruleName: rule.name,
        };
      }

      return {
        valid: true,
        ruleId: rule.id,
        ruleName: rule.name,
      };
    } catch (error: any) {
      return {
        valid: false,
        errors: [`Custom function error: ${error.message}`],
        ruleId: rule.id,
        ruleName: rule.name,
      };
    }
  }

  /**
   * Validate field dependency
   */
  private validateDependency(
    rule: CustomValidationRule,
    context: CustomValidationContext,
  ): CustomValidationResult {
    if (!rule.dependsOn) {
      return {
        valid: false,
        errors: ['No dependency field specified'],
        ruleId: rule.id,
        ruleName: rule.name,
      };
    }

    const dependentValue = context.formData[rule.dependsOn];

    // Simple dependency validation - field must have a value if a dependent field has a value
    const dependentHasValue = !this.isEmpty(dependentValue);
    const currentHasValue = !this.isEmpty(context.value);

    if (dependentHasValue && !currentHasValue) {
      return {
        valid: false,
        errors: [rule.errorMessage || `This field is required when ${rule.dependsOn} has a value`],
        ruleId: rule.id,
        ruleName: rule.name,
      };
    }

    return {
      valid: true,
      ruleId: rule.id,
      ruleName: rule.name,
    };
  }

  /**
   * Update validation result for a control
   */
  private updateValidationResult(controlName: string, result: CustomValidationResult): void {
    const currentResults = this.validationResults.value;
    currentResults[controlName] = result;
    this.validationResults.next({ ...currentResults });
  }

  /**
   * Check if a value is considered empty
   */
  private isEmpty(value: any): boolean {
    return (
      value == null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' && Object.keys(value).length === 0)
    );
  }
}
