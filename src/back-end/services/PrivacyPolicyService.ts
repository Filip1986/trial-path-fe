/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { CreatePrivacyPolicyDto } from '../models/CreatePrivacyPolicyDto';
import type { PrivacyPolicyAcceptanceCheckDto } from '../models/PrivacyPolicyAcceptanceCheckDto';
import type { PrivacyPolicyAcceptanceDto } from '../models/PrivacyPolicyAcceptanceDto';
import type { PrivacyPolicyAcceptanceResponseDto } from '../models/PrivacyPolicyAcceptanceResponseDto';
import type { PrivacyPolicyDto } from '../models/PrivacyPolicyDto';
import type { UpdatePrivacyPolicyDto } from '../models/UpdatePrivacyPolicyDto';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
    providedIn: 'root',
})
export class PrivacyPolicyService {
    constructor(public readonly http: HttpClient) {}
    /**
     * Get the latest privacy policy
     * @returns PrivacyPolicyDto Returns the latest active privacy policy
     * @throws ApiError
     */
    public privacyPolicyControllerGetLatestPrivacyPolicy(): Observable<PrivacyPolicyDto> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/privacy-policy/latest',
            errors: {
                404: `No active privacy policy found`,
            },
        });
    }
    /**
     * Get all privacy policy versions
     * @returns PrivacyPolicyDto Returns all privacy policy versions
     * @throws ApiError
     */
    public privacyPolicyControllerGetAllVersions(): Observable<Array<PrivacyPolicyDto>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/privacy-policy/versions',
            errors: {
                500: `Internal server error`,
            },
        });
    }
    /**
     * Get specific privacy policy version
     * @param version The privacy policy version to retrieve
     * @returns PrivacyPolicyDto Returns the specified privacy policy version
     * @throws ApiError
     */
    public privacyPolicyControllerGetVersionedPrivacyPolicy(
        version: string,
    ): Observable<PrivacyPolicyDto> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/privacy-policy/version/{version}',
            path: {
                'version': version,
            },
            errors: {
                400: `Invalid version format`,
                404: `Privacy policy version not found`,
            },
        });
    }
    /**
     * Check if user needs to accept the latest policy
     * @returns PrivacyPolicyAcceptanceCheckDto Returns whether user needs to accept the policy
     * @throws ApiError
     */
    public privacyPolicyControllerCheckUserNeedsToAcceptPolicy(): Observable<PrivacyPolicyAcceptanceCheckDto> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/privacy-policy/needs-acceptance',
            errors: {
                401: `Unauthorized`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Record user acceptance of privacy policy
     * @param requestBody
     * @returns PrivacyPolicyAcceptanceResponseDto Records user acceptance of the policy
     * @throws ApiError
     */
    public privacyPolicyControllerAcceptPrivacyPolicy(
        requestBody: PrivacyPolicyAcceptanceDto,
    ): Observable<PrivacyPolicyAcceptanceResponseDto> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/privacy-policy/accept',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid version format`,
                401: `Unauthorized`,
                404: `Privacy policy version not found`,
                500: `Failed to record privacy policy acceptance`,
            },
        });
    }
    /**
     * Create a new privacy policy version
     * @param requestBody
     * @returns PrivacyPolicyDto The privacy policy has been successfully created
     * @throws ApiError
     */
    public privacyPolicyControllerCreatePrivacyPolicy(
        requestBody: CreatePrivacyPolicyDto,
    ): Observable<PrivacyPolicyDto> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/privacy-policy',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid data format`,
                401: `Unauthorized`,
                403: `Forbidden - Insufficient permissions`,
                409: `Version already exists`,
            },
        });
    }
    /**
     * Update an existing privacy policy
     * @param version The privacy policy version to update
     * @param requestBody
     * @returns PrivacyPolicyDto The privacy policy has been successfully updated
     * @throws ApiError
     */
    public privacyPolicyControllerUpdatePrivacyPolicy(
        version: string,
        requestBody: UpdatePrivacyPolicyDto,
    ): Observable<PrivacyPolicyDto> {
        return __request(OpenAPI, this.http, {
            method: 'PATCH',
            url: '/api/privacy-policy/{version}',
            path: {
                'version': version,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid data format`,
                401: `Unauthorized`,
                403: `Forbidden - Insufficient permissions`,
                404: `Privacy policy version not found`,
            },
        });
    }
}
