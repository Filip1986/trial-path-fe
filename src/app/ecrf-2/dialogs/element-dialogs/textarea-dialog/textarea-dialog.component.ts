import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { ECRFTextAreaClass } from '../../../form-controls/form-elements/textarea/textarea.class';
import { IconMappingService } from '../../../core/services/icon-mapping.service';
import {
  LibTextareaComponent,
  LibInputTextComponent,
  FormLabelStyleEnum,
  FormLabelPositionEnum,
  FormComponentVariantEnum,
  FormComponentSizeEnum,
} from '@artificial-sense/ui-lib';
import { DialogSharedModule } from '../../dialog-shared.module';
import { Tabs, TabsModule, TabsStyle } from 'primeng/tabs';
import { SavePresetDialogComponent } from '../../shared/components/presets/save-preset-dialog/save-preset-dialog.component';
import { LoadPresetDialogComponent } from '../../shared/components/presets/load-preset-dialog/load-preset-dialog.component';
import { DialogWrapperComponent } from '../../shared/components/dialog-wrapper/dialog-wrapper.component';
import { FormElementType } from '../../../core/models/enums/form.enums';
import { IPresetConfiguration } from '../../../core/models/interfaces/preset.interfaces';
import { ITextAreaOptions } from '../../../core/models/interfaces/text-area.interfaces';
import { DialogConfigBuilder } from '../../core/builders/config-builders';
import { IDialogFieldConfig } from '../../../core/models/interfaces/dialog.interfaces';
import { BaseDialogComponent } from '../../core/abstracts/base-dialog.component';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogConfirmationService } from '../../core/services/dialog-confirmation.service';

@Component({
  selector: 'app-textarea-dialog',
  templateUrl: './textarea-dialog.component.html',
  styleUrls: ['./textarea-dialog.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    SelectModule,
    CheckboxModule,
    DialogWrapperComponent,
    LibTextareaComponent,
    LibInputTextComponent,
    DialogSharedModule,
    TabsModule,
    SavePresetDialogComponent,
    LoadPresetDialogComponent,
    ConfirmDialog
],
  providers: [Tabs, TabsStyle, ConfirmationService, DialogConfirmationService],
})
export class TextareaDialogComponent extends BaseDialogComponent<ECRFTextAreaClass> {
  // Dimension field configs - unique to textarea
  dimensionFields: IDialogFieldConfig[] = [
    {
      name: 'rows',
      config: DialogConfigBuilder.createNumberConfig('Rows', 1, 50, {
        helperText: 'Number of visible text rows',
      }),
    },
    {
      name: 'cols',
      config: DialogConfigBuilder.createNumberConfig('Columns', 1, 200, {
        helperText: 'Width of the textarea in columns',
      }),
    },
  ];

  protected elementType = FormElementType.TEXT_AREA;

  protected readonly FormComponentVariantEnum = FormComponentVariantEnum;
  protected readonly FormComponentSizeEnum = FormComponentSizeEnum;
  protected readonly FormLabelStyleEnum = FormLabelStyleEnum;
  protected readonly FormLabelPositionEnum = FormLabelPositionEnum;

  constructor(private iconService: IconMappingService) {
    super();
  }

  // Helper method to get FormControl from the form
  getControl(name: string): FormControl {
    return this.form.get(name) as FormControl;
  }

  /**
   * Track by function for dimensionFields
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
      rows: this.form.value.rows,
      cols: this.form.value.cols,
      autoResize: this.form.value.autoResize,
      minLength: this.form.value.minLength,
      maxLength: this.form.value.maxLength,
      helperText: this.form.value.helperText,
      labelStyle: this.form.value.labelStyle,
      labelPosition: this.form.value.labelPosition,
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
      rows: config['rows'] || this.dialogConfiguration.defaultValues?.['rows'],
      cols: config['cols'] || this.dialogConfiguration.defaultValues?.['cols'],
      autoResize: config['autoResize'] || this.dialogConfiguration.defaultValues?.['autoResize'],
      minLength: config['minLength'] || null,
      maxLength: config['maxLength'] || null,
      helperText: config['helperText'] || '',
      labelStyle: config['labelStyle'] || this.dialogConfiguration.defaultValues?.['labelStyle'],
      labelPosition:
        config['labelPosition'] || this.dialogConfiguration.defaultValues?.['labelPosition'],
    });

    // Apply preset-specific behaviors using PresetManagerService
    this.applyPresetBehaviors(config);

    // Apply dynamic behavior for autoResize
    this.handleAutoResizeBehavior(config['autoResize']);

    this.hasUnsavedChanges = true;
  }

  /**
   * ✅ SIMPLIFIED: Override ngOnInit to add component-specific behavior
   */
  override ngOnInit(): void {
    super.ngOnInit(); // Call parent to get all the registry goodness
    this.setupDynamicBehavior(); // Add textarea-specific behavior
  }

