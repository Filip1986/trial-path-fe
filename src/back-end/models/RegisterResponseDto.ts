/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RegisterResponseDto = {
    /**
     * JWT access token used for authenticating subsequent requests.
     */
    accessToken: string;
    /**
     * Refresh token used to generate a new access token upon expiry.
     */
    refreshToken: string;
    /**
     * Unique identifier for the refresh token, used for token management.
     */
    refreshTokenIdentifier: string;
    /**
     * Lifetime of the access token in seconds.
     */
    numberAccessTokenExpiryTime: number;
    /**
     * Lifetime of the refresh token in seconds.
     */
    refreshTokenExpiryTime: number;
    /**
     * CSRF token for protecting against Cross-Site Request Forgery attacks.
     */
    csrfToken: string;
};

