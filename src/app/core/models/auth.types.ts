import { HttpErrorResponse } from '@angular/common/http';

// Omit 'error' from HttpErrorResponse and redefine it in AuthError
export interface AuthError extends Omit<HttpErrorResponse, 'error'> {
  error: {
    message?: string;
    code: string;
    details?: unknown;
  };
}

export interface FormFieldError {
  [key: string]: string | boolean;
}

export type FormControlValue = string | number | boolean | Date | null;
