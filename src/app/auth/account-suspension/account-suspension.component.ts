import { Component, Input, ChangeDetectionStrategy, WritableSignal, signal } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from '../../core/services/app-auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-account-suspension',
  standalone: true,
  imports: [CardModule, ButtonModule, DialogModule],
  templateUrl: './account-suspension.component.html',
  styleUrls: ['./account-suspension.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountSuspensionComponent {
  @Input() visible = false;
  @Input() reason?: string;

  // Local UI state as a signal for OnPush reactivity
  isLoggingOut: WritableSignal<boolean> = signal(false);

  constructor(private authService: AuthService) {}

  contactSupport(): void {
    window.location.href = 'mailto:support@yourdomain.com?subject=Account%20Suspension%20Appeal';
  }

  logout(): void {
    if (this.isLoggingOut()) return;
    this.isLoggingOut.set(true);

    // AuthService.logout returns an Observable and handles navigation internally
    this.authService
      .logout()
      .pipe(finalize((): void => this.isLoggingOut.set(false)))
      .subscribe();
  }
}
