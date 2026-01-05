/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateUserDto = {
    /**
     * The username of the user
     */
    username?: string;
    /**
     * The email of the user
     */
    email?: string;
    /**
     * The role of the user
     */
    role?: UpdateUserDto.role;
    /**
     * The password of the user
     */
    password?: string;
    /**
     * CSRF token for security verification
     */
    _csrf?: string;
};
export namespace UpdateUserDto {
    /**
     * The role of the user
     */
    export enum role {
        ADMIN = 'admin',
        USER = 'user',
        MANAGER = 'manager',
    }
}

