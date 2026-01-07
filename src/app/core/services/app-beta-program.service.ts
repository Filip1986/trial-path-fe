import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import {BetaProgramService} from '@back-end/services/BetaProgramService';
import {BetaSubscriberDto} from '@back-end/models/BetaSubscriberDto';
import {BetaFeaturesDto} from '@back-end/models/BetaFeaturesDto';

export interface BetaFeature {
  id: string;
  name: string;
  description: string;
  releaseDate: Date;
}

export interface BetaFeature {
  id: string;
  name: string;
  description: string;
  releaseDate: Date;
}

export interface BetaFeaturesResponse {
  features: BetaFeature[];
  isSubscribed: boolean;
  preferences?: string;
  receiveNotifications?: boolean;
}

export interface CreateBetaSubscriptionDto {
  receiveNotifications: boolean;
  preferences?: string;
}

export interface UpdateBetaSubscriptionDto {
  receiveNotifications?: boolean;
  preferences?: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AppBetaProgramService {
  constructor(
    private messageService: MessageService,
    private betaProgramService: BetaProgramService,
  ) {}

  /**
   * Get the user's beta subscription
   */
  getSubscription(): Observable<BetaSubscriberDto | null> {
    return this.betaProgramService.betaSubscribersControllerGetSubscription().pipe(
      catchError((error) => {
        console.error('Error fetching beta subscription:', error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Get available beta features and subscription status
   */
  getBetaFeatures(): Observable<BetaFeaturesDto> {
    return this.betaProgramService.betaSubscribersControllerGetBetaFeatures().pipe(
      catchError((error) => {
        console.error('Error fetching beta features:', error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Subscribe to the beta program
   */
  subscribe(data: CreateBetaSubscriptionDto): Observable<BetaSubscriberDto> {
    return this.betaProgramService.betaSubscribersControllerSubscribe(data).pipe(
      tap(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Beta Program',
          detail: 'You have successfully subscribed to the beta program!',
        });
      }),
      catchError((error) => {
        console.error('Error subscribing to beta program:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to subscribe to the beta program. Please try again.',
        });
        return throwError(() => error);
      }),
    );
  }

  /**
   * Update beta subscription
   */
  updateSubscription(data: UpdateBetaSubscriptionDto): Observable<BetaSubscriberDto> {
    return this.betaProgramService.betaSubscribersControllerUpdate(data).pipe(
      tap(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Beta Program',
          detail: 'Your beta program preferences have been updated!',
        });
      }),
      catchError((error) => {
        console.error('Error updating beta subscription:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update beta program preferences. Please try again.',
        });
        return throwError(() => error);
      }),
    );
  }

  /**
   * Unsubscribe from the beta program
   */
  unsubscribe(): Observable<void> {
    return this.betaProgramService.betaSubscribersControllerUnsubscribe().pipe(
      tap(() => {
        this.messageService.add({
          severity: 'info',
          summary: 'Beta Program',
          detail: 'You have unsubscribed from the beta program.',
        });
      }),
      catchError((error) => {
        console.error('Error unsubscribing from beta program:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to unsubscribe from the beta program. Please try again.',
        });
        return throwError(() => error);
      }),
    );
  }
}
