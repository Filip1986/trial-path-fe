import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormContainerComponent } from '../form-container/form-container.component';
import { FormService } from '../core/services/form/form.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormContainerComponent],
})
export class FormComponent {
  constructor(public formService: FormService) {}
}
