/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TokenResponseDto = {
    /**
     * Success message
     */
    message: string;
    /**
     * Status code for the operation
     */
    code: string;
    /**
     * Additional details about the operation
     */
    details?: Record<string, any>;
    /**
     * Timestamp of when the operation occurred
     */
    timestamp: string;
    /**
     * CSRF Token
     */
    csrfToken: string;
};

