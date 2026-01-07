import {
  Component,
  ChangeDetectionStrategy,
  signal,
  Injector,
  inject,
  DestroyRef,
  Signal,
  WritableSignal,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TabsModule } from 'primeng/tabs';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { GdprConsentPreferences } from '@core/models/consent.models';
import { GdprConsentService } from '@core/services/gdpr-consent.service';
import { finalize, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-gdpr-consent',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    CheckboxModule,
    DialogModule,
    ToggleSwitchModule,
    TabsModule,
    DividerModule,
    ToastModule
],
  templateUrl: './gdpr-consent.component.html',
  styleUrls: ['./gdpr-consent.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GdprConsentComponent {
  private readonly injector: Injector = inject(Injector);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly gdprConsentService: GdprConsentService = inject(GdprConsentService);

  // Signals
  showBanner: Signal<boolean> = toSignal(
    this.gdprConsentService.showBanner$.pipe(distinctUntilChanged()),
    {
      initialValue: false,
      injector: this.injector,
    },
  );

  preferences: Signal<GdprConsentPreferences> = toSignal(
    this.gdprConsentService.preferences$.pipe(
      distinctUntilChanged((a: GdprConsentPreferences, b: GdprConsentPreferences): boolean =>
        this.preferencesShallowEqual(a, b),
      ),
    ),
    {
      initialValue: {
        necessary: true,
        analytics: false,
        marketing: false,
        preferences: false,
        thirdParty: false,
      } as GdprConsentPreferences,
      injector: this.injector,
    },
  );

  // Local UI state
  showDetailedSettings = false; // kept as a plain boolean due to two-way binding in the template
  isSaving: WritableSignal<boolean> = signal(false);

  // Shallow comparator for preferences to avoid unnecessary updates
  private preferencesShallowEqual(a: GdprConsentPreferences, b: GdprConsentPreferences): boolean {
    return (
      a?.necessary === b?.necessary &&
      a?.analytics === b?.analytics &&
      a?.marketing === b?.marketing &&
      a?.preferences === b?.preferences &&
      a?.thirdParty === b?.thirdParty
    );
  }

  constructor(private messageService: MessageService) {}

  /**
   * Save the user's consent preferences
   */
  savePreferences(): void {
    this.isSaving.set(true);

    this.gdprConsentService
      .savePreferences(this.preferences())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize((): void => {
          this.isSaving.set(false);
          this.showDetailedSettings = false;
        }),
      )
      .subscribe((success: boolean): void => {
        if (success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Preferences Saved',
            detail: 'Your privacy preferences have been updated successfully.',
          });
        } else {
          this.messageService.add({
            severity: 'info',
            summary: 'Preferences Saved Locally',
            detail:
              'Your privacy preferences have been saved locally. They will sync with our servers when you reconnect.',
          });
        }
      });
  }

  /**
   * Accept all consent options
   */
  acceptAll(): void {
    this.isSaving.set(true);

    this.gdprConsentService
      .acceptAll()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize((): void => {
          this.isSaving.set(false);
        }),
      )
      .subscribe((success: boolean): void => {
        if (success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Preferences Saved',
            detail: 'You have accepted all privacy preferences.',
          });
        } else {
          this.messageService.add({
            severity: 'info',
            summary: 'Preferences Saved Locally',
            detail:
              'Your privacy preferences have been saved locally. They will sync with our servers when you reconnect.',
          });
        }
      });
  }

  /**
   * Accept only the necessary cookies
   */
  acceptNecessaryOnly(): void {
    this.isSaving.set(true);

    this.gdprConsentService
      .acceptNecessaryOnly()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize((): void => {
          this.isSaving.set(false);
        }),
      )
      .subscribe((success: boolean): void => {
        if (success) {
          this.messageService.add({
            severity: 'info',
            summary: 'Preferences Saved',
            detail: 'Only necessary cookies will be used.',
          });
        } else {
          this.messageService.add({
            severity: 'info',
            summary: 'Preferences Saved Locally',
            detail:
              'Your privacy preferences have been saved locally. They will sync with our servers when you reconnect.',
          });
        }
      });
  }

  /**
   * Show detailed settings dialog
   */
  showSettings(): void {
    this.showDetailedSettings = true;
  }

  /**
   * Hide detailed settings dialog
   */
  hideSettings(): void {
    this.showDetailedSettings = false;
  }

  /**
   * Open privacy policy page
   */
  openPrivacyPolicy(): void {
    window.open('/privacy-policy', '_blank');
  }
}
