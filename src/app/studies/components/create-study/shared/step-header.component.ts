import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-step-header',
  standalone: true,
  imports: [],
  templateUrl: './step-header.component.html',
  styleUrls: ['./step-header.component.scss'],
})
export class StepHeaderComponent {
  @Input() title!: string;
  @Input() description?: string;
  @Input() iconClass!: string;
}
