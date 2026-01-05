import { Component, OnInit, ChangeDetectionStrategy, WritableSignal, signal } from '@angular/core';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Store } from '@ngxs/store';
import { SetEmailConfirmed } from '../../core/store/auth.actions';
import { Observable, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { UserService } from '../../../../../../shared/src/lib/api';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [
    RouterModule,
    CardModule,
    ButtonModule,
    ProgressSpinnerModule,
    ToastModule
],
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmailComponent implements OnInit {
  token: string | null = null;
  isVerifying: WritableSignal<boolean> = signal(false);
  verificationComplete: WritableSignal<boolean> = signal(false);
  verificationSuccess: WritableSignal<boolean> = signal(false);
  verificationMessage: WritableSignal<string> = signal('');
  errorMessage: WritableSignal<string> = signal('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private messageService: MessageService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    // Get token from URL
    this.token = this.route.snapshot.paramMap.get('token');

    if (!this.token) {
      this.errorMessage.set('Invalid verification link. No token provided.');
      this.verificationComplete.set(true);
      return;
    }

    // Verify the token
    this.verifyToken();
  }

  verifyToken(): void {
    this.isVerifying.set(true);

    this.processVerification().subscribe({
      next: (response: any) => {
        this.verificationComplete.set(true);
        this.verificationSuccess.set(response.success);
        this.verificationMessage.set(response.message);

        if (response.success) {
          // Update the store if the verification was successful
          this.store.dispatch(new SetEmailConfirmed(true));

          // Show success toast
          this.messageService.add({
            severity: 'success',
            summary: 'Email Verified',
            detail: this.verificationMessage(),
          });
        } else {
          // Show error toast
          this.messageService.add({
            severity: 'error',
            summary: 'Verification Failed',
            detail: this.verificationMessage(),
          });
        }
      },
      error: (): void => {
        this.verificationComplete.set(true);
        this.verificationSuccess.set(false);
        this.errorMessage.set('Failed to verify email. Please try again later.');

        this.messageService.add({
          severity: 'error',
          summary: 'Verification Error',
          detail: this.errorMessage(),
        });
      },
    });
  }

  processVerification(): Observable<any> {
    if (!this.token) {
      return of({
        success: false,
        message: 'Invalid token. Please try again.',
      });
    }

    return this.userService.userControllerVerifyEmailToken(this.token).pipe(
      tap((response: any): void => {
        // If verification was successful, and we have a userId, we could log it or trigger a flow
        if (response.success && response.userId) {
          // Intentionally no-op for now.
        }
      }),
      catchError((err: any) => {
        return of({
          success: false,
          message: err.error?.message || 'Failed to verify email. Please try again later.',
        });
      }),
      finalize((): void => {
        this.isVerifying.set(false);
      }),
    );
  }

  goToDashboard(): void {
    void this.router.navigate(['/dashboard']);
  }

  goToLogin(): void {
    void this.router.navigate(['/login']);
  }

  resendVerificationEmail(): void {
    void this.router.navigate(['/email-verification']);
  }
}
