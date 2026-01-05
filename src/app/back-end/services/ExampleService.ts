/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
    providedIn: 'root',
})
export class ExampleService {
    constructor(public readonly http: HttpClient) {}
    /**
     * @returns any
     * @throws ApiError
     */
    public appControllerHealthCheck(): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/health-check',
        });
    }
    /**
     * Endpoint to test the API with versioning
     * Responds differently based on the specified API version in the request header.
     * @param apiVersion Specify the API version. Supported versions: v1, v2
     * @returns any Hello World for the specified API version.
     * @throws ApiError
     */
    public appControllerGetHello(
        apiVersion: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/hello',
            headers: {
                'API-Version': apiVersion,
            },
            errors: {
                400: `Unsupported API Version`,
            },
        });
    }
    /**
     * JWT protected endpoint
     * @returns any You accessed a JWT protected endpoint!
     * @throws ApiError
     */
    public appControllerGetJwtProtected(): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/jwt-protected',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public appControllerTestCookie(): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/test-cookie',
        });
    }
}
