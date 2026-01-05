import { ChangeDetectionStrategy, Component, Input } from '@angular/core';


@Component({
  selector: 'app-tab-error-indicator',
  standalone: true,
  imports: [],
  templateUrl: './tab-error-indicator.component.html',
  styleUrl: './tab-error-indicator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabErrorIndicatorComponent {
  @Input() hasErrors = false;
  @Input() errorCount = 0;
  @Input() warningCount = 0;
  @Input() iconClass = 'pi pi-exclamation-circle text-red-500 ml-1';
  @Input() customTooltip?: string;

  /**
   * Get tooltip text for the error indicator
   */
  get tooltipText(): string {
    if (this.customTooltip) {
      return this.customTooltip;
    }

    const parts: string[] = [];
    if (this.errorCount > 0) {
      parts.push(`${this.errorCount} error${this.errorCount !== 1 ? 's' : ''}`);
    }
    if (this.warningCount > 0) {
      parts.push(`${this.warningCount} warning${this.warningCount !== 1 ? 's' : ''}`);
    }

    return parts.length > 0 ? parts.join(', ') : 'Issues detected';
  }
}
