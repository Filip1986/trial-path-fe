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
  LibInputTextComponent,
  InputTextConfig,
  InputTextTypeEnum,
} from '@artificial-sense/ui-lib';
import { IconMappingService } from '@core/services/icon-mapping.service';
import { ECRFInputTextClass } from './ecrf-input-text.class';
import { FormDialogService } from '@core/services/dialog/form-dialog.service';
import { ToastManagerService } from '@core/services/toast-manager.service';
import { Card } from 'primeng/card';
import { Observable, Subscription } from 'rxjs';
import { EnhancedFormControlComponent } from '../../enhanced-form-control.component';
import { DragDropService } from '@core/services/drag-and-drop';
import { FormElementType } from '@core/models/enums/form.enums';
import { SpeedDialModule } from 'primeng/speeddial';
import { ConfirmationService } from 'primeng/api';
import { FormControlsService } from '@core/services/form/form-controls.service';

@Component({
  selector: 'app-text-box',
  templateUrl: './ecrf-input-text-component.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LibInputTextComponent, Card, SpeedDialModule],
})
export class EcrfInputTextComponent
  extends EnhancedFormControlComponent<ECRFInputTextClass>
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

  getInputConfig(): InputTextConfig {
    return this.getControlConfig();
  }

  ngOnDestroy(): void {
    // Cleanup subscriptions
    this.subscription.unsubscribe();
  }

  /**
   * Open configuration dialog for input text
   * @returns Observable of updated input text control
   */
  protected openConfigDialog(): Observable<ECRFInputTextClass> {
    return this.formDialogService.openTextInputDialog(this.control as ECRFInputTextClass);
  }

  protected createDuplicate(): ECRFInputTextClass | null {
    if (!this.control) return null;

    const originalControl: ECRFInputTextClass = this.control;

    // Create a new control using the service
    const newControl = this.formControlsService.createControl(originalControl.type, {
      title: `${originalControl.options?.title || originalControl.title} (Copy)`,
      required: originalControl.options?.required || false,
      disabled: originalControl.options?.disabled || false,
      placeholder: originalControl.placeholder,
      maxLength: originalControl.maxLength,
      minLength: originalControl.minLength,
      helperText: originalControl.options?.helperText,
    }) as ECRFInputTextClass;

    // Set default value
    newControl.value = '';

    return newControl;
  }

  /**
   * Get human-readable control type name
   * @returns Control type name
   */
  protected getControlTypeName(): string {
    return 'Input text field';
  }

  /**
   * Get configuration for the input component
   * @returns InputTextConfig object
   */
  protected getControlConfig(): InputTextConfig {
    if (!this.control) {
      return this.getDefaultConfig();
    }

    // Cast to TextInput to access specific properties
    const textInput = this.control as ECRFInputTextClass;

    // Use control's toInputTextConfig method if available
    if (textInput.toInputTextConfig && typeof textInput.toInputTextConfig === 'function') {
      return textInput.toInputTextConfig();
    }

    // Otherwise, manually build the config from control properties
    return {
      label: textInput.options?.title || 'Text Field',
      required: textInput.options?.required || false,
      disabled: textInput.options?.disabled || false,
      placeholder: textInput.placeholder || 'Enter text here...',
      autofocus: false,
      type: InputTextTypeEnum.TEXT,
      labelStyle: FormLabelStyleEnum.DEFAULT,
      labelPosition: FormLabelPositionEnum.ABOVE,
      maxLength: textInput.maxLength,
      minLength: textInput.minLength,
      helperText: textInput.options?.helperText,
      variant: FormComponentVariantEnum.OUTLINED,
      size: FormComponentSizeEnum.NORMAL,
      // Apply any other properties from options
      ...(textInput.options?.inputConfig || {}),
    };
  }

  /**
   * Get control-specific icon name
   * @returns Icon name string
   */
  protected getIconName(): string {
    return this.iconService?.getPrimeIcon(FormElementType.INPUT_TEXT) || 'text_fields';
  }

  /**
   * Check if the control is valid for editing
   * @returns True if the control is a valid TextInput
   */
  protected isValidControl(): boolean {
    return !!this.control && this.control.type === FormElementType.INPUT_TEXT;
  }

  /**
   * Get default configuration when no control is present
   * @returns Default InputTextConfig
   */
  private getDefaultConfig(): InputTextConfig {
    return {
      label: 'Text Field',
      required: false,
      disabled: false,
      placeholder: 'Enter text here...',
      autofocus: false,
      type: InputTextTypeEnum.TEXT,
      labelStyle: FormLabelStyleEnum.DEFAULT,
      labelPosition: FormLabelPositionEnum.ABOVE,
      variant: FormComponentVariantEnum.OUTLINED,
      size: FormComponentSizeEnum.NORMAL,
    };
  }
}
