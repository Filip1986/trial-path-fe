/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AppearanceSettingsDto = {
    /**
     * Theme mode preference
     */
    theme: AppearanceSettingsDto.theme;
    /**
     * Primary color in hex format
     */
    primaryColor: string;
    /**
     * Selected font family
     */
    selectedFont: AppearanceSettingsDto.selectedFont;
    /**
     * Whether borders are rounded
     */
    isBordersRounded: boolean;
    /**
     * Selected shadow style
     */
    selectedShadow: string;
    /**
     * Selected background for dark mode
     */
    selectedBackground?: string;
    /**
     * Whether layout is boxed
     */
    isBoxedLayout: boolean;
    /**
     * Whether compact mode is enabled
     */
    compactMode: boolean;
    /**
     * CSRF Token for security verification
     */
    _csrf?: string;
};
export namespace AppearanceSettingsDto {
    /**
     * Theme mode preference
     */
    export enum theme {
        LIGHT = 'light',
        DARK = 'dark',
        SYSTEM = 'system',
    }
    /**
     * Selected font family
     */
    export enum selectedFont {
        DEFAULT = 'default',
        NOTO_SERIF = 'noto-serif',
        BREE_SERIF = 'bree-serif',
    }
}

