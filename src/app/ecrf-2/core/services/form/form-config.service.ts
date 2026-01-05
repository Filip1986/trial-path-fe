import { Injectable } from '@angular/core';

/**
 * Service to provide global form configuration settings
 * This allows for central control of form builder features
 */
@Injectable({ providedIn: 'root' })
export class FormConfigService {
  /** Maximum allowed column nesting level */
  readonly MAX_COLUMN_NESTING_LEVEL = 2;

  /**
   * Get the maximum allowed column nesting level
   * @returns The maximum nesting level
   */
  getMaxColumnNestingLevel(): number {
    return this.MAX_COLUMN_NESTING_LEVEL;
  }
}
