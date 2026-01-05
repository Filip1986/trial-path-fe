import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, BehaviorSubject, timer } from 'rxjs';
import { takeUntil, filter, shareReplay} from 'rxjs/operators';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { Store } from '@ngxs/store';
import { UpdateActiveUsers } from '../store/dashboard-stats.actions';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService implements OnDestroy {
  private socket: Socket | null = null;
  private connectionStatus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private destroy$: Subject<void> = new Subject<void>();

  // Stream of active user counts from the server
  private activeUsers$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  // Heartbeat interval (every 30 seconds)
  private readonly HEARTBEAT_INTERVAL = 30 * 1000;

  constructor(private store: Store) {}

  /**
   * Initialize the WebSocket connection
   * @returns Observable that completes when connected
   */
  connect(): Observable<boolean> {
    // Only connect if not already connected
    if (this.socket?.connected) {
      return this.connectionStatus$.asObservable();
    }

    // Get the access token from cookies
    const cookies = document.cookie.split(';').reduce(
      (acc, cookie) => {
        const [key, value] = cookie.split('=').map((c) => c.trim());
        acc[key] = value;
        return acc;
      },
      {} as Record<string, string>,
    );

    const token = cookies['accessToken'];

    // Connect to the WebSocket server
    this.socket = io(`${environment.apiBaseUrl}/presence`, {
      auth: {
        token,
      },
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Set up event listeners
    this.setupEventListeners();

    // Start heartbeat
    this.startHeartbeat();

    // Return an observable that completes when connected
    return this.connectionStatus$.asObservable();
  }

  /**
   * Disconnect the WebSocket connection
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connectionStatus$.next(false);
    }
  }

  /**
   * Get an observable of the connection status
   * @returns Observable of connection status
   */
  getConnectionStatus(): Observable<boolean> {
    return this.connectionStatus$.asObservable();
  }

  /**
   * Get an observable of active user count
   * @returns Observable of active user count
   */
  getActiveUserCount(): Observable<number> {
    return this.activeUsers$.asObservable().pipe(shareReplay(1));
  }

  /**
   * Clean up on service destruction
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.disconnect();
  }

  /**
   * Set up WebSocket event listeners
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    // Connection event
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.connectionStatus$.next(true);

      // Request active user count on connection
      this.socket?.emit('getActiveUserCount');
    });

    // Disconnection event
    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.connectionStatus$.next(false);
    });

    // Active user count update
    this.socket.on('activeUserCount', (data: { count: number }) => {
      console.log('Active users:', data.count);
      this.activeUsers$.next(data.count);

      // Update the store with the new active user count
      this.store.dispatch(new UpdateActiveUsers(data.count));
    });

    // Connection error
    this.socket.on('connect_error', (error: any) => {
      console.error('WebSocket connection error:', error);
    });
  }

  /**
   * Start sending heartbeat messages
   */
  private startHeartbeat(): void {
    if (!this.socket) return;

    timer(this.HEARTBEAT_INTERVAL, this.HEARTBEAT_INTERVAL)
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.socket?.connected || false),
      )
      .subscribe(() => {
        this.socket?.emit('heartbeat');
      });
  }
}
