import { Directive, ElementRef, Input, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Directive({
  selector: '[appFormField]',
  standalone: true,
})
export class FormFieldWrapperDirective implements OnInit {
  @Input() appFormField!: string;
  @Input() form!: FormGroup;
  @Input() label?: string;
  @Input() errorMessages?: { [key: string]: string };
  @Input() colClasses = 'col-12 md:col-6';
  @Input() suppressErrors = false; // New input to suppress error display

  private errorElement?: HTMLElement;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private viewContainer: ViewContainerRef,
  ) {}

  ngOnInit(): void {
    // Apply column classes
    if (this.colClasses) {
      this.colClasses.split(' ').forEach((cls: string): void => {
        this.renderer.addClass(this.el.nativeElement, cls);
      });
    }

    // Only set up error handling if not suppressed and not using UI lib components
    if (!this.suppressErrors && !this.isUsingUILibComponent()) {
      this.setupErrorHandling();
    }
  }

  /**
   * Check if this field wrapper contains a UI library component that handles its own errors
   */
  private isUsingUILibComponent(): boolean {
    const element: any = this.el.nativeElement;

    // List of UI library component selectors that handle their own validation
    const uiLibComponents: string[] = [
      'lib-input-text',
      'lib-textarea',
      'lib-checkbox',
      'lib-radio-button',
      'lib-date-picker',
      'lib-time-picker',
      'lib-input-number',
      'lib-select',
      'lib-multiselect',
      'lib-listbox',
      'lib-select-button',
      'lib-icon-select',
    ];

    // Check if any UI library component is found within this wrapper
    return uiLibComponents.some(
      (selector: string): boolean => element.querySelector(selector) !== null,
    );
  }

  private setupErrorHandling(): void {
    // Watch for errors and update an error message
    if (this.form && this.appFormField) {
      const control: AbstractControl<any, any> | null = this.form.get(this.appFormField);
      if (control) {
        this.createErrorElement();
        this.updateErrorMessage(control);

        // Subscribe to status changes to update an error message
        control.statusChanges.subscribe((): void => {
          this.updateErrorMessage(control);
        });
      }
    }
  }

  private createErrorElement(): void {
    this.errorElement = this.renderer.createElement('div');
    this.renderer.addClass(this.errorElement, 'error-message');
    this.renderer.addClass(this.errorElement, 'text-red-500');
    this.renderer.addClass(this.errorElement, 'text-xs');
    this.renderer.addClass(this.errorElement, 'mt-1');
    this.renderer.setStyle(this.errorElement, 'display', 'none');
    this.renderer.appendChild(this.el.nativeElement, this.errorElement);
  }

  private updateErrorMessage(control: AbstractControl): void {
    if (!this.errorElement) return;

    if (control.errors && control.touched) {
      const errorKey: string = Object.keys(control.errors)[0];
      const errorValue = control.errors[errorKey];
      const message = this.getErrorMessage(this.appFormField, errorKey, errorValue);

      this.renderer.setProperty(this.errorElement, 'textContent', message);
      this.renderer.setStyle(this.errorElement, 'display', 'block');
    } else {
      this.renderer.setStyle(this.errorElement, 'display', 'none');
    }
  }

  private getErrorMessage(field: string, errorKey: string, errorValue: any): string {
    // Use custom error messages if provided
    if (this.errorMessages && this.errorMessages[errorKey]) {
      return this.errorMessages[errorKey];
    }

    // Default error messages
    const fieldName: string = this.label || this.formatFieldName(field);

    const messages: Record<string, string> = {
      required: `${fieldName} is required`,
      minlength: `${fieldName} must be at least ${errorValue.requiredLength} characters`,
      maxlength: `${fieldName} cannot exceed ${errorValue.requiredLength} characters`,
      pattern: `${fieldName} has an invalid format`,
      min: `${fieldName} must be at least ${errorValue.min}`,
      max: `${fieldName} cannot exceed ${errorValue.max}`,
      minGreaterThanMax: `Minimum value cannot be greater than maximum value`,
    };

    return messages[errorKey] || `${fieldName} is invalid`;
  }

  private formatFieldName(camelCase: string): string {
    // Convert camelCase to Title Case with spaces
    return camelCase.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  }
}
