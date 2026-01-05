import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import {
  FormComponentSizeEnum,
  FormComponentVariantEnum,
  FormLabelPositionEnum,
  FormLabelStyleEnum,
  LibInputTextComponent,
  InputTextConfig,
  InputTextIconPositionEnum,
  InputTextTypeEnum,
} from '@artificial-sense/ui-lib';

@Component({
  selector: 'app-input-text-example',
  standalone: true,
  imports: [
    CommonModule,
    LibInputTextComponent,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    DividerModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './input-text-example.component.html',
  styleUrls: ['./input-text-example.component.scss'],
})
export class InputTextExampleComponent implements OnInit {
  // Form group for reactive forms example
  reactiveForm: FormGroup;
  public LabelPosition = FormLabelPositionEnum;
  public InputTextType = InputTextTypeEnum;

  // Form model for template-driven forms example
  templateModel = {
    name: '',
    email: '',
    search: '',
  };

  // Input text configuration examples
  basicConfig: InputTextConfig = {
    id: 'basic-input',
    label: 'Basic Input',
    placeholder: 'Enter text here',
    helperText: 'This is a basic input with default styling',
    required: false,
    autofocus: false,
    disabled: false,
    variant: FormComponentVariantEnum.OUTLINED,
    labelPosition: FormLabelPositionEnum.ABOVE,
    labelStyle: FormLabelStyleEnum.DEFAULT,
    size: FormComponentSizeEnum.NORMAL,
  };

  // Label position examples
  aboveLabelConfig: InputTextConfig = {
    id: 'above-label-input',
    label: 'Above Label (Default)',
    placeholder: 'Label positioned above',
    labelPosition: FormLabelPositionEnum.ABOVE,
    helperText: 'This input has the label positioned above (default)',
    required: false,
    autofocus: false,
    disabled: false,
    variant: FormComponentVariantEnum.OUTLINED,
    labelStyle: FormLabelStyleEnum.DEFAULT,
    size: FormComponentSizeEnum.NORMAL,
  };

  inlineLabelConfig: InputTextConfig = {
    id: 'inline-label-input',
    label: 'Inline Label:',
    placeholder: 'Label positioned inline',
    labelPosition: FormLabelPositionEnum.INLINE,
    helperText: 'This input has the label positioned inline (on the same line)',
    required: false,
    autofocus: false,
    disabled: false,
    variant: FormComponentVariantEnum.OUTLINED,
    labelStyle: FormLabelStyleEnum.DEFAULT,
    size: FormComponentSizeEnum.NORMAL,
  };

  inlineLabelWithIconConfig: InputTextConfig = {
    id: 'inline-label-icon-input',
    label: 'Username:',
    placeholder: 'Enter your username',
    labelPosition: FormLabelPositionEnum.INLINE,
    icon: 'pi pi-user',
    helperText: 'Inline label with an icon',
    required: true,
    autofocus: false,
    disabled: false,
    variant: FormComponentVariantEnum.OUTLINED,
    labelStyle: FormLabelStyleEnum.DEFAULT,
    size: FormComponentSizeEnum.NORMAL,
  };

  requiredInlineLabelConfig: InputTextConfig = {
    id: 'required-inline-label',
    label: 'Required Field:',
    placeholder: 'This field is required',
    labelPosition: FormLabelPositionEnum.INLINE,
    required: true,
    helperText: 'Inline label with required indicator',
    autofocus: false,
    disabled: false,
    variant: FormComponentVariantEnum.OUTLINED,
    labelStyle: FormLabelStyleEnum.DEFAULT,
    size: FormComponentSizeEnum.NORMAL,
  };

  emailConfig: InputTextConfig = {
    id: 'email-input',
    label: 'Email Address',
    placeholder: 'Enter your email',
    type: InputTextTypeEnum.EMAIL,
    required: true,
    icon: 'pi pi-envelope',
    helperText: "We'll never share your email with anyone else",
    autofocus: false,
    disabled: false,
    variant: FormComponentVariantEnum.OUTLINED,
    labelPosition: FormLabelPositionEnum.ABOVE,
    labelStyle: FormLabelStyleEnum.DEFAULT,
    size: FormComponentSizeEnum.NORMAL,
  };

  passwordConfig: InputTextConfig = {
    id: 'password-input',
    label: 'Password',
    placeholder: 'Enter your password',
    type: InputTextTypeEnum.PASSWORD,
    required: true,
    icon: 'pi pi-lock',
    minLength: 8,
    helperText: 'Password must be at least 8 characters',
    autofocus: false,
    disabled: false,
    variant: FormComponentVariantEnum.OUTLINED,
    labelPosition: FormLabelPositionEnum.ABOVE,
    labelStyle: FormLabelStyleEnum.DEFAULT,
    size: FormComponentSizeEnum.NORMAL,
  };

  floatLabelConfig: InputTextConfig = {
    id: 'float-label-input',
    label: 'Floating Label',
    placeholder: '',
    labelStyle: FormLabelStyleEnum.FLOAT,
    icon: 'pi pi-pencil',
    required: false,
    autofocus: false,
    disabled: false,
    variant: FormComponentVariantEnum.OUTLINED,
    labelPosition: FormLabelPositionEnum.ABOVE,
    size: FormComponentSizeEnum.NORMAL,
  };

  iftaLabelConfig: InputTextConfig = {
    id: 'ifta-label-input',
    label: 'IFTA Label',
    placeholder: 'Type something',
    labelStyle: FormLabelStyleEnum.IFTA,
    icon: 'pi pi-user',
    required: false,
    autofocus: false,
    disabled: false,
    variant: FormComponentVariantEnum.OUTLINED,
    labelPosition: FormLabelPositionEnum.ABOVE,
    size: FormComponentSizeEnum.NORMAL,
  };

  searchConfig: InputTextConfig = {
    id: 'search-input',
    label: 'Search',
    placeholder: 'Search...',
    type: InputTextTypeEnum.SEARCH,
    icon: 'pi pi-search',
    iconPosition: InputTextIconPositionEnum.RIGHT,
    required: false,
    autofocus: false,
    disabled: false,
    variant: FormComponentVariantEnum.OUTLINED,
    labelPosition: FormLabelPositionEnum.ABOVE,
    labelStyle: FormLabelStyleEnum.DEFAULT,
    size: FormComponentSizeEnum.NORMAL,
  };

  disabledConfig: InputTextConfig = {
    id: 'disabled-input',
    label: 'Disabled Input',
    placeholder: 'Disabled',
    disabled: true,
    required: false,
    autofocus: false,
    variant: FormComponentVariantEnum.OUTLINED,
    labelPosition: FormLabelPositionEnum.ABOVE,
    labelStyle: FormLabelStyleEnum.DEFAULT,
    size: FormComponentSizeEnum.NORMAL,
  };

  // Input configurations for floating example
  standardFloatConfig: InputTextConfig = {
    id: 'standard-float',
    label: 'Standard Float Label',
    placeholder: '',
    labelStyle: FormLabelStyleEnum.FLOAT,
    required: false,
    autofocus: false,
    disabled: false,
    variant: FormComponentVariantEnum.OUTLINED,
    labelPosition: FormLabelPositionEnum.ABOVE,
    size: FormComponentSizeEnum.NORMAL,
  };

  floatInConfig: InputTextConfig = {
    id: 'float-in',
    label: 'Float In Label',
    placeholder: '',
    labelStyle: FormLabelStyleEnum.FLOAT_IN,
    required: false,
    autofocus: false,
    disabled: false,
    variant: FormComponentVariantEnum.OUTLINED,
    labelPosition: FormLabelPositionEnum.ABOVE,
    size: FormComponentSizeEnum.NORMAL,
  };

  floatOnConfig: InputTextConfig = {
    id: 'float-on',
    label: 'Float On Label',
    placeholder: '',
    labelStyle: FormLabelStyleEnum.FLOAT_ON,
    required: false,
    autofocus: false,
    disabled: false,
    variant: FormComponentVariantEnum.OUTLINED,
    labelPosition: FormLabelPositionEnum.ABOVE,
    size: FormComponentSizeEnum.NORMAL,
  };

  standardFloatIconConfig: InputTextConfig = {
    id: 'standard-float-icon',
    label: 'Standard Float With Icon',
    placeholder: '',
    labelStyle: FormLabelStyleEnum.FLOAT,
    icon: 'pi pi-user',
    required: false,
    autofocus: false,
    disabled: false,
    variant: FormComponentVariantEnum.OUTLINED,
    labelPosition: FormLabelPositionEnum.ABOVE,
    size: FormComponentSizeEnum.NORMAL,
  };

  floatInIconConfig: InputTextConfig = {
    id: 'float-in-icon',
    label: 'Float IN With Icon',
    placeholder: '',
    labelStyle: FormLabelStyleEnum.FLOAT_IN,
    icon: 'pi pi-user',
    required: false,
    autofocus: false,
    disabled: false,
    variant: FormComponentVariantEnum.OUTLINED,
    labelPosition: FormLabelPositionEnum.ABOVE,
    size: FormComponentSizeEnum.NORMAL,
  };

  floatOnIconConfig: InputTextConfig = {
    id: 'float-on-icon',
    label: 'Float ON With Icon',
    placeholder: '',
    labelStyle: FormLabelStyleEnum.FLOAT_ON,
    icon: 'pi pi-user',
    required: false,
    autofocus: false,
    disabled: false,
    variant: FormComponentVariantEnum.OUTLINED,
    labelPosition: FormLabelPositionEnum.ABOVE,
    size: FormComponentSizeEnum.NORMAL,
  };
  protected readonly FormComponentVariantEnum = FormComponentVariantEnum;
  protected readonly FormLabelStyleEnum = FormLabelStyleEnum;
  protected readonly FormLabelPositionEnum = FormLabelPositionEnum;
  protected readonly FormComponentSizeEnum = FormComponentSizeEnum;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
  ) {
    // Initialize reactive form
    this.reactiveForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.pattern(/^\+?[\d\s()-]{7,20}$/)],
    });
  }

  ngOnInit(): void {
    // Any initialization logic goes here
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.reactiveForm.valid) {
      this.messageService.add({
        severity: 'success',
        summary: 'Form Submitted',
        detail: 'Form data: ' + JSON.stringify(this.reactiveForm.value),
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Form Invalid',
        detail: 'Please correct the errors in the form',
      });
      this.markFormGroupTouched(this.reactiveForm);
    }
  }

  /**
   * Handle input events for the template-driven example
   * @param event - The event object
   * @param field - The field name
   */
  onInputEvent(event: any, field: string): void {
    this.messageService.add({
      severity: 'info',
      summary: `${field} Event`,
      detail: `Event type: ${event.type || 'value change'}, Value: ${this.templateModel[field as keyof typeof this.templateModel]}`,
    });
  }

  /**
   * Mark all form controls as touched to trigger validation display
   * @param formGroup - The form group to mark
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}
