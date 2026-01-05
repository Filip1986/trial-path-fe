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
  LibTimePickerComponent as LibTimePickerComponent,
  TimePickerConfig,
  TimePickerHourFormatEnum,
} from '@artificial-sense/ui-lib';
import { IconMappingService } from '../../../core/services/icon-mapping.service';
import { EcrfTimePickerClass } from './time-picker.class';
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
  selector: 'app-time-picker',
  templateUrl: './ecrf-time-picker.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LibTimePickerComponent, Card, SpeedDial],
})
export class EcrfTimePickerComponent
  extends EnhancedFormControlComponent<EcrfTimePickerClass>
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
   * Get time picker configuration for template
   * @returns TimePickerConfig object
   */
  getTimePickerConfig(): TimePickerConfig {
    return this.getControlConfig();
  }

  /**
   * Open configuration dialog for time picker
   * @returns Observable of updated time picker control
   */
  protected openConfigDialog(): Observable<EcrfTimePickerClass> {
    return this.formDialogService.openTimePickerDialog(this.control as EcrfTimePickerClass);
  }

  /**
   * Get human-readable control type name
   * @returns Control type name
   */
  protected getControlTypeName(): string {
    return 'Time picker field';
  }

  /**
   * Create a duplicate of the current time picker control
   * @returns A new time picker control with copied properties
   */
  protected createDuplicate(): EcrfTimePickerClass | null {
    if (!this.control) return null;

    const originalControl: EcrfTimePickerClass = this.control;

    // Create a new control using the service with basic options
    const newControl = this.formControlsService.createControl(originalControl.type, {
      title: `${originalControl.options?.title || originalControl.title} (Copy)`,
      required: originalControl.options?.required || false,
      disabled: originalControl.options?.disabled || false,
      name: originalControl.options?.name || `time-picker-${Date.now()}`,
      helperText: originalControl.options?.helperText,
    }) as EcrfTimePickerClass;

    // Copy time picker specific properties directly to the control instance
    if (originalControl.hourFormat) {
      newControl.hourFormat = originalControl.hourFormat;
    }

    if (originalControl.placeholder) {
      newControl.placeholder = originalControl.placeholder;
    }

    if (originalControl.labelStyle) {
      newControl.labelStyle = originalControl.labelStyle;
    }

    if (originalControl.labelPosition) {
      newControl.labelPosition = originalControl.labelPosition;
    }

    if (originalControl.showIcon !== undefined) {
      newControl.showIcon = originalControl.showIcon;
    }

    // Set default value (null for time picker)
    newControl.value = null;

    return newControl;
  }

  /**
   * Get configuration for the time picker component
   * @returns TimePickerConfig object
   */
  protected getControlConfig(): TimePickerConfig {
    if (!this.control) {
      return this.getDefaultConfig();
    }

    // Cast to TimePicker to access specific properties
    const timePicker = this.control as EcrfTimePickerClass;

    // Use control's toTimePickerConfig method if available
    if (timePicker.toTimePickerConfig && typeof timePicker.toTimePickerConfig === 'function') {
      return timePicker.toTimePickerConfig();
    }

    // Otherwise, manually build the config from control properties
    return {
      label: timePicker.options?.title || 'Time',
      required: timePicker.options?.required || false,
      disabled: timePicker.options?.disabled || false,
      hourFormat: timePicker.hourFormat || TimePickerHourFormatEnum.TWELVE,
      labelStyle: timePicker.labelStyle,
      labelPosition: timePicker.labelPosition,
      helperText: timePicker.options?.helperText,
      variant: FormComponentVariantEnum.OUTLINED,
      size: FormComponentSizeEnum.NORMAL,
      // Apply any other properties from options
      ...(timePicker.options?.timePickerConfig || {}),
    };
  }

  /**
   * Get control-specific icon name
   * @returns Icon name string
   */
  protected getIconName(): string {
    return this.iconService?.getPrimeIcon(FormElementType.TIME_PICKER) || 'pi pi-clock';
  }

  /**
   * Check if the control is valid for editing
   * @returns True if the control is a valid TimePicker
   */
  protected isValidControl(): boolean {
    return !!this.control && this.control.type === FormElementType.TIME_PICKER;
  }

  /**
   * Get default configuration when no control is present
   * @returns Default TimePickerConfig
   */
  private getDefaultConfig(): TimePickerConfig {
    return {
      label: 'Time',
      required: false,
      disabled: false,
      hourFormat: TimePickerHourFormatEnum.TWELVE,
      variant: FormComponentVariantEnum.OUTLINED,
      size: FormComponentSizeEnum.NORMAL,
      labelPosition: FormLabelPositionEnum.ABOVE,
      labelStyle: FormLabelStyleEnum.DEFAULT,
    };
  }
}
