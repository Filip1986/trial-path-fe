import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FormStateService } from './form-state.service';
import { IForm } from '../../models/interfaces/form.interfaces';

/**
 * Service responsible for managing form state and operations
 * Provides observables for current form state and handles form updates
 */
@Injectable({ providedIn: 'root' })
export class FormService {
  /**
   * Observable of the current form state
   * Components can subscribe to this to get form updates
   */
  public form$: Observable<IForm>;

  constructor(private formStateService: FormStateService) {
    // By default, create an initial form with a TextInput and Columns
    const initialForm = {
      title: 'New Form',
      container: { controls: [] },
    };

    // Set the initial form state in the FormStateService
    const currentState: IForm = this.formStateService.getCurrentState();

    // If the current state is just the default, replace it
    if (currentState.container.controls.length === 0) {
      this.formStateService.updateFormMetadata(initialForm);
    }

    // Use the form$ from FormStateService
    this.form$ = this.formStateService.form$;
  }
}
