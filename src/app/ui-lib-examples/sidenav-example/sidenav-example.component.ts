import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

import {
  SidenavComponent,
  NavItem,
  SidenavVariant,
  SidenavService,
} from '@artificial-sense/ui-lib';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-sidenav-example',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, CardModule, SidenavComponent],
  templateUrl: './sidenav-example.component.html',
  styleUrl: './sidenav-example.component.scss',
})
export class SidenavExampleComponent implements OnInit, OnDestroy {
  // Currently selected variant
  selectedVariant: SidenavVariant = '1';

  // Sidenav expanded state observable
  expanded$: Observable<boolean>;
  expanded = true;

  // Selected navigation item to display details
  selectedItem: NavItem | null = null;

  // Sample navigation items with rich configuration
  navigationItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      route: '/dashboard',
    },
    {
      label: 'Analytics',
      icon: 'pi pi-chart-bar',
      expanded: true,
      children: [
        {
          label: 'Reports',
          icon: 'pi pi-file',
          route: '/analytics/reports',
        },
        {
          label: 'Statistics',
          icon: 'pi pi-chart-line',
          route: '/analytics/statistics',
        },
        {
          label: 'Performance',
          icon: 'pi pi-bolt',
          route: '/analytics/performance',
        },
      ],
    },
    {
      label: 'User Management',
      icon: 'pi pi-users',
      children: [
        {
          label: 'List Users',
          icon: 'pi pi-list',
          route: '/users/list',
        },
        {
          label: 'Add User',
          icon: 'pi pi-user-plus',
          route: '/users/add',
        },
        {
          label: 'User Groups',
          icon: 'pi pi-sitemap',
          route: '/users/groups',
        },
      ],
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      route: '/settings',
    },
    {
      label: 'Disabled Option',
      icon: 'pi pi-lock',
      disabled: true,
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      action: () => this.logout(),
    },
  ];

  private subscription: Subscription = new Subscription();

  constructor(private sidenavService: SidenavService) {
    // Subscribe to the expanded state observable
    this.expanded$ = this.sidenavService.expanded$;

    // Set initial items in the service
    this.sidenavService.setItems(this.navigationItems);
  }

  ngOnInit(): void {
    // Subscribe to expanded state changes
    this.subscription.add(
      this.sidenavService.expanded$.subscribe((expanded) => {
        this.expanded = expanded;
      }),
    );

    // Optional: You can set a specific route to be active on initialization
    this.sidenavService.activateByRoute('/dashboard');
  }

  ngOnDestroy(): void {
    // Clean up subscription
    this.subscription.unsubscribe();
  }

  // Toggle sidenav expanded state
  toggleSidenav(): void {
    this.sidenavService.toggleExpanded();
  }

  // Event handler for navigation item click
  onNavItemClick(item: NavItem): void {
    console.log('Navigation item clicked:', item);
    this.selectedItem = item;

    // Handle special actions if needed
    if (item.action) {
      item.action();
    }
  }

  // Logout method
  logout(): void {
    console.log('Logout action triggered');
    alert('Logging out...');
  }
}
