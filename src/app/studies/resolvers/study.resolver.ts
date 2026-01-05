import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StudyApiService } from '../services/study-api.service';
import { Study } from '../models/interfaces/study.interface';

@Injectable({
  providedIn: 'root',
})
export class StudyResolver implements Resolve<Study | null> {
  constructor(
    private studyApiService: StudyApiService,
    private router: Router,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Study | null> {
    const studyId = route.paramMap.get('id');

    if (!studyId) {
      this.router.navigate(['/studies']);
      return EMPTY;
    }

    return this.studyApiService.getStudyById(studyId).pipe(
      catchError(() => {
        this.router.navigate(['/studies']);
        return EMPTY;
      }),
    );
  }
}
