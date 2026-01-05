import { IFormContainer } from './form.interfaces';
import { BaseControlOptions } from './options.interfaces';

export interface ColumnsFactoryOptions extends BaseControlOptions {
  columnCount?: number;
}

export interface IColumn {
  container: IFormContainer;
}
