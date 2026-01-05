import { Component, OnInit, ChangeDetectionStrategy, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { AuthState, UserDetails } from '../../core/store/auth.state';
import { Store } from '@ngxs/store';
import { ConfirmationService } from 'primeng/api';
import { ProfileService } from '../../core/services/user-profile.service';
import { Router } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AuthService } from '../../core/services/app-auth.service';
import { ToastManagerService } from '../../core/services/toast-manager.service';
// Import the new profile detail card component
import {
  ProfileDetailCardComponent,
  UserProfile,
} from '../../participants/components/profile-detail-card/profile-detail-card.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    TabsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    AvatarModule,
    DividerModule,
    ToastModule,
    ConfirmDialogModule,
    ProfileDetailCardComponent, // Add the new component
  ],
  providers: [ConfirmationService],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  user: UserDetails | null = null;
  isSubmitting: WritableSignal<boolean> = signal(false);
  isChangingPassword: WritableSignal<boolean> = signal(false);

  // Profile data formatted for the new card component
  userProfile: UserProfile | null = null;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private confirmationService: ConfirmationService,
    private profileService: ProfileService,
    private router: Router,
    private authService: AuthService,
    private toastManager: ToastManagerService,
  ) {
    // Initialize profile form
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
    });

    // Initialize password form
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  // Getters for easy access to form controls
  get username(): AbstractControl<string> | null {
    return this.profileForm.get('username');
  }

  get email(): AbstractControl<string> | null {
    return this.profileForm.get('email');
  }

  get currentPassword(): AbstractControl<string, string> | null {
    return this.passwordForm.get('currentPassword');
  }

  get newPassword(): AbstractControl<string, string> | null {
    return this.passwordForm.get('newPassword');
  }

  get confirmPassword(): AbstractControl<string, string> | null {
    return this.passwordForm.get('confirmPassword');
  }

  ngOnInit(): void {
    // Get user data from store
    this.user = this.store.selectSnapshot(AuthState.getUser);

    // Initialize form with user data
    if (this.user) {
      this.profileForm.patchValue({
        username: this.user.username,
        email: this.user.email,
      });

      // Convert user data to UserProfile format for the profile card
      this.userProfile = this.mapUserToProfile(this.user);
    }
  }

  /**
   * Map UserDetails to UserProfile format for the profile card component
   */
  private mapUserToProfile(user: UserDetails): UserProfile {
    return {
      id: user.id?.toString(),
      firstName: this.extractFirstName(user.username),
      lastName: this.extractLastName(user.username),
      email: user.email,
      role: user.role,
      status: 'active', // You can determine this based on your user status logic
      createdAt: user.createdAt,
      // Add any other fields you have available
    };
  }

  /**
   * Extract first name from username (you might want to add separate firstName field to UserDetails)
   */
  private extractFirstName(username?: string): string {
    if (!username) return '';
    const parts: string[] = username.split(' ');
    return parts[0] || '';
  }

  /**
   * Extract last name from username
   */
  private extractLastName(username?: string): string {
    if (!username) return '';
    const parts = username.split(' ');
    return parts.length > 1 ? parts.slice(1).join(' ') : '';
  }

  /**
   * Handle edit profile action from profile card
   */
  onEditProfile(): void {
    // You can either scroll to the edit form or open a modal
    // For now, we'll focus on the first tab (which contains the edit form)
    this.focusOnEditForm();
  }

  /**
   * Handle settings action from profile card
   */
  onOpenSettings(): void {
    void this.router.navigate(['/user/settings']);
  }

  /**
   * Handle avatar click from profile card
   */
  onAvatarClick(): void {
    // You can open a profile picture upload modal here
    this.toastManager.info({
      summary: 'Profile Picture',
      detail: 'Profile picture upload feature coming soon!',
    });
  }

  /**
   * Focus on the edit form tab
   */
  private focusOnEditForm(): void {
    // Scroll to the tab view or focus on the first input
    setTimeout((): void => {
      const usernameInput = document.getElementById('username');
      if (usernameInput) {
        usernameInput.focus();
      }
    }, 100);
  }

  /**
   * Password match validator
   */
  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const newPassword: any = form.get('newPassword')?.value;
    const confirmPassword: any = form.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }

    return null;
  }

  /**
   * Update profile information
   */
  updateProfile(): void {
    if (this.profileForm.valid) {
      this.isSubmitting.set(true);

      this.profileService
        .updateProfile({
          username: this.profileForm.value.username,
          email: this.profileForm.value.email,
        })
        .subscribe({
          next: (): void => {
            this.toastManager.success({
              summary: 'Profile Updated',
              detail: 'Your profile information has been updated successfully.',
            });

            // Update the user in the component and refresh profile card data
            if (this.user) {
              this.user = {
                ...this.user,
                username: this.profileForm.value.username,
                email: this.profileForm.value.email,
              };
              // Update the profile card data
              this.userProfile = this.mapUserToProfile(this.user);
            }

            this.isSubmitting.set(false);
          },
          error: (error: any): void => {
            this.toastManager.error({
              summary: 'Update Failed',
              detail: error.message || 'Failed to update profile. Please try again.',
            });
            this.isSubmitting.set(false);
          },
        });
    } else {
      // Mark all fields as touched to trigger validation errors
      Object.keys(this.profileForm.controls).forEach((key: string): void => {
        this.profileForm.get(key)?.markAsTouched();
      });
    }
  }

  /**
   * Change user password
   */
  changePassword(): void {
    if (this.passwordForm.valid) {
      this.isChangingPassword.set(true);

      this.profileService.changePassword().subscribe({
        next: (): void => {
          this.toastManager.success({
            summary: 'Password Changed',
            detail: 'Your password has been changed successfully.',
          });

          // Reset the password form
          this.passwordForm.reset();
          this.isChangingPassword.set(false);
        },
        error: (error: any): void => {
          this.toastManager.error({
            summary: 'Password Change Failed',
            detail: error.message || 'Failed to change password. Please try again.',
          });
          this.isChangingPassword.set(false);
        },
      });
    } else {
      // Mark all fields as touched to trigger validation errors
      Object.keys(this.passwordForm.controls).forEach((key: string): void => {
        this.passwordForm.get(key)?.markAsTouched();
      });
    }
  }

  /**
   * Delete user account with confirmation
   */
  deleteAccount(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete your account? This action cannot be undone.',
      header: 'Delete Account Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: (): void => {
        this.profileService.deleteAccount().subscribe({
          next: (): void => {
            this.toastManager.success({
              summary: 'Account Deleted',
              detail: 'Your account has been deleted successfully.',
            });

            // Logout and redirect to log in
            this.authService.logout();
            void this.router.navigate(['/auth/login']);
          },
          error: (error): void => {
            this.toastManager.error({
              summary: 'Delete Failed',
              detail: error.message || 'Failed to delete account. Please try again.',
            });
          },
        });
      },
    });
  }
}
