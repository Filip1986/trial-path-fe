import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { Columns } from '../form-controls/form-layout/columns/columns.class';
import { FormConfigService } from '@core/services/form/form-config.service';
import { DynamicComponentLoaderComponent } from '../dynamic-component-loader.component';
import { DragDropService } from '@core/services/drag-and-drop';
import { Subscription } from 'rxjs';
import { IColumn } from '@core/models/interfaces/columns.interfaces';

@Component({
  selector: 'app-form-columns',
  templateUrl: './form-columns.component.html',
  styleUrls: ['./form-columns.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DynamicComponentLoaderComponent],
})
export class FormColumnsComponent implements OnInit, OnDestroy {
  @Input() control?: Columns;

  /**
   * The Current nesting level of this column element
   * Default is 1 (first level of columns)
   */
  @Input() nestingLevel = 1;

  /**
   * Maximum allowed nesting level
   */
  @Input() maxNestingLevel = 2;

  /**
   * Flag to show debugging information
   */
  @Input() showDebugInfo = false;

  // Subscription for change detection triggers
  private subscription: Subscription = new Subscription();

  constructor(
    private formConfigService: FormConfigService,
    private dragDropService: DragDropService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // Get max nesting level from config service
    this.maxNestingLevel = this.formConfigService.getMaxColumnNestingLevel();

    // Subscribe to change detection triggers
    this.subscription.add(
      this.dragDropService.changeDetectionNeeded$.subscribe((): void => {
        this.cdr.markForCheck();
      }),
    );

    // Also subscribe to control dropped events
    this.subscription.add(
      this.dragDropService.controlDropped.subscribe((): void => {
        this.cdr.markForCheck();
      }),
    );
  }

  ngOnDestroy(): void {
    // Cleanup subscriptions
    this.subscription.unsubscribe();
  }

  /**
   * TrackBy function for columns to optimize rendering
   * @param index Column index
   * @param column The column object
   * @returns A unique identifier for the column
   */
  trackByColumnIndex(index: number, column: IColumn): number {
    // Using index is fine for columns as they are unlikely to be reordered
    return index;
  }
}
