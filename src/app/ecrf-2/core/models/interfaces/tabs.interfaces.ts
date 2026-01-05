import { Type } from '@angular/core';

export interface IDialogTab {
  id: string;
  label: string;
  component: Type<any>;
  config?: any;
  order?: number;
}
