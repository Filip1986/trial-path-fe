import { BasicSettingsComponent } from '../../shared/components/tab-sections/basic-settings/basic-settings.component';
import { BehaviorSettingsComponent } from '../../shared/components/tab-sections/behavior-settings/behavior-settings.component';
import { OptionsManagerComponent } from '../../shared/components/options-manager/options-manager.component';
import { ValidationSettingsComponent } from '../../shared/components/tab-sections/validation-settings/validation-settings.component';
import { AppearanceSettingsComponent } from '../../shared/components/tab-sections/appearance-settings/appearance-settings.component';
import { FormElementType } from '../../../core/models/enums/form.enums';
import {
  IDialogFieldConfig,
  IDialogConfiguration,
  IDialogBehaviorOption,
} from '../../../core/models/interfaces/dialog.interfaces';
import { IDialogTab } from '../../../core/models/interfaces/tabs.interfaces';

/**
 * Fluent builder for dialog configurations
 */
export class DialogConfigurationBuilder {
  private config: Partial<IDialogConfiguration> = {};

  static for(elementType: FormElementType): DialogConfigurationBuilder {
    return new DialogConfigurationBuilder().setElementType(elementType);
  }

  setElementType(elementType: FormElementType): this {
    this.config.elementType = elementType;
    this.config.title = this.getDefaultTitle(elementType);
    return this;
  }

  setTitle(title: string): this {
    this.config.title = title;
    return this;
  }

  setDimensions(width: string, height?: string): this {
    this.config.width = width;
    this.config.height = height;
    return this;
  }

  addBasicTab(fields?: IDialogFieldConfig[]): this {
    return this.addTab({
      id: 'basic',
      label: 'Basic Settings',
      component: BasicSettingsComponent,
      order: 0,
      config: { fields: fields || this.getDefaultBasicFields() },
    });
  }

  addBehaviorTab(options?: IDialogBehaviorOption[]): this {
    return this.addTab({
      id: 'behavior',
      label: 'Behavior',
      component: BehaviorSettingsComponent,
      order: 1,
      config: { options: options || this.getDefaultBehaviorOptions() },
    });
  }

  addValidationTab(validationType: 'text' | 'number' | 'date' = 'text'): this {
    return this.addTab({
      id: 'validation',
      label: 'Validation',
      component: ValidationSettingsComponent,
      order: 2,
      config: { type: validationType },
    });
  }

  addOptionsTab(minOptions = 1, showGroupField = false): this {
    return this.addTab({
      id: 'options',
      label: 'Options',
      component: OptionsManagerComponent,
      order: 2,
      config: { minOptions, showGroupField },
    });
  }

  addAppearanceTab(options?: any): this {
    return this.addTab({
      id: 'appearance',
      label: 'Appearance',
      component: AppearanceSettingsComponent,
      order: 3,
      config: options || this.getDefaultAppearanceOptions(),
    });
  }

  // addCustomTab(tab: TabConfig): this {
  //   return this.addTab(tab);
  // }

  enablePresets(enabled = true): this {
    this.config.enablePresets = enabled;
    return this;
  }

  // setPreviewConfig(config: any): this {
  //   this.config.previewConfig = config;
  //   return this;
  // }
  //
  // setValidationRules(rules: Record<string, any>): this {
  //   this.config.validationRules = rules;
  //   return this;
  // }

  setDefaultValues(values: Record<string, any>): this {
    this.config.defaultValues = values;
    return this;
  }

  build(): IDialogConfiguration {
    this.validateConfiguration();
    this.sortTabs();
    return this.config as IDialogConfiguration;
  }

  addTab(tab: IDialogTab): this {
    if (!this.config.tabs) {
      this.config.tabs = [];
    }
    this.config.tabs.push(tab);
    return this;
  }

  private validateConfiguration(): void {
    if (!this.config.elementType) {
      throw new Error('Element type is required');
    }
    if (!this.config.tabs || this.config.tabs.length === 0) {
      throw new Error('At least one tab is required');
    }
  }

  private sortTabs(): void {
    if (this.config.tabs) {
      this.config.tabs.sort((a, b) => (a.order || 0) - (b.order || 0));
    }
  }

  private getDefaultTitle(elementType: FormElementType): string {
    const titleMap: Record<FormElementType, string> = {
      [FormElementType.INPUT_TEXT]: 'Configure Input Text',
      [FormElementType.TEXT_AREA]: 'Configure Text Area',
      [FormElementType.CHECKBOX]: 'Configure Checkbox',
      [FormElementType.RADIO]: 'Configure Radio Button',
      [FormElementType.DATE_PICKER]: 'Configure Date Picker',
      [FormElementType.TIME_PICKER]: 'Configure Time Picker',
      [FormElementType.INPUT_NUMBER]: 'Configure Number Input',
      [FormElementType.SELECT]: 'Configure Select',
      [FormElementType.MULTISELECT]: 'Configure Multiselect',
      [FormElementType.LIST_BOX]: 'Configure ListBox',
      [FormElementType.SELECT_BUTTON]: 'Configure Select Button',
      [FormElementType.COLUMNS]: 'Configure Columns',
      // Add other mappings...
    };
    return titleMap[elementType] || `Configure ${elementType}`;
  }

  private getDefaultBasicFields(): IDialogFieldConfig[] {
    // Return default basic fields based on an element type
    return [];
  }

  private getDefaultBehaviorOptions(): IDialogBehaviorOption[] {
    // Return default behavior options based on an element type
    return [
      { name: 'required', label: 'Required field', controlName: 'required' },
      { name: 'disabled', label: 'Disabled', controlName: 'disabled' },
    ];
  }

  private getDefaultAppearanceOptions(): any {
    return {
      labelPositionOptions: [],
      labelStyleOptions: [],
      sizeOptions: [],
      variantOptions: [],
    };
  }
}
