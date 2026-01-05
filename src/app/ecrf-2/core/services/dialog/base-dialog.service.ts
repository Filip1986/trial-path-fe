import {
  Injectable,
  EnvironmentInjector,
  createComponent,
  ApplicationRef,
  ComponentRef,
  Type,
} from '@angular/core';
import { Observable, Subscription, Subscriber } from 'rxjs';
import { IDialogComponent, IDialogConfig } from '../../models/interfaces/dialog.interfaces';

/**
 * Dialog reference containing the component instance and cleanup logic
 */
export class DialogRef<T extends IDialogComponent> {
  private subscriptions: Set<Subscription> = new Set<Subscription>();

  constructor(
    public componentRef: ComponentRef<T>,
    private cleanupFn: () => void,
  ) {}

  /**
   * Close the dialog
   */
  close(): void {
    this.componentRef.instance.visible = false;
    this.cleanup();
  }

  /**
   * Add a subscription to be cleaned up when the dialog closes
   */
  addSubscription(subscription: Subscription): void {
    this.subscriptions.add(subscription);
  }

  /**
   * Clean up all subscriptions and destroy the component
   */
  private cleanup(): void {
    this.subscriptions.forEach((sub: Subscription): void => sub.unsubscribe());
    this.subscriptions.clear();
    this.cleanupFn();
  }
}

/**
 * Generic dialog service for creating and managing dialog components
 */
@Injectable({
  providedIn: 'root',
})
export abstract class BaseDialogService {
  protected activeDialogs = new Map<string, DialogRef<any>>();

  constructor(
    protected injector: EnvironmentInjector,
    protected appRef: ApplicationRef,
  ) {}

  /**
   * Open a dialog with the specified component
   * @param component The dialog component class
   * @param config Configuration for the dialog
   * @returns A dialog reference
   */
  protected openDialog<T extends IDialogComponent, TConfig extends IDialogConfig>(
    component: Type<T>,
    config?: TConfig,
  ): DialogRef<T> {
    // Generate unique ID for this dialog
    const dialogId = `dialog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create the component
    const componentRef: ComponentRef<T> = createComponent(component, {
      environmentInjector: this.injector,
    });

    const instance: T = componentRef.instance;

    // Apply configuration if provided
    if (config && 'config' in instance) {
      instance.config = config;
    }

    // Create dialog reference
    const dialogRef = new DialogRef(componentRef, (): void =>
      this.removeDialog(dialogId, componentRef),
    );

    // Store the dialog reference
    this.activeDialogs.set(dialogId, dialogRef);

    // Attach to DOM
    this.appRef.attachView(componentRef.hostView);
    const domElement = componentRef.location.nativeElement;
    document.body.appendChild(domElement);

    // Make visible
    instance.visible = true;

    // Set up automatic cleanup when the dialog is closed
    const visibleSub: Subscription = instance.visibleChange.subscribe((visible: boolean): void => {
      if (!visible) {
        dialogRef.close();
      }
    });
    dialogRef.addSubscription(visibleSub);

    return dialogRef;
  }

  /**
   * Create an observable dialog that resolves when saved or rejects when canceled
   */
  protected createObservableDialog<T extends IDialogComponent<any, TResult>, TResult>(
    component: Type<T>,
    config?: IDialogConfig,
    setupFn?: (instance: T) => void,
  ): Observable<TResult> {
    return new Observable<TResult>((observer: Subscriber<TResult>): (() => void) => {
      const dialogRef: DialogRef<T> = this.openDialog(component, config);
      const instance: T = dialogRef.componentRef.instance;

      // Call setup function if provided
      if (setupFn) {
        setupFn(instance);
      }

      // Subscribe to save event
      if (instance.save) {
        const saveSub: Subscription = instance.save.subscribe((result: TResult): void => {
          observer.next(result);
          observer.complete();
          dialogRef.close();
        });
        dialogRef.addSubscription(saveSub);
      }

      // Subscribe to cancel event
      if (instance.cancel) {
        const cancelSub: Subscription = instance.cancel.subscribe((): void => {
          observer.error(new Error('Dialog cancelled'));
          dialogRef.close();
        });
        dialogRef.addSubscription(cancelSub);
      }

      // Subscribe to visibility changes
      const visibleSub: Subscription = instance.visibleChange.subscribe(
        (visible: boolean): void => {
          if (!visible && !observer.closed) {
            observer.error(new Error('Dialog closed'));
          }
        },
      );
      dialogRef.addSubscription(visibleSub);

      // Return teardown logic
      return (): void => {
        if (!observer.closed) {
          dialogRef.close();
        }
      };
    });
  }

  /**
   * Remove dialog from DOM and destroy component
   */
  private removeDialog(dialogId: string, componentRef: ComponentRef<any>): void {
    // Remove from active dialogs
    this.activeDialogs.delete(dialogId);

    // Detach from Angular
    this.appRef.detachView(componentRef.hostView);

    // Remove from DOM
    const domElement = componentRef.location.nativeElement;
    if (domElement && domElement.parentElement) {
      domElement.parentElement.removeChild(domElement);
    }

    // Destroy component
    componentRef.destroy();
  }
}
