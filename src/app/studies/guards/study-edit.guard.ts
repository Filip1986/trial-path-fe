import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { StudyApiService } from '../services/study-api.service';
import { AuthService } from '@core/services/app-auth.service';

@Injectable({
  providedIn: 'root',
})
export class StudyEditGuard implements CanActivate {
  constructor(
    private studyApiService: StudyApiService,
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const studyId = route.paramMap.get('id');

    if (!studyId) {
      this.router.navigate(['/studies']);
      return of(false);
    }

    return this.studyApiService.getStudyById(studyId).pipe(
      map((study) => {
        if (!study) {
          this.router.navigate(['/studies']);
          return false;
        }

        // Check if user has permission to edit this study
        const canEdit =
          this.authService.hasPermission('edit_study') &&
          (study.createdBy === this.authService.currentUser?.email ||
            this.authService.hasRole('admin'));

        if (!canEdit) {
          this.router.navigate(['/studies', studyId]);
          return false;
        }

        return true;
      }),
      catchError(() => {
        this.router.navigate(['/studies']);
        return of(false);
      }),
    );
  }
}
