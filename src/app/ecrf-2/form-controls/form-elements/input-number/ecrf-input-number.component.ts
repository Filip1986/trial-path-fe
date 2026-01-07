import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LibInputNumberComponent as LibInputNumberComponent,
  InputNumberConfig,
  InputNumberModeEnum,
  InputNumberButtonLayoutEnum,
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  FormLabelStyleEnum,
  FormLabelPositionEnum,
} from '@artificial-sense/ui-lib';
import { IconMappingService } from '@core/services/icon-mapping.service';
import { ECRFInputNumberClass } from './input-number.class';
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
  selector: 'app-input-number',
  templateUrl: './ecrf-input-number.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LibInputNumberComponent, Card, SpeedDial],
})
export class ECRFInputNumberComponent
  extends EnhancedFormControlComponent<ECRFInputNumberClass>
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
   * Get input number configuration for template
   * @returns InputNumberConfig object
   */
  getInputNumberConfig(): InputNumberConfig {
    return this.getControlConfig();
  }

  /**
   * Open configuration dialog for input number
   * @returns Observable of updated input number control
   */
  protected openConfigDialog(): Observable<ECRFInputNumberClass> {
    return this.formDialogService.openInputNumberDialog(this.control as ECRFInputNumberClass);
  }

  /**
   * Get human-readable control type name
   * @returns Control type name
   */
  protected getControlTypeName(): string {
    return 'Number input field';
  }

  /**
   * Create a duplicate of the current input number control
   * @returns A new ECRFInputNumberClass instance or null if duplication fails
   */
  protected createDuplicate(): ECRFInputNumberClass | null {
    if (!this.control) return null;

    const originalControl: ECRFInputNumberClass = this.control;

    // Create a new control using the service
    const newControl = this.formControlsService.createControl(originalControl.type, {
      title: `${originalControl.options?.title || originalControl.title} (Copy)`,
      required: originalControl.options?.required || false,
      disabled: originalControl.options?.disabled || false,
      helperText: originalControl.options?.helperText,
      // Input number specific properties
      min: originalControl.min,
      max: originalControl.max,
      step: originalControl.step,
      prefix: originalControl.prefix,
      suffix: originalControl.suffix,
      currency: originalControl.currency,
      mode: originalControl.mode,
    }) as ECRFInputNumberClass;

    // Copy additional properties that might not be covered by the factory options
    newControl.placeholder = originalControl.placeholder;
    newControl.locale = originalControl.locale;
    newControl.minFractionDigits = originalControl.minFractionDigits;
    newControl.maxFractionDigits = originalControl.maxFractionDigits;
    newControl.showButtons = originalControl.showButtons;
    newControl.buttonLayout = originalControl.buttonLayout;
    newControl.useGrouping = originalControl.useGrouping;
    newControl.size = originalControl.size;
    newControl.variant = originalControl.variant;
    newControl.labelStyle = originalControl.labelStyle;
    newControl.labelPosition = originalControl.labelPosition;

    // Set default value (typically null or 0 for number inputs)
    newControl.value = null;

    return newControl;
  }

  /**
   * Get configuration for the input number component
   * @returns InputNumberConfig object
   */
  protected getControlConfig(): InputNumberConfig {
    if (!this.control) {
      return this.getDefaultConfig();
    }

    // Cast to InputNumber to access specific properties
    const inputNumber = this.control as ECRFInputNumberClass;

    // Use control's toInputNumberConfig method if available
    if (inputNumber.toInputNumberConfig && typeof inputNumber.toInputNumberConfig === 'function') {
      return inputNumber.toInputNumberConfig();
    }

    // Otherwise, manually build the config from control properties
    return {
      label: inputNumber.options?.title || 'Number Input',
      required: inputNumber.options?.required || false,
      disabled: inputNumber.options?.disabled || false,
      placeholder: inputNumber.placeholder || 'Enter a number',
      mode: inputNumber.mode || InputNumberModeEnum.DECIMAL,
      min: inputNumber.min,
      max: inputNumber.max,
      step: inputNumber.step || 1,
      prefix: inputNumber.prefix,
      suffix: inputNumber.suffix,
      minFractionDigits: inputNumber.minFractionDigits,
      maxFractionDigits: inputNumber.maxFractionDigits,
      showButtons: inputNumber.showButtons ?? true,
      buttonLayout: inputNumber.buttonLayout || InputNumberButtonLayoutEnum.STACKED,
      useGrouping: inputNumber.useGrouping ?? true,
      size: inputNumber.size || FormComponentSizeEnum.NORMAL,
      variant: inputNumber.variant || FormComponentVariantEnum.OUTLINED,
      labelStyle: inputNumber.labelStyle || FormLabelStyleEnum.DEFAULT,
      labelPosition: inputNumber.labelPosition || FormLabelPositionEnum.ABOVE,
      helperText: inputNumber.options?.helperText,
      // Apply any other properties from options
      ...(inputNumber.options?.inputNumberConfig || {}),
    };
  }

  /**
   * Get control-specific icon name
   * @returns Icon name string
   */
  protected getIconName(): string {
    return this.iconService?.getPrimeIcon(FormElementType.INPUT_NUMBER) || 'pi pi-hashtag';
  }

  /**
   * Check if the control is valid for editing
   * @returns True if the control is a valid InputNumber
   */
  protected isValidControl(): boolean {
    return !!this.control && this.control.type === FormElementType.INPUT_NUMBER;
  }

  /**
   * Get default configuration when no control is present
   * @returns Default InputNumberConfig
   */
  private getDefaultConfig(): InputNumberConfig {
    return {
      label: 'Number Input',
      required: false,
      disabled: false,
      placeholder: 'Enter a number',
      mode: InputNumberModeEnum.DECIMAL,
      step: 1,
      showButtons: true,
      buttonLayout: InputNumberButtonLayoutEnum.STACKED,
      useGrouping: true,
      size: FormComponentSizeEnum.NORMAL,
      variant: FormComponentVariantEnum.OUTLINED,
      labelStyle: FormLabelStyleEnum.DEFAULT,
      labelPosition: FormLabelPositionEnum.ABOVE,
    };
  }
}
