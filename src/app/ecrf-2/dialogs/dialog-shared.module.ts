import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfigSectionComponent } from './shared/components/config-section/config-section.component';
import { AppearanceSettingsComponent } from './shared/components/tab-sections/appearance-settings/appearance-settings.component';
import { BehaviorSettingsComponent } from './shared/components/tab-sections/behavior-settings/behavior-settings.component';
import { ValidationSettingsComponent } from './shared/components/tab-sections/validation-settings/validation-settings.component';
import { BasicSettingsComponent } from './shared/components/tab-sections/basic-settings/basic-settings.component';
import { FormFieldWrapperDirective } from './shared/directives/form-field-wrapper/form-field-wrapper.component';
import { ValidationSummaryComponent } from './shared/components/validation-summary/validation-summary.component';
import { TabErrorIndicatorComponent } from './shared/components/tab-error-indicator/tab-error-indicator.component';

const COMPONENTS = [
  ConfigSectionComponent,
  AppearanceSettingsComponent,
  BehaviorSettingsComponent,
  ValidationSettingsComponent,
  BasicSettingsComponent,
  FormFieldWrapperDirective,
  ValidationSummaryComponent,
  TabErrorIndicatorComponent,
];

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, ...COMPONENTS],
  exports: [...COMPONENTS],
})
export class DialogSharedModule {}
