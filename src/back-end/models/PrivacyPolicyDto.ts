/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PrivacyPolicyDto = {
    /**
     * The unique identifier of the privacy policy
     */
    id: number;
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
     * The date when the privacy policy was published
     */
    publishedDate: string;
    /**
     * Whether this is the active privacy policy version
     */
    isActive: boolean;
    /**
     * The date when the privacy policy was created
     */
    createdAt: string;
    /**
     * The date when the privacy policy was last updated
     */
    updatedAt: string;
};

