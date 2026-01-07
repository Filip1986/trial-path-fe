import { Component, OnInit, signal, WritableSignal } from '@angular/core';

import { ResetPasswordComponent, ResetPasswordFormData } from '@artificial-sense/ui-lib';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserService } from '../../../../../../shared/src/lib/api';
import { MessageService } from 'primeng/api';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { SelectButton } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { COMPONENT_STYLE_OPTIONS, ComponentStyleOption } from '@core/models/ui-variants';

@Component({
  selector: 'app-reset-password-view',
  standalone: true,
  imports: [SelectButton, FormsModule, ResetPasswordComponent],
  templateUrl: './reset-password-view.component.html',
  styleUrl: './reset-password-view.component.scss',
})
export class ResetPasswordViewComponent implements OnInit {
  private static readonly INVALID_TOKEN_MESSAGE = 'Invalid reset link. Please request a new one.';
  private static readonly RESET_SUCCESS_MESSAGE = 'Your password has been reset successfully.';
  private static readonly RESET_ERROR_MESSAGE = 'Failed to reset password. Please try again.';

  isSubmitting: WritableSignal<boolean> = signal(false);
  resetSuccessful: WritableSignal<boolean> = signal(false);
  tokenError: WritableSignal<boolean> = signal(false);

  token: string = '';

  styleOptions: ComponentStyleOption[] = COMPONENT_STYLE_OPTIONS;

  selectedResetPasswordStyle: '1' | '2' | '3' = '1';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params): void => {
      this.token = params['token'];
      if (!this.token) {
        this.handleTokenError();
      }
    });
  }

  onNavigateToLogin(): void {
    void this.router.navigate(['/login']);
  }

  public onSubmitResetPassword(event: ResetPasswordFormData): void {
    this.isSubmitting.set(true);
    this.userService
      .userControllerResetPassword(this.token, { password: event.password })
      .pipe(
        tap((): void => this.handleResetSuccess()),
        catchError((error: any): Observable<null> => {
          this.handleError(error);
          return of(null);
        }),
        finalize((): void => this.isSubmitting.set(false)),
      )
      .subscribe();
  }

  private handleResetSuccess(): void {
    this.resetSuccessful.set(true);
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: ResetPasswordViewComponent.RESET_SUCCESS_MESSAGE,
    });
  }

  private handleError(error: any): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: error.error?.message || ResetPasswordViewComponent.RESET_ERROR_MESSAGE,
    });
  }

  private handleTokenError(): void {
    this.tokenError.set(true);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: ResetPasswordViewComponent.INVALID_TOKEN_MESSAGE,
    });
  }
}
