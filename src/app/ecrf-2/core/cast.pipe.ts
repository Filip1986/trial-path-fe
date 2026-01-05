import { Pipe, PipeTransform } from '@angular/core';
import { Columns } from '../form-controls/form-layout/columns/columns.class';
import { IFormControl } from './models/interfaces/form.interfaces';

/**
 * Pipe that casts an IFormControl to a specific type
 * Useful for safely accessing type-specific properties in templates
 */
@Pipe({
  name: 'cast',
  pure: true,
  standalone: true,
})
export class CastPipe implements PipeTransform {
  /**
   * Casts input value to the specified type
   * Currently only supports casting to Columns type
   *
   * @param value The IFormControl to cast
   * @returns The value cast to the Columns type
   */
  transform<T extends IFormControl>(value: T): Columns {
    // We could extend this to support other types with a type parameter
    return value as unknown as Columns;
  }
}
