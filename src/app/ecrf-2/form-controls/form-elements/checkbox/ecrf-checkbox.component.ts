import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LibCheckboxComponent as LibCheckboxComponent,
  CheckboxConfig,
  CheckboxModeEnum,
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  FormLabelPositionEnum,
  FormLabelStyleEnum,
} from '@artificial-sense/ui-lib';
import { Card } from 'primeng/card';
import { Observable, Subscription } from 'rxjs';
import { EnhancedFormControlComponent } from '../../enhanced-form-control.component';
import { ECRFCheckboxClass } from './checkbox.class';
import { IconMappingService } from '../../../core/services/icon-mapping.service';
import { FormDialogService } from '../../../core/services/dialog/form-dialog.service';
import { ToastManagerService } from '../../../../core/services/toast-manager.service';
import { DragDropService } from '../../../core/services/drag-and-drop';
import { FormElementType } from '../../../core/models/enums/form.enums';
import { SpeedDialModule } from 'primeng/speeddial';
import { ConfirmationService } from 'primeng/api';
import { FormControlsService } from '../../../core/services/form/form-controls.service';

@Component({
  selector: 'app-checkbox',
  templateUrl: './ecrf-checkbox.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LibCheckboxComponent, Card, SpeedDialModule],
})
export class ECRFCheckboxComponent
  extends EnhancedFormControlComponent<ECRFCheckboxClass>
  implements OnInit, OnDestroy
{
  protected readonly CheckboxModeEnum: typeof CheckboxModeEnum = CheckboxModeEnum;
  // Subscription for change detection triggers
  private subscription: Subscription = new Subscription();

  constructor(
    protected override iconService: IconMappingService,
    protected override formDialogService: FormDialogService,
    protected override toastManager: ToastManagerService,
    private dragDropService: DragDropService,
    private cdr: ChangeDetectorRef,
    protected override confirmationService: ConfirmationService,
    private formControlsService: FormControlsService,
  ) {
    super(iconService, formDialogService, toastManager, confirmationService);
  }

  ngOnInit(): void {
    // Subscribe to change detection triggers
    this.subscription.add(
      this.dragDropService.changeDetectionNeeded$.subscribe((): void => {
        this.cdr.markForCheck();
      }),
    );

    // Also subscribe to control dropped events
    this.subscription.add(
      this.dragDropService.controlDropped.subscribe((): void => {
        this.cdr.markForCheck();
      }),
    );
  }

  ngOnDestroy(): void {
    // Cleanup subscriptions
    this.subscription.unsubscribe();
  }

  /**
   * Get checkbox configuration for template
   * @returns CheckboxConfig object
   */
  getCheckboxConfig(): CheckboxConfig {
    return this.getControlConfig();
  }

  /**
   * Handle value change for single checkbox
   * @param value The new value
   */
  override onValueChange(value: boolean): void {
    if (this.control) {
      this.control.value = value;
    }
  }

  /**
   * Handle value change for a checkbox in GROUP mode
   * @param optionValue The option value
   * @param isChecked Whether the checkbox is checked
   * @param index The index of the option
   */
  onGroupValueChange(optionValue: any, isChecked: boolean, index: number): void {
    if (!this.control) return;

    // Initialize the value as an array if needed
    if (!Array.isArray(this.control.value)) {
      this.control.value = [];
    }

    const selectedValues = this.control.value as any[];

    if (isChecked) {
      // Add value if not already in array
      if (!selectedValues.includes(optionValue)) {
        selectedValues.push(optionValue);
      }
    } else {
      // Remove value if in array
      const idx = selectedValues.indexOf(optionValue);
      if (idx !== -1) {
        selectedValues.splice(idx, 1);
      }
    }

    // Update control value
    this.control.value = selectedValues;
  }

  /**
   * Check if an option is selected in GROUP mode
   * @param optionValue The option value to check
   * @returns True if the option is selected
   */
  isOptionSelected(optionValue: any): boolean {
    if (!this.control || !this.control.value) return false;

    // Handle array values for GROUP mode
    if (Array.isArray(this.control.value)) {
      return this.control.value.includes(optionValue);
    }

    // Handle single value
    return this.control.value === optionValue;
  }

  /**
   * Open configuration dialog for checkbox
   * @returns Observable of updated checkbox control
   */
  protected openConfigDialog(): Observable<ECRFCheckboxClass> {
    return this.formDialogService.openCheckboxDialog(this.control as ECRFCheckboxClass);
  }

  /**
   * Get human-readable control type name
   * @returns Control type name
   */
  protected getControlTypeName(): string {
    return 'Checkbox field';
  }

  /**
   * Create a duplicate of the current checkbox control
   * @returns A new ECRFCheckboxClass instance or null if duplication fails
   */
  protected createDuplicate(): ECRFCheckboxClass | null {
    if (!this.control) return null;

    const originalControl: ECRFCheckboxClass = this.control;

    // Create a new control using the service
    const newControl = this.formControlsService.createControl(originalControl.type, {
      name: `${originalControl.options?.name || 'checkbox'}_copy_${Date.now()}`,
      title: `${originalControl.options?.title || originalControl.title} (Copy)`,
      required: originalControl.options?.required || false,
      disabled: originalControl.options?.disabled || false,
      helperText: originalControl.options?.helperText,
      // Copy checkbox-specific options
      mode: originalControl.mode,
      size: originalControl.size,
      variant: originalControl.variant,
      // Copy group options if they exist
    }) as ECRFCheckboxClass;

    // Handle different checkbox modes
    if (originalControl.mode === CheckboxModeEnum.GROUP) {
      // For group mode, initialize with empty array
      newControl.value = [];
      // Ensure options are properly copied
      if (originalControl.options?.options && newControl.options) {
        newControl.options = {
          ...newControl.options,
          name: newControl.options.name, // Ensure name is preserved
          options: originalControl.options.options.map((option) => ({
            label: option.label,
            value: option.value,
            disabled: option.disabled,
            group: option.group,
          })),
        };
      }
    } else {
      // For binary mode, initialize with false
      newControl.value = false;
    }

    // Copy other checkbox-specific properties
    newControl.mode = originalControl.mode;
    newControl.size = originalControl.size;
    newControl.variant = originalControl.variant;
    newControl.labelPosition = originalControl.labelPosition;
    newControl.labelStyle = originalControl.labelStyle;
    newControl.indeterminate = false; // Reset indeterminate state

    return newControl;
  }

  /**
   * Get configuration for the checkbox component
   * @returns CheckboxConfig object
   */
  protected getControlConfig(): CheckboxConfig {
    if (!this.control) {
      return this.getDefaultConfig();
    }

    // Cast to Checkbox to access specific properties
    const checkbox = this.control as ECRFCheckboxClass;

    // Use control's toCheckboxConfig method if available
    if (checkbox.toCheckboxConfig && typeof checkbox.toCheckboxConfig === 'function') {
      return checkbox.toCheckboxConfig();
    }

    // Otherwise, manually build the config from control properties
    return {
      label: checkbox.options?.title || 'Checkbox',
      required: checkbox.options?.required || false,
      disabled: checkbox.options?.disabled || false,
      mode: checkbox.mode || CheckboxModeEnum.BINARY,
      size: checkbox.size || FormComponentSizeEnum.NORMAL,
      variant: checkbox.variant || FormComponentVariantEnum.OUTLINED,
      indeterminate: checkbox.indeterminate || false,
      helperText: checkbox.options?.helperText,
      labelStyle: FormLabelStyleEnum.DEFAULT,
      labelPosition: FormLabelPositionEnum.ABOVE,
      // Apply any other properties from options
      ...(checkbox.options?.checkboxConfig || {}),
    };
  }

  /**
   * Get control-specific icon name
   * @returns Icon name string
   */
  protected getIconName(): string {
    return this.iconService?.getPrimeIcon(FormElementType.CHECKBOX) || 'check_box';
  }

  /**
   * Check if the control is valid for editing
   * @returns True if the control is valid Checkbox
   */
  protected isValidControl(): boolean {
    return !!this.control && this.control.type === FormElementType.CHECKBOX;
  }

  /**
   * Get default configuration when no control is present
   * @returns Default CheckboxConfig
   */
  private getDefaultConfig(): CheckboxConfig {
    return {
      label: 'Checkbox',
      required: false,
      disabled: false,
      mode: CheckboxModeEnum.BINARY,
      size: FormComponentSizeEnum.NORMAL,
      variant: FormComponentVariantEnum.OUTLINED,
      labelPosition: FormLabelPositionEnum.ABOVE,
      labelStyle: FormLabelStyleEnum.DEFAULT,
    };
  }
}
