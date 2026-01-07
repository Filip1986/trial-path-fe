import { Component, signal, WritableSignal, ChangeDetectionStrategy } from '@angular/core';

import { ForgotPasswordComponent, ForgotPasswordFormData } from '@artificial-sense/ui-lib';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../../../shared/src/lib/api';
import { MessageService } from 'primeng/api';
import { catchError, finalize } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { SelectButton } from 'primeng/selectbutton';
import { COMPONENT_STYLE_OPTIONS, ComponentStyleOption } from '@core/models/ui-variants';

@Component({
  selector: 'app-forgot-password-view',
  standalone: true,
  imports: [ForgotPasswordComponent, SelectButton, FormsModule],
  templateUrl: './forgot-password-view.component.html',
  styleUrls: ['./forgot-password-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordViewComponent {
  private static readonly ERROR_MESSAGE = 'Failed to send reset link. Please try again.';
  selectedForgotPasswordStyle: '1' | '2' | '3' = '1';

  styleOptions: ComponentStyleOption[] = COMPONENT_STYLE_OPTIONS;

  isSubmitting: WritableSignal<boolean> = signal(false);
  resetLinkSent: WritableSignal<boolean> = signal(false);

  constructor(
    private router: Router,
    private userService: UserService,
    private messageService: MessageService,
  ) {}

  navigateToLogin(): void {
    void this.router.navigate(['/login']);
  }

  public handleSubmit(event: ForgotPasswordFormData): void {
    this.isSubmitting.set(true);
    this.userService
      .userControllerForgotPassword({ email: event.email })
      .pipe(
        catchError((error: any): Observable<null> => {
          this.handleError(error);
          return of(null);
        }),
        finalize((): void => {
          this.isSubmitting.set(false);
        }),
      )
      .subscribe((response: any): void => {
        if (response && response.success) {
          // Check for truthy response AND success property
          this.resetLinkSent.set(true);
        }
      });
  }

  private handleError(error: any): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: error.error?.message || ForgotPasswordViewComponent.ERROR_MESSAGE,
    });
  }
}