  protected patchFormValues(): void {
    if (!this.control) return;

    this.form.patchValue({
      label: this.control.options?.title || this.dialogConfiguration.defaultValues?.['label'],
      placeholder:
        this.control.placeholder || this.dialogConfiguration.defaultValues?.['placeholder'],
      required: this.control.options?.required || false,
      disabled: this.control.options?.disabled || false,
      rows: this.control.rows || this.dialogConfiguration.defaultValues?.['rows'],
      cols: this.control.cols || this.dialogConfiguration.defaultValues?.['cols'],
      autoResize: this.control.autoResize || this.dialogConfiguration.defaultValues?.['autoResize'],
      minLength: this.control.minLength,
      maxLength: this.control.maxLength,
      helperText: this.control.options?.helperText || '',
      labelStyle: this.control.labelStyle || this.dialogConfiguration.defaultValues?.['labelStyle'],
      labelPosition:
        this.control.labelPosition || this.dialogConfiguration.defaultValues?.['labelPosition'],
    });
  }

  protected buildResult(): ECRFTextAreaClass {
    const formValues: any = this.form.value;

    // Create an option object
    const options: ITextAreaOptions = {
      name: this.sanitizeName(formValues.label),
      title: formValues.label,
      required: formValues.required,
      disabled: formValues.disabled,
      readonly: false,
      helperText: formValues.helperText,
      rows: formValues.rows,
      cols: formValues.cols,
      autoResize: formValues.autoResize,
      labelStyle: formValues.labelStyle,
      labelPosition: formValues.labelPosition,
      size: FormComponentSizeEnum.NORMAL,
      variant: FormComponentVariantEnum.OUTLINED,
    };

    if (this.control) {
      // Update existing textarea
      Object.assign(this.control, {
        options,
        placeholder: formValues.placeholder,
        minLength: formValues.minLength,
        maxLength: formValues.maxLength,
        rows: formValues.rows,
        cols: formValues.cols,
        autoResize: formValues.autoResize,
        labelStyle: formValues.labelStyle,
        labelPosition: formValues.labelPosition,
      });
      return this.control;
    } else {
      // Create a new textarea
      const textArea = new ECRFTextAreaClass(this.iconService, options);
      Object.assign(textArea, {
        placeholder: formValues.placeholder,
        minLength: formValues.minLength,
        maxLength: formValues.maxLength,
      });
      return textArea;
    }
  }

  /**
   * Set up dynamic form behavior specific to the textarea
   */
  private setupDynamicBehavior(): void {
    // Use PresetManagerService to handle autoResize -> rows/cols dependency
    this.presetManager.setupFieldDependency(
      this.form,
      'autoResize',
      ['rows', 'cols'],
      (autoResize: boolean): boolean => !autoResize,
    );

    // Handle autoResize behavior updates
    this.form.get('autoResize')?.valueChanges.subscribe((autoResize: boolean): void => {
      this.handleAutoResizeBehavior(autoResize);
    });

    // Apply initial autoResize state
    const currentAutoResize: any = this.form.get('autoResize')?.value;
    this.handleAutoResizeBehavior(currentAutoResize);
  }

  /**
   * Handle the autoResize behavior for rows/cols controls
   */
  private handleAutoResizeBehavior(autoResize: boolean): void {
    const rowsCtrl = this.form.get('rows');
    const colsCtrl = this.form.get('cols');

    if (autoResize) {
      rowsCtrl?.disable();
      colsCtrl?.disable();
    } else {
      rowsCtrl?.enable();
      colsCtrl?.enable();
    }
  }
}
