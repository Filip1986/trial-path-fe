import {
  Component,
  ChangeDetectionStrategy,
  Injector,
  Signal,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';

import { Store } from '@ngxs/store';
import { UserService } from '../../../../../../shared/src/lib/api';
import { MessageService } from 'primeng/api';
import { AuthState, UserDetails } from '../../core/store/auth.state';
import { Router } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { toSignal } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-email-confirmation-banner',
  standalone: true,
  imports: [ButtonDirective],
  templateUrl: './email-confirmation-banner.component.html',
  styleUrls: ['./email-confirmation-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailConfirmationBannerComponent {
  private readonly injector: Injector = inject(Injector);
  private readonly store: Store = inject(Store);
  private readonly userService: UserService = inject(UserService);
  private readonly messageService: MessageService = inject(MessageService);
  private readonly router: Router = inject(Router);

  // Signals
  readonly user: Signal<UserDetails | null> = toSignal(
    this.store.select(AuthState.getUser).pipe(distinctUntilChanged()),
    { initialValue: null, injector: this.injector },
  );

  readonly userEmail: Signal<string> = computed((): string => this.user()?.email ?? '');

  private readonly dismissed: WritableSignal<boolean> = signal(false);

  readonly showBanner: Signal<boolean> = computed((): boolean => {
    const u: UserDetails | null = this.user();
    const isLoggedIn: boolean = !!u;
    const isEmailConfirmed: boolean = u?.isEmailConfirmed ?? false;
    return isLoggedIn && !isEmailConfirmed && !this.dismissed();
  });

  readonly isResending: WritableSignal<boolean> = signal(false);
  readonly isVerifying: WritableSignal<boolean> = signal(false);

  dismissBanner(): void {
    // Hides banner via a dismissed flag (showBanner is computed)
    this.dismissed.set(true);
    // Effect will propagate visibility change to the store
  }

  goToVerificationPage(): void {
    void this.router.navigate(['/email-verification']);
  }

  resendConfirmationEmail(): void {
    const email: string = this.userEmail();
    if (!email) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Could not retrieve your email address. Please contact support.',
      });
      return;
    }

    this.isResending.set(true);

    this.userService
      .userControllerResendVerificationEmail({
        email,
      })
      .pipe(finalize((): void => this.isResending.set(false)))
      .subscribe({
        next: (): void => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Confirmation email has been resent. Please check your inbox.',
          });
        },
        error: (error: any): void => {
          console.error('Email resend error:', error);
          if (
            error &&
            error.status === 201 &&
            error.body &&
            (error.body.text || error.body.message)
          ) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail:
                error.body.text ||
                error.body.message ||
                'Confirmation email has been resent. Please check your inbox.',
            });
            return;
          }
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              error?.error?.message ||
              'Failed to resend confirmation email. Please try again later.',
          });
        },
      });
  }
}
