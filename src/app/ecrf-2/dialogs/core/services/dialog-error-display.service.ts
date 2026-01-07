import { Injectable } from '@angular/core';
import {
  IValidationError,
  IValidationResult,
  IValidationWarning,
} from '@core/models/interfaces/validation.interfaces';

/**
 * Error display service for consistent error presentation
 */
@Injectable({
  providedIn: 'root',
})
export class DialogErrorDisplayService {
  /**
   * Format validation result for display
   */
  formatValidationResult(result: IValidationResult): string[] {
    const messages: string[] = [];

    result.errors.forEach((error: IValidationError): void => {
      messages.push(`❌ ${this.formatError(error)}`);
    });

    result.warnings.forEach((warning: IValidationWarning): void => {
      messages.push(`⚠️ ${warning.message}`);
      if (warning.suggestion) {
        messages.push(`   💡 ${warning.suggestion}`);
      }
    });

    return messages;
  }

  /**
   * Get field-specific error messages for form display
   */
  getFieldErrors(result: IValidationResult, fieldName: string): string[] {
    return result.errors
      .filter((error: IValidationError): boolean => error.field === fieldName)
      .map((error: IValidationError): string => error.message);
  }

  private formatError(error: IValidationError): string {
    const severity = error.severity === 'error' ? '🔴' : error.severity === 'warning' ? '🟡' : '🔵';

    return `${severity} ${error.message}`;
  }
}
