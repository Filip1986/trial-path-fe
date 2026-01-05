import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import {UserService} from '../../back-end/services/UserService';
import {UserDto} from '../../back-end/models/UserDto';

export interface SuspensionState {
  isSuspended: boolean;
  reason?: string;
  dialogVisible: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SuspensionService {
  private suspensionStateSubject = new BehaviorSubject<SuspensionState>({
    isSuspended: false,
    reason: '',
    dialogVisible: false,
  });

  // Observable to subscribe to suspension state changes
  public suspensionState$ = this.suspensionStateSubject.asObservable();

  constructor(private userService: UserService) {}

  /**
   * Show the suspension notification dialog
   * @param reason The reason for suspension
   */
  showSuspensionNotification(reason?: string): void {
    this.suspensionStateSubject.next({
      isSuspended: true,
      reason: reason,
      dialogVisible: true,
    });
  }

  /**
   * Reset suspension state
   */
  resetSuspensionState(): void {
    this.suspensionStateSubject.next({
      isSuspended: false,
      reason: '',
      dialogVisible: false,
    });
  }

  /**
   * Admin function to suspend a user account
   * @param userId The ID of the user to suspend
   * @param reason The reason for suspension
   * @param notes Optional additional notes about the suspension
   * @returns An observable with the API response
   */
  suspendUser(userId: string, reason: string, notes?: string): Observable<UserDto> {
    console.log('suspendUser called with ID:', userId);

    // Return the API call directly
    return this.userService
      .userControllerSuspendUser(userId, {
        isSuspended: true,
        suspensionReason: reason,
        suspensionNotes: notes,
      })
      .pipe(
        tap((response: UserDto): void => {
          console.log('Suspension API response:', response);
        }),
        catchError((error: any): never => {
          console.error('Error in suspendUser:', error);
          throw error;
        }),
      );
  }

  /**
   * Admin function to unsuspend a user account
   * @param userId The ID of the user to unsuspend
   * @returns An observable with the API response
   */
  unsuspendUser(userId: string): Observable<UserDto> {
    // Return the API call directly
    return this.userService
      .userControllerSuspendUser(userId, {
        isSuspended: false,
        suspensionReason: 'Account reactivated',
      })
      .pipe(
        tap((response: UserDto): void => {
          console.log('Unsuspension API response:', response);
        }),
        catchError((error: any): never => {
          console.error('Error in unsuspendUser:', error);
          throw error;
        }),
      );
  }
}
