import { Component, ViewChild, computed, effect, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
// PrimeNG imports
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { MenuItem, MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { PopoverModule } from 'primeng/popover';
import { Popover } from 'primeng/popover';
import { AuthState, UserDetails } from '@core/store/auth.state';
import { toSignal } from '@angular/core/rxjs-interop';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '@artificial-sense/ui-lib';
import { AuthService } from '@core/services/app-auth.service';
import { UserRole } from '@core/models/roles';

@Component({
  selector: 'app-menubar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MenubarModule,
    ButtonModule,
    AvatarModule,
    InputTextModule,
    BadgeModule,
    RippleModule,
    PopoverModule,
    ToggleSwitchModule,
    FormsModule,
  ],
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.scss',
})
export class MenubarComponent {
  items: MenuItem[] = [];
  user: UserDetails | null = null;
  isLoggedIn = false;
  isDarkMode = false;

  @ViewChild('userMenuPopover') userMenuPopover!: Popover;

  // DI via inject to allow use in signal initializers
  private readonly store: Store = inject(Store);

  // Signals
  readonly userSig: Signal<UserDetails | null> = toSignal<UserDetails | null>(
    this.store.select(AuthState.getUser),
    {
      initialValue: null,
    },
  );

  readonly isLoggedInSig: Signal<boolean> = computed((): boolean => !!this.userSig());
  readonly usernameSig: Signal<string> = computed((): string => this.userSig()?.username ?? '');
  readonly userEmailSig: Signal<string> = computed((): string => this.userSig()?.email ?? '');
  readonly userRoleSig: Signal<UserRole | ''> = computed(
    (): UserRole | '' => this.userSig()?.role ?? '',
  );

  readonly itemsSig: Signal<MenuItem[]> = computed<MenuItem[]>((): MenuItem[] => {
    const commonItems: MenuItem[] = [{ label: 'Home', icon: 'pi pi-home', routerLink: '/' }];
    if (this.isLoggedInSig()) {
      const items: MenuItem[] = [
        ...commonItems,
        { label: 'Dashboard', icon: 'pi pi-th-large', routerLink: '/dashboard' },
        { label: 'Documentation1', icon: 'pi pi-book', routerLink: '/documentation' },
        {
          label: 'Users',
          icon: 'pi pi-users',
          items: [
            { label: 'User List', icon: 'pi pi-list', routerLink: '/users' },
            { label: 'Add User', icon: 'pi pi-user-plus', badge: 'NEW' },
          ],
        },
        {
          label: 'Analytics',
          icon: 'pi pi-chart-bar',
          items: [
            { label: 'Dashboard', icon: 'pi pi-chart-line', routerLink: '/dashboard' },
            { label: 'Reports', icon: 'pi pi-file', badge: '3' },
          ],
        },
        {
          label: 'Settings',
          icon: 'pi pi-cog',
          items: [
            { label: 'Account', icon: 'pi pi-user-edit', routerLink: '/profile' },
            { label: 'Application Settings', icon: 'pi pi-sliders-h', routerLink: '/settings' },
            { label: 'Preferences', icon: 'pi pi-palette' },
            { label: 'Security', icon: 'pi pi-shield' },
          ],
        },
      ];

      if (this.userRoleSig() === 'admin') {
        items.push({ label: 'Admin', icon: 'pi pi-shield', routerLink: '/dashboard' });
      }
      return items;
    } else {
      return [
        ...commonItems,
        { label: 'Documentation', icon: 'pi pi-book', routerLink: '/documentation' },
        { label: 'About', icon: 'pi pi-info-circle' },
        { label: 'Features', icon: 'pi pi-star' },
        { label: 'Pricing', icon: 'pi pi-money-bill' },
        { label: 'Contact', icon: 'pi pi-envelope' },
        {
          label: 'Components',
          icon: 'pi-palette',
          items: [
            {
              label: 'Breadcrumbs example',
              icon: 'pi pi-envelope',
              routerLink: '/lib-breadcrumbs-example',
            },
            {
              label: 'Button 1 Example',
              icon: 'pi-stop-circle',
              routerLink: '/lib-button-1-example',
            },
            {
              label: 'Button 2 Example',
              icon: 'pi-stop-circle',
              routerLink: '/lib-button-2-example',
            },
            {
              label: 'WYSIWYG Editor',
              icon: 'pi pi-pencil',
              routerLink: '/wysiwyg-editor-example',
              badge: 'NEW',
            },
            {
              label: 'Sidenav Example',
              icon: 'pi pi-pencil',
              routerLink: '/sidenav-example',
              badge: 'NEW',
            },
          ],
        },
      ];
    }
  });

  constructor(
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService,
    private themeService: ThemeService,
  ) {
    // Sync computed signals to existing fields used in the template to avoid template changes
    effect((): void => {
      this.items = this.itemsSig();
      this.isLoggedIn = this.isLoggedInSig();
      // Keep user updated if needed elsewhere
      this.user = this.userSig();
    });
  }

  get username(): string {
    return this.usernameSig();
  }

  get userEmail(): string {
    return this.userEmailSig();
  }

  get userRole(): string {
    return this.userRoleSig();
  }

  toggle(event: Event): void {
    this.userMenuPopover.toggle(event);
  }

  login(): void {
    void this.router.navigate(['/login']);
  }

  register(): void {
    void this.router.navigate(['/register']);
  }

  navigateToProfile(): void {
    this.userMenuPopover.hide();
    void this.router.navigate(['/profile']);
  }

  navigateToInbox(): void {
    this.userMenuPopover.hide();
    // You can implement this once you have an inbox page
    console.log('Navigate to inbox');
  }

  navigateToSettings(): void {
    this.userMenuPopover.hide();
    void this.router.navigate(['/settings']);
  }

  navigateToAdminView(): void {
    this.userMenuPopover.hide();
    void this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.userMenuPopover.hide();
    this.authService.logout();
    void this.router.navigate(['/login']);
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
