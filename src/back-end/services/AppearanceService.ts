/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { AppearanceSettingsDto } from '../models/AppearanceSettingsDto';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
    providedIn: 'root',
})
export class AppearanceService {
    constructor(public readonly http: HttpClient) {}
    /**
     * Get current user appearance settings
     * @returns AppearanceSettingsDto The user's appearance settings
     * @throws ApiError
     */
    public appearanceControllerGetAppearanceSettings(): Observable<AppearanceSettingsDto> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/appearance/settings',
        });
    }
    /**
     * Save or update appearance settings
     * @param requestBody
     * @returns AppearanceSettingsDto The appearance settings have been saved
     * @throws ApiError
     */
    public appearanceControllerSaveAppearanceSettings(
        requestBody: AppearanceSettingsDto,
    ): Observable<AppearanceSettingsDto> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/appearance/settings',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
