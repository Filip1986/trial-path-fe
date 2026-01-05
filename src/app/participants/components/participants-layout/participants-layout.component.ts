import {
  Component,
  OnInit,
  inject,
  DestroyRef,
  signal,
  WritableSignal,
  ChangeDetectionStrategy,
} from '@angular/core';

import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-participants-layout',
  standalone: true,
  imports: [RouterOutlet, ButtonModule, BreadcrumbModule],
  templateUrl: 'participants-layout.component.html',
  styleUrls: ['participants-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantsLayoutComponent implements OnInit {
  breadcrumbItems: WritableSignal<MenuItem[]> = signal<MenuItem[]>([]);
  homeBreadcrumb: MenuItem = {
    icon: 'pi pi-home',
    routerLink: '/participants/dashboard',
    command: (): void => this.navigateToParticipantsDashboard(),
  };

  private router: Router = inject(Router);
  private destroyRef: DestroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.initializeBreadcrumbs();
    this.setupRouterSubscription();
  }

  private navigateToParticipantsDashboard(): void {
    void this.router.navigate(['/participants/dashboard']);
  }

  private initializeBreadcrumbs(): void {
    this.updateBreadcrumbs();
  }

  private setupRouterSubscription(): void {
    this.router.events
      .pipe(
        filter((event): boolean => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((): void => {
        this.updateBreadcrumbs();
      });
  }

  // Replace your entire updateBreadcrumbs method with this simplified version
  private updateBreadcrumbs(): void {
    const url: string = this.router.url;
    const segments: string[] = url.split('/').filter((segment: string): boolean => segment !== '');

    const items: MenuItem[] = [];

    if (segments.length <= 1) {
      this.breadcrumbItems.set(items);
      return; // No breadcrumbs needed for base route
    }

    const secondSegment: string = segments[1];

    // Handle all routes explicitly
    if (secondSegment === 'dashboard') {
      // Add Dashboard breadcrumb item when on dashboard
      items.push({
        label: 'Dashboard',
        // No routerLink since we're already on the dashboard
      });
      this.breadcrumbItems.set(items);
      return;
    }

    if (secondSegment === 'all') {
      items.push({
        label: 'All Participants',
        routerLink: '/participants/all',
      });
      this.breadcrumbItems.set(items);
      return;
    }

    if (secondSegment === 'enroll') {
      items.push({
        label: 'Enroll Participant',
        routerLink: '/participants/enroll',
      });
      this.breadcrumbItems.set(items);
      return;
    }

    if (secondSegment === 'screening') {
      items.push({
        label: 'Screening',
        routerLink: '/participants/screening',
      });
      this.breadcrumbItems.set(items);
      return;
    }

    // If we get here, assume it's a participant ID route
    // Always add "All Participants" first
    items.push({
      label: 'All Participants',
      routerLink: '/participants/all',
    });

    // Add participant details
    items.push({
      label: 'Participant Details',
      routerLink: `/participants/${secondSegment}`,
    });

    // Check for edit route
    if (segments[2] === 'edit') {
      items.push({
        label: 'Edit Participant',
      });
    }

    this.breadcrumbItems.set(items);
  }
}
