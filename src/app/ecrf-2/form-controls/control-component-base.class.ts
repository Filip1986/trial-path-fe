import { Component, Input } from '@angular/core';
import { IFormControl } from '@core/models/interfaces/form.interfaces';

@Component({
  template: '',
})
export abstract class FormControlComponentBase<TControl extends IFormControl = IFormControl> {
  @Input() control?: TControl;
}
