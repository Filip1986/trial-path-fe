import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-form-dialog-wrapper',
  standalone: true,
  imports: [CommonModule, DialogModule, CardModule, ButtonModule, TabsModule],
  templateUrl: './dialog-wrapper.component.html',
  styleUrl: './dialog-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogWrapperComponent {
  @Input() visible = false;
  @Input() header = 'Configure Field';
  @Input() width = '700px';
  @Input() height?: string;
  @Input() loading = false;
  @Input() showPreview = true;
  @Input() saveLabel = 'Save';
  @Input() cancelLabel = 'Cancel';
  @Input() saveDisabled = false;
  @Input() dismissableMask = false;
  @Input() showPresetButtons = true;

  @Output() showEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() hideEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() saveEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() cancelEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() activeTabIndexChange: EventEmitter<string | number> = new EventEmitter<
    string | number
  >();
  @Output() savePresetEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() loadPresetEvent: EventEmitter<void> = new EventEmitter<void>();

  // Add theme state for preview
  previewDarkTheme = false;

  /**
   * Toggle the preview theme between light and dark
   */
  togglePreviewTheme(): void {
    this.previewDarkTheme = !this.previewDarkTheme;
  }
}
