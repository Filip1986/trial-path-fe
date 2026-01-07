import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  FormLabelPositionEnum,
  FormLabelStyleEnum,
  LibInputTextComponent,
  InputTextConfig,
} from '@artificial-sense/ui-lib';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { OptionItem } from '@core/models/interfaces/options.interfaces';

@Component({
  selector: 'app-options-manager',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, LibInputTextComponent, DragDropModule],
  templateUrl: './options-manager.component.html',
  styleUrls: ['./options-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionsManagerComponent implements OnInit {
  @Input() parentForm!: FormGroup;
  @Input() controlName = 'options';
  @Input() minOptions = 1;
  @Input() maxOptions?: number;
  @Input() showGroupField = false;
  @Input() showDisabledField = false;
  @Input() showBulkImport = true;
  @Output() optionsChanged: EventEmitter<OptionItem[]> = new EventEmitter<OptionItem[]>();

  bulkImportVisible = false;
  bulkImportText = '';

  constructor(private fb: FormBuilder) {}

  get optionsFormArray(): FormArray {
    return this.parentForm.get(this.controlName) as FormArray;
  }

  get optionGroups(): FormGroup[] {
    return this.optionsFormArray.controls as FormGroup[];
  }

  ngOnInit(): void {
    if (!this.parentForm.get(this.controlName)) {
      this.parentForm.addControl(this.controlName, this.fb.array([]));
    }
  }

  addOption(label = '', value = '', disabled = false, group = ''): void {
    const optionGroup = this.fb.group({
      label: [label, [Validators.required]],
      value: [value, [Validators.required]],
      disabled: [disabled],
      group: [group],
    });

    this.optionsFormArray.push(optionGroup);
    this.emitOptionsChanged();
  }

  removeOption(index: number): void {
    if (this.optionsFormArray.length > this.minOptions) {
      this.optionsFormArray.removeAt(index);
      this.emitOptionsChanged();
    }
  }

  drop(event: CdkDragDrop<FormGroup[]>): void {
    const controls = this.optionsFormArray.controls as FormGroup[];
    moveItemInArray(controls, event.previousIndex, event.currentIndex);
    this.optionsFormArray.setValue(controls.map((c: FormGroup<any>): any => c.value));
    this.emitOptionsChanged();
  }

  toggleBulkImport(): void {
    this.bulkImportVisible = !this.bulkImportVisible;
  }

  importBulkOptions(): void {
    const lines: string[] = this.bulkImportText
      .split('\n')
      .filter((line: string): string => line.trim());

    lines.forEach((line: string): void => {
      const parts: string[] = line.split('|');
      const label: string = parts[0]?.trim() || line.trim();
      const value: string = parts[1]?.trim() || label.toLowerCase().replace(/\s+/g, '_');
      const group: string = parts[2]?.trim() || '';

      this.addOption(label, value, false, group);
    });

    this.bulkImportText = '';
    this.bulkImportVisible = false;
  }

  cancelBulkImport(): void {
    this.bulkImportText = '';
    this.bulkImportVisible = false;
  }

  getLabelConfig(index: number): InputTextConfig {
    return {
      label: `Option ${index + 1} Label`,
      placeholder: 'Enter label',
      required: true,
      disabled: false,
      autofocus: false,
      variant: FormComponentVariantEnum.OUTLINED,
      labelStyle: FormLabelStyleEnum.DEFAULT,
      labelPosition: FormLabelPositionEnum.ABOVE,
      size: FormComponentSizeEnum.NORMAL,
    };
  }

  getValueConfig(index: number): InputTextConfig {
    return {
      label: `Option ${index + 1} Value`,
      placeholder: 'Enter value',
      required: true,
      disabled: false,
      autofocus: false,
      variant: FormComponentVariantEnum.OUTLINED,
      labelStyle: FormLabelStyleEnum.DEFAULT,
      labelPosition: FormLabelPositionEnum.ABOVE,
      size: FormComponentSizeEnum.NORMAL,
    };
  }

  getGroupConfig(): InputTextConfig {
    return {
      label: 'Group',
      placeholder: 'Enter group name',
      required: false,
      disabled: false,
      autofocus: false,
      variant: FormComponentVariantEnum.OUTLINED,
      labelStyle: FormLabelStyleEnum.DEFAULT,
      labelPosition: FormLabelPositionEnum.ABOVE,
      size: FormComponentSizeEnum.NORMAL,
    };
  }

  /**
   * Track by function for optionsFormArray
   */
  trackByOptionIndex(index: number, option: any): number {
    return index;
  }

  private emitOptionsChanged(): void {
    const options = this.optionsFormArray.value as OptionItem[];
    this.optionsChanged.emit(options);
  }
}
