import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-preview-wrapper',
  standalone: true,
  imports: [],
  templateUrl: './preview-wrapper.component.html',
  styleUrl: './preview-wrapper.component.scss',
})
export class PreviewWrapperComponent {
  @Input() wrapperClass = '';
  @Input() title = '';
  @Input() helperText?: string;
}
