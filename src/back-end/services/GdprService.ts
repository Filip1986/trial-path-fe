/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { GdprConsentDto } from '../models/GdprConsentDto';
import type { GdprConsentResponseDto } from '../models/GdprConsentResponseDto';
import type { GdprConsentStatusDto } from '../models/GdprConsentStatusDto';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
    providedIn: 'root',
})
export class GdprService {
    constructor(public readonly http: HttpClient) {}
    /**
     * Get current user GDPR consent preferences
     * @returns GdprConsentResponseDto The user's GDPR consent preferences
     * @throws ApiError
     */
    public gdprControllerGetUserConsent(): Observable<GdprConsentResponseDto> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/gdpr/consent',
            errors: {
                404: `No consent found for this user`,
            },
        });
    }
    /**
     * Save or update GDPR consent preferences
     * @param requestBody
     * @returns GdprConsentResponseDto The GDPR consent preferences have been saved
     * @throws ApiError
     */
    public gdprControllerSaveConsent(
        requestBody: GdprConsentDto,
    ): Observable<GdprConsentResponseDto> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/gdpr/consent',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid consent data provided`,
            },
        });
    }
    /**
     * Delete GDPR consent data (right to be forgotten)
     * @returns any GDPR consent data has been deleted
     * @throws ApiError
     */
    public gdprControllerDeleteConsent(): Observable<{
        deleted?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/api/gdpr/consent',
        });
    }
    /**
     * Check current user GDPR consent status
     * @returns GdprConsentStatusDto The status of the user's GDPR consent
     * @throws ApiError
     */
    public gdprControllerCheckConsentStatus(): Observable<GdprConsentStatusDto> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/gdpr/consent/status',
        });
    }
    /**
     * Withdraw GDPR consent
     * @returns GdprConsentResponseDto GDPR consent has been withdrawn
     * @throws ApiError
     */
    public gdprControllerWithdrawConsent(): Observable<GdprConsentResponseDto> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/api/gdpr/consent/withdraw',
            errors: {
                404: `No consent found for this user`,
            },
        });
    }
    /**
     * Get the latest GDPR consent version information
     * @returns any The latest GDPR consent version information
     * @throws ApiError
     */
    public gdprControllerGetConsentVersion(): Observable<{
        version?: string;
        lastUpdated?: string;
        details?: {
            cookieTypes?: Array<{
                type?: string;
                required?: boolean;
                description?: string;
            }>;
        };
    }> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/gdpr/consent/version',
        });
    }
    /**
     * Get GDPR consent for a specific user (Admin only)
     * @param userId
     * @returns GdprConsentResponseDto The user's GDPR consent preferences
     * @throws ApiError
     */
    public gdprControllerGetConsentForUser(
        userId: string,
    ): Observable<GdprConsentResponseDto> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/gdpr/admin/consent/{userId}',
            path: {
                'userId': userId,
            },
            errors: {
                403: `Forbidden - Insufficient permissions`,
                404: `No consent found for this user`,
            },
        });
    }
}
