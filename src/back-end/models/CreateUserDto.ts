/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateUserDto = {
    username: string;
    password: string;
    email: string;
    /**
     * The role of the user
     */
    role?: CreateUserDto.role;
    /**
     * CSRF Token for security verification
     */
    _csrf?: string;
};
export namespace CreateUserDto {
    /**
     * The role of the user
     */
    export enum role {
        ADMIN = 'admin',
        USER = 'user',
        MANAGER = 'manager',
    }
}

