import { ComponentType } from '../enums/component-types.enum';
import { ComponentCategory } from '../enums/component-category.enum';

export interface IComponentMetadata {
  readonly type: ComponentType;
  readonly category: ComponentCategory;
  readonly displayName: string;
  readonly description?: string;
  readonly icon?: string;
}
