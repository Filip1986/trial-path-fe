/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { CreateUserDto } from '../models/CreateUserDto';
import type { CurrentUserDto } from '../models/CurrentUserDto';
import type { ForgotPasswordDto } from '../models/ForgotPasswordDto';
import type { SuspendUserDto } from '../models/SuspendUserDto';
import type { UpdateUserDto } from '../models/UpdateUserDto';
import type { UserDto } from '../models/UserDto';
import type { UserListDto } from '../models/UserListDto';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(public readonly http: HttpClient) {}
    /**
     * Get current user profile
     * @param requestBody
     * @returns CurrentUserDto Returns the current user profile
     * @throws ApiError
     */
    public userControllerGetCurrentUser(
        requestBody?: {
            /**
             * CSRF token
             */
            _csrf?: string;
        },
    ): Observable<CurrentUserDto> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/user/me',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Request password reset email
     * @param requestBody
     * @returns any Password reset email sent
     * @throws ApiError
     */
    public userControllerForgotPassword(
        requestBody: ForgotPasswordDto,
    ): Observable<{
        message?: string;
        success?: boolean;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/user/forgot-password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid email format`,
            },
        });
    }
    /**
     * Reset password using token
     * @param token Password reset token from email
     * @param requestBody
     * @returns any Password reset successful
     * @throws ApiError
     */
    public userControllerResetPassword(
        token: string,
        requestBody: {
            password: string;
            _csrf?: string;
        },
    ): Observable<{
        message?: string;
        success?: boolean;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/user/reset-password/{token}',
            path: {
                'token': token,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid or expired token`,
            },
        });
    }
    /**
     * Verify password reset token
     * @param token Password reset token to verify
     * @returns any Token is valid
     * @throws ApiError
     */
    public userControllerVerifyResetToken(
        token: string,
    ): Observable<{
        valid?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/user/verify-reset-token/{token}',
            path: {
                'token': token,
            },
            errors: {
                400: `Invalid token`,
                404: `Token not found`,
            },
        });
    }
    /**
     * Confirm email address using token
     * @param token Email confirmation token
     * @param requestBody
     * @returns any Email confirmation successful
     * @throws ApiError
     */
    public userControllerConfirmEmail(
        token: string,
        requestBody?: {
            _csrf?: string;
        },
    ): Observable<{
        message?: string;
        success?: boolean;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/user/confirm-email/{token}',
            path: {
                'token': token,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid or expired token`,
            },
        });
    }
    /**
     * Access JWT-protected content
     * @param requestBody
     * @returns any Private content accessed
     * @throws ApiError
     */
    public userControllerPrivateContent(
        requestBody?: {
            _csrf?: string;
        },
    ): Observable<{
        message?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/user/private-content-jwt',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Admin role only route
     * @param requestBody
     * @returns any Admin route accessed.
     * @throws ApiError
     */
    public userControllerAdminOnly(
        requestBody?: {
            _csrf?: string;
        },
    ): Observable<{
        message?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/user/admin-only',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden - Insufficient permissions`,
            },
        });
    }
    /**
     * User role only route
     * @param requestBody
     * @returns any User route accessed.
     * @throws ApiError
     */
    public userControllerUserOnly(
        requestBody?: {
            _csrf?: string;
        },
    ): Observable<{
        message?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/user/user-only',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden - Insufficient permissions`,
            },
        });
    }
    /**
     * Manager role only route
     * @param requestBody
     * @returns any Manager route accessed.
     * @throws ApiError
     */
    public userControllerManagerOnly(
        requestBody?: {
            _csrf?: string;
        },
    ): Observable<{
        message?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/user/manager-only',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden - Insufficient permissions`,
            },
        });
    }
    /**
     * Admin or Manager role only route
     * @param requestBody
     * @returns any Admin or Manager route accessed.
     * @throws ApiError
     */
    public userControllerAdminOrManager(
        requestBody?: {
            _csrf?: string;
        },
    ): Observable<{
        message?: string;
        timestamp?: string;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/user/admin-or-manager',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden - Insufficient permissions`,
            },
        });
    }
    /**
     * Get all users
     * @param requestBody
     * @returns UserListDto List of users retrieved successfully.
     * @throws ApiError
     */
    public userControllerFindAll(
        requestBody?: {
            _csrf?: string;
        },
    ): Observable<Array<UserListDto>> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/user',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized.`,
                403: `Forbidden - Insufficient permissions`,
            },
        });
    }
    /**
     * Create a new user (Admin only)
     * @param requestBody
     * @returns UserDto User created successfully
     * @throws ApiError
     */
    public userControllerCreateUser(
        requestBody: CreateUserDto,
    ): Observable<UserDto> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/user',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request - validation error`,
                401: `Unauthorized`,
                409: `Username or email already exists`,
            },
        });
    }
    /**
     * Resend email verification link
     * @param requestBody
     * @returns any Verification email has been resent
     * @throws ApiError
     */
    public userControllerResendVerificationEmail(
        requestBody: {
            /**
             * Email address to send verification to
             */
            email: string;
            /**
             * CSRF Token for security verification
             */
            _csrf?: string;
        },
    ): Observable<{
        message?: string;
        success?: boolean;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/user/resend-verification',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request - Invalid email format`,
                429: `Too Many Requests - Rate limit exceeded`,
            },
        });
    }
    /**
     * Check if current user email is verified
     * @param requestBody
     * @returns any Returns the email verification status
     * @throws ApiError
     */
    public userControllerCheckEmailVerificationStatus(
        requestBody?: {
            _csrf?: string;
        },
    ): Observable<{
        isVerified?: boolean;
        email?: string;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/user/email-verification-status',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Manually check if email is verified
     * @param requestBody
     * @returns any Email verification status
     * @throws ApiError
     */
    public userControllerManualEmailVerificationCheck(
        requestBody?: {
            _csrf?: string;
        },
    ): Observable<{
        verified?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/user/check-verification',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Verify email token from frontend
     * @param token Email confirmation token to verify
     * @returns any Token verification result
     * @throws ApiError
     */
    public userControllerVerifyEmailToken(
        token: string,
    ): Observable<{
        success?: boolean;
        message?: string;
        userId?: number | null;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/api/user/verify-email-token/{token}',
            path: {
                'token': token,
            },
            errors: {
                400: `Invalid token format`,
            },
        });
    }
    /**
     * Update a user by ID
     * @param id User ID
     * @param requestBody
     * @returns UserDto User updated successfully
     * @throws ApiError
     */
    public userControllerUpdateUser(
        id: string,
        requestBody: UpdateUserDto,
    ): Observable<UserDto> {
        return __request(OpenAPI, this.http, {
            method: 'PATCH',
            url: '/api/user/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request - validation error`,
                401: `Unauthorized`,
                403: `Forbidden - Insufficient permissions`,
                404: `User not found`,
                409: `Username or email already exists`,
                500: `Internal server error 1`,
            },
        });
    }
    /**
     * Delete a user by ID
     * @param id User ID
     * @returns any User deleted successfully
     * @throws ApiError
     */
    public userControllerDeleteUser(
        id: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/api/user/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad request - invalid user ID`,
                404: `User not found`,
            },
        });
    }
    /**
     * Suspend or unsuspend a user account
     * @param id User ID
     * @param requestBody
     * @returns UserDto User suspension status updated successfully
     * @throws ApiError
     */
    public userControllerSuspendUser(
        id: string,
        requestBody: SuspendUserDto,
    ): Observable<UserDto> {
        return __request(OpenAPI, this.http, {
            method: 'PATCH',
            url: '/api/user/{id}/suspension',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                404: `User not found`,
            },
        });
    }
    /**
     * Check if a user account is suspended
     * @param id User ID
     * @returns any User suspension status retrieved successfully
     * @throws ApiError
     */
    public userControllerCheckSuspension(
        id: string,
    ): Observable<{
        isSuspended?: boolean;
        reason?: string | null;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/user/{id}/suspension',
            path: {
                'id': id,
            },
            errors: {
                404: `User not found`,
            },
        });
    }
    /**
     * Get total number of registered users
     * @returns any Returns the total count of registered users
     * @throws ApiError
     */
    public userControllerGetUserCount(): Observable<{
        count?: number;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/api/user/count',
        });
    }
}
