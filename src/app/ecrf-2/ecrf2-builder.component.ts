import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  Type,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  FormLabelPositionEnum,
  FormLabelPositionType,
  FormLabelStyleEnum,
  FormLabelStyleType,
  LibTextareaComponent,
} from '@artificial-sense/ui-lib';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Card } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { ToastManagerService } from '@core/services/toast-manager.service';
import { ComponentTypeUtils } from './core/models/consts/component-type-utils.const';
import { ComponentType } from './core/models/enums/component-types.enum';
import { IForm } from './core/models/interfaces/form.interfaces';
import { ComponentRegistryService } from './core/services/component-registry.service';
import { DialogService } from './core/services/dialog/dialog.service';
import { FormDialogService } from './core/services/dialog/form-dialog.service';
import {
  ControlDropHandlerService,
  DragDropService,
  DragFeedbackService,
  DragValidationService,
  DropZoneRegistryService,
} from './core/services/drag-and-drop';
import { FormConfigService } from './core/services/form/form-config.service';
import { FormControlsService } from './core/services/form/form-controls.service';
import { HistoryService } from './core/services/form/form-history.service';
import { PreviewService } from './core/services/form/form-preview.service';
import { FormStateService } from './core/services/form/form-state.service';
import { FormService } from './core/services/form/form.service';
import { CheckboxDialogComponent } from './dialogs/element-dialogs/checkbox-dialog/checkbox-dialog.component';
import { DatePickerDialogComponent } from './dialogs/element-dialogs/date-picker-dialog/date-picker-dialog.component';
import { InputTextDialogComponent } from './dialogs/element-dialogs/input-text-dialog/input-text-dialog.component';
import { MultiselectDialogComponent } from './dialogs/element-dialogs/multiselect-dialog/multiselect-dialog.component';
import { RadioButtonDialogComponent } from './dialogs/element-dialogs/radio-button-dialog/radio-button-dialog.component';
import { SelectButtonDialogComponent } from './dialogs/element-dialogs/select-button-dialog/select-button-dialog.component';
import { SelectDialogComponent } from './dialogs/element-dialogs/select-dialog/select-dialog.component';
import { TextareaDialogComponent } from './dialogs/element-dialogs/textarea-dialog/textarea-dialog.component';
import { TimePickerDialogComponent } from './dialogs/element-dialogs/time-picker-dialog/time-picker-dialog.component';
import { FormColumnsComponent } from './form-columns/form-columns.component';
import { FormContainerComponent } from './form-container/form-container.component';
import { ECRFCheckboxComponent } from './form-controls/form-elements/checkbox/ecrf-checkbox.component';
import { ECRFDatePickerComponent } from './form-controls/form-elements/date-picker';
import { ECRFInputNumberComponent } from './form-controls/form-elements/input-number/ecrf-input-number.component';
import { EcrfInputTextComponent } from './form-controls/form-elements/input-text/ecrf-input-text-component.component';
import { EcrfListboxComponent } from './form-controls/form-elements/listbox/ecrf-listbox.component';
import { EcrfMultiSelectComponent } from './form-controls/form-elements/multiselect/ecrf-multi-select.component';
import { EcrfRadioButtonComponent } from './form-controls/form-elements/radio-button/ecrf-radio-button.component';
import { EcrfSelectButtonComponent } from './form-controls/form-elements/select-button/ecrf-select-button.component';
import { EcrfSelectComponent } from './form-controls/form-elements/select/ecrf-select.component';
import { EcrfTextAreaComponent } from './form-controls/form-elements/textarea/ecrf-text-area.component';
import { EcrfTimePickerComponent } from './form-controls/form-elements/time-picker';
import { PreviewCheckboxComponent } from './form-preview/form-elements/preview-checkbox/preview-checkbox.component';
import { PreviewDatePickerComponent } from './form-preview/form-elements/preview-date-picker/preview-date-picker.component';
import { PreviewInputNumberComponent } from './form-preview/form-elements/preview-input-number/preview-input-number.component';
import { PreviewInputTextComponent } from './form-preview/form-elements/preview-input-text/preview-input-text.component';
import { PreviewMultiselectComponent } from './form-preview/form-elements/preview-multiselect/preview-multiselect.component';
import { PreviewRadioButtonComponent } from './form-preview/form-elements/preview-radio-button/preview-radio-button.component';
import { PreviewSelectButtonComponent } from './form-preview/form-elements/preview-select-button/preview-select-button.component';
import { PreviewSelectComponent } from './form-preview/form-elements/preview-select/preview-select.component';
import { PreviewTextareaComponent } from './form-preview/form-elements/preview-textarea/preview-textarea.component';
import { PreviewTimePickerComponent } from './form-preview/form-elements/preview-time-picker/preview-time-picker.component';
import { PreviewColumnsComponent } from './form-preview/form-layout/preview-columns/preview-columns.component';
import { FormPreviewComponent } from './form-preview/form-preview.component';
import { FormComponent } from './form/form.component';
import { NewControlsComponent } from './new-controls/new-controls.component';

