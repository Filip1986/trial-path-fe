import { Injectable } from '@angular/core';
import { ColumnDialogComponent } from '../../../dialogs/element-dialogs/column-dialog/column-dialog.component';
import { Observable } from 'rxjs';
import { BaseDialogService } from './base-dialog.service';
import { IColumnDialogConfig } from '../../models/interfaces/dialog.interfaces';

/**
 * Generic dialog service for non-form-related dialogs
 */
@Injectable({
  providedIn: 'root',
})
export class DialogService extends BaseDialogService {
  /**
   * Show a dialog to prompt for the number of columns
   * @param config Optional configuration for the dialog
   * @returns An observable that emits the number of columns or errors if canceled
   */
  promptForColumnCount(config?: IColumnDialogConfig): Observable<number> {
    return this.createObservableDialog<ColumnDialogComponent, number>(
      ColumnDialogComponent,
      config,
      (instance: ColumnDialogComponent): void => {
        // Apply custom configuration
        if (config) {
          if (config.defaultColumns) {
            instance.columnCount = config.defaultColumns;
          }
        }
      },
    );
  }
}
