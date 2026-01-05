import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-column-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './column-dialog.component.html',
  styleUrl: './column-dialog.component.scss',
})
export class ColumnDialogComponent {
  @Input() visible = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() save: Subject<number> = new Subject<number>(); // Changed from 'confirmed'
  @Output() cancel: Subject<void> = new Subject<void>(); // Added for consistency

  columnCount = 2; // Default value

  /**
   * Cancel the dialog and close without action
   */
  onCancel(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.cancel.next();
  }

  /**
   * Confirm the selected column count
   */
  onConfirm(): void {
    if (this.columnCount >= 1 && this.columnCount <= 12) {
      this.save.next(this.columnCount); // Changed from 'confirmed.emit'
      this.visible = false;
      this.visibleChange.emit(this.visible);
    }
  }
}
