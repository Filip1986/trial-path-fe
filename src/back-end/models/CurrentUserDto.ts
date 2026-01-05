/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmailVerificationStatusDto } from './EmailVerificationStatusDto';
export type CurrentUserDto = {
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
    role: CurrentUserDto.role;
    /**
     * Whether the user's email is confirmed
     */
    isEmailConfirmed: boolean;
    /**
     * The user's email verification status
     */
    emailVerificationStatus: EmailVerificationStatusDto;
    /**
     * Whether the user account is suspended
     */
    isSuspended: boolean;
    /**
     * Reason for account suspension
     */
    suspensionReason?: string;
    /**
     * Whether the user needs to accept the latest privacy policy
     */
    needsPrivacyPolicyAcceptance: boolean;
    /**
     * The latest privacy policy version
     */
    latestPrivacyPolicyVersion?: string;
    /**
     * The version of the privacy policy accepted by the user
     */
    privacyPolicyVersion?: string;
};
export namespace CurrentUserDto {
    /**
     * The role of the user
     */
    export enum role {
        ADMIN = 'admin',
        USER = 'user',
        MANAGER = 'manager',
    }
}

