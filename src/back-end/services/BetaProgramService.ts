/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { BetaFeaturesDto } from '../models/BetaFeaturesDto';
import type { BetaSubscriberDto } from '../models/BetaSubscriberDto';
import type { CreateBetaSubscriberDto } from '../models/CreateBetaSubscriberDto';
import type { UpdateBetaSubscriberDto } from '../models/UpdateBetaSubscriberDto';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
    providedIn: 'root',
})
export class BetaProgramService {
    constructor(public readonly http: HttpClient) {}
    /**
     * Subscribe to the beta program
     * @param requestBody
     * @returns BetaSubscriberDto Successfully subscribed to the beta program
     * @throws ApiError
     */
    public betaSubscribersControllerSubscribe(
        requestBody: CreateBetaSubscriberDto,
    ): Observable<BetaSubscriberDto> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/beta-subscribers',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid beta program preferences`,
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Update beta program subscription
     * @param requestBody
     * @returns BetaSubscriberDto Successfully updated beta program subscription
     * @throws ApiError
     */
    public betaSubscribersControllerUpdate(
        requestBody: UpdateBetaSubscriberDto,
    ): Observable<BetaSubscriberDto> {
        return __request(OpenAPI, this.http, {
            method: 'PATCH',
            url: '/api/beta-subscribers',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid beta program preferences`,
                401: `Unauthorized`,
                404: `Beta subscription not found`,
            },
        });
    }
    /**
     * Unsubscribe from the beta program
     * @returns void
     * @throws ApiError
     */
    public betaSubscribersControllerUnsubscribe(): Observable<void> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/api/beta-subscribers',
            errors: {
                401: `Unauthorized`,
                404: `Beta subscription not found`,
            },
        });
    }
    /**
     * Get current user beta subscription
     * @returns BetaSubscriberDto Returns the user's beta subscription
     * @throws ApiError
     */
    public betaSubscribersControllerGetSubscription(): Observable<BetaSubscriberDto> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/beta-subscribers',
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Get available beta features
     * @returns BetaFeaturesDto Returns available beta features and subscription status
     * @throws ApiError
     */
    public betaSubscribersControllerGetBetaFeatures(): Observable<BetaFeaturesDto> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/beta-subscribers/features',
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Check access to a specific beta feature
     * @param featureId ID of the beta feature to check access for
     * @returns any Returns whether the user has access to the feature
     * @throws ApiError
     */
    public betaSubscribersControllerCheckFeatureAccess(
        featureId: string,
    ): Observable<{
        hasAccess?: boolean;
        featureId?: string;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/beta-subscribers/features/{featureId}/access',
            path: {
                'featureId': featureId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Access to beta feature denied`,
                404: `Feature not found`,
            },
        });
    }
    /**
     * Get all beta subscribers (Admin only)
     * @returns BetaSubscriberDto Returns all active beta subscribers
     * @throws ApiError
     */
    public betaSubscribersControllerGetAllSubscribers(): Observable<Array<BetaSubscriberDto>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/beta-subscribers/all',
            errors: {
                401: `Unauthorized`,
                403: `Insufficient permissions`,
            },
        });
    }
}
