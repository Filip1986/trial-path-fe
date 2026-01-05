import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PreviewErrorHandlerService {
  /**
   * Handle errors that occur during component configuration
   * @param component Component name or type
   * @param error The error that occurred
   * @param defaultConfig
   * @returns A default configuration if provided
   */
  handleConfigError<T>(component: string, error: unknown, defaultConfig?: T): T | undefined {
    console.error(`Error creating config for ${component}:`, error);

    // Here you could add more sophisticated handling:
    // - Send errors to a monitoring service like Sentry
    // - Show user-friendly toasts/messages via a notification service
    // - Log to an API endpoint
    // - Track error frequency

    return defaultConfig;
  }

  /**
   * Handle errors that occur during option extraction
   * @param component Component name or type
   * @param error The error that occurred
   * @param defaultOptions Default options to return
   */
  handleOptionsError<T>(component: string, error: unknown, defaultOptions: T[] = []): T[] {
    console.error(`Error extracting options for ${component}:`, error);
    return defaultOptions;
  }

  /**
   * Handle errors that occur during value formatting or retrieval
   * @param component Component name or type
   * @param error The error that occurred
   * @param defaultValue Default value to return
   */
  handleValueError<T>(component: string, error: unknown, defaultValue?: T): T | undefined {
    console.error(`Error handling value for ${component}:`, error);
    return defaultValue;
  }

  /**
   * Log validation warnings
   * @param component Component name or type
   * @param message Warning message
   */
  logWarning(component: string, message: string): void {
    console.warn(`[${component}] ${message}`);

    // Add additional handling like:
    // - Collecting warnings for debugging information
    // - Conditionally showing warnings based on the environment
  }

  /**
   * Handle validation errors
   * @param component Component name or type
   * @param error The validation error
   */
  handleValidationError(component: string, error: unknown): void {
    console.error(`Validation error in ${component}:`, error);

    // Validation-specific error handling logic
  }
}
