import { Component } from '@angular/core';

import { FormControlComponentBase } from '../../control-component-base.class';
import { Columns } from './columns.class';

@Component({
  selector: 'app-columns',
  standalone: true,
  imports: [],
  template: ``,
})
export class ColumnsComponent extends FormControlComponentBase<Columns> {
  constructor() {
    super();
  }
}
