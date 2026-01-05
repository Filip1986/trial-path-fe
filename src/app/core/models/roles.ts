/**
 * Type definition for user roles in the application
 */
export type UserRole = 'admin' | 'user' | 'manager';

/**
 * Constants for user roles to prevent magic strings
 */
export const Roles = {
  ADMIN: 'admin' as UserRole,
  USER: 'user' as UserRole,
  MANAGER: 'manager' as UserRole,
} as const;

/**
 * Array of all available roles for dropdown options
 */
export const ROLE_OPTIONS = [
  { label: 'Admin', value: Roles.ADMIN },
  { label: 'User', value: Roles.USER },
  { label: 'Manager', value: Roles.MANAGER },
];

/**
 * Check if a given string is a valid user role
 * @param role The role to validate
 * @returns Boolean indicating if the role is valid
 */
export function isValidRole(role: string): role is UserRole {
  return Object.values(Roles).includes(role as UserRole);
}
