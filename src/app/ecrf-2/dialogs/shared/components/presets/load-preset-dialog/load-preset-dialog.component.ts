import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { Preset, PresetService } from '../../../services/preset.service';
import { FormElementType } from '@core/models/enums/form.enums';

@Component({
  selector: 'app-load-preset-dialog',
  standalone: true,
  imports: [
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    ConfirmDialogModule
],
  templateUrl: './load-preset-dialog.component.html',
  styleUrl: './load-preset-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class LoadPresetDialogComponent implements OnInit {
  @Input() visible = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() elementType!: FormElementType;
  @Output() loadPreset: EventEmitter<Preset> = new EventEmitter<Preset>();
  @Output() presetDeleted: EventEmitter<string> = new EventEmitter<string>();

  presets: Preset[] = [];
  filteredPresets: Preset[] = [];
  searchText = '';

  constructor(
    private presetService: PresetService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    // Subscribe to preset changes
    this.presetService.getPresetsByType(this.elementType).subscribe((presets: Preset[]): void => {
      this.presets = presets;
      this.applyFilter();
    });
  }

  onDialogShow(): void {
    // Reload presets when the dialog shows
    this.searchText = '';
    this.applyFilter();
  }

  onSearch(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    if (!this.searchText.trim()) {
      this.filteredPresets = [...this.presets];
    } else {
      const searchLower: string = this.searchText.toLowerCase();
      this.filteredPresets = this.presets.filter(
        (preset: Preset) =>
          preset.name.toLowerCase().includes(searchLower) ||
          (preset.description && preset.description.toLowerCase().includes(searchLower)),
      );
    }
  }

  onLoadPreset(preset: Preset): void {
    this.loadPreset.emit(preset);
    this.hideDialog();
  }

  onDeletePreset(event: Event, preset: Preset): void {
    event.stopPropagation();

    this.confirmationService.confirm({
      message: `Are you sure you want to delete the preset "${preset.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: (): void => {
        if (this.presetService.deletePreset(preset.id)) {
          this.presetDeleted.emit(preset.id);
        }
      },
    });
  }

  hideDialog(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }
}