export const COMPONENT_TYPE_TO_CLASS_MAP: Partial<Record<ComponentType, Type<any>>> = {
  // Container Components
  [ComponentType.FORM_CONTAINER]: FormContainerComponent,
  [ComponentType.COLUMNS]: FormColumnsComponent,

  // Form Control Components
  [ComponentType.TEXT_INPUT]: EcrfInputTextComponent,
  [ComponentType.TEXT_AREA]: EcrfTextAreaComponent,
  [ComponentType.CHECKBOX]: ECRFCheckboxComponent,
  [ComponentType.RADIO]: EcrfRadioButtonComponent,
  [ComponentType.DATE_PICKER]: ECRFDatePickerComponent,
  [ComponentType.TIME_PICKER]: EcrfTimePickerComponent,
  [ComponentType.NUMBER_INPUT]: ECRFInputNumberComponent,
  [ComponentType.DROPDOWN]: EcrfSelectComponent,
  [ComponentType.MULTISELECT]: EcrfMultiSelectComponent,
  [ComponentType.LIST_BOX]: EcrfListboxComponent,
  [ComponentType.SELECT_BUTTON]: EcrfSelectButtonComponent,

  // Dialog Components
  [ComponentType.TEXT_INPUT_DIALOG]: InputTextDialogComponent,
  [ComponentType.TEXTAREA_DIALOG]: TextareaDialogComponent,
  [ComponentType.CHECKBOX_DIALOG]: CheckboxDialogComponent,
  [ComponentType.RADIO_DIALOG]: RadioButtonDialogComponent,
  [ComponentType.DATE_PICKER_DIALOG]: DatePickerDialogComponent,
  [ComponentType.MULTISELECT_DIALOG]: MultiselectDialogComponent,
  [ComponentType.TIME_PICKER_DIALOG]: TimePickerDialogComponent,
  [ComponentType.SELECT_DIALOG]: SelectDialogComponent,
  [ComponentType.SELECT_BUTTON_DIALOG]: SelectButtonDialogComponent,

  // Preview Components
  [ComponentType.PREVIEW_TEXT_INPUT]: PreviewInputTextComponent,
  [ComponentType.PREVIEW_TEXTAREA]: PreviewTextareaComponent,
  [ComponentType.PREVIEW_CHECKBOX]: PreviewCheckboxComponent,
  [ComponentType.PREVIEW_RADIO]: PreviewRadioButtonComponent,
  [ComponentType.PREVIEW_DATE_PICKER]: PreviewDatePickerComponent,
  [ComponentType.PREVIEW_TIME_PICKER]: PreviewTimePickerComponent,
  [ComponentType.PREVIEW_INPUT_NUMBER]: PreviewInputNumberComponent,
  [ComponentType.PREVIEW_MULTISELECT]: PreviewMultiselectComponent,
  [ComponentType.PREVIEW_SELECT]: PreviewSelectComponent,
  [ComponentType.PREVIEW_SELECT_BUTTON]: PreviewSelectButtonComponent,
  [ComponentType.PREVIEW_COLUMNS]: PreviewColumnsComponent,
  [ComponentType.FORM_PREVIEW]: FormPreviewComponent,
};

/**
 * The Main component for the ECRF2 form builder feature
 * This component serves as the entry point for the ECRF2 feature and
 * handles the main form properties and layout
 */
