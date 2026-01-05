/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { RenewTokenDto } from '../models/RenewTokenDto';
import type { TokenResponseDto } from '../models/TokenResponseDto';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
    providedIn: 'root',
})
export class TokenService {
    constructor(public readonly http: HttpClient) {}
    /**
     * Renew access token using refresh token
     * @param requestBody
     * @returns TokenResponseDto Token renewed successfully
     * @throws ApiError
     */
    public tokenControllerRenewAccessToken(
        requestBody: RenewTokenDto,
    ): Observable<TokenResponseDto> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/auth/renew-token',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Invalid or expired refresh token`,
            },
        });
    }
    /**
     * Retrieve a CSRF token
     * @returns TokenResponseDto CSRF token provided
     * @throws ApiError
     */
    public tokenControllerGetCsrfToken(): Observable<TokenResponseDto> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/auth/csrf-token',
        });
    }
}
