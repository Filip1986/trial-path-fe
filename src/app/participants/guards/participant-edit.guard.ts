import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ParticipantEditGuard implements CanActivate {
  private router = inject(Router);

  // Inject your auth service and participant service when available
  // private authService = inject(AuthService);
  // private participantService = inject(ParticipantService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    const participantId = route.params['id'];

    if (!participantId) {
      this.router.navigate(['/participants']);
      return false;
    }

    // Check if user has permission to edit participants
    // Replace with actual permission check logic
    return this.checkEditPermissions(participantId).pipe(
      map((canEdit) => {
        if (!canEdit) {
          // Redirect to participant view instead of edit
          this.router.navigate(['/participants', participantId]);
          return false;
        }
        return true;
      }),
      catchError(() => {
        this.router.navigate(['/participants']);
        return of(false);
      }),
    );
  }

  private checkEditPermissions(participantId: string): Observable<boolean> {
    // Mock permission check - replace with actual logic
    // This would typically check:
    // 1. User authentication status
    // 2. User role/permissions
    // 3. Participant status (e.g., can't edit completed participants)
    // 4. Study permissions

    // For now, return true for demonstration
    // In real implementation:
    // return this.authService.hasPermission('edit_participants').pipe(
    //   switchMap(hasPermission => {
    //     if (!hasPermission) return of(false);
    //     return this.participantService.canEditParticipant(participantId);
    //   })
    // );

    return of(true);
  }
}
