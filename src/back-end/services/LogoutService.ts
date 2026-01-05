/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { LogoutResponseDto } from '../models/LogoutResponseDto';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
    providedIn: 'root',
})
export class LogoutService {
    constructor(public readonly http: HttpClient) {}
    /**
     * Logout user
     * Logs out the user by invalidating tokens and clearing cookies
     * @returns LogoutResponseDto Logout successful
     * @throws ApiError
     */
    public logoutControllerLogout(): Observable<LogoutResponseDto> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/auth/logout',
            errors: {
                401: `Unauthorized - Invalid or missing token`,
                500: `Server error during logout process`,
            },
        });
    }
}
