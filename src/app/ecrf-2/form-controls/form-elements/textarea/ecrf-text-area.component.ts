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
  LibTextareaComponent,
  TextareaConfig,
} from '@artificial-sense/ui-lib';
import { IconMappingService } from '@core/services/icon-mapping.service';
import { ECRFTextAreaClass } from './textarea.class';
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
  selector: 'app-text-area',
  templateUrl: './ecrf-text-area.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LibTextareaComponent, Card, SpeedDial],
})
export class EcrfTextAreaComponent
  extends EnhancedFormControlComponent<ECRFTextAreaClass>
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
   * Get textarea configuration for template
   * @returns TextareaConfig object
   */
  getTextareaConfig(): TextareaConfig {
    return this.getControlConfig();
  }

  /**
   * Open configuration dialog for textarea
   * @returns Observable of updated textarea control
   */
  protected openConfigDialog(): Observable<ECRFTextAreaClass> {
    return this.formDialogService.openTextareaDialog(this.control as ECRFTextAreaClass);
  }

  /**
   * Get human-readable control type name
   * @returns Control type name
   */
  protected getControlTypeName(): string {
    return 'Text area field';
  }

  /**
   * Create a duplicate of the current textarea control
   * @returns A new ECRFTextAreaClass instance or null if duplication fails
   */
  protected createDuplicate(): ECRFTextAreaClass | null {
    if (!this.control) return null;

    const originalControl: ECRFTextAreaClass = this.control;

    // Create a new control using the service
    const newControl = this.formControlsService.createControl(originalControl.type, {
      title: `${originalControl.options?.title || originalControl.title} (Copy)`,
      required: originalControl.options?.required || false,
      disabled: originalControl.options?.disabled || false,
      placeholder: originalControl.placeholder,
      rows: originalControl.rows,
      cols: originalControl.cols,
      autoResize: originalControl.autoResize,
      maxLength: originalControl.maxLength,
      minLength: originalControl.minLength,
      helperText: originalControl.options?.helperText,
      size: originalControl.size,
      variant: originalControl.variant,
      labelStyle: originalControl.labelStyle,
      labelPosition: originalControl.labelPosition,
    }) as ECRFTextAreaClass;

    // Set default value
    newControl.value = '';

    return newControl;
  }

  /**
   * Get configuration for the textarea component
   * @returns TextareaConfig object
   */
  protected getControlConfig(): TextareaConfig {
    if (!this.control) {
      return this.getDefaultConfig();
    }

    // Cast to TextArea to access specific properties
    const textArea = this.control as ECRFTextAreaClass;

    // Use control's toTextareaConfig method if available
    if (textArea.toTextareaConfig && typeof textArea.toTextareaConfig === 'function') {
      return textArea.toTextareaConfig();
    }

    // Otherwise, manually build the config from control properties
    return {
      label: textArea.options?.title || 'Text Area',
      required: textArea.options?.required || false,
      disabled: textArea.options?.disabled || false,
      placeholder: textArea.placeholder || 'Enter text here...',
      autofocus: false,
      labelStyle: textArea.labelStyle || FormLabelStyleEnum.DEFAULT,
      labelPosition: textArea.labelPosition || FormLabelPositionEnum.ABOVE,
      rows: textArea.rows || 3,
      cols: textArea.cols || 30,
      autoResize: textArea.autoResize || false,
      maxLength: textArea.maxLength,
      minLength: textArea.minLength,
      helperText: textArea.options?.helperText,
      size: FormComponentSizeEnum.NORMAL,
      variant: FormComponentVariantEnum.OUTLINED,
      // Apply any other properties from options
      ...(textArea.options?.textareaConfig || {}),
    };
  }

  /**
   * Get control-specific icon name
   * @returns Icon name string
   */
  protected getIconName(): string {
    return this.iconService?.getPrimeIcon(FormElementType.TEXT_AREA) || 'align_left';
  }

  /**
   * Check if the control is valid for editing
   * @returns True if the control is a valid TextArea
   */
  protected isValidControl(): boolean {
    return !!this.control && this.control.type === FormElementType.TEXT_AREA;
  }

  /**
   * Get default configuration when no control is present
   * @returns Default TextareaConfig
   */
  private getDefaultConfig(): TextareaConfig {
    return {
      label: 'Text Area',
      required: false,
      disabled: false,
      placeholder: 'Enter text here...',
      autofocus: false,
      labelStyle: FormLabelStyleEnum.DEFAULT,
      labelPosition: FormLabelPositionEnum.ABOVE,
      rows: 3,
      cols: 30,
      autoResize: false,
      size: FormComponentSizeEnum.NORMAL,
      variant: FormComponentVariantEnum.OUTLINED,
    };
  }
}
