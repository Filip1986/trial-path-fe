import { Subject } from 'rxjs';
import { Type } from '@angular/core';
import { IFormControl } from './form.interfaces';
import { FormElementType } from '../enums/form.enums';
import { IDialogTab } from './tabs.interfaces';
import { InputTextConfig } from '@artificial-sense/ui-lib';

/**
 * Base configuration for dialogs
 */
export interface IDialogConfig<T = any> {
  data?: T;
  width?: string;
  height?: string;
  dismissable?: boolean;
  closable?: boolean;
  showFooter?: boolean;
}

/**
 * Base interface for dialog components
 */
export interface IDialogComponent<TConfig = any, TResult = any> {
  visible: boolean;
  visibleChange: Subject<boolean>;
  save?: Subject<TResult>;
  cancel?: Subject<void>;
  config?: TConfig;
}

/**
 * Configuration for column dialog
 */
export interface IColumnDialogConfig extends IDialogConfig {
  minColumns?: number;
  maxColumns?: number;
  defaultColumns?: number;
}

export interface IDialogRegistration<T extends IFormControl> {
  controlType: string;
  dialogComponent: Type<any>;
  defaultConfig?: IDialogConfig;
}

export interface IDialogConfiguration<T = any> {
  title: string;
  showPreview: boolean;
  previewDebounceTime: number;
  height: string;
  width: string;
  elementType: FormElementType;
  enablePresets: boolean;
  tabs: IDialogTab[];
  defaultValues: Partial<T>;
}

export interface IDialogFieldConfig {
  name: string;
  config: InputTextConfig;
  colClasses?: string;
}

export interface IDialogBehaviorOption {
  name: string;
  label: string;
  controlName: string;
  disabled?: boolean;
}
