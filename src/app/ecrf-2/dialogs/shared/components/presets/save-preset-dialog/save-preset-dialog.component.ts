import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormElementType } from '@core/models/enums/form.enums';

interface PresetConfiguration {
  // Add specific properties based on your configuration structure
  [key: string]: unknown; // Use as fallback if structure varies
}

@Component({
  selector: 'app-save-preset-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule],
  templateUrl: './save-preset-dialog.component.html',
  styleUrl: './save-preset-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SavePresetDialogComponent {
  @Input() visible = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() elementType!: FormElementType;
  @Input() currentConfiguration!: PresetConfiguration;

  @Output() savePreset = new EventEmitter<{
    name: string;
    description: string;
    configuration: PresetConfiguration;
  }>();

  presetForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.presetForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(200)]],
    });
  }

  onSave(): void {
    if (this.presetForm.valid) {
      this.savePreset.emit({
        name: this.presetForm.value.name,
        description: this.presetForm.value.description,
        configuration: this.currentConfiguration,
      });
      this.hideDialog();
    } else {
      // Mark fields as touched to show validation errors
      this.presetForm.markAllAsTouched();
    }
  }

  hideDialog(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.presetForm.reset();
  }
}
