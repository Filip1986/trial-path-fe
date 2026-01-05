export interface IValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  message: string;
  value?: any;
}

/**
 * Enhanced error result interface
 */
export interface IValidationResult {
  valid: boolean;
  errors: IValidationError[];
  warnings: IValidationWarning[];
}

export interface IValidationError {
  field: string;
  code: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  context?: any;
}

export interface IValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

/**
 * Validation rule interface
 */
export interface ValidationRule {
  name: string;
  validate: (data: any) => { errors: IValidationError[]; warnings: IValidationWarning[] };
}

/**
 * Common validation patterns
 */
export const ValidationPatterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^\+?[1-9]\d{1,14}$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  alphanumericWithSpaces: /^[a-zA-Z0-9\s]+$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
};
