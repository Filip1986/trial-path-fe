/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BetaFeatureInfo } from './BetaFeatureInfo';
export type BetaFeaturesDto = {
    /**
     * List of available beta features
     */
    features: Array<BetaFeatureInfo>;
    /**
     * Whether the user is subscribed to the beta program
     */
    isSubscribed: boolean;
    /**
     * User preferences if subscribed
     */
    preferences?: string;
    /**
     * Whether the user receives notifications
     */
    receiveNotifications?: boolean;
};

