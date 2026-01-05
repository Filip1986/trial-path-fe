import {
  Component,
  OnInit,
  DestroyRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Injector,
  effect,
  Signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  NavItem,
  SidenavService,
  SidenavFooter1Component,
  Sidenav1Component,
} from '@artificial-sense/ui-lib';
import { Store } from '@ngxs/store';
import { AuthState, UserDetails } from '../../core/store/auth.state';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ThemeService } from '@artificial-sense/ui-lib';
import { AuthService } from '../../core/services/app-auth.service';
import { LayoutState } from '../../core/store/layout.state';
import {
  ClinicalRoles,
  getRolePermissions,
  RolePermissions,
} from '../../core/models/clinical-roles';
import { RoleSelectorComponent } from '../../role-selector/role-selector.component';
import {
  AnimatedLogo2Component,
  ThicknessLevel,
} from '../../showcases/gsap-examples/animated-logo-2/animated-logo-2.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
    BadgeModule,
    AvatarModule,
    MenuModule,
    FormsModule,
    ToggleSwitchModule,
    SidenavFooter1Component,
    Sidenav1Component,
    RoleSelectorComponent,
    AnimatedLogo2Component,
    // Add the role selector component
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent implements OnInit {
  // Navigation items
  navigationItems: NavItem[] = [];

  // User state
  user$: Observable<UserDetails | null>;
  user: UserDetails | null = null;
  private readonly injector!: Injector;
  private cdr!: ChangeDetectorRef;
  private readonly userSig!: Signal<UserDetails | null>;
  private readonly emailBannerSig!: Signal<boolean>;
  username = '';
  userIsBetaTester = false;

  // Layout state
  expanded$: Observable<boolean>;
  isDarkMode = false;
  emailBannerVisible = false;

  // Menu items for user dropdown
  menuItems: MenuItem[] = [];

  // Search functionality
  searchTerm = '';

  // Role management
  currentUserRole: ClinicalRoles = ClinicalRoles.GUEST;
  userPermissions: RolePermissions = getRolePermissions(ClinicalRoles.GUEST);

  public logoThickness: ThicknessLevel = 'thick';

  // Study counts for badges (you may want to get this from a service)
  studyCounts = {
    urgentItems: 0,
    pendingQueries: 0,
    protocolDeviations: 0,
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store,
    private sidenavService: SidenavService,
    private themeService: ThemeService,
    private messageService: MessageService,
    private destroyRef: DestroyRef,
    injector: Injector,
    cdr: ChangeDetectorRef,
  ) {
    this.injector = injector;
    this.cdr = cdr;
    // Initialize observables
    this.user$ = this.store.select(AuthState.getUser);
    this.expanded$ = this.sidenavService.expanded$;

    // Signals
    this.userSig = toSignal(this.store.select(AuthState.getUser), {
      initialValue: null,
      injector: this.injector,
    });

    effect((): void => {
      const user: UserDetails | null = this.userSig();
      this.user = user;
      if (user) {
        this.username = user.username || user.email || 'User';
        this.userIsBetaTester = user.isBetaTester || false;
        this.currentUserRole = (user.role as ClinicalRoles) || ClinicalRoles.GUEST;
        this.userPermissions = getRolePermissions(this.currentUserRole);
      } else {
        this.username = '';
        this.userIsBetaTester = false;
        this.currentUserRole = ClinicalRoles.GUEST;
        this.userPermissions = getRolePermissions(ClinicalRoles.GUEST);
      }
      this.initializeNavigation();
      this.cdr.markForCheck();
    });

    // Theme changes (keep two-way binding compatibility)
    this.themeService.isDarkMode$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isDark: boolean): void => {
        this.isDarkMode = isDark;
        this.cdr.markForCheck();
      });

    // Email banner visibility as a signal
    this.emailBannerSig = toSignal(this.store.select(LayoutState.isEmailBannerVisible), {
      initialValue: false,
      injector: this.injector,
    });
    effect((): void => {
      this.emailBannerVisible = this.emailBannerSig();
      this.cdr.markForCheck();
    });
  }

  ngOnInit(): void {
    this.initializeNavigation();
  }

  /**
   * Handle role change from the role selector
   * @param newRole The selected clinical role
   */
  onRoleChanged(newRole: ClinicalRoles): void {
    // Update current role and permissions
    this.currentUserRole = newRole;
    this.userPermissions = getRolePermissions(newRole);

    // Re-initialize navigation with new permissions
    this.initializeNavigation();

    // Show a confirmation message
    this.messageService.add({
      severity: 'info',
      summary: 'Role Changed',
      detail: `Switched to ${newRole} role`,
      life: 3000,
    });

    // You might want to update the user's role in the backend here
    // this.authService.updateUserRole(newRole).subscribe();

    // Optional: Navigate to dashboard to reflect new permissions
    // if (this.router.url !== '/dashboard') {
    //   void this.router.navigate(['/dashboard']);
    // }
  }

  /**
   * Handle navigation item click
   * @param item The clicked navigation item
   */
  onNavItemClick(item: NavItem): void {
    // Handle special actions if needed
    if (item.action) {
      item.action();
    }
  }

  /**
   * Toggle sidenav expanded state
   */
  toggleSidenav(): void {
    this.sidenavService.toggleExpanded();
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  /**
   * Perform search action
   */
  performSearch(): void {
    if (this.searchTerm.trim()) {
      this.messageService.add({
        severity: 'info',
        summary: 'Search',
        detail: `Searching for: ${this.searchTerm}`,
      });
      // Implement actual search functionality here
    }
  }

  // Navigation methods
  navigateToProfile(): void {
    void this.router.navigate(['/profile']);
  }

  navigateToSettings(): void {
    void this.router.navigate(['/settings']);
  }

  navigateToAdminView(): void {
    void this.router.navigate(['/admin-dashboard']);
  }

  login(): void {
    void this.router.navigate(['/login']);
  }

  register(): void {
    void this.router.navigate(['/register']);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: (): void => {
        void this.router.navigate(['/login']);
      },
      error: (): void => {
        void this.router.navigate(['/login']);
      },
    });
  }

  /**
   * Initialize navigation items based on user role and permissions
   */
  private initializeNavigation(): void {
    const isLoggedIn = !!this.user;
    const permissions: RolePermissions = this.userPermissions;

    if (isLoggedIn) {
      this.navigationItems = [
        // Dashboard - Always visible for logged-in users
        {
          label: 'Dashboard',
          icon: 'pi pi-home',
          route: permissions.canAccessAdminSettings ? '/admin-dashboard' : '/user-dashboard',
          badge:
            this.studyCounts.urgentItems > 0
              ? { value: this.studyCounts.urgentItems.toString(), severity: 'danger' }
              : undefined,
        },
        {
          label: 'UI-LIB',
          icon: 'pi pi-file-o',
          expanded: false,
          children: [
            {
              label: 'Article Card 1',
              icon: 'pi pi-list',
              route: '/article-card-1',
            },
            {
              label: 'Article Card 2',
              icon: 'pi pi-list',
              route: '/article-card-2',
            },
          ],
        },
        // Studies - Based on permissions
        ...(permissions.canViewAllStudies
          ? [
              {
                label: 'Studies',
                icon: 'pi pi-file-o',
                expanded: false,
                children: [
                  {
                    label: 'Dashboard',
                    icon: 'pi pi-list',
                    route: '/studies/dashboard', // CHANGED: was '/studies', now '/studies/dashboard'
                  },
                  ...(permissions.canEditStudyData
                    ? [
                        {
                          label: 'Create Study1',
                          icon: 'pi pi-plus',
                          route: '/studies/create1',
                        },
                        {
                          label: 'Create Study2',
                          icon: 'pi pi-plus',
                          route: '/studies/create2',
                        },
                      ]
                    : []),
                  {
                    label: 'All Studies 1',
                    icon: 'pi pi-list',
                    route: '/studies/list1',
                  },
                  {
                    label: 'All Studies 2',
                    icon: 'pi pi-list',
                    route: '/studies/list2',
                  },
                ],
              },
            ]
          : []),

        // Participant Management - Based on permissions
        ...(permissions.canEditStudyData || permissions.canViewAllStudies
          ? [
              {
                label: 'Participants',
                icon: 'pi pi-users',
                expanded: false,
                children: [
                  ...(permissions.canEditStudyData
                    ? [
                        {
                          label: 'Dashboard',
                          icon: 'pi pi-list',
                          route: '/participants/dashboard',
                        },
                        {
                          label: 'Enroll Participant',
                          icon: 'pi pi-user-plus',
                          route: '/participants/enroll',
                        },
                      ]
                    : []),

                  {
                    label: 'All Participants',
                    icon: 'pi pi-list',
                    route: '/participants/all',
                  },
                  {
                    label: 'Screening',
                    icon: 'pi pi-search',
                    route: '/participants/screening',
                  },
                ],
              },
            ]
          : []),

        // Data Management - Based on permissions
        ...(permissions.canEditStudyData || permissions.canExportData || permissions.canViewReports
          ? [
              {
                label: 'Data Management',
                icon: 'pi pi-database',
                expanded: false,
                children: [
                  ...(permissions.canEditStudyData
                    ? [
                        {
                          label: 'Data Entry',
                          icon: 'pi pi-pencil',
                          route: '/data/entry',
                        },
                        {
                          label: 'Query Management',
                          icon: 'pi pi-question-circle',
                          route: '/data/queries',
                          badge:
                            this.studyCounts.pendingQueries > 0
                              ? {
                                  value: this.studyCounts.pendingQueries.toString(),
                                  severity: 'warning',
                                }
                              : undefined,
                        },
                      ]
                    : []),
                  ...(permissions.canViewReports
                    ? [
                        {
                          label: 'Reports',
                          icon: 'pi pi-chart-line',
                          route: '/data/reports',
                        },
                      ]
                    : []),
                  ...(permissions.canExportData
                    ? [
                        {
                          label: 'Data Export',
                          icon: 'pi pi-download',
                          route: '/data/export',
                        },
                      ]
                    : []),
                ],
              },
            ]
          : []),

        // Safety & Monitoring - Based on permissions
        ...(permissions.canMonitorStudies || permissions.canEditStudyData
          ? [
              {
                label: 'Safety & Monitoring',
                icon: 'pi pi-shield',
                expanded: false,
                children: [
                  {
                    label: 'Adverse Events',
                    icon: 'pi pi-exclamation-triangle',
                    route: '/safety/adverse-events',
                  },
                  {
                    label: 'Protocol Deviations',
                    icon: 'pi pi-times-circle',
                    route: '/safety/deviations',
                    badge:
                      this.studyCounts.protocolDeviations > 0
                        ? {
                            value: this.studyCounts.protocolDeviations.toString(),
                            severity: 'danger',
                          }
                        : undefined,
                  },
                  ...(permissions.canMonitorStudies
                    ? [
                        {
                          label: 'Site Visits',
                          icon: 'pi pi-map-marker',
                          route: '/safety/site-visits',
                        },
                      ]
                    : []),
                ],
              },
            ]
          : []),

        // Regulatory & Compliance - Based on permissions
        ...(permissions.canAccessRegulatory
          ? [
              {
                label: 'Regulatory',
                icon: 'pi pi-verified',
                expanded: false,
                children: [
                  {
                    label: 'Documents',
                    icon: 'pi pi-file',
                    route: '/regulatory/documents',
                  },
                  {
                    label: 'Submissions',
                    icon: 'pi pi-send',
                    route: '/regulatory/submissions',
                  },
                  {
                    label: 'Compliance',
                    icon: 'pi pi-check-circle',
                    route: '/regulatory/compliance',
                  },
                ],
              },
            ]
          : []),

        // Pharmacy Management - Based on permissions
        ...(permissions.canManagePharmacy
          ? [
              {
                label: 'Pharmacy',
                icon: 'pi pi-heart',
                expanded: false,
                children: [
                  {
                    label: 'Drug Inventory',
                    icon: 'pi pi-list',
                    route: '/pharmacy/inventory',
                  },
                  {
                    label: 'Dispensing',
                    icon: 'pi pi-send',
                    route: '/pharmacy/dispensing',
                  },
                  {
                    label: 'Returns',
                    icon: 'pi pi-undo',
                    route: '/pharmacy/returns',
                  },
                ],
              },
            ]
          : []),

        // Administration - Based on permissions
        ...(permissions.canManageUsers || permissions.canAccessAdminSettings
          ? [
              {
                label: 'Settings & Administration',
                icon: 'pi pi-cog',
                expanded: false,
                children: [
                  ...(permissions.canManageUsers
                    ? [
                        {
                          label: 'User Management',
                          icon: 'pi pi-users',
                          route: '/admin/users',
                        },
                        {
                          label: 'Role Permissions',
                          icon: 'pi pi-key',
                          route: '/admin/permissions',
                        },
                      ]
                    : []),
                  ...(permissions.canAccessAdminSettings
                    ? [
                        {
                          label: 'System Settings',
                          icon: 'pi pi-sliders-h',
                          route: '/admin/system',
                        },
                        {
                          label: 'Site Configuration',
                          icon: 'pi pi-building',
                          route: '/admin/sites',
                        },
                      ]
                    : []),
                ],
              },
            ]
          : []),
      ];

      // Set user menu items in header
      this.menuItems = [
        {
          label: 'Profile',
          icon: 'pi pi-user',
          command: (): void => this.navigateToProfile(),
        },
        {
          label: 'Settings',
          icon: 'pi pi-cog',
          command: (): void => this.navigateToSettings(),
        },
        {
          separator: true,
        },
        {
          label: 'Logout',
          icon: 'pi pi-sign-out',
          command: (): void => this.logout(),
        },
      ];
    } else {
      // Guest navigation
      this.navigationItems = [
        {
          label: 'Home',
          icon: 'pi pi-home',
          route: '/',
        },
        {
          label: 'Features',
          icon: 'pi pi-star',
          route: '/features',
        },
        {
          label: 'Documentation',
          icon: 'pi pi-book',
          route: '/documentation',
        },
        {
          label: 'ECRF2',
          icon: 'pi pi-check-square',
          route: '/ecrf2',
        },
        {
          label: 'GSAP Showcase',
          icon: 'pi pi-sparkles',
          route: '/gsap-showcase',
          children: [
            {
              label: 'Scroll Animation',
              icon: 'pi pi-list',
              route: '/gsap/scroll-animation-1',
            },
            {
              label: 'Enroll Participant',
              icon: 'pi pi-user-plus',
              route: '/participants/enroll',
            },
          ],
        },
      ];

      this.menuItems = [
        {
          label: 'Login',
          icon: 'pi pi-sign-in',
          command: (): void => this.login(),
        },
        {
          label: 'Register',
          icon: 'pi pi-user-plus',
          command: (): void => this.register(),
        },
      ];
    }

    // Initialize the navigation items in the service
    this.sidenavService.setItems(this.navigationItems);
  }
}
