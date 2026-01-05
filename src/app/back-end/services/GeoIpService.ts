/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { GeoLocationResponseDto } from '../models/GeoLocationResponseDto';
import type { UserLocationStatsDto } from '../models/UserLocationStatsDto';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
    providedIn: 'root',
})
export class GeoIpService {
    constructor(public readonly http: HttpClient) {}
    /**
     * Get current user's geolocation
     * @returns GeoLocationResponseDto Current user's geolocation
     * @throws ApiError
     */
    public geoIpControllerGetMyLocation(): Observable<GeoLocationResponseDto> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/geo-ip/my-location',
        });
    }
    /**
     * Track current user's geolocation
     * @returns any Location tracking status
     * @throws ApiError
     */
    public geoIpControllerTrackLocation(): Observable<{
        success?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/geo-ip/track-location',
        });
    }
    /**
     * Get active users by location (Admin/Manager only)
     * @returns UserLocationStatsDto Active users by location
     * @throws ApiError
     */
    public geoIpControllerGetActiveUsersByLocation(): Observable<Array<UserLocationStatsDto>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/geo-ip/active-users',
        });
    }
    /**
     * Get registered users by location (Admin/Manager only)
     * @returns UserLocationStatsDto Registered users by location
     * @throws ApiError
     */
    public geoIpControllerGetRegisteredUsersByLocation(): Observable<Array<UserLocationStatsDto>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/geo-ip/registered-users',
        });
    }
    /**
     * Get a user's location history (Admin only)
     * @param userId User ID
     * @param limit Maximum records to return
     * @returns any User's location history
     * @throws ApiError
     */
    public geoIpControllerGetUserLocationHistory(
        userId: number,
        limit?: number,
    ): Observable<Array<{
        ipAddress?: string;
        country?: string;
        city?: string;
        latitude?: number;
        longitude?: number;
        loginAt?: string;
        userAgent?: string;
    }>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/geo-ip/user/{userId}/history',
            path: {
                'userId': userId,
            },
            query: {
                'limit': limit,
            },
        });
    }
}
