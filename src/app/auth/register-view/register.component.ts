import {
  Component,
  DestroyRef,
  ChangeDetectionStrategy,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';

import { RegisterFormData, RegistrationComponent } from '@artificial-sense/ui-lib';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { RegistrationService } from '../../../../../../shared/src/lib/api';
import { ToastManagerService } from '../../core/services/toast-manager.service';
import { SelectButton } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { COMPONENT_STYLE_OPTIONS, ComponentStyleOption } from '../../core/models/ui-variants';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ToastModule, SelectButton, FormsModule, RegistrationComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterViewComponent {
  isSubmitting: WritableSignal<boolean> = signal(false);
  registrationError: WritableSignal<string> = signal('');

  // Login style selection
  styleOptions: ComponentStyleOption[] = COMPONENT_STYLE_OPTIONS;

  selectedLoginStyle: '1' | '2' | '3' = '1';

  private destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private router: Router,
    private registrationService: RegistrationService,
    private toastManager: ToastManagerService,
  ) {}

  /**
   * Handle registration form submission
   * @param formData Registration form data
   */
  handleRegistrationSubmit(formData: RegisterFormData): void {
    this.isSubmitting.set(true);
    this.registrationError.set('');

    // Call the registration service
    this.registrationService
      .registrationControllerRegister({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error: any): Observable<null> => {
          console.error('Registration error:', error);

          // Set an error message that will be passed to the UI component
          const errorMessage: string = this.getErrorMessage(error);
          this.registrationError.set(errorMessage);

          // Display toast notification
          this.toastManager.error({
            summary: 'Registration Failed',
            detail: errorMessage,
          });

          return of(null);
        }),
        finalize((): void => {
          this.isSubmitting.set(false);
        }),
      )
      .subscribe((response: any): void => {
        if (response) {
          this.handleRegistrationSuccess();
        }
      });
  }

  /**
   * Navigate to the login page
   */
  navigateToLogin(): void {
    void this.router.navigate(['/login']);
  }

  /**
   * Handle successful registration
   */
  private handleRegistrationSuccess(): void {
    console.log('Registration successful!');
    this.toastManager.success({
      summary: 'Success',
      detail: 'Registration successful! Redirecting to login...',
    });

    // Navigate to the login page after a short delay
    setTimeout((): void => {
      void this.router.navigate(['/login']);
    }, 2000);
  }

  /**
   * Get appropriate error message based on error response
   * @param error Error object from API
   * @returns Formatted error message
   */
  private getErrorMessage(error: any): string {
    // Handle different error scenarios
    if (error.status === 409) {
      return 'A user with this email or username already exists.';
    } else if (error.status === 400) {
      if (error.error?.message?.includes('weak password')) {
        return `Your password is not strong enough. Suggestions: ${
          error.error?.details?.suggestions?.join(', ') || 'Improve password complexity.'
        }`;
      } else {
        return 'Validation failed. Please check your input.';
      }
    }

    return error.error?.message || 'Registration failed. Please try again.';
  }
}
