/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GdprConsentStatusDto = {
    /**
     * Whether the user has provided GDPR consent
     */
    hasConsent: boolean;
    /**
     * The current consent version
     */
    currentVersion: string;
    /**
     * The user's consent version (if any)
     */
    userConsentVersion: string | null;
    /**
     * Whether the user needs to update their consent to the newest version
     */
    needsUpdate: boolean;
};

