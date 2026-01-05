/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { CreateUserDto } from '../models/CreateUserDto';
import type { RegisterResponseDto } from '../models/RegisterResponseDto';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
    providedIn: 'root',
})
export class RegistrationService {
    constructor(public readonly http: HttpClient) {}
    /**
     * Register a new user and log them in
     * @param requestBody
     * @returns RegisterResponseDto User registered successfully
     * @throws ApiError
     */
    public registrationControllerRegister(
        requestBody: CreateUserDto,
    ): Observable<RegisterResponseDto> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/auth/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid registration data or password too weak`,
                409: `Username or email already exists`,
                500: `Internal server error during registration`,
            },
        });
    }
}
