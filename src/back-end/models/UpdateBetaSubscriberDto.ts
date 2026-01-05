/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateBetaSubscriberDto = {
    /**
     * Whether the user wants to receive beta feature notifications
     */
    receiveNotifications?: boolean;
    /**
     * User preferences for beta features in JSON format
     */
    preferences?: string;
    /**
     * Whether the subscription is active
     */
    isActive?: boolean;
    /**
     * CSRF token for security verification
     */
    _csrf?: string;
};

