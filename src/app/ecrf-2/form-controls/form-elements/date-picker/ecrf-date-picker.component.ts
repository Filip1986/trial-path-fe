import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LibDatePickerComponent as LibDatePickerComponent,
  DatePickerConfig,
  DatePickerHourFormatEnum,
  DatePickerModeEnum,
  DatePickerViewEnum,
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  FormLabelPositionEnum,
  FormLabelStyleEnum,
  IconDisplayModeEnum,
} from '@artificial-sense/ui-lib';
import { IconMappingService } from '../../../core/services/icon-mapping.service';
import { EcrfDatePickerClass } from './date-picker.class';
import { FormDialogService } from '../../../core/services/dialog/form-dialog.service';
import { ToastManagerService } from '../../../../core/services/toast-manager.service';
import { Card } from 'primeng/card';
import { Observable, Subscription } from 'rxjs';
import { EnhancedFormControlComponent } from '../../enhanced-form-control.component';
import { DragDropService } from '../../../core/services/drag-and-drop';
import { FormElementType } from '../../../core/models/enums/form.enums';
import { SpeedDialModule } from 'primeng/speeddial';
import { ConfirmationService } from 'primeng/api';
import { FormControlsService } from '../../../core/services/form/form-controls.service';

@Component({
  selector: 'app-date-picker',
  templateUrl: './ecrf-date-picker.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LibDatePickerComponent, Card, SpeedDialModule],
})
export class ECRFDatePickerComponent
  extends EnhancedFormControlComponent<EcrfDatePickerClass>
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
   * Get date picker configuration for template
   * @returns DatePickerConfig object
   */
  getDatePickerConfig(): DatePickerConfig {
    return this.getControlConfig();
  }

  /**
   * Open configuration dialog for date picker
   * @returns Observable of updated date picker control
   */
  protected openConfigDialog(): Observable<EcrfDatePickerClass> {
    return this.formDialogService.openDatePickerDialog(this.control as EcrfDatePickerClass);
  }

  /**
   * Get human-readable control type name
   * @returns Control type name
   */
  protected getControlTypeName(): string {
    return 'Date picker field';
  }

  /**
   * Create a duplicate of the current date picker control
   * @returns A new ECRFDatePickerClass instance or null if duplication fails
   */
  protected createDuplicate(): EcrfDatePickerClass | null {
    if (!this.control) return null;

    const originalControl: EcrfDatePickerClass = this.control;

    // Create a new control using the form controls service
    const newControl = this.formControlsService.createControl(originalControl.type, {
      title: `${originalControl.options?.title || originalControl.title} (Copy)`,
      name: originalControl.options?.name || 'date-picker-copy',
      required: originalControl.options?.required || false,
      disabled: originalControl.options?.disabled || false,
      helperText: originalControl.options?.helperText,
      // Date picker specific options
      dateFormat: originalControl.dateFormat,
      showTime: originalControl.showTime,
      selectionMode: originalControl.selectionMode,
      view: originalControl.view,
      minDate: originalControl.minDate,
      maxDate: originalControl.maxDate,
      size: originalControl.options?.size || FormComponentSizeEnum.NORMAL,
    }) as EcrfDatePickerClass;

    // Copy additional properties that might not be in the factory options
    if (originalControl.placeholder) {
      newControl.placeholder = originalControl.placeholder;
    }

    // Copy label style and position
    newControl.labelStyle = originalControl.labelStyle;
    newControl.labelPosition = originalControl.labelPosition;

    // Copy show icon setting
    newControl.showIcon = originalControl.showIcon;

    // Reset the value to null for the new control (don't copy the selected date)
    newControl.value = null;

    return newControl;
  }

  /**
   * Get configuration for the date picker component
   * @returns DatePickerConfig object
   */
  protected getControlConfig(): DatePickerConfig {
    if (!this.control) {
      return this.getDefaultConfig();
    }

    // Cast to DatePicker to access specific properties
    const datePicker = this.control as EcrfDatePickerClass;

    // Use control's toDatePickerConfig method if available
    if (datePicker.toDatePickerConfig && typeof datePicker.toDatePickerConfig === 'function') {
      return datePicker.toDatePickerConfig();
    }

    // Otherwise, manually build the config from control properties
    return {
      label: datePicker.options?.title || 'Date',
      required: datePicker.options?.required || false,
      disabled: datePicker.options?.disabled || false,
      selectionMode: datePicker.selectionMode || DatePickerModeEnum.SINGLE,
      view: datePicker.view || DatePickerViewEnum.DATE,
      labelStyle: datePicker.labelStyle,
      labelPosition: datePicker.labelPosition,
      dateFormat: datePicker.dateFormat || 'mm/dd/yy',
      showTime: datePicker.showTime,
      hourFormat: datePicker.hourFormat || DatePickerHourFormatEnum.TWENTY_FOUR,
      minDate: datePicker.minDate,
      maxDate: datePicker.maxDate,
      helperText: datePicker.options?.helperText,
      iconDisplay: IconDisplayModeEnum.BUTTON,
      variant: FormComponentVariantEnum.OUTLINED,
      numberOfMonths: 1,
      size: FormComponentSizeEnum.NORMAL,
      // Apply any other properties from options
      ...(datePicker.options?.datePickerConfig || {}),
    };
  }

  /**
   * Get control-specific icon name
   * @returns Icon name string
   */
  protected getIconName(): string {
    return this.iconService?.getPrimeIcon(FormElementType.DATE_PICKER) || 'pi pi-calendar';
  }

  /**
   * Check if the control is valid for editing
   * @returns True if the control is a valid DatePicker
   */
  protected isValidControl(): boolean {
    return !!this.control && this.control.type === FormElementType.DATE_PICKER;
  }

  /**
   * Get default configuration when no control is present
   * @returns Default DatePickerConfig
   */
  private getDefaultConfig(): DatePickerConfig {
    return {
      label: 'Date',
      required: false,
      disabled: false,
      selectionMode: DatePickerModeEnum.SINGLE,
      view: DatePickerViewEnum.DATE,
      iconDisplay: IconDisplayModeEnum.BUTTON,
      variant: FormComponentVariantEnum.OUTLINED,
      numberOfMonths: 1,
      showTime: false,
      hourFormat: DatePickerHourFormatEnum.TWENTY_FOUR,
      labelPosition: FormLabelPositionEnum.ABOVE,
      labelStyle: FormLabelStyleEnum.DEFAULT,
      size: FormComponentSizeEnum.NORMAL,
    };
  }
}
