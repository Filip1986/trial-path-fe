import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  signal,
  WritableSignal,
} from '@angular/core';

import { Router, NavigationEnd, ActivatedRoute, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-studies-layout',
  standalone: true,
  imports: [RouterOutlet, MenuModule, ButtonModule, BreadcrumbModule],
  templateUrl: './studies-layout.component.html',
  styleUrls: ['./studies-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudiesLayoutComponent implements OnInit {
  breadcrumbItems: WritableSignal<MenuItem[]> = signal<MenuItem[]>([]);
  homeBreadcrumb: MenuItem = {
    icon: 'pi pi-home',
    routerLink: '/',
  };

  private destroyRef: DestroyRef = inject(DestroyRef);

  quickActions = [
    {
      label: 'Create Study',
      icon: 'pi pi-plus',
      routerLink: ['/studies/create1'],
    },
    {
      label: 'Import Studies',
      icon: 'pi pi-upload',
      command: (): void => this.importStudies(),
    },
    {
      label: 'Export Data',
      icon: 'pi pi-download',
      command: (): void => this.exportData(),
    },
  ];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // Initialize breadcrumbs based on current route
    this.updateBreadcrumbs();

    // Listen for route changes to update breadcrumbs
    this.router.events
      .pipe(
        filter((event): boolean => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((): void => {
        this.updateBreadcrumbs();
      });
  }

  private updateBreadcrumbs(): void {
    const url: string = this.router.url;
    const segments: string[] = url.split('/').filter((segment: string): boolean => segment !== '');

    const items: MenuItem[] = [];

    if (segments.length <= 1) {
      this.breadcrumbItems.set([]); // No breadcrumbs needed for base route
      return;
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

    if (secondSegment === 'list1') {
      items.push({
        label: 'All Studies1',
        routerLink: '/studies/list1',
      });
      this.breadcrumbItems.set(items);
      return;
    }

    if (secondSegment === 'list2') {
      items.push({
        label: 'All Studies2',
        routerLink: '/studies/list2',
      });
      this.breadcrumbItems.set(items);
      return;
    }

    if (secondSegment === 'create1') {
      items.push({
        label: 'Create Study',
        routerLink: '/studies/create1',
      });
      this.breadcrumbItems.set(items);
      return;
    }

    if (secondSegment === 'create2') {
      items.push({
        label: 'Create Study',
        routerLink: '/studies/create2',
      });
      this.breadcrumbItems.set(items);
      return;
    }

    // If we get here, assume it's a study ID route
    if (this.isStudyId(secondSegment)) {
      // Always add "All Studies1" first for study detail pages
      // This ensures consistent breadcrumb behavior regardless of navigation path
      items.push({
        label: 'All Studies1',
        routerLink: '/studies/list1',
      });

      // Add study details
      items.push({
        label: 'Study Details',
        routerLink: `/studies/${secondSegment}`,
      });

      // Check for edit route
      if (segments[2] === 'edit') {
        items.push({
          label: 'Edit Study',
        });
      }
      this.breadcrumbItems.set(items);
    } else {
      // Fallback for any other routes
      items.push(this.getGenericRouteBreadcrumb());
      this.breadcrumbItems.set(items);
    }
  }

  private getGenericRouteBreadcrumb(): MenuItem {
    let route: ActivatedRoute = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }

    if (route.snapshot.data['breadcrumb']) {
      return {
        label: route.snapshot.data['breadcrumb'],
      };
    } else {
      // Fallback: capitalize the segment
      const segments: string[] = this.router.url
        .split('/')
        .filter((segment: string): boolean => segment !== '');
      const secondSegment: string = segments[1];
      const label: string = secondSegment.charAt(0).toUpperCase() + secondSegment.slice(1);
      return { label };
    }
  }

  private isStudyId(segment: string): boolean {
    // Check if the segment looks like a study ID (could be UUID, number, etc.)
    return /^[a-zA-Z0-9-]+$/.test(segment) && segment.length > 2;
  }

  importStudies(): void {
    console.log('Import studies functionality');
  }

  exportData(): void {
    console.log('Export data functionality');
  }
}
