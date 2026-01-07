import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
} from '@angular/core';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormPreviewComponent } from '../../../../form-preview/form-preview.component';
import { ThemeService } from '@artificial-sense/ui-lib';
import { IForm } from '@core/models/interfaces/form.interfaces';

@Component({
  selector: 'app-preview-dialog',
  templateUrl: './preview-dialog.component.html',
  styleUrls: ['./preview-dialog.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogModule, ButtonModule, FormPreviewComponent],
})
export class PreviewDialogComponent implements OnInit {
  @Input() visible = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() form!: IForm;

  // Track the current theme state
  isDarkTheme = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Initialize theme status on component init
    this.themeService.isDarkMode$.subscribe((isDark: boolean): void => {
      this.isDarkTheme = isDark;
    });
  }

  /**
   * Toggle the theme between light and dark mode
   */
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  /**
   * Close the dialog
   */
  hideDialog(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
