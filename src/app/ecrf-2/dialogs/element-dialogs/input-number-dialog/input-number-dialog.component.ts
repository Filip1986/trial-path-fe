import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FormControl, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { ECRFInputNumberClass } from '../../../form-controls/form-elements/input-number/input-number.class';
import { IconMappingService } from '../../../core/services/icon-mapping.service';
import { DialogConfigBuilder } from '../../core/builders/config-builders';
import {
  InputNumberModeEnum,
  LibInputNumberComponent as LibInputNumberComponent,
  LibInputTextComponent,
  FormComponentVariantEnum,
  FormLabelStyleEnum,
  FormLabelPositionEnum,
  FormComponentSizeEnum,
  InputTextConfig,
} from '@artificial-sense/ui-lib';
import { BaseDialogComponent } from '../../core/abstracts/base-dialog.component';
import { DialogSharedModule } from '../../dialog-shared.module';
import { Tabs, TabsModule, TabsStyle } from 'primeng/tabs';
import { SavePresetDialogComponent } from '../../shared/components/presets/save-preset-dialog/save-preset-dialog.component';
import { LoadPresetDialogComponent } from '../../shared/components/presets/load-preset-dialog/load-preset-dialog.component';
import { DialogWrapperComponent } from '../../shared/components/dialog-wrapper/dialog-wrapper.component';
import { InputNumberFactoryOptions } from '../../../core/models/interfaces/input-number.interfaces';
import { FormElementType } from '../../../core/models/enums/form.enums';
import { IDialogFieldConfig } from '../../../core/models/interfaces/dialog.interfaces';
import { IPresetConfiguration } from '../../../core/models/interfaces/preset.interfaces';
import { DropdownOption } from '../../core/models/dialog.types';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogConfirmationService } from '../../core/services/dialog-confirmation.service';

@Component({
  selector: 'app-enhanced-input-number-dialog',
  templateUrl: './input-number-dialog.component.html',
  styleUrls: ['./input-number-dialog.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    SelectModule,
    CheckboxModule,
    DialogWrapperComponent,
    LibInputTextComponent,
    LibInputNumberComponent,
    DialogSharedModule,
    TabsModule,
    SavePresetDialogComponent,
    LoadPresetDialogComponent,
    ConfirmDialog
],
  providers: [Tabs, TabsStyle, ConfirmationService, DialogConfirmationService],
})
export class InputNumberDialogComponent extends BaseDialogComponent<ECRFInputNumberClass> {
  readonly minConfig: InputTextConfig =
    this.configFactory.getValidationConfigs('number').minConfig ||
    DialogConfigBuilder.createNumberConfig('Minimum Value', undefined, undefined, {
      helperText: 'Minimum allowed value',
    });

  readonly maxConfig: InputTextConfig =
    this.configFactory.getValidationConfigs('number').maxConfig ||
    DialogConfigBuilder.createNumberConfig('Maximum Value', undefined, undefined, {
      helperText: 'Maximum allowed value',
    });

  readonly stepConfig: InputTextConfig =
    this.configFactory.getValidationConfigs('number').stepConfig ||
    DialogConfigBuilder.createNumberConfig('Step', 1, undefined, {
      helperText: 'Increment/decrement step',
    });

  // Format fields - unique to input number
  formatFields: IDialogFieldConfig[] = [
    {
      name: 'prefix',
      config: DialogConfigBuilder.createTextConfig('Prefix', 'e.g. $', {
        helperText: 'Text to display before the value',
      }),
    },
    {
      name: 'suffix',
      config: DialogConfigBuilder.createTextConfig('Suffix', 'e.g. %', {
        helperText: 'Text to display after the value',
      }),
    },
    {
      name: 'minFractionDigits',
      config: DialogConfigBuilder.createNumberConfig('Minimum Fraction Digits', 0, 20, {
        helperText: 'Minimum number of fraction digits to display',
      }),
    },
    {
      name: 'maxFractionDigits',
      config: DialogConfigBuilder.createNumberConfig('Maximum Fraction Digits', 0, 20, {
        helperText: 'Maximum number of fraction digits to display',
      }),
    },
  ];

  // Cached dropdown options
  readonly modes: DropdownOption<InputNumberModeEnum>[] =
    this.configFactory.getEnumOptions(InputNumberModeEnum);

  protected elementType: FormElementType = FormElementType.INPUT_NUMBER;
  protected readonly FormComponentVariantEnum: typeof FormComponentVariantEnum =
    FormComponentVariantEnum;
  protected readonly FormLabelStyleEnum: typeof FormLabelStyleEnum = FormLabelStyleEnum;
  protected readonly FormLabelPositionEnum: typeof FormLabelPositionEnum = FormLabelPositionEnum;
  protected readonly FormComponentSizeEnum: typeof FormComponentSizeEnum = FormComponentSizeEnum;

