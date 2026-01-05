/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserListDto = {
    /**
     * The ID of the user
     */
    id: number;
    /**
     * The username of the user
     */
    username: string;
    /**
     * The email of the user
     */
    email: string;
    /**
     * The role of the user
     */
    role: string;
    /**
     * Whether the user's email is confirmed
     */
    isEmailConfirmed: boolean;
    /**
     * The version of the privacy policy accepted by the user
     */
    privacyPolicyVersion?: string | null;
    /**
     * The timestamp when the user accepted the privacy policy
     */
    privacyPolicyAcceptanceTimestamp?: string | null;
    /**
     * Whether the user account is suspended
     */
    isSuspended: boolean;
    /**
     * Reason for account suspension
     */
    suspensionReason?: string | null;
    /**
     * When the user first logged in
     */
    firstLoginAt?: string | null;
    /**
     * When the account was suspended
     */
    suspendedAt?: string | null;
};

