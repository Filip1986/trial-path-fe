/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SuspendUserDto = {
    /**
     * Whether the user account is suspended
     */
    isSuspended: boolean;
    /**
     * Reason for account suspension
     */
    suspensionReason: string;
    /**
     * Additional notes about the suspension
     */
    suspensionNotes?: string;
    /**
     * CSRF token for security verification
     */
    _csrf?: string;
};