  constructor(private iconService: IconMappingService) {
    super();
    // Enhanced validation is enabled by default in base class
    // Input number validation is already registered in DialogValidationService
  }

  // Helper method to get FormControl from the form
  getControl(name: string): FormControl {
    return this.form.get(name) as FormControl;
  }

  /**
   * Track by function for formatFields
   */
  trackByFieldName(index: number, field: IDialogFieldConfig): string {
    return field.name;
  }

  /**
   * Implementation of PresetSupport interface - get the current configuration
   */
  getConfigurationForPreset(): IPresetConfiguration {
    return {
      label: this.form.value.label,
      placeholder: this.form.value.placeholder,
      required: this.form.value.required,
      disabled: this.form.value.disabled,
      min: this.form.value.min,
      max: this.form.value.max,
      step: this.form.value.step,
      prefix: this.form.value.prefix,
      suffix: this.form.value.suffix,
      mode: this.form.value.mode,
      labelStyle: this.form.value.labelStyle,
      labelPosition: this.form.value.labelPosition,
      helperText: this.form.value.helperText,
      useGrouping: this.form.value.useGrouping,
      minFractionDigits: this.form.value.minFractionDigits,
      maxFractionDigits: this.form.value.maxFractionDigits,
    };
  }

  /**
   * Implementation of PresetSupport interface - apply preset configuration
   */
  applyPresetConfiguration(config: IPresetConfiguration): void {
    this.form.patchValue({
      label: config['label'] || this.dialogConfiguration.defaultValues?.['label'],
      placeholder: config['placeholder'] || this.dialogConfiguration.defaultValues?.['placeholder'],
      required: config['required'] || this.dialogConfiguration.defaultValues?.['required'],
      disabled: config['disabled'] || this.dialogConfiguration.defaultValues?.['disabled'],
      min: config['min'],
      max: config['max'],
      step: config['step'] || this.dialogConfiguration.defaultValues?.['step'],
      prefix: config['prefix'] || '',
      suffix: config['suffix'] || '',
      mode: config['mode'] || this.dialogConfiguration.defaultValues?.['mode'],
      labelStyle: config['labelStyle'] || this.dialogConfiguration.defaultValues?.['labelStyle'],
      labelPosition:
        config['labelPosition'] || this.dialogConfiguration.defaultValues?.['labelPosition'],
      helperText: config['helperText'] || '',
      useGrouping:
        config['useGrouping'] !== undefined
          ? config['useGrouping']
          : this.dialogConfiguration.defaultValues?.['useGrouping'],
      minFractionDigits:
        config['minFractionDigits'] ||
        this.dialogConfiguration.defaultValues?.['minFractionDigits'],
      maxFractionDigits:
        config['maxFractionDigits'] ||
        this.dialogConfiguration.defaultValues?.['maxFractionDigits'],
    });

    // Apply preset-specific behaviors using PresetManagerService
    this.applyPresetBehaviors(config);

    this.hasUnsavedChanges = true;
  }

  /**
   * Override ngOnInit to add component-specific behavior
   */
  override ngOnInit(): void {
    super.ngOnInit(); // Call parent to get all the registry and validation setup
    this.setupDynamicBehavior(); // Add input-number specific behavior
  }

  /**
   * Override to add additional validation specific to the input number
   */
  protected override onFormValueChange(): void {
    super.onFormValueChange(); // This handles enhanced validation
    // Add any input-number specific logic here if needed
  }

  protected patchFormValues(): void {
    if (!this.control) return;

    // Use registry defaults as fallbacks
    this.form.patchValue({
      label: this.control.options?.title || this.dialogConfiguration.defaultValues?.['label'],
      placeholder:
        this.control.placeholder || this.dialogConfiguration.defaultValues?.['placeholder'],
      required: this.control.options?.required || false,
      disabled: this.control.options?.disabled || false,
      min: this.control.min,
      max: this.control.max,
      step: this.control.step || this.dialogConfiguration.defaultValues?.['step'],
      prefix: this.control.prefix || '',
      suffix: this.control.suffix || '',
      mode: this.control.mode || this.dialogConfiguration.defaultValues?.['mode'],
      helperText: this.control.options?.helperText || '',
      labelStyle: this.control.labelStyle || this.dialogConfiguration.defaultValues?.['labelStyle'],
      labelPosition:
        this.control.labelPosition || this.dialogConfiguration.defaultValues?.['labelPosition'],
      useGrouping:
        this.control.useGrouping ?? this.dialogConfiguration.defaultValues?.['useGrouping'],
      minFractionDigits:
        this.control.minFractionDigits ||
        this.dialogConfiguration.defaultValues?.['minFractionDigits'],
      maxFractionDigits:
        this.control.maxFractionDigits ||
        this.dialogConfiguration.defaultValues?.['maxFractionDigits'],
    });
  }

