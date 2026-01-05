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
  LibMultiSelectComponent as LibMultiSelectComponent,
  MultiSelectConfig,
  MultiSelectDisplayModeEnum,
} from '@artificial-sense/ui-lib';
import { IconMappingService } from '../../../core/services/icon-mapping.service';
import { ECRFMultiSelectClass } from './multiselect.class';
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
  selector: 'app-multiselect',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LibMultiSelectComponent, Card, SpeedDial],
  templateUrl: './ecrf-multi-select.component.html',
  styleUrls: ['./ecrf-multi-select.component.scss'],
})
export class EcrfMultiSelectComponent
  extends EnhancedFormControlComponent<ECRFMultiSelectClass>
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
   * Get multiselect configuration for template
   * @returns MultiSelectConfig object
   */
  getMultiSelectConfig(): MultiSelectConfig {
    return this.getControlConfig();
  }

  /**
   * Open configuration dialog for multiselect
   * @returns Observable of updated multiselect control
   */
  protected openConfigDialog(): Observable<ECRFMultiSelectClass> {
    return this.formDialogService.openMultiselectDialog(this.control as ECRFMultiSelectClass);
  }

  /**
   * Get human-readable control type name
   * @returns Control type name
   */
  protected getControlTypeName(): string {
    return 'Multi-select field';
  }

  /**
   * Create a duplicate of the current multi-select control
   * @returns A new ECRFMultiSelectClass instance or null if duplication fails
   */
  protected createDuplicate(): ECRFMultiSelectClass | null {
    if (!this.control) return null;

    const originalControl: ECRFMultiSelectClass = this.control;

    // Create a new control using the service
    const newControl = this.formControlsService.createControl(originalControl.type, {
      title: `${originalControl.options?.title || originalControl.title} (Copy)`,
      required: originalControl.options?.required || false,
      disabled: originalControl.options?.disabled || false,
      multiple: originalControl.multiple,
      filter: originalControl.filter,
      showToggleAll: originalControl.showToggleAll,
      checkbox: originalControl.checkbox,
      group: originalControl.group,
      optionLabel: originalControl.optionLabel,
      optionValue: originalControl.optionValue,
      optionGroupLabel: originalControl.optionGroupLabel,
      optionGroupChildren: originalControl.optionGroupChildren,
      maxSelectedLabels: originalControl.maxSelectedLabels,
      display: originalControl.display,
      size: originalControl.size,
      variant: originalControl.variant,
      selectOptions: originalControl.selectOptions ? [...originalControl.selectOptions] : [],
      helperText: originalControl.options?.helperText,
    }) as ECRFMultiSelectClass;

    // Set default value - empty array for multi-select
    newControl.value = [];

    return newControl;
  }

  /**
   * Get configuration for the multiselect component
   * @returns MultiSelectConfig object
   */
  protected getControlConfig(): MultiSelectConfig {
    if (!this.control) {
      return this.getDefaultConfig();
    }

    // Cast to MultiSelect to access specific properties
    const multiSelect = this.control as ECRFMultiSelectClass;

    // Use control's toMultiSelectConfig method if available
    if (multiSelect.toMultiSelectConfig && typeof multiSelect.toMultiSelectConfig === 'function') {
      return multiSelect.toMultiSelectConfig();
    }

    // Otherwise, manually build the config from control properties
    return {
      label: multiSelect.options?.title || 'MultiSelect',
      required: multiSelect.options?.required || false,
      disabled: multiSelect.options?.disabled || false,
      placeholder: multiSelect.placeholder || 'Select options',
      labelStyle: multiSelect.labelStyle || FormLabelStyleEnum.DEFAULT,
      labelPosition: multiSelect.labelPosition || FormLabelPositionEnum.ABOVE,
      display: multiSelect.display || MultiSelectDisplayModeEnum.COMMA,
      filter: multiSelect.filter || false,
      options: multiSelect.selectOptions || [],
      optionLabel: multiSelect.optionLabel,
      optionValue: multiSelect.optionValue,
      showToggleAll: multiSelect.showToggleAll ?? true,
      maxSelectedLabels: multiSelect.maxSelectedLabels,
      group: multiSelect.group || false,
      optionGroupLabel: multiSelect.optionGroupLabel,
      optionGroupChildren: multiSelect.optionGroupChildren,
      helperText: multiSelect.options?.helperText,
      variant: multiSelect.variant,
      size: FormComponentSizeEnum.NORMAL,
    };
  }

  /**
   * Get control-specific icon name
   * @returns Icon name string
   */
  protected getIconName(): string {
    return this.iconService?.getPrimeIcon(FormElementType.MULTISELECT) || 'pi pi-list';
  }

  /**
   * Check if the control is valid for editing
   * @returns True if the control is a valid MultiSelect
   */
  protected isValidControl(): boolean {
    return !!this.control && this.control.type === FormElementType.MULTISELECT;
  }

  /**
   * Get default configuration when no control is present
   * @returns Default MultiSelectConfig
   */
  private getDefaultConfig(): MultiSelectConfig {
    return {
      label: 'MultiSelect',
      required: false,
      disabled: false,
      placeholder: 'Select options',
      labelStyle: FormLabelStyleEnum.DEFAULT,
      labelPosition: FormLabelPositionEnum.ABOVE,
      display: MultiSelectDisplayModeEnum.COMMA,
      filter: false,
      options: [],
      showToggleAll: true,
      group: false,
      variant: FormComponentVariantEnum.OUTLINED,
      size: FormComponentSizeEnum.NORMAL,
    };
  }
}
