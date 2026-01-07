import {
  Component,
  OnInit,
  DestroyRef,
  inject,
  ChangeDetectionStrategy,
  WritableSignal,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { RippleModule } from 'primeng/ripple';
import { AppBetaProgramService, BetaFeature } from '@core/services/app-beta-program.service';
import { finalize } from 'rxjs/operators';
import {
  BetaFeatureInfo,
  BetaFeaturesDto,
  BetaSubscriberDto,
} from '../../../../../shared/src/lib/api';

type Severity = 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined;

@Component({
  selector: 'app-beta-program-widget',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    ToggleSwitchModule,
    DialogModule,
    TooltipModule,
    ProgressBarModule,
    TagModule,
    RippleModule,
  ],
  templateUrl: './beta-program-widget.component.html',
  styleUrls: ['./beta-program-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BetaProgramWidgetComponent implements OnInit {
  // Signals for UI state
  loading: WritableSignal<boolean> = signal(true);
  subscribing: WritableSignal<boolean> = signal(false);
  updating: WritableSignal<boolean> = signal(false);
  isSubscribed: WritableSignal<boolean> = signal(false);
  betaFeatures: WritableSignal<BetaFeature[]> = signal<BetaFeature[]>([]);

  // Keep booleans used with two-way or dialog bindings as plain properties
  showDetailsDialog = false; // [(visible)] requires a plain boolean
  receiveNotifications = true; // [(ngModel)] on InputSwitch

  // Non-templated data can remain plain
  subscription: BetaSubscriberDto | null = null;

  private destroyRef: DestroyRef = inject(DestroyRef);

  constructor(private betaProgramService: AppBetaProgramService) {}

  ngOnInit(): void {
    this.loadBetaFeatures();
  }

  /**
   * Load beta features and subscription status
   */
  loadBetaFeatures(): void {
    this.loading.set(true);
    this.betaProgramService
      .getBetaFeatures()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize((): void => this.loading.set(false)),
      )
      .subscribe({
        next: (response: BetaFeaturesDto): void => {
          const features: BetaFeature[] = response.features.map((feature: BetaFeatureInfo) => {
            return {
              id: feature.id,
              name: feature.name,
              description: feature.description,
              releaseDate: new Date(), // Assuming you want to add a release date
            };
          });
          this.betaFeatures.set(features);
          this.isSubscribed.set(response.isSubscribed);
          this.receiveNotifications = response.receiveNotifications ?? true;

          // If subscribed, load full subscription details
          if (this.isSubscribed()) {
            this.loadSubscriptionDetails();
          }
        },
        error: (error: any): void => {
          console.error('Error loading beta features:', error);
        },
      });
  }

  /**
   * Load detailed subscription information
   */
  loadSubscriptionDetails(): void {
    this.betaProgramService
      .getSubscription()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (subscription: BetaSubscriberDto | null): void => {
          this.subscription = subscription;
        },
        error: (error: any): void => {
          console.error('Error loading subscription details:', error);
        },
      });
  }

  /**
   * Subscribe to the beta program
   */
  subscribe(): void {
    this.subscribing.set(true);
    this.betaProgramService
      .subscribe({
        receiveNotifications: this.receiveNotifications,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize((): void => this.subscribing.set(false)),
      )
      .subscribe({
        next: (subscription: BetaSubscriberDto): void => {
          this.isSubscribed.set(true);
          this.subscription = subscription;
          this.showDetailsDialog = true;
        },
      });
  }

  /**
   * Update subscription preferences
   */
  updatePreferences(): void {
    this.updating.set(true);
    this.betaProgramService
      .updateSubscription({
        receiveNotifications: this.receiveNotifications,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize((): void => this.updating.set(false)),
      )
      .subscribe({
        next: (subscription: BetaSubscriberDto): void => {
          this.subscription = subscription;
        },
      });
  }

  /**
   * Unsubscribe from the beta program
   */
  unsubscribe(): void {
    if (confirm('Are you sure you want to unsubscribe from the beta program?')) {
      this.updating.set(true);
      this.betaProgramService
        .unsubscribe()
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize((): void => this.updating.set(false)),
        )
        .subscribe({
          next: (): void => {
            this.isSubscribed.set(false);
            this.subscription = null;
          },
        });
    }
  }

  /**
   * Show more details about the beta program
   */
  showDetails(): void {
    this.showDetailsDialog = true;
  }

  /**
   * Get time remaining until the feature release
   */
  getTimeRemaining(releaseDate: Date): string {
    const now = new Date();
    const timeRemaining: number = releaseDate.getTime() - now.getTime();

    if (timeRemaining <= 0) {
      return 'Available now';
    }

    const days: number = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} remaining`;
    }

    const hours: number = Math.floor(timeRemaining / (1000 * 60 * 60));
    return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
  }

  /**
   * Get progress percentage toward feature release
   */
  getReleaseProgress(releaseDate: Date): number {
    const now = new Date();
    const timeRemaining: number = releaseDate.getTime() - now.getTime();

    // If already released
    if (timeRemaining <= 0) return 100;

    // Assuming the typical beta period is 90 days
    const betaPeriod: number = 90 * 24 * 60 * 60 * 1000; // 90 days in milliseconds

    // Calculate how far along we are
    const startDate = new Date(releaseDate.getTime() - betaPeriod);
    const totalDuration: number = releaseDate.getTime() - startDate.getTime();
    const elapsed: number = now.getTime() - startDate.getTime();

    // Calculate percentage (0-100)
    return Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));
  }

  /**
   * Get the severity level for a feature tag
   */
  getFeatureSeverity(releaseDate: Date): Severity {
    const now = new Date();
    const daysRemaining: number = Math.floor(
      (releaseDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysRemaining <= 0) return 'success';
    if (daysRemaining <= 7) return 'warn';
    return 'info';
  }
}
