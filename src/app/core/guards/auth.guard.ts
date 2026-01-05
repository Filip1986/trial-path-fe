import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ActivatedRouteSnapshot, CanActivateFn, Router, UrlTree } from '@angular/router';
import { Store } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { AuthState, UserDetails } from '../store/auth.state';
import { AuthService } from '../services/app-auth.service';
import { isValidRole, UserRole } from '../models/roles';

// Auth guard function to protect routes based on user roles
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
): Observable<boolean | UrlTree> => {
  // Inject necessary services
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  const store: Store = inject(Store);
  const messageService: MessageService = inject(MessageService);

  // Get allowed roles from route data
  // Cast as string[] since route data provides strings
  const allowedRoles = route.data['roles'] as UserRole[];

  // Get the currently stored user from the state
  const storedUser: UserDetails | null = store.selectSnapshot(AuthState.getUser);

  // If user is already stored, validate their role
  if (storedUser) {
    return of(validateUserRole(storedUser, allowedRoles, router, messageService));
  }

  // If user is not stored, fetch and store the current user, then validate their role
  return authService.fetchAndStoreCurrentUser().pipe(
    map((user: UserDetails | null): boolean | UrlTree =>
      user
        ? validateUserRole(user, allowedRoles, router, messageService)
        : router.createUrlTree(['/login']),
    ),
    // Handle errors by redirecting to the login page
    catchError((): Observable<UrlTree> => of(router.createUrlTree(['/login']))),
  );
};

// Function to validate the user's role against allowed roles
function validateUserRole(
  user: UserDetails,
  allowedRoles: Array<UserRole> | undefined,
  router: Router,
  messageService: MessageService,
): boolean | UrlTree {
  // If no roles are specified, allow access
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  // Validate that user has a valid role first
  if (user.role && isValidRole(user.role) && allowedRoles.includes(user.role)) {
    return true;
  }

  // If the user does not have the required role, show an access denied message and redirect
  messageService.add({
    severity: 'warn',
    summary: 'Access Denied',
    detail: 'You do not have permission to access this page.',
    life: 5000,
  });

  return router.createUrlTree(['/dashboard']);
}
