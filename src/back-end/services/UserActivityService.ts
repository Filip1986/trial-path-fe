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
export class UserActivityService {
    constructor(public readonly http: HttpClient) {}
    /**
     * Update user activity timestamp
     * @returns any Activity timestamp updated
     * @throws ApiError
     */
    public activeUsersControllerUpdateActivity(): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/user-activity/heartbeat',
        });
    }
    /**
     * Get count of active users
     * @returns any Returns the count of active users
     * @throws ApiError
     */
    public activeUsersControllerGetActiveUserCount(): Observable<{
        activeUsers?: number;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/user-activity/count',
        });
    }
}
