import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-config-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './config-section.component.html',
  styleUrl: './config-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigSectionComponent {
  @Input() title = '';
  @Input() isFirst = false;
}
