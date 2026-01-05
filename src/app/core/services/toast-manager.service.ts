import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

export type ToastSeverity = 'success' | 'info' | 'warn' | 'error';

export interface ToastOptions {
  summary?: string;
  detail: string;
  life?: number;
  sticky?: boolean;
  closable?: boolean;
  preventDuplicates?: boolean;
}

/**
 * Centralized service for managing toast notifications
 * Prevents duplicate messages and provides a standardized API for showing toasts
 */
@Injectable({
  providedIn: 'root',
})
export class ToastManagerService {
  private recentMessages: Map<string, number> = new Map();
  // Default duplicate prevention window in milliseconds
  private readonly DUPLICATE_PREVENTION_WINDOW = 3000;

  constructor(private messageService: MessageService) {}

  /**
   * Shows a toast message with the specified severity
   * @param severity The severity level of the toast
   * @param options Toast message options
   */
  show(severity: ToastSeverity, options: ToastOptions): void {
    const {
      summary,
      detail,
      life = 3000,
      sticky = false,
      closable = true,
      preventDuplicates = true,
    } = options;

    // Generate a key for duplicate detection based on severity and content
    const messageKey = `${severity}:${summary ?? ''}:${detail}`;

    // Check for duplicate messages if prevention is enabled
    if (preventDuplicates) {
      const now = Date.now();
      const lastShown = this.recentMessages.get(messageKey);

      if (lastShown && now - lastShown < this.DUPLICATE_PREVENTION_WINDOW) {
        // Skip showing a duplicate message
        return;
      }

      // Record this message to prevent duplicates
      this.recentMessages.set(messageKey, now);

      // Cleanup old entries periodically
      this.cleanupOldMessages();
    }

    // Show the toast
    this.messageService.add({
      severity,
      summary,
      detail,
      life: sticky ? 0 : life,
      closable,
    });
  }

  /**
   * Shows a success toast message
   * @param options Toast message options or simple message string
   */
  success(options: ToastOptions | string): void {
    if (typeof options === 'string') {
      options = { detail: options };
    }
    options.summary = options.summary || 'Success';
    this.show('success', options);
  }

  /**
   * Shows an info toast message
   * @param options Toast message options or simple message string
   */
  info(options: ToastOptions | string): void {
    if (typeof options === 'string') {
      options = { detail: options };
    }
    options.summary = options.summary || 'Information';
    this.show('info', options);
  }

  /**
   * Shows a warning toast message
   * @param options Toast message options or simple message string
   */
  warn(options: ToastOptions | string): void {
    if (typeof options === 'string') {
      options = { detail: options };
    }
    options.summary = options.summary || 'Warning';
    this.show('warn', options);
  }

  /**
   * Shows an error toast message
   * @param options Toast message options or simple message string
   */
  error(options: ToastOptions | string): void {
    if (typeof options === 'string') {
      options = { detail: options };
    }
    options.summary = options.summary || 'Error';
    this.show('error', options);
  }

  /**
   * Clears all displayed toast messages
   */
  clear(): void {
    this.messageService.clear();
  }

  /**
   * Handles API errors and displays appropriate toast messages
   * @param error The error object from an API call
   * @param defaultMessage Default message to show if error doesn't contain details
   */
  handleError(error: any, defaultMessage = 'An unexpected error occurred'): void {
    console.error('API Error:', error);

    let errorMessage = defaultMessage;

    // Extract error message from various error response formats
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (typeof error.error === 'string') {
      errorMessage = error.error;
    } else if (error.statusText) {
      errorMessage = `${error.status}: ${error.statusText}`;
    }

    this.error({ detail: errorMessage });
  }

  /**
   * Cleanup old message entries to prevent memory leaks
   */
  private cleanupOldMessages(): void {
    const now = Date.now();
    for (const [key, timestamp] of this.recentMessages.entries()) {
      if (now - timestamp > this.DUPLICATE_PREVENTION_WINDOW) {
        this.recentMessages.delete(key);
      }
    }
  }
}
