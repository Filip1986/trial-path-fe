import { IconMappingService } from '../../../core/services/icon-mapping.service';
import { IFormControl } from '../../../core/models/interfaces/form.interfaces';
import { IColumn } from '../../../core/models/interfaces/columns.interfaces';
import { FormElementType } from '../../../core/models/enums/form.enums';
import { generateUniqueId } from '../../../core/utils/utils';

/**
 * Columns form control class
 * Uses enum values instead of magic strings
 */
export class Columns implements IFormControl {
  readonly id: string;
  readonly iconName: string;
  readonly type: FormElementType = FormElementType.COLUMNS;
  readonly title: string = 'Columns';

  columns: IColumn[] = [];

  /**
   * Create a new Columns control
   * @param columnCount The number of columns to create (default: 2)
   * @param iconService Optional icon service for retrieving icons
   * @param id Optional custom ID for the control
   */
  constructor(
    columnCount = 2,
    private iconService?: IconMappingService,
    id?: string,
  ) {
    // Assign a unique ID
    this.id = id || generateUniqueId(FormElementType.COLUMNS);

    // Use icon service to get the correct icon
    this.iconName = this.iconService?.getPrimeIcon(FormElementType.COLUMNS) || 'view_column';
    this.createColumns(columnCount);
  }

  /**
   * Create the specified number of columns
   * @param count Number of columns to create
   */
  private createColumns(count: number): void {
    this.columns = [];

    for (let i = 0; i < count; i++) {
      this.columns.push({
        container: { controls: [] },
      });
    }
  }
}
