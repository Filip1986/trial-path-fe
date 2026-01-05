import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  LibInputTextComponent,
  LibSelectComponent,
  LibTextareaComponent,
  LibCheckboxComponent,
  FormComponentVariantEnum,
  FormLabelStyleEnum,
  FormLabelPositionEnum,
  FormComponentSizeEnum,
  DEFAULT_SCROLL_HEIGHT,
  CheckboxModeEnum,
  InputTextTypeEnum,
} from '@artificial-sense/ui-lib';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

export interface CustomValidationRule {
  id: string;
  name: string;
  type: 'regex' | 'range' | 'custom' | 'dependency';
  description?: string;
  enabled: boolean;
  priority: number;

  // Rule configuration
  pattern?: string; // For regex validation
  minValue?: number; // For range validation
  maxValue?: number; // For range validation
  customFunction?: string; // JavaScript function for custom validation
  dependsOn?: string; // Field dependency

  // Error messaging
  errorMessage: string;
  errorType: 'error' | 'warning';

  // Advanced options
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  skipIfEmpty?: boolean;
}

@Component({
  selector: 'app-custom-validation-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LibInputTextComponent,
    LibSelectComponent,
    LibTextareaComponent,
    LibCheckboxComponent,
    DragDropModule,
  ],
  templateUrl: './custom-validation-settings.component.html',
  styleUrl: './custom-validation-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomValidationSettingsComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() elementType?: string;

  // Validation rule types
  readonly validationTypes = [
    { label: 'Regex', value: 'regex' },
    { label: 'Range', value: 'range' },
    { label: 'Custom', value: 'custom' },
    { label: 'Dependency', value: 'dependency' },
  ];

  // Common regex patterns
  readonly commonPatterns = [
    { label: 'Email', value: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,} ' },
    { label: 'Phone', value: '^\\+?[1-9]\\d{1,14}' },
    { label: 'Numbers Only', value: '^\\d+ ' },
    { label: 'Letters Only', value: '^[a-zA-Z]+ ' },
    { label: 'Alphanumeric', value: '^[a-zA-Z0-9]+ ' },
  ];

  // Template constants
  protected readonly FormComponentVariantEnum = FormComponentVariantEnum;
  protected readonly FormLabelStyleEnum = FormLabelStyleEnum;
  protected readonly FormLabelPositionEnum = FormLabelPositionEnum;
  protected readonly FormComponentSizeEnum = FormComponentSizeEnum;
  protected readonly DEFAULT_SCROLL_HEIGHT = DEFAULT_SCROLL_HEIGHT;
  protected readonly CheckboxModeEnum = CheckboxModeEnum;
  protected readonly InputTextTypeEnum = InputTextTypeEnum;

  constructor(private fb: FormBuilder) {}

  get customValidationRules(): FormArray {
    return this.form.get('customValidationRules') as FormArray;
  }

  get customValidationRulesControls(): FormGroup[] {
    return this.customValidationRules.controls as FormGroup[];
  }

  ngOnInit(): void {
    this.initializeCustomValidationArray();
  }

  addValidationRule(): void {
    const newRule = this.createValidationRuleGroup();
    this.customValidationRules.push(newRule);
  }

  removeValidationRule(index: number): void {
    if (this.customValidationRules.length > 0) {
      this.customValidationRules.removeAt(index);
    }
  }

  onDrop(event: CdkDragDrop<FormGroup[]>): void {
    const controls = this.customValidationRules.controls;
    moveItemInArray(controls, event.previousIndex, event.currentIndex);

    // Update priority values based on new order
    controls.forEach((control, index) => {
      (control as FormGroup).get('priority')?.setValue(index + 1);
    });
  }

  applyCommonPattern(index: number, pattern: string): void {
    const ruleGroup = this.customValidationRules.at(index) as FormGroup;
    ruleGroup.get('pattern')?.setValue(pattern);
    ruleGroup.get('type')?.setValue('regex');
  }

  getRuleType(index: number): string {
    const ruleGroup = this.customValidationRules.at(index) as FormGroup;
    return ruleGroup.get('type')?.value || 'regex';
  }

  getTypeLabel(type: string): string {
    const typeMap: Record<string, string> = {
      regex: 'Regex',
      range: 'Range',
      custom: 'Custom',
      dependency: 'Depends',
    };
    return typeMap[type] || type;
  }

  trackByRuleIndex(index: number): number {
    return index;
  }

  getRuleControl(ruleGroup: FormGroup, controlName: string): FormControl {
    return ruleGroup.get(controlName) as FormControl;
  }

  validateCustomRules(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    let valid = true;

    this.customValidationRules.controls.forEach((control, index) => {
      const ruleGroup = control as FormGroup;

      if (ruleGroup.invalid) {
        valid = false;
        errors.push(`Rule ${index + 1}: ${this.getFormGroupErrors(ruleGroup)}`);
      }

      // Validate regex patterns
      const type = ruleGroup.get('type')?.value;
      const pattern = ruleGroup.get('pattern')?.value;

      if (type === 'regex' && pattern) {
        try {
          new RegExp(pattern);
        } catch {
          valid = false;
          errors.push(`Rule ${index + 1}: Invalid regex pattern`);
        }
      }

      // Validate range rules
      if (type === 'range') {
        const minValue = ruleGroup.get('minValue')?.value;
        const maxValue = ruleGroup.get('maxValue')?.value;

        if (minValue != null && maxValue != null && minValue >= maxValue) {
          valid = false;
          errors.push(`Rule ${index + 1}: Min must be less than max`);
        }
      }
    });

    return { valid, errors };
  }

  private initializeCustomValidationArray(): void {
    if (!this.form.get('customValidationRules')) {
      this.form.addControl('customValidationRules', this.fb.array([]));
    }
  }

  private createValidationRuleGroup(rule?: Partial<CustomValidationRule>): FormGroup {
    return this.fb.group({
      id: [rule?.id || this.generateRuleId()],
      name: [rule?.name || '', [Validators.required, Validators.minLength(3)]],
      type: [rule?.type || 'regex', Validators.required],
      description: [rule?.description || ''],
      enabled: [rule?.enabled ?? true],
      priority: [rule?.priority || this.customValidationRules.length + 1, [Validators.min(1)]],

      // Rule configuration
      pattern: [rule?.pattern || ''],
      minValue: [rule?.minValue],
      maxValue: [rule?.maxValue],
      customFunction: [rule?.customFunction || ''],
      dependsOn: [rule?.dependsOn || ''],

      // Error messaging
      errorMessage: [rule?.errorMessage || '', Validators.required],
      errorType: [rule?.errorType || 'error'],

      // Advanced options
      validateOnBlur: [rule?.validateOnBlur ?? true],
      validateOnChange: [rule?.validateOnChange ?? false],
      skipIfEmpty: [rule?.skipIfEmpty ?? true],
    });
  }

  private generateRuleId(): string {
    return 'rule_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  }

  private getFormGroupErrors(formGroup: FormGroup): string {
    const errors: string[] = [];

    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control?.errors) {
        Object.keys(control.errors).forEach((errorKey) => {
          errors.push(`${key}: ${errorKey}`);
        });
      }
    });

    return errors.join(', ');
  }
}
