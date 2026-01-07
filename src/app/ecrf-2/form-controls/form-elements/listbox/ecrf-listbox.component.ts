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
  LibListboxComponent as LibListboxComponent,
  ListBoxConfig,
} from '@artificial-sense/ui-lib';
import { IconMappingService } from '@core/services/icon-mapping.service';
import { ECRFListBoxClass } from './listbox.class';
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
  selector: 'app-listbox',
  templateUrl: './ecrf-listbox.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LibListboxComponent, Card, SpeedDial],
})
export class EcrfListboxComponent
  extends EnhancedFormControlComponent<ECRFListBoxClass>
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
   * Get listbox configuration for template
   * @returns ListboxConfig object
   */
  getListboxConfig(): ListBoxConfig {
    return this.getControlConfig();
  }

  /**
   * Open configuration dialog for listbox
   * @returns Observable of updated listbox control
   */
  protected openConfigDialog(): Observable<ECRFListBoxClass> {
    return this.formDialogService.openListBoxDialog(this.control as ECRFListBoxClass);
  }

  /**
   * Get human-readable control type name
   * @returns Control type name
   */
  protected getControlTypeName(): string {
    return 'Listbox field';
  }

  /**
   * Create a duplicate of the current listbox control
   * @returns A new ECRFListBoxClass instance or null if duplication fails
   */
  protected createDuplicate(): ECRFListBoxClass | null {
    if (!this.control) return null;

    const originalControl: ECRFListBoxClass = this.control;

    // Create a new control using the FormControlsService
    const newControl = this.formControlsService.createControl(originalControl.type, {
      name: `${originalControl.options?.name || 'listbox'}_copy`,
      title: `${originalControl.options?.title || originalControl.title} (Copy)`,
      required: originalControl.options?.required || false,
      disabled: originalControl.options?.disabled || false,
      readonly: originalControl.options?.readonly || false,
      helperText: originalControl.options?.helperText,
      // Listbox-specific options
      multiple: originalControl.multiple,
      checkbox: originalControl.checkbox,
      filter: originalControl.filter,
      listOptions: originalControl.listOptions ? [...originalControl.listOptions] : [], // Deep copy the options array
      optionLabel: originalControl.optionLabel,
      optionValue: originalControl.optionValue,
    }) as ECRFListBoxClass;

    // Reset the value for the duplicated control
    if (originalControl.multiple) {
      newControl.value = []; // Empty array for multiple selection
    } else {
      newControl.value = null; // Null for single selection
    }

    // Copy additional UI configuration properties
    newControl.labelStyle = originalControl.labelStyle;
    newControl.labelPosition = originalControl.labelPosition;
    newControl.placeholder = originalControl.placeholder;

    return newControl;
  }

  /**
   * Get configuration for the listbox component
   * @returns ListboxConfig object
   */
  protected getControlConfig(): ListBoxConfig {
    if (!this.control) {
      return this.getDefaultConfig();
    }

    // Cast to Listbox to access specific properties
    const listbox = this.control as ECRFListBoxClass;

    // Use control's toListboxConfig method if available
    if (listbox.toListBoxConfig && typeof listbox.toListBoxConfig === 'function') {
      return listbox.toListBoxConfig();
    }

    // Otherwise, manually build the config from control properties
    return {
      label: listbox.options?.title || 'Listbox',
      required: listbox.options?.required || false,
      disabled: listbox.options?.disabled || false,
      placeholder: listbox.placeholder || 'Select option',
      labelStyle: listbox.labelStyle || FormLabelStyleEnum.DEFAULT,
      labelPosition: listbox.labelPosition || FormLabelPositionEnum.ABOVE,
      multiple: listbox.multiple || false,
      checkbox: listbox.checkbox || false,
      filter: listbox.filter || false,
      options: listbox.listOptions || [],
      optionLabel: listbox.optionLabel,
      optionValue: listbox.optionValue,
      helperText: listbox.options?.helperText,
      variant: FormComponentVariantEnum.OUTLINED,
      size: FormComponentSizeEnum.NORMAL,
      // Apply any other properties from options
      ...(listbox.options?.listboxConfig || {}),
    };
  }

  /**
   * Get control-specific icon name
   * @returns Icon name string
   */
  protected getIconName(): string {
    return this.iconService?.getPrimeIcon(FormElementType.LIST_BOX) || 'pi pi-list';
  }

  /**
   * Check if the control is valid for editing
   * @returns True if the control is a valid Listbox
   */
  protected isValidControl(): boolean {
    return !!this.control && this.control.type === FormElementType.LIST_BOX;
  }

  /**
   * Get default configuration when no control is present
   * @returns Default ListboxConfig
   */
  private getDefaultConfig(): ListBoxConfig {
    return {
      label: 'Listbox',
      required: false,
      disabled: false,
      placeholder: 'Select option',
      labelStyle: FormLabelStyleEnum.DEFAULT,
      labelPosition: FormLabelPositionEnum.ABOVE,
      multiple: false,
      checkbox: false,
      filter: false,
      options: [],
      variant: FormComponentVariantEnum.OUTLINED,
      size: FormComponentSizeEnum.NORMAL,
    };
  }
}
