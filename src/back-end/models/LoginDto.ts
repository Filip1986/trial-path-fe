/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LoginDto = {
    /**
     * Username or email address
     */
    username: string;
    password: string;
    /**
     * Remember user session
     */
    rememberMe?: boolean;
    _csrf?: string;
};

