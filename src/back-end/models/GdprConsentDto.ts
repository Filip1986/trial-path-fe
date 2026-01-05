/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GdprConsentDto = {
    /**
     * Consent for necessary/essential cookies (always required)
     */
    necessaryCookies: boolean;
    /**
     * Consent for analytics cookies
     */
    analyticsCookies: boolean;
    /**
     * Consent for marketing cookies
     */
    marketingCookies: boolean;
    /**
     * Consent for preferences/functionality cookies
     */
    preferencesCookies: boolean;
    /**
     * Consent for third-party cookies
     */
    thirdPartyCookies: boolean;
    /**
     * Version of the consent form that was accepted
     */
    consentVersion?: string;
    /**
     * CSRF Token for security verification
     */
    _csrf?: string;
};

