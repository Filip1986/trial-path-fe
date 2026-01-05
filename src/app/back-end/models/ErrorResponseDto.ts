/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ErrorResponseDto = {
    /**
     * Error message
     */
    message: string;
    /**
     * HTTP status code
     */
    statusCode: number;
    /**
     * Error code for client-side error handling
     */
    code?: string;
    /**
     * Additional error details
     */
    details?: Record<string, any>;
    /**
     * Request path that caused the error
     */
    path?: string;
    /**
     * Timestamp of when the error occurred
     */
    timestamp?: string;
};

