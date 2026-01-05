import {
  Component,
  DestroyRef,
  ChangeDetectionStrategy,
  Injector,
  Signal,
  WritableSignal,
  signal,
} from '@angular/core';

import { UserService } from '../../../../../../shared/src/lib/api';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '../../core/store/auth.state';
import { ButtonDirective } from 'primeng/button';
import { Card } from 'primeng/card';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/services/app-auth.service';
import { distinctUntilChanged, finalize, map } from 'rxjs/operators';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [ButtonDirective, Card],
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailVerificationComponent {
  userEmail: Signal<string>;
  isResending: WritableSignal<boolean> = signal(false);
  isChecking: WritableSignal<boolean> = signal(false);

  constructor(
    private store: Store,
    private userService: UserService,
    private messageService: MessageService,
    private router: Router,
    private appAuthService: AuthService,
    private destroyRef: DestroyRef,
    private injector: Injector,
  ) {
    // Convert store selector to signal with a default fallback
    this.userEmail = toSignal(
      this.store.select(AuthState.getUserEmail).pipe(
        map((email: string | null | undefined): string => email || 'your email address'),
        distinctUntilChanged(),
      ),
      { initialValue: 'your email address', injector: this.injector },
    );
  }

  resendVerificationEmail(): void {
    const email: string = this.userEmail();
    if (!email) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Email address not found. Please update your profile with a valid email.',
      });
      return;
    }

    this.isResending.set(true);

    // Call the API to resend verification email directly
    this.userService
      .userControllerResendVerificationEmail({
        email,
      })
      .pipe(finalize((): void => this.isResending.set(false)))
      .subscribe({
        next: (response: any): void => {
          console.log('Email resend success response:', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Email Sent',
            detail: 'A new verification email has been sent to your inbox.',
          });
        },
        error: (error: any): void => {
          console.error('Email resend error:', error);

          // Check if the error is actually a successful response with status 201
          if (
            error &&
            error.status === 201 &&
            error.body &&
            (error.body.text || error.body.message)
          ) {
            // This is actually a success!
            this.messageService.add({
              severity: 'success',
              summary: 'Email Sent',
              detail:
                error.body.text ||
                error.body.message ||
                'A new verification email has been sent to your inbox.',
            });
            return;
          }

          // Handle actual errors
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              error?.error?.message || 'Failed to send verification email. Please try again later.',
          });
        },
      });
  }

  /**
   * Handle the "I've Verified My Email" button click
   * This is the main method for the manual verification check
   */
  confirmVerification(): void {
    if (this.isChecking()) return;

    this.isChecking.set(true);

    // Fetch the updated user information which includes email verification status
    this.appAuthService
      .fetchAndStoreCurrentUser()
      .pipe(
        finalize((): void => this.isChecking.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (user: any): void => {
          if (user && user.isEmailConfirmed) {
            // User is verified - show a success message
            this.messageService.add({
              severity: 'success',
              summary: 'Verified!',
              detail: 'Your email has been verified successfully!',
            });

            // Navigate to the dashboard after a short delay
            setTimeout((): void => {
              void this.router.navigate(['/dashboard']);
            }, 1500);
          } else {
            // Not verified yet
            this.messageService.add({
              severity: 'info',
              summary: 'Not Verified',
              detail:
                'Your email has not been verified yet. Please check your inbox for the verification link.',
            });
          }
        },
        error: (error: any): void => {
          console.error('Verification check error:', error);

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to check verification status. Please try again later.',
          });
        },
      });
  }

  goBack(): void {
    void this.router.navigate(['/dashboard']);
  }
}
