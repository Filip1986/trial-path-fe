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
  FormComponentVariantType,
  FormLabelPositionEnum,
  FormLabelStyleEnum,
  LibRadioButtonComponent as LibRadioButtonComponent,
  RadioButtonConfig,
  RadioButtonModeEnum,
} from '@artificial-sense/ui-lib';
import { IconMappingService } from '../../../core/services/icon-mapping.service';
import { ECRFRadioButtonClass } from './radio-button.class';
import { FormDialogService } from '../../../core/services/dialog/form-dialog.service';
import { ToastManagerService } from '../../../../core/services/toast-manager.service';
import { Card } from 'primeng/card';
import { Observable, Subscription } from 'rxjs';
import { EnhancedFormControlComponent } from '../../enhanced-form-control.component';
import { DragDropService } from '../../../core/services/drag-and-drop';
import { FormElementType } from '../../../core/models/enums/form.enums';
import { SpeedDial } from 'primeng/speeddial';
import { ConfirmationService } from 'primeng/api';
import { FormControlsService } from '../../../core/services/form/form-controls.service';

@Component({
  selector: 'app-radio-button',
  templateUrl: './ecrf-radio-button.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LibRadioButtonComponent, Card, SpeedDial],
})
export class EcrfRadioButtonComponent
  extends EnhancedFormControlComponent<ECRFRadioButtonClass>
  implements OnInit, OnDestroy
{
  protected readonly FormLabelPositionEnum = FormLabelPositionEnum;
  protected readonly FormLabelStyleEnum = FormLabelStyleEnum;
  protected readonly FormComponentSizeEnum = FormComponentSizeEnum;
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
   * Type guard to check if the control is a RadioButton
   * @returns True if the control is a RadioButton
   */
  isRadioButton(): boolean {
    return this.isValidControl();
  }

  /**
   * Safely get radio options from the RadioButton control
   * @returns Array of radio options or empty array if not found
   */
  getRadioOptions(): Array<{ label: string; value: any }> {
    if (this.control && this.control.type === FormElementType.RADIO) {
      const radioButton = this.control as ECRFRadioButtonClass;
      return radioButton.radioOptions || [];
    }
    return [];
  }

  /**
   * Safely get radio name from the RadioButton control
   * @returns The radio group name
   */
  getRadioName(): string {
    if (this.control && this.control.type === FormElementType.RADIO) {
      const radioButton = this.control as ECRFRadioButtonClass;
      return radioButton.name || 'radio-group';
    }
    return 'radio-group';
  }

  /**
   * Safely get radio variant from the RadioButton control
   * @returns The radio button variant
   */
  getRadioVariant(): FormComponentVariantType {
    if (this.control && this.control.type === FormElementType.RADIO) {
      const radioButton = this.control as ECRFRadioButtonClass;
      return radioButton.variant || FormComponentVariantEnum.OUTLINED;
    }
    return FormComponentVariantEnum.OUTLINED;
  }

  /**
   * Open configuration dialog for radio button
   * @returns Observable of updated radio button control
   */
  protected openConfigDialog(): Observable<ECRFRadioButtonClass> {
    return this.formDialogService.openRadioButtonDialog(this.control as ECRFRadioButtonClass);
  }

  /**
   * Get human-readable control type name
   * @returns Control type name
   */
  protected getControlTypeName(): string {
    return 'Radio button field';
  }

  /**
   * Create a duplicate of the current radio button control
   * @returns A new ECRFRadioButtonClass instance or null if duplication fails
   */
  protected createDuplicate(): ECRFRadioButtonClass | null {
    if (!this.control) return null;

    const originalControl: ECRFRadioButtonClass = this.control;

    // Create a new control using the service
    const newControl = this.formControlsService.createControl(originalControl.type, {
      title: `${originalControl.options?.title || originalControl.title} (Copy)`,
      required: originalControl.options?.required || false,
      disabled: originalControl.options?.disabled || false,
      helperText: originalControl.options?.helperText,
      // Copy radio-specific options
      radioOptions: originalControl.radioOptions ? [...originalControl.radioOptions] : [],
      mode: originalControl.mode,
      size: originalControl.size,
      variant: originalControl.variant,
    }) as ECRFRadioButtonClass;

    // Generate a unique name for the radio group to avoid conflicts
    newControl.name = `radio-group-${Math.random().toString(36).substring(2, 9)}`;

    // Reset the value for the new control
    newControl.value = undefined;

    return newControl;
  }

  /**
   * Get configuration for the radio button component
   * @returns RadioButtonConfig object
   */
  protected getControlConfig(): RadioButtonConfig {
    if (!this.control) {
      return this.getDefaultConfig();
    }

    // Cast to RadioButton to access specific properties
    const radioButton = this.control as ECRFRadioButtonClass;

    // Use control's toRadioButtonConfig method if available
    if (radioButton.toRadioButtonConfig && typeof radioButton.toRadioButtonConfig === 'function') {
      return radioButton.toRadioButtonConfig();
    }

    // Otherwise, manually build the config from control properties
    return {
      label: radioButton.options?.title || 'Radio Button',
      name: radioButton.name || 'radio-group',
      required: radioButton.options?.required || false,
      disabled: radioButton.options?.disabled || false,
      mode: radioButton.mode || RadioButtonModeEnum.STANDARD,
      size: radioButton.size,
      variant: radioButton.variant || FormComponentVariantEnum.OUTLINED,
      value: radioButton.value,
      labelPosition: radioButton.labelPosition || FormLabelPositionEnum.ABOVE,
      labelStyle: radioButton.labelStyle || FormLabelStyleEnum.DEFAULT,
      // Apply any other properties from options
      ...(radioButton.options?.radioButtonConfig || {}),
    };
  }

  /**
   * Get control-specific icon name
   * @returns Icon name string
   */
  protected getIconName(): string {
    return this.iconService?.getPrimeIcon(FormElementType.RADIO) || 'radio_button_checked';
  }

  /**
   * Check if the control is valid for editing
   * @returns True if the control is a valid RadioButton
   */
  protected isValidControl(): boolean {
    return !!this.control && this.control.type === FormElementType.RADIO;
  }

  /**
   * Get default configuration when no control is present
   * @returns Default RadioButtonConfig
   */
  private getDefaultConfig(): RadioButtonConfig {
    return {
      label: 'Radio Button',
      name: 'radio-group',
      required: false,
      disabled: false,
      mode: RadioButtonModeEnum.STANDARD,
      variant: FormComponentVariantEnum.OUTLINED,
      size: FormComponentSizeEnum.NORMAL,
      labelStyle: FormLabelStyleEnum.DEFAULT,
      labelPosition: FormLabelPositionEnum.ABOVE,
    };
  }
}