  protected buildResult(): ECRFInputNumberClass {
    const formValues: any = this.form.value;

    // Create an option object
    const options: InputNumberFactoryOptions = {
      name: this.sanitizeName(formValues.label),
      title: formValues.label,
      required: formValues.required,
      disabled: formValues.disabled,
      readonly: false,
      helperText: formValues.helperText,
      min: formValues.min,
      max: formValues.max,
      step: formValues.step,
      prefix: formValues.prefix,
      suffix: formValues.suffix,
      mode: formValues.mode,
    };

    if (this.control) {
      // Update existing number input
      Object.assign(this.control, {
        options,
        placeholder: formValues.placeholder,
        min: formValues.min,
        max: formValues.max,
        step: formValues.step,
        prefix: formValues.prefix,
        suffix: formValues.suffix,
        mode: formValues.mode,
        labelStyle: formValues.labelStyle,
        labelPosition: formValues.labelPosition,
        useGrouping: formValues.useGrouping,
        minFractionDigits: formValues.minFractionDigits,
        maxFractionDigits: formValues.maxFractionDigits,
      });
      return this.control;
    } else {
      // Create a new number input
      const inputNumber = new ECRFInputNumberClass(this.iconService, options);
      Object.assign(inputNumber, {
        placeholder: formValues.placeholder,
        labelStyle: formValues.labelStyle,
        labelPosition: formValues.labelPosition,
        useGrouping: formValues.useGrouping,
        minFractionDigits: formValues.minFractionDigits,
        maxFractionDigits: formValues.maxFractionDigits,
      });
      return inputNumber;
    }
  }

  /**
   * Get tab-specific field names for validation
   */
  protected getFormattingTabFields(): string[] {
    return ['prefix', 'suffix', 'minFractionDigits', 'maxFractionDigits'];
  }

  /**
   * Override validation tab fields to include step
   */
  protected override getValidationTabFields(): string[] {
    return ['min', 'max', 'step'];
  }

  /**
   * Set up dynamic form behavior specific to the input number
   */
  private setupDynamicBehavior(): void {
    // Use PresetManagerService to handle min/max validation
    this.presetManager.setupFieldDependency(this.form, 'min', [], (): boolean =>
      this.validateMinMaxRange(),
    );

    this.presetManager.setupFieldDependency(this.form, 'max', [], (): boolean =>
      this.validateMinMaxRange(),
    );

    // Validate min/max consistency
    ['min', 'max'].forEach((field: string): void => {
      this.form.get(field)?.valueChanges.subscribe((): void => {
        this.validateMinMaxRange();
        // Trigger enhanced validation after min/max changes
        setTimeout((): void => {
          this.performEnhancedValidation();
          this.cdr.markForCheck();
        }, 0);
      });
    });

    // Validate fraction digits consistency
    ['minFractionDigits', 'maxFractionDigits'].forEach((field: string): void => {
      this.form.get(field)?.valueChanges.subscribe((): void => {
        this.validateFractionDigitsRange();
        // Trigger enhanced validation after fraction digits changes
        setTimeout((): void => {
          this.performEnhancedValidation();
          this.cdr.markForCheck();
        }, 0);
      });
    });
  }

  /**
   * Validate min/max range consistency
   */
  private validateMinMaxRange(): boolean {
    const min: any = this.form.get('min')?.value;
    const max: any = this.form.get('max')?.value;

    if (min !== null && max !== null && min > max) {
      this.form.get('max')?.setErrors({ minGreaterThanMax: true });
      return false;
    } else {
      const errors: ValidationErrors | null | undefined = this.form.get('max')?.errors;
      if (errors?.['minGreaterThanMax']) {
        delete errors['minGreaterThanMax'];
        this.form.get('max')?.setErrors(Object.keys(errors).length ? errors : null);
      }
      return true;
    }
  }

  /**
   * Validate fraction digits range consistency
   */
  private validateFractionDigitsRange(): boolean {
    const minFraction: any = this.form.get('minFractionDigits')?.value;
    const maxFraction: any = this.form.get('maxFractionDigits')?.value;

    if (minFraction > maxFraction) {
      this.form.get('maxFractionDigits')?.setErrors({ minGreaterThanMax: true });
      return false;
    } else {
      const errors: ValidationErrors | null | undefined =
        this.form.get('maxFractionDigits')?.errors;
      if (errors?.['minGreaterThanMax']) {
        delete errors['minGreaterThanMax'];
        this.form.get('maxFractionDigits')?.setErrors(Object.keys(errors).length ? errors : null);
      }
      return true;
    }
  }
}
