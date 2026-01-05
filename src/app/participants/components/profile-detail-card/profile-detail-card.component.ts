import {
  Component,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  input,
  InputSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

// Interface for user data
export interface UserProfile {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  department?: string;
  studyTitle?: string;
  status: 'active' | 'inactive' | 'pending' | 'completed';
  profilePicture?: string;
  location?: string;
  address?: string;
  createdAt?: Date | string;
  enrollmentDate?: Date | string;
  // Add any other user properties you need
}

@Component({
  selector: 'app-profile-detail-card',
  standalone: true,
  imports: [CommonModule, CardModule, AvatarModule, ButtonModule, TagModule],
  templateUrl: './profile-detail-card.component.html',
  styleUrls: ['./profile-detail-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileDetailCardComponent {
  /**
   * User data to display in the profile card (signal input)
   */
  user: InputSignal<UserProfile | null> = input<UserProfile | null>(null);

  /**
   * Whether to show action buttons (signal input)
   */
  showActions: InputSignal<boolean> = input(true);

  /**
   * Whether to show the status indicator on avatar (signal input)
   */
  showStatusIndicator: InputSignal<boolean> = input(true);

  /**
   * Custom avatar size (default is xlarge) (signal input)
   */
  avatarSize: InputSignal<'normal' | 'large' | 'xlarge'> = input<'normal' | 'large' | 'xlarge'>(
    'xlarge',
  );

  /**
   * Event emitted when edit profile button is clicked
   */
  @Output() editProfile: EventEmitter<UserProfile> = new EventEmitter<UserProfile>();

  /**
   * Event emitted when settings button is clicked
   */
  @Output() openSettings: EventEmitter<UserProfile> = new EventEmitter<UserProfile>();

  /**
   * Event emitted when avatar is clicked
   */
  @Output() avatarClick: EventEmitter<UserProfile> = new EventEmitter<UserProfile>();

  /**
   * Get severity for status tag based on status value
   */
  getStatusSeverity(status?: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    if (!status) return 'secondary';

    switch (status.toLowerCase()) {
      case 'active':
      case 'completed':
        return 'success';
      case 'pending':
        return 'warn';
      case 'inactive':
      case 'suspended':
        return 'danger';
      default:
        return 'info';
    }
  }

  /**
   * Get status indicator class for avatar
   */
  getStatusIndicatorClass(status?: string): string {
    if (!status) return 'offline';

    switch (status.toLowerCase()) {
      case 'active':
        return 'online';
      case 'pending':
        return 'away';
      case 'inactive':
      default:
        return 'offline';
    }
  }

  /**
   * Handle edit profile button click
   */
  onEditProfile(): void {
    const u: UserProfile | null = this.user();
    if (u) {
      this.editProfile.emit(u);
    }
  }

  /**
   * Handle settings button click
   */
  onOpenSettings(): void {
    const u: UserProfile | null = this.user();
    if (u) {
      this.openSettings.emit(u);
    }
  }
}
