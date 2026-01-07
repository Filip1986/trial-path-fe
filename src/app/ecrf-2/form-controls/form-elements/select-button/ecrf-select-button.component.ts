import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  FormLabelPositionEnum,
  FormLabelStyleEnum,
  LibSelectButtonComponent as LibSelectButtonComponent,
  SelectButtonConfig,
} from '@artificial-sense/ui-lib';
import { IconMappingService } from '@core/services/icon-mapping.service';
import { ECRFSelectButtonClass } from './select-button.class';
import { FormDialogService } from '@core/services/dialog/form-dialog.service';
import { ToastManagerService } from '@core/services/toast-manager.service';
import { Card } from 'primeng/card';
import { Observable, Subscription } from 'rxjs';
import { EnhancedFormControlComponent } from '../../enhanced-form-control.component';
import { DragDropService } from '@core/services/drag-and-drop';
import { FormElementType } from '@core/models/enums/form.enums';
import { SpeedDial } from 'primeng/speeddial';
import { ConfirmationService } from 'primeng/api';
import { FormControlsService } from '@core/services/form/form-controls.service';

@Component({
  selector: 'app-select-button',
  templateUrl: './ecrf-select-button.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LibSelectButtonComponent, Card, SpeedDial],
})
export class EcrfSelectButtonComponent
  extends EnhancedFormControlComponent<ECRFSelectButtonClass>
  implements OnInit, OnDestroy
{
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
   * Get select button configuration for template
   * @returns SelectButtonConfig object
   */
  getSelectButtonConfig(): SelectButtonConfig {
    return this.getControlConfig();
  }

  /**
   * Open configuration dialog for select button
   * @returns Observable of updated select button control
   */
  protected openConfigDialog(): Observable<ECRFSelectButtonClass> {
    return this.formDialogService.openSelectButtonDialog(this.control as ECRFSelectButtonClass);
  }

  /**
   * Get human-readable control type name
   * @returns Control type name
   */
  protected getControlTypeName(): string {
    return 'Select Button';
  }

  /**
   * Create a duplicate of the current select button control
   * @returns A new ECRFSelectButtonClass instance or null if duplication fails
   */
  protected createDuplicate(): ECRFSelectButtonClass | null {
    if (!this.control) return null;

    const originalControl: ECRFSelectButtonClass = this.control;

    // Create a new control using the service
    const newControl = this.formControlsService.createControl(originalControl.type, {
      title: `${originalControl.options?.title || originalControl.title} (Copy)`,
      name: originalControl.options?.name || `${originalControl.title} (Copy)`,
      required: originalControl.options?.required || false,
      disabled: originalControl.options?.disabled || false,
      multiple: originalControl.multiple,
      size: originalControl.size,
      // Deep copies the select button options to avoid reference issues
      selectButtonOptions: originalControl.selectButtonOptions
        ? originalControl.selectButtonOptions.map((option) => ({
            label: option.label,
            value: option.value,
            disabled: option.disabled,
          }))
        : [],
      optionLabel: originalControl.optionLabel,
      optionValue: originalControl.optionValue,
      optionDisabled: originalControl.optionDisabled,
      helperText: originalControl.options?.helperText,
    }) as ECRFSelectButtonClass;

    // Reset the value for the duplicated control
    // For single selection, set to null; for multiple selection, set to empty array
    newControl.value = originalControl.multiple ? [] : null;

    // Copy any additional UI configuration properties
    if (originalControl.labelStyle) {
      newControl.labelStyle = originalControl.labelStyle;
    }
    if (originalControl.labelPosition) {
      newControl.labelPosition = originalControl.labelPosition;
    }
    if (originalControl.variant) {
      newControl.variant = originalControl.variant;
    }
    if (originalControl.ariaLabelledBy) {
      newControl.ariaLabelledBy = originalControl.ariaLabelledBy;
    }

    return newControl;
  }

  /**
   * Get configuration for the select button component
   * @returns SelectButtonConfig object
   */
  protected getControlConfig(): SelectButtonConfig {
    if (!this.control) {
      return this.getDefaultConfig();
    }

    // Cast to SelectButton to access specific properties
    const selectButton = this.control as ECRFSelectButtonClass;

    // Use control toSelectButtonConfig method if available
    if (
      selectButton.toSelectButtonConfig &&
      typeof selectButton.toSelectButtonConfig === 'function'
    ) {
      return selectButton.toSelectButtonConfig();
    }

    // Otherwise, manually build the config from control properties
    return {
      options: selectButton.selectButtonOptions || [],
      optionLabel: selectButton.optionLabel || 'label',
      optionValue: selectButton.optionValue || 'value',
      optionDisabled: selectButton.optionDisabled,
      multiple: selectButton.multiple,
      required: selectButton.options?.required || false,
      disabled: selectButton.options?.disabled || false,
      size: selectButton.size || FormComponentSizeEnum.NORMAL,
      ariaLabelledBy: selectButton.ariaLabelledBy,
      helperText: selectButton.options?.helperText,
      labelPosition: selectButton.labelPosition || FormLabelPositionEnum.ABOVE,
      labelStyle: selectButton.labelStyle || FormLabelStyleEnum.DEFAULT,
      variant: selectButton.variant || FormComponentVariantEnum.OUTLINED,
      // Apply any other properties from options
      ...(selectButton.options?.selectButtonConfig || {}),
    };
  }

  /**
   * Get control-specific icon name
   * @returns Icon name string
   */
  protected getIconName(): string {
    return this.iconService?.getPrimeIcon(FormElementType.SELECT_BUTTON) || 'pi pi-toggle-on';
  }

  /**
   * Check if the control is valid for editing
   * @returns True if the control is a valid SelectButton
   */
  protected isValidControl(): boolean {
    return !!this.control && this.control.type === FormElementType.SELECT_BUTTON;
  }

  /**
   * Get default configuration when no control is present
   * @returns Default SelectButtonConfig
   */
  private getDefaultConfig(): SelectButtonConfig {
    return {
      options: [],
      multiple: false,
      required: false,
      disabled: false,
      size: FormComponentSizeEnum.NORMAL,
      labelPosition: FormLabelPositionEnum.ABOVE,
      labelStyle: FormLabelStyleEnum.DEFAULT,
      variant: FormComponentVariantEnum.OUTLINED,
    };
  }
}
