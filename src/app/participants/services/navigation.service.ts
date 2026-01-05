import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private previousUrl = '';
  private currentUrl = '';

  constructor(private router: Router) {
    this.currentUrl = this.router.url;

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const navigationEnd = event as NavigationEnd;
        this.previousUrl = this.currentUrl;
        this.currentUrl = navigationEnd.url;
      });
  }

  getPreviousUrl(): string {
    return this.previousUrl;
  }

  getCurrentUrl(): string {
    return this.currentUrl;
  }

  cameFromAllParticipants(): boolean {
    return this.previousUrl.includes('/participants/all');
  }

  cameFromParticipantsDashboard(): boolean {
    return (
      this.previousUrl.includes('/participants/dashboard') || this.previousUrl === '/participants'
    );
  }
}
