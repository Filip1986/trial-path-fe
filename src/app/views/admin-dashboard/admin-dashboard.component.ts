import { Component, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// PrimeNG Components
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TabsModule } from 'primeng/tabs';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';

// Services
import { BetaProgramService } from '@back-end/services/BetaProgramService';
import { UserService } from '@back-end/services/UserService';
import { GeoIpService } from '@back-end/services/GeoIpService';
import { BetaSubscriberDto } from '@back-end/models/BetaSubscriberDto';
import { UpdateUserDto } from '@back-end/models/UpdateUserDto';
import { UserListDto } from '@back-end/models/UserListDto';
import { UserLocationStatsDto } from '@back-end/models/UserLocationStatsDto';
import { SuspensionService } from '@core/services/suspension.service';
import { UserActivityService } from '@core/services/user-activity.service';

// Components
import { PrivacyPolicyManagementComponent } from '../../auth/privacy-policy-management/privacy-policy-management.component';
import { Password } from 'primeng/password';
import { MenuModule } from 'primeng/menu';
import { UserSuspensionDialogComponent } from '../../user/user-suspension-dialog/user-suspension-dialog.component';
import { filter } from 'rxjs/operators';
import { SetDashboardStats } from '@core/store/dashboard-stats.actions';
import { Store } from '@ngxs/store';
import { DashboardStateModel } from '@core/store/dashboard-stats.state';
import { ROLE_OPTIONS, Roles, UserRole } from '@core/models/roles';
import { VisitorsChartWidgetComponent } from '../../widgets/visitors-chart-widget.component';
import { AuthState, UserDetails } from '@core/store/auth.state';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { BetaProgramWidgetComponent } from '../../beta-program-widget/beta-program-widget.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    ProgressSpinnerModule,
    TagModule,
    DialogModule,
    SelectModule,
    ConfirmDialogModule,
    ToastModule,
    TabsModule,
    PrivacyPolicyManagementComponent,
    Password,
    MenuModule,
    UserSuspensionDialogComponent,
    CardModule,
    VisitorsChartWidgetComponent,
    AvatarModule,
    BetaProgramWidgetComponent,
    RouterModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  users: UserListDto[] = [];
  filteredUsers: UserListDto[] = [];
  selectedUser: UserListDto | null = null;
  userDialogVisible = false;
  isSaving = false;
  searchTerm = '';
  addUserDialogVisible = false;
  isCreatingUser = false;
  newUser: any = {
    username: '',
    email: '',
    password: '',
    role: 'user',
  };
  usernameError = '';
  emailError = '';
  passwordError = '';
  actionMenuItems: { [userId: number]: MenuItem[] } = {};

  // Suspension management
  suspendDialogVisible = false;
  userToSuspend: UserListDto | null = null;

  // Real-time dashboard data
  userCount = 0;
  activeUserCount = 0;
  betaSubscribers: BetaSubscriberDto[] = [];
  betaSubscribersLoading = true;
  wsConnected = false;

  // Error flags for API requests
  loadUsersError = false;
  loadBetaSubscribersError = false;
  loadUserCountError = false;
  loadingUsersActivity = true;

  isLoadingUsers = false;
  isLoadingBetaSubscribers = false;
  isLoadingUserCount = false;

  stats: DashboardStateModel = {
    userCount: 0,
    activeUsers: 0,
    reports: 0,
    pendingUpdates: 0,
  };

  roles = ROLE_OPTIONS;

  // Map data properties
  activeUserLocations: UserLocationStatsDto[] = [];
  registeredUserLocations: UserLocationStatsDto[] = [];
  loadingActiveUserMap = true;
  loadingRegisteredUserMap = true;
  activeUserMapError = '';
  registeredUserMapError = '';

  // Added from user-dashboard
  user: UserDetails | null = null;
  loading = true;
  loadError = false;
  activeUsersLoading = true;

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private suspensionService: SuspensionService,
    private betaProgramService: BetaProgramService,
    private userActivityService: UserActivityService,
    private destroyRef: DestroyRef,
    private store: Store,
    private geoIpService: GeoIpService,
    private route: ActivatedRoute,
  ) {}

  get username(): string {
    return this.user?.username || '';
  }

  get userEmail(): string {
    return this.user?.email || '';
  }

  get userRole(): string {
    return this.user?.role || '';
  }

  get isAdmin(): boolean {
    return this.user?.role === Roles.ADMIN;
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadBetaSubscribers();
    this.initializeRealTimeUpdates();
    this.monitorWebSocketConnectionStatus();
    this.getUserActivityCount();
    // Geo location
    this.loadActiveUserLocations();
    this.loadRegisteredUserLocations();

    // Handle welcome message after login (from user-dashboard)
    this.handlePostLoginMessage();
  }

  getUserActivityCount() {
    this.userActivityService
      .getActiveUserCount()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((count) => count !== undefined),
      )
      .subscribe({
        next: (count: number) => {
          console.log('WebSocket active user count update:', count);
          this.activeUserCount = count;
          this.loadingUsersActivity = false;

          // Update the stats in the store as well
          this.store.dispatch(
            new SetDashboardStats({
              ...this.stats,
              activeUsers: count,
            }),
          );
        },
        error: (error: any) => {
          console.error('Error with WebSocket active users:', error);
          this.loadingUsersActivity = false;
        },
      });
  }

  /**
   * Loads beta program subscribers
   */
  loadBetaSubscribers(): void {
    this.isLoadingBetaSubscribers = true;
    this.loadBetaSubscribersError = false;

    this.betaProgramService
      .betaSubscribersControllerGetAllSubscribers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (subscribers: BetaSubscriberDto[]) => {
          this.betaSubscribers = subscribers;
          this.isLoadingBetaSubscribers = false;
        },
        error: (error: any) => {
          console.error('Error loading beta subscribers:', error);
          this.isLoadingBetaSubscribers = false;
          this.loadBetaSubscribersError = true;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load beta subscribers.',
          });
        },
      });
  }

  /**
   * Initializes real-time updates for active users
   */
  initializeRealTimeUpdates(): void {
    this.isLoadingUserCount = true;
    this.userService
      .userControllerGetUserCount()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: { count?: number }) => {
          this.userCount = response.count || 0;
          this.isLoadingUserCount = false;
        },
        error: (error: any) => {
          console.error('Error getting user count:', error);
          this.isLoadingUserCount = false;
          this.loadUserCountError = true;
        },
      });
  }

  /**
   * Refreshes real-time data manually
   */
  refreshRealTimeData(): void {
    this.loadBetaSubscribers();
    this.userService.userControllerGetUserCount().subscribe({
      next: (response: { count?: number }) => {
        this.userCount = response.count || 0;
        this.messageService.add({
          severity: 'success',
          summary: 'Refreshed',
          detail: 'Real-time data has been refreshed.',
        });
      },
    });
  }

  loadUsers(): void {
    this.isLoadingUsers = true;
    this.loadUsersError = false;

    this.userService
      .userControllerFindAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.users = response;
          this.filteredUsers = [...this.users];
          this.isLoadingUsers = false;

          this.users.forEach((user) => {
            this.prepareActionMenuItems(user);
          });
        },
        error: (error: any) => {
          console.error('Error fetching users:', error);
          this.isLoadingUsers = false;
          this.loadUsersError = true;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load users. Please try again later.',
          });
        },
      });
  }

  private loadUserData(): void {
    this.store
      .select(AuthState.getUser)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user: UserDetails | null) => {
          this.user = user;
          this.loading = false;
          this.loadError = false;
        },
        error: (error: any) => {
          console.error('Error loading user data:', error);
          this.loading = false;
          this.loadError = true;
        },
      });
  }

  private handlePostLoginMessage(): void {
    this.route.paramMap.subscribe(() => {
      const state = window.history.state as {
        fromLogin?: boolean;
        username?: string;
      };

      if (state?.fromLogin && state?.username) {
        this.messageService.add({
          severity: 'success',
          summary: 'Welcome!',
          detail: `Login successful. Welcome back, ${state.username}!`,
          life: 5000,
        });

        // Clear the state to prevent showing the message on refresh
        window.history.replaceState({}, '', window.location.pathname);
      }
    });
  }

  filterUsers(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [...this.users];
      return;
    }

    const search = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(
      (user) =>
        user.username?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search) ||
        user.role?.toLowerCase().includes(search),
    );
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filteredUsers = [...this.users];
  }

  getRoleSeverity(
    role: UserRole,
  ): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
    switch (role) {
      case Roles.ADMIN:
        return 'danger';
      case Roles.MANAGER:
        return 'warn';
      default:
        return 'info';
    }
  }

  getEmailVerificationSeverity(
    isEmailConfirmed: boolean,
  ): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
    return isEmailConfirmed ? 'success' : 'warn';
  }

  getEmailVerificationLabel(isEmailConfirmed: boolean): string {
    return isEmailConfirmed ? 'Verified' : 'Unverified';
  }

  /**
   * Get the status badge severity for account suspension status
   */
  getSuspensionStatusSeverity(
    isSuspended: boolean,
  ): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
    if (isSuspended) {
      return 'danger';
    } else {
      return 'success';
    }
  }

  /**
   * Get the status label for account suspension status
   */
  getSuspensionStatusLabel(isSuspended: boolean): string {
    return isSuspended ? 'Suspended' : 'Active';
  }

  /**
   * Open the suspension dialog for a user
   */
  openSuspendUserDialog(user: UserListDto): void {
    this.userToSuspend = { ...user };
    this.suspendDialogVisible = true;
  }

  /**
   * Handle completion of suspension operation
   */
  handleSuspensionComplete(event: { success: boolean; user: UserListDto | null }): void {
    if (event.success && event.user) {
      // Update user in lists
      this.users = this.users.map((u) => (u.id === event.user!.id ? { ...u, ...event.user } : u));
      this.filteredUsers = this.filteredUsers.map((u) =>
        u.id === event.user!.id ? { ...u, ...event.user } : u,
      );

      // Update action menu items
      this.prepareActionMenuItems(event.user);
    }
  }

  editUser(user: UserListDto): void {
    this.selectedUser = { ...user };
    this.userDialogVisible = true;
  }

  deleteUser(user: UserListDto): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete user "${user.username}"?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: (): void => {
        // Call the API to delete the user
        this.userService.userControllerDeleteUser(user.id.toString()).subscribe({
          next: (): void => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'User Deleted',
              life: 3000,
            });

            // Remove from local arrays
            this.users = this.users.filter((u) => u.id !== user.id);
            this.filteredUsers = this.filteredUsers.filter((u: UserListDto) => u.id !== user.id);
          },
          error: (error: any): void => {
            console.error('Error deleting user:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete user. Please try again later.',
            });
          },
        });
      },
    });
  }

  saveUserChanges(): void {
    if (!this.selectedUser) return;

    this.isSaving = true;

    // Prepare the update data matching the UserDto/UpdateUserDto structure
    const updateData: UpdateUserDto = {
      username: this.selectedUser?.username || '',
      email: this.selectedUser?.email || '',
      role: (this.selectedUser?.role as UpdateUserDto['role']) || undefined,
    };

    // Call the API to update the user
    this.userService
      .userControllerUpdateUser(this.selectedUser?.id?.toString() || '0', updateData)
      .subscribe({
        next: (updatedUser: UserListDto) => {
          // Update the user in the local arrays
          this.users = this.users.map((u) =>
            u.id === updatedUser.id
              ? {
                  ...u,
                  username: updatedUser.username,
                  email: updatedUser.email,
                  role: updatedUser.role,
                  isEmailConfirmed: updatedUser.isEmailConfirmed,
                  // Keep other properties that might not be in the response
                  privacyPolicyVersion: updatedUser.privacyPolicyVersion || u.privacyPolicyVersion,
                  privacyPolicyAcceptanceTimestamp:
                    updatedUser.privacyPolicyAcceptanceTimestamp ||
                    u.privacyPolicyAcceptanceTimestamp,
                }
              : u,
          );

          // Also update filtered users
          this.filteredUsers = this.filteredUsers.map((u) =>
            u.id === updatedUser.id
              ? {
                  ...u,
                  username: updatedUser.username,
                  email: updatedUser.email,
                  role: updatedUser.role,
                  isEmailConfirmed: updatedUser.isEmailConfirmed,
                  privacyPolicyVersion: updatedUser.privacyPolicyVersion || u.privacyPolicyVersion,
                  privacyPolicyAcceptanceTimestamp:
                    updatedUser.privacyPolicyAcceptanceTimestamp ||
                    u.privacyPolicyAcceptanceTimestamp,
                }
              : u,
          );

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `User ${updatedUser.username} updated successfully`,
          });

          this.isSaving = false;
          this.userDialogVisible = false;
        },
        error: (error: any) => {
          console.error('Error updating user:', error);

          // Provide more specific error messages based on the error
          let errorMessage = 'Failed to update user. Please try again later.';

          if (error.status === 400) {
            // Handle validation errors
            if (error.error?.message) {
              if (typeof error.error.message === 'string') {
                errorMessage = error.error.message;
              } else if (Array.isArray(error.error.message)) {
                errorMessage = error.error.message[0];
              }
            }
          } else if (error.status === 404) {
            errorMessage = 'User not found. The user may have been deleted.';
          } else if (error.status === 401 || error.status === 403) {
            errorMessage = 'You do not have permission to update this user.';
          }

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
          });

          this.isSaving = false;
        },
      });
  }

  resendVerificationEmail(user: UserListDto): void {
    if (!user.email) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'User has no email address',
      });
      return;
    }

    this.userService.userControllerResendVerificationEmail({ email: user.email }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Verification email sent successfully',
        });
      },
      error: (error: any) => {
        console.error('Error sending verification email:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to send verification email',
        });
      },
    });
  }

  openAddUserDialog(): void {
    // Reset form and errors
    this.newUser = {
      username: '',
      email: '',
      password: '',
      role: Roles.USER,
    };
    this.usernameError = '';
    this.emailError = '';
    this.passwordError = '';
    this.addUserDialogVisible = true;
  }

  validateNewUser(): boolean {
    let isValid = true;

    // Reset errors
    this.usernameError = '';
    this.emailError = '';
    this.passwordError = '';

    // Validate username (at least 3 characters)
    if (!this.newUser.username || this.newUser.username.length < 3) {
      this.usernameError = 'Username must be at least 3 characters';
      isValid = false;
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!this.newUser.email || !emailRegex.test(this.newUser.email)) {
      this.emailError = 'Please enter a valid email address';
      isValid = false;
    }

    // Validate password (at least 6 characters)
    if (!this.newUser.password || this.newUser.password.length < 6) {
      this.passwordError = 'Password must be at least 6 characters';
      isValid = false;
    }

    return isValid;
  }

  createUser(): void {
    // Validate the form
    if (!this.validateNewUser()) {
      return;
    }

    this.isCreatingUser = true;

    // Create the user data object
    const userData = { ...this.newUser };

    // Call the API to create the user
    this.userService.userControllerCreateUser(userData).subscribe({
      next: (response: any): void => {
        // Add the new user to the local arrays
        const newUser = {
          id: response.id,
          username: response.username,
          email: response.email,
          role: response.role,
          isEmailConfirmed: response.isEmailConfirmed || false,
          privacyPolicyVersion: response.privacyPolicyVersion || null,
          privacyPolicyAcceptanceTimestamp: response.privacyPolicyAcceptanceTimestamp || null,
          isSuspended: response.isSuspended || false,
        };

        this.users = [newUser, ...this.users];
        this.filteredUsers = [newUser, ...this.filteredUsers];

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `User ${newUser.username} created successfully`,
        });

        this.isCreatingUser = false;
        this.addUserDialogVisible = false;
      },
      error: (error: any): void => {
        console.error('Error creating user:', error);

        // Handle specific error cases
        if (error.status === 409) {
          // Conflict - username or email already exists
          if (error.error?.message?.includes('Username')) {
            this.usernameError = 'Username already exists';
          } else if (error.error?.message?.includes('Email')) {
            this.emailError = 'Email already exists';
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error?.message || 'Username or email already exists',
            });
          }
        } else if (error.status === 400) {
          // Bad request - validation errors
          if (error.error?.message?.includes('Password')) {
            this.passwordError = error.error.message;
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error?.message || 'Invalid input data',
            });
          }
        } else {
          // General error
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create user. Please try again later.',
          });
        }

        this.isCreatingUser = false;
      },
    });
  }

  /**
   * Gets action menu items for a specific user
   * @param user The user to get actions for
   * @returns List of menu items
   */
  getActionMenuItems(user: UserListDto): MenuItem[] {
    return this.actionMenuItems[user.id] || this.prepareActionMenuItems(user);
  }

  /**
   * Triggers a password reset for a user
   * @param user The user to reset password for
   */
  resetPasswordAction(user: UserListDto): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Reset Password',
      detail: `Password reset for ${user.username} would be triggered here`,
    });
  }

  /**
   * Gets severity class for beta feature status
   * @param isActive Whether the feature is active
   * @returns Severity class for UI tag
   */
  getBetaFeatureStatusSeverity(isActive: boolean): 'success' | 'warning' | 'danger' | 'info' {
    return isActive ? 'success' : 'danger';
  }

  /**
   * Confirm and process unsuspending a user account
   */
  confirmUnsuspendUser(user: UserListDto): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to reactivate the account for ${user.username}? This will restore their access to the platform.`,
      header: 'Reactivate User Account',
      icon: 'pi pi-unlock',
      acceptButtonStyleClass: 'p-button-success',
      acceptLabel: 'Reactivate Account',
      accept: () => {
        this.suspensionService.unsuspendUser(user.id.toString()).subscribe({
          next: () => {
            // Success
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `User ${user.username} has been reactivated`,
            });

            // Update local user data
            user.isSuspended = false;
            user.suspensionReason = null;

            // Update the lists
            this.users = this.users.map((u) => (u.id === user.id ? { ...user } : u));
            this.filteredUsers = this.filteredUsers.map((u) =>
              u.id === user.id ? { ...user } : u,
            );

            // Update action menu
            this.prepareActionMenuItems(user);
          },
          error: (error: any) => {
            console.error('Error unsuspending user:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message || 'Failed to reactivate user. Please try again.',
            });
          },
        });
      },
    });
  }

  toggleMfa(user: UserListDto): void {
    console.log('toggleMfa');
    this.confirmationService.confirm({
      message: `Are you sure you want to toggle MFA for ${user.username}?`,
      header: 'Confirm MFA Toggle',
      icon: 'pi pi-exclamation-triangle',
      accept: (): void => {
        this.messageService.add({
          severity: 'info',
          summary: 'MFA Toggled',
          detail: `MFA for ${user.username} has been toggled.`,
        });
      },
    });
  }

  /**
   * Load active user location data for the map
   */
  loadActiveUserLocations(): void {
    this.loadingActiveUserMap = true;
    this.activeUserMapError = '';

    this.geoIpService
      .geoIpControllerGetActiveUsersByLocation()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: UserLocationStatsDto[]) => {
          this.activeUserLocations = data;
          this.loadingActiveUserMap = false;
        },
        error: (error) => {
          console.error('Error loading active user locations:', error);
          this.loadingActiveUserMap = false;
          this.activeUserMapError = 'Failed to load active user locations';
        },
      });
  }

  /**
   * Load registered user location data for the map
   */
  loadRegisteredUserLocations(): void {
    this.loadingRegisteredUserMap = true;
    this.registeredUserMapError = '';

    this.geoIpService
      .geoIpControllerGetRegisteredUsersByLocation()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: UserLocationStatsDto[]) => {
          this.registeredUserLocations = data;
          this.loadingRegisteredUserMap = false;
        },
        error: (error) => {
          console.error('Error loading registered user locations:', error);
          this.loadingRegisteredUserMap = false;
          this.registeredUserMapError = 'Failed to load registered user location data';
        },
      });
  }

  /**
   * Refresh location map data
   */
  refreshMapData(): void {
    this.loadActiveUserLocations();
    this.loadRegisteredUserLocations();

    this.messageService.add({
      severity: 'success',
      summary: 'Maps Refreshed',
      detail: 'Location data has been refreshed.',
    });
  }

  private monitorWebSocketConnectionStatus(): void {
    this.userActivityService
      .getConnectionStatus()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((connected) => {
        this.wsConnected = connected;
        if (connected) {
          this.messageService.add({
            severity: 'info',
            summary: 'Real-time Connection',
            detail: 'Connected to real-time user tracking',
            life: 3000,
          });
        }
      });
  }

  // Prepares action menu items for a user
  private prepareActionMenuItems(user: UserListDto): void {
    this.actionMenuItems[user.id] = [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editUser(user),
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteUser(user),
      },
    ];

    if (!user.isEmailConfirmed) {
      this.actionMenuItems[user.id].push({
        label: 'Resend Verification',
        icon: 'pi pi-envelope',
        command: () => this.resendVerificationEmail(user),
      });
    }

    if (user.isSuspended) {
      this.actionMenuItems[user.id].push({
        label: 'Reactivate Account',
        icon: 'pi pi-unlock',
        command: () => this.confirmUnsuspendUser(user),
      });
    } else {
      this.actionMenuItems[user.id].push({
        label: 'Suspend Account',
        icon: 'pi pi-lock',
        command: () => this.openSuspendUserDialog(user),
      });
    }

    this.actionMenuItems[user.id].push({
      label: 'Reset Password',
      icon: 'pi pi-key',
      command: () => this.resetPasswordAction(user),
    });
  }
}
