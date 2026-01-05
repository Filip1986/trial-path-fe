import { Observable } from 'rxjs';
import { IFormControl } from '../interfaces/form.interfaces';
import { FormElementType } from '../enums/form.enums';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';

/**
 * Drop handler configuration for each control type
 */
export interface DropHandler<T extends IFormControl> {
  elementType: FormElementType;
  openDialog: (control: T) => Observable<T>;
  successMessage: string;
  cancelMessage: string;
}

export type FormControlDrag = CdkDrag<IFormControl>;
export type FormControlDropList = CdkDropList<IFormControl[]>;
