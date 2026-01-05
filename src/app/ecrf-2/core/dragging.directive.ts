import { CdkDrag } from '@angular/cdk/drag-drop';
import { Directive, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Directive that adds global styling and state management during drag operations
 * Attaches to cdkDrag elements to enhance the drag and drop experience
 */
@Directive({
  selector: '[cdkDrag]',
  standalone: true,
})
export class DraggingDirective implements OnInit, OnDestroy {
  /** Subject used to complete observables when the directive is destroyed */
  private unsubscribe$: Subject<void> = new Subject<void>();

  /**
   * Creates an instance of DraggingDirective
   *
   * @param cdkDrag Reference to the CdkDrag directive this is attached to
   */
  constructor(private cdkDrag: CdkDrag<unknown>) {}

  /**
   * Lifecycle hook that runs on directive initialization
   * Sets up subscriptions to drag events
   */
  ngOnInit(): void {
    // Add dragging class to the body when drag starts
    this.cdkDrag.started.pipe(takeUntil(this.unsubscribe$)).subscribe((): void => {
      document.body.classList.add('dragging');
      document.body.classList.add('cursor-grabbing');
    });

    // Remove dragging class when drag ends
    this.cdkDrag.ended.pipe(takeUntil(this.unsubscribe$)).subscribe((): void => {
      document.body.classList.remove('dragging');
      document.body.classList.remove('cursor-grabbing');
    });
  }

  /**
   * Lifecycle hook that runs when the directive is destroyed
   * Cleans up subscriptions to prevent memory leaks
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    // Ensure classes are removed in case the directive is destroyed during a drag
    document.body.classList.remove('dragging');
    document.body.classList.remove('cursor-grabbing');
  }
}