@Component({
  selector: 'app-ecrf2-root',
  templateUrl: './ecrf2-builder.component.html',
  styleUrls: ['./ecrf2-builder.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    FormComponent,
    NewControlsComponent,
    Card,
    ButtonModule,
    LibTextareaComponent,
    Dialog,
    ConfirmDialogModule,
  ],
  providers: [
    FormConfigService,
    DragDropService,
    DropZoneRegistryService,
    DragValidationService,
    DragFeedbackService,
    ControlDropHandlerService,
    FormControlsService,
    DialogService,
    FormDialogService,
    FormService,
    ComponentRegistryService,
    ToastManagerService,
    PreviewService,
    HistoryService,
    ConfirmationService,
  ],
})
export class Ecrf2BuilderComponent implements OnInit {
  formValid = true;
  validationErrors: string[] = [];
  currentForm: IForm | null = null;
  savedForms: { id: string; title: string; updatedAt: Date }[] = [];
  showSavedFormsDialog = false;
  destroyRef: DestroyRef = inject(DestroyRef);
  protected readonly TextareaLabelStyle: FormLabelStyleType = FormLabelStyleEnum.DEFAULT;
  protected readonly TextareaLabelPosition: FormLabelPositionType = FormLabelPositionEnum.ABOVE;
  protected readonly FormComponentVariantEnum: typeof FormComponentVariantEnum =
    FormComponentVariantEnum;
  protected readonly FormComponentSizeEnum: typeof FormComponentSizeEnum = FormComponentSizeEnum;
  protected readonly FormLabelStyleEnum: typeof FormLabelStyleEnum = FormLabelStyleEnum;
  protected readonly FormLabelPositionEnum: typeof FormLabelPositionEnum = FormLabelPositionEnum;

  constructor(
    private componentRegistry: ComponentRegistryService,
    private formService: FormService,
    private previewService: PreviewService,
    private formStateService: FormStateService,
    private toastManager: ToastManagerService,
  ) {}

  ngOnInit(): void {
    // Register all components at the application level
    this.registerComponents();

    this.formStateService.form$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((form: IForm): void => {
        console.log('Form updated:', form);
        this.currentForm = form;

        const validation = this.formStateService.validateForm();
        this.formValid = validation.valid;
        this.validationErrors = validation.errors;
      });
  }

  /**
   * Update form metadata with type safety
   */
  updateFormField(field: keyof Omit<IForm, 'container' | 'id'>, value: any): void {
    const updates: Partial<Omit<IForm, 'container'>> = {};
    updates[field] = value;

    this.formStateService.updateFormMetadata(updates);
    this.toastManager.success(`Form ${field} updated successfully`);
  }

  /**
   * Save the current form
   */
  saveForm(): void {
    try {
      const key: string = this.formStateService.saveForm();
      this.toastManager.success('Form saved successfully');
      // Optionally navigate to a different route or update the UI
    } catch (error) {
      console.error('Error saving form:', error);
      this.toastManager.error('Error saving form');
    }
  }

  /**
   * Load the list of saved forms
   */
  loadSavedFormsList(): void {
    this.savedForms = this.formStateService.getSavedForms();
    this.showSavedFormsDialog = true;
  }

  /**
   * Load a saved form
   */
  loadForm(key: string): void {
    if (this.formStateService.loadForm(key)) {
      this.toastManager.success('Form loaded successfully');
    } else {
      this.toastManager.error('Error loading form');
    }
  }

  createNewForm(): void {
    if (confirm('Are you sure you want to create a new form? Any unsaved changes will be lost.')) {
      this.formStateService.resetToNewForm();
      this.toastManager.success('New form created');
    }
  }

  /**
   * Preview the current form
   */
  previewForm(): void {
    // Get the current form from the form service
    this.formService.form$
      .subscribe((form: IForm): void => {
        this.previewService.previewForm(form);
      })
      .unsubscribe(); // Only need the current value
  }

  private getComponentClassForType(type: ComponentType): Type<any> | undefined {
    return COMPONENT_TYPE_TO_CLASS_MAP[type];
  }

  /**
   * Register all form components with the component registry
   * This is done once at the application level
   */
  private registerComponents(): void {
    // Register container components
    this.componentRegistry.registerComponent(ComponentType.FORM_CONTAINER, FormContainerComponent);
    this.componentRegistry.registerComponent(ComponentType.COLUMNS, FormColumnsComponent);

    // Register all form control components
    const formControls: ComponentType[] = ComponentTypeUtils.getFormControls();
    formControls.forEach((type: ComponentType): void => {
      const componentClass = this.getComponentClassForType(type);
      if (componentClass) {
        this.componentRegistry.registerComponent(type, componentClass);
      }
    });

    // Register all dialog components
    const dialogs: ComponentType[] = ComponentTypeUtils.getDialogs();
    dialogs.forEach((type: ComponentType): void => {
      const componentClass = this.getComponentClassForType(type);
      if (componentClass) {
        this.componentRegistry.registerComponent(type, componentClass);
      }
    });

    // Register all preview components
    const previews: ComponentType[] = ComponentTypeUtils.getPreviews();
    previews.forEach((type: ComponentType): void => {
      const componentClass = this.getComponentClassForType(type);
      if (componentClass) {
        this.componentRegistry.registerComponent(type, componentClass);
      }
    });
  }
}
