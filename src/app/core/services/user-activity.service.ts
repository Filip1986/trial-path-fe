import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, shareReplay, takeUntil } from 'rxjs/operators';
import { WebSocketService } from './websocket.service';

@Injectable({
  providedIn: 'root',
})
export class UserActivityService implements OnDestroy {
  private destroy$ = new Subject<void>();
  // Cache the active user count observable
  private readonly activeUserCount$: Observable<number>;

  constructor(private webSocketService: WebSocketService) {
    // Connect to WebSocket when service is initialized
    this.initWebSocketConnection();
    this.activeUserCount$ = this.webSocketService.getActiveUserCount().pipe(shareReplay(1));
  }

  /**
   * Get observable of active user count
   */
  getActiveUserCount(): Observable<number> {
    return this.activeUserCount$;
  }

  /**
   * Get the WebSocket connection status
   */
  getConnectionStatus(): Observable<boolean> {
    return this.webSocketService.getConnectionStatus();
  }

  /**
   * Clean up resources on destroy
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize WebSocket connection
   */
  private initWebSocketConnection(): void {
    this.webSocketService
      .connect()
      .pipe(
        takeUntil(this.destroy$),
        catchError((error: any): Observable<boolean> => {
          console.error('Error connecting to WebSocket:', error);
          return of(false);
        }),
      )
      .subscribe((connected: boolean): void => {
        if (connected) {
          console.log('WebSocket connected - User activity tracking active');
        } else {
          console.warn('WebSocket not connected - User activity tracking inactive');
        }
      });
  }
}
