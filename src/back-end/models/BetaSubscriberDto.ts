/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type BetaSubscriberDto = {
    /**
     * The ID of the beta subscriber
     */
    id: number;
    /**
     * The ID of the user
     */
    userId: number;
    /**
     * Whether the user wants to receive beta feature notifications
     */
    receiveNotifications: boolean;
    /**
     * User preferences for beta features
     */
    preferences: string;
    /**
     * The date when the user subscribed to the beta program
     */
    subscribedAt: string;
    /**
     * Whether the subscription is active
     */
    isActive: boolean;
};

