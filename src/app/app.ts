import { Component, DestroyRef, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthState, UserDetails } from './core/store/auth.state';
import { Store } from '@ngxs/store';
import { PrivacyPolicyUserService } from './core/services/privacy-policy-user.service';
import { SuspensionService, SuspensionState } from './core/services/suspension.service';
import { PrivacyPolicyAcceptanceComponent } from './auth/privacy-policy-acceptance/privacy-policy-acceptance.component';
import { AccountSuspensionComponent } from './auth/account-suspension/account-suspension.component';
import { EmailConfirmationBannerComponent } from './auth/email-confirmation-banner/email-confirmation-banner.component';
import { SettingsDrawerComponent } from './settings-drawer/settings-drawer.component';
import { Toast } from 'primeng/toast';
import { LayoutState } from './core/store/layout.state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GdprConsentComponent } from './auth/gdpr-consent/gdpr-consent.component';
import { GdprConsentService } from './core/services/gdpr-consent.service';
import { AppearanceSettingsService } from './core/services/appearance-settings.service';

@Component({
  imports: [
    CommonModule,
    RouterModule,
    PrivacyPolicyAcceptanceComponent,
    AccountSuspensionComponent,
    EmailConfirmationBannerComponent,
    SettingsDrawerComponent,
    Toast,
    GdprConsentComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'draft-fe';
  showPrivacyPolicyModal = false;
  suspensionState: SuspensionState = {
    isSuspended: false,
    reason: '',
    dialogVisible: false,
  };
  emailBannerVisible = false;
  private policyModalSubscription: Subscription | null = null;
  private suspensionSubscription: Subscription | null = null;
  private authStateSubscription: Subscription | null = null;

  constructor(
    private privacyPolicyUserService: PrivacyPolicyUserService,
    private suspensionService: SuspensionService,
    private store: Store,
    private destroyRef: DestroyRef,
    private gdprConsentService: GdprConsentService,
    private appearanceSettingsService: AppearanceSettingsService,
  ) {}

  ngOnInit(): void {
    // Initialize appearance settings (if user is logged in)
    if (this.store.selectSnapshot(AuthState.isAuthenticated)) {
      this.loadUserAppearanceSettings();
    }

    // Add this subscription to reload appearance settings when user logs in
    this.store
      .select(AuthState.isAuthenticated)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isAuthenticated: boolean): void => {
        if (isAuthenticated) {
          this.loadUserAppearanceSettings();
        }
      });

    // Subscribe to privacy policy modal visibility
    this.policyModalSubscription = this.privacyPolicyUserService.showPolicyModal$.subscribe(
      (shouldShow: boolean): void => {
        console.log('showPrivacyPolicyModal', shouldShow);
        this.showPrivacyPolicyModal = shouldShow;
      },
    );

    // Subscribe to suspension state changes
    this.suspensionSubscription = this.suspensionService.suspensionState$.subscribe(
      (state: SuspensionState): void => {
        this.suspensionState = state;
      },
    );

    // Listen for authentication state changes
    this.authStateSubscription = this.store
      .select(AuthState.getUser)
      .subscribe((user: UserDetails | null): void => {
        if (user && user.id) {
          // If the user is suspended according to the user details, update the suspension state
          if (user.isSuspended) {
            this.suspensionService.showSuspensionNotification(user.suspensionReason);
          }
        } else {
          // Reset suspension state when a user logs out
          this.suspensionService.resetSuspensionState();
        }
      });

    // Apply saved font preference
    const savedFont = localStorage.getItem('selectedFont');
    if (savedFont && savedFont !== 'default') {
      const fontClass =
        savedFont === 'noto-serif'
          ? 'font-noto-serif'
          : savedFont === 'bree-serif'
            ? 'font-bree-serif'
            : '';
      if (fontClass) {
        document.body.classList.add(fontClass);
      }
    }

    // Initialize GDPR consent (will handle migration from cookie consent)
    this.gdprConsentService.checkConsentStatus();

    // The rest of your initialization code...
    this.policyModalSubscription = this.privacyPolicyUserService.showPolicyModal$.subscribe(
      (shouldShow: boolean): void => {
        console.log('showPrivacyPolicyModal', shouldShow);
        this.showPrivacyPolicyModal = shouldShow;
      },
    );

    this.getEmailBannerVisibility();
  }

  getEmailBannerVisibility() {
    this.store
      .select(LayoutState.isEmailBannerVisible)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((visible: boolean): void => {
        this.emailBannerVisible = visible;
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.policyModalSubscription) {
      this.policyModalSubscription.unsubscribe();
    }

    if (this.suspensionSubscription) {
      this.suspensionSubscription.unsubscribe();
    }

    if (this.authStateSubscription) {
      this.authStateSubscription.unsubscribe();
    }
  }

  handlePolicyAccepted(): void {
    this.privacyPolicyUserService.handlePolicyAccepted();
  }

  /**
   * Load user appearance settings from the service
   */
  private loadUserAppearanceSettings(): void {
    this.appearanceSettingsService.loadSettings().subscribe({
      next: () => console.log('User appearance settings loaded'),
      error: (err) => console.error('Error loading user appearance settings:', err),
    });
  }
}
