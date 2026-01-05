import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DEFAULT_SCROLL_HEIGHT,
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  FormLabelPositionEnum,
  FormLabelStyleEnum,
  LibSelectComponent as LibSelectComponent,
  SelectConfig,
} from '@artificial-sense/ui-lib';
import { IconMappingService } from '../../../core/services/icon-mapping.service';
import { ECRFSelectClass } from './select.class';
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
  selector: 'app-select',
  templateUrl: './ecrf-select.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LibSelectComponent, Card, SpeedDial],
})
export class EcrfSelectComponent
  extends EnhancedFormControlComponent<ECRFSelectClass>
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
   * Get to select configuration for template
   * @returns SelectConfig object
   */
  getSelectConfig(): SelectConfig {
    return this.getControlConfig();
  }

  /**
   * Open configuration dialog for select
   * @returns Observable of updated select control
   */
  protected openConfigDialog(): Observable<ECRFSelectClass> {
    return this.formDialogService.openSelectDialog(this.control as ECRFSelectClass);
  }

  /**
   * Create a duplicate of the current select control
   * @returns A new ECRFSelectClass instance or null if duplication fails
   */
  protected createDuplicate(): ECRFSelectClass | null {
    if (!this.control) return null;

    const originalControl: ECRFSelectClass = this.control;

    // Create a new control using the service
    const newControl = this.formControlsService.createControl(originalControl.type, {
      title: `${originalControl.options?.title || originalControl.title} (Copy)`,
      name: `${originalControl.options?.name || 'select'}_copy`,
      required: originalControl.options?.required || false,
      disabled: originalControl.options?.disabled || false,
      helperText: originalControl.options?.helperText,
      // Copy select-specific options
      filter: originalControl.filter,
      showClear: originalControl.showClear,
      selectOptions: originalControl.selectOptions ? [...originalControl.selectOptions] : [],
      optionLabel: originalControl.optionLabel,
      optionValue: originalControl.optionValue,
      group: originalControl.group,
      optionGroupLabel: originalControl.optionGroupLabel,
      optionGroupChildren: originalControl.optionGroupChildren,
      size: originalControl.size,
      variant: originalControl.variant,
    }) as ECRFSelectClass;

    // Copy additional properties that might not be in the factory options
    newControl.placeholder = originalControl.placeholder;
    newControl.labelStyle = originalControl.labelStyle;
    newControl.labelPosition = originalControl.labelPosition;

    // Reset value to avoid conflicts
    newControl.value = null;

    return newControl;
  }

  /**
   * Get human-readable control type name
   * @returns Control type name
   */
  protected getControlTypeName(): string {
    return 'Select field';
  }

  /**
   * Get configuration for the select component
   * @returns SelectConfig object
   */
  protected getControlConfig(): SelectConfig {
    if (!this.control) {
      return this.getDefaultConfig();
    }

    // Cast to Select to access specific properties
    const select = this.control as ECRFSelectClass;

    // Use control toSelectConfig method if available
    if (select.toSelectConfig && typeof select.toSelectConfig === 'function') {
      return select.toSelectConfig();
    }

    // Otherwise, manually build the config from control properties
    const config: SelectConfig = {
      label: select.options?.title || 'Select',
      required: select.options?.required || false,
      disabled: select.options?.disabled || false,
      placeholder: select.placeholder || 'Select an option',
      options: select.selectOptions || [],
      optionLabel: select.optionLabel || 'label',
      optionValue: select.optionValue || 'value',
      filter: select.filter,
      showClear: select.showClear,
      group: select.group,
      optionGroupLabel: select.optionGroupLabel,
      optionGroupChildren: select.optionGroupChildren,
      labelStyle: select.labelStyle || FormLabelStyleEnum.DEFAULT,
      labelPosition: select.labelPosition || FormLabelPositionEnum.ABOVE,
      size: select.size || FormComponentSizeEnum.NORMAL,
      variant: select.variant || FormComponentVariantEnum.OUTLINED,
      helperText: select.options?.helperText,
      scrollHeight: DEFAULT_SCROLL_HEIGHT,
      // Apply any other properties from options
      ...(select.options?.selectConfig || {}),
    };

    // Debug logging to help identify the issue
    console.log('Select Config:', config);
    console.log('Select Options:', config.options);

    return config;
  }

  /**
   * Get control-specific icon name
   * @returns Icon name string
   */
  protected getIconName(): string {
    return this.iconService?.getPrimeIcon(FormElementType.SELECT) || 'pi pi-chevron-down';
  }

  /**
   * Check if the control is valid for editing
   * @returns True if the control is valid Select
   */
  protected isValidControl(): boolean {
    return !!this.control && this.control.type === FormElementType.SELECT;
  }

  /**
   * Get default configuration when no control is present
   * @returns Default SelectConfig
   */
  private getDefaultConfig(): SelectConfig {
    return {
      label: 'Select',
      required: false,
      disabled: false,
      placeholder: 'Select an option',
      options: [],
      labelStyle: FormLabelStyleEnum.DEFAULT,
      labelPosition: FormLabelPositionEnum.ABOVE,
      size: FormComponentSizeEnum.NORMAL,
      variant: FormComponentVariantEnum.OUTLINED,
      scrollHeight: DEFAULT_SCROLL_HEIGHT,
    };
  }
}
