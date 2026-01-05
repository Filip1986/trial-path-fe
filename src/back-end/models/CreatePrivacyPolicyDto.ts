/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreatePrivacyPolicyDto = {
    /**
     * The version of the privacy policy
     */
    version: string;
    /**
     * The content of the privacy policy in markdown format
     */
    content: string;
    /**
     * The date when the privacy policy becomes effective
     */
    effectiveDate: string;
    /**
     * Whether this should be the active privacy policy version
     */
    isActive: boolean;
};

