import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PrivacyPolicyUserService {
  private showPolicyModalSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showPolicyModal$: Observable<boolean> =
    this.showPolicyModalSubject.asObservable();

  private shouldRedirectToDashboard = false;

  constructor(
    private messageService: MessageService,
    private router: Router,
  ) {}

  /**
   * Show the privacy policy acceptance modal
   */
  showPrivacyPolicyModal(): void {
    this.showPolicyModalSubject.next(true);
  }

  /**
   * Hide the privacy policy acceptance modal
   */
  hidePrivacyPolicyModal(): void {
    this.showPolicyModalSubject.next(false);
  }

  /**
   * Handle successful policy acceptance
   */
  handlePolicyAccepted(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Privacy Policy Accepted',
      detail: 'Thank you for accepting our privacy policy.',
    });

    this.hidePrivacyPolicyModal();

    // Navigate to dashboard if that flag is set
    if (this.shouldRedirectToDashboard) {
      console.log('Privacy policy accepted, redirecting to dashboard');
      void this.router.navigate(['/dashboard']);
    }
  }
}
