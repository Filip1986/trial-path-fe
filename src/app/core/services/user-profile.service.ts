import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { AuthState, UserDetails } from '../store/auth.state';
import { SetUser } from '../store/auth.actions';
import { ToastManagerService } from './toast-manager.service';
import {UpdateUserDto} from '../../../back-end/models/UpdateUserDto';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(
    private store: Store,
    private toastManager: ToastManagerService,
  ) {}

  /**
   * Update user profile
   * @param updateData Profile update data
   * @returns Observable with updated user data
   */
  updateProfile(updateData: UpdateUserDto): Observable<any> {
    // In a real implementation, this would call an API endpoint
    // For demo, we'll simulate a successful update
    return of({ success: true, user: updateData }).pipe(
      tap((response): void => {
        if (response.success) {
          // Get current user from store
          const currentUser: UserDetails | null = this.store.selectSnapshot(AuthState.getUser);

          if (currentUser) {
            // Update user in store with new data
            const updatedUser: UserDetails = {
              ...currentUser,
              username: updateData.username || currentUser.username,
              email: updateData.email || currentUser.email,
            };

            // Update store
            this.store.dispatch(new SetUser(updatedUser));
          }
        }
      }),
      catchError((error: any): Observable<never> => {
        console.error('Error updating profile:', error);
        return throwError(() => new Error('Failed to update profile. Please try again.'));
      }),
    );
  }

  /**
   * Change user password
   * @returns Observable with success status
   */
  changePassword(): Observable<any> {
    // In a real implementation, this would call an API endpoint
    // For demo, we'll simulate a successful password change
    return of({ success: true }).pipe(
      catchError((error: any): Observable<never> => {
        console.error('Error changing password:', error);
        return throwError(() => new Error('Failed to change password. Please try again.'));
      }),
    );
  }

  /**
   * Delete user account
   * @returns Observable with success status
   */
  deleteAccount(): Observable<{
    success: boolean;
    message?: string;
  }> {
    // In a real implementation, this would call an API endpoint
    // For demo, we'll simulate a successful account deletion
    return of({ success: true }).pipe(
      catchError((error: any): Observable<never> => {
        console.error('Error deleting account:', error);
        return throwError((): Error => new Error('Failed to delete account. Please try again.'));
      }),
    );
  }

  /**
   * Resend email verification
   * @returns Observable with success status
   */
  resendEmailVerification(): Observable<{
    success: boolean;
    message?: string;
  }> {
    // In a real implementation, this would call an API endpoint
    // For demo, we'll simulate a successful resend
    return of({ success: true }).pipe(
      catchError((error: any): Observable<never> => {
        console.error('Error resending verification email:', error);
        return throwError(
          () => new Error('Failed to resend verification email. Please try again.'),
        );
      }),
    );
  }
}
