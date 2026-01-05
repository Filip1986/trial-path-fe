/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { LoginDto } from '../models/LoginDto';
import type { SuccessLoginResponseDto } from '../models/SuccessLoginResponseDto';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
    providedIn: 'root',
})
export class LoginService {
    constructor(public readonly http: HttpClient) {}
    /**
     * Login user and set auth tokens in cookies
     * This endpoint allows users to log in and receive authentication tokens in HTTP-only cookies.
     * A CSRF token must be included in the request body with the name _csrf for security reasons.
     * @param requestBody Request body including user login credentials. Include the _csrf token parameter for security.
     * @returns SuccessLoginResponseDto Login successful
     * @throws ApiError
     */
    public loginControllerLogin(
        requestBody: LoginDto,
    ): Observable<SuccessLoginResponseDto> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid login credentials`,
                401: `Authentication failed`,
            },
        });
    }
}
