/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserDto = {
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
     * The email confirmation token
     */
    emailConfirmationToken: string;
    /**
     * The email confirmation token expiration time
     */
    emailConfirmationTokenExpiresAt: string;
    /**
     * Whether the email is confirmed
     */
    isEmailConfirmed: boolean;
    /**
     * The role of the user
     */
    role: UserDto.role;
    /**
     * The password reset token expiration time
     */
    passwordResetTokenExpiresAt: string;
    /**
     * The language
     */
    language: string;
    /**
     * The version of the accepted privacy policy
     */
    privacyPolicyVersion: string;
    /**
     * The timestamp when the privacy policy was accepted
     */
    privacyPolicyAcceptanceTimestamp: string;
    /**
     * Whether the user account is suspended
     */
    isSuspended: boolean;
    /**
     * Reason for account suspension
     */
    suspensionReason: string;
    /**
     * When the account was suspended
     */
    suspendedAt: string;
};
export namespace UserDto {
    /**
     * The role of the user
     */
    export enum role {
        ADMIN = 'admin',
        USER = 'user',
        MANAGER = 'manager',
    }
}

