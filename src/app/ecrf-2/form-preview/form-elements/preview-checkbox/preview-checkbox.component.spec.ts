import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreviewCheckboxComponent } from './preview-checkbox.component';
import { FormElementType } from '@core/models/form.models';
import { ECRFCheckboxClass } from '../../../form-controls/form-elements/checkbox/checkbox.class';

describe('PreviewCheckboxComponent', () => {
  let component: PreviewCheckboxComponent;
  let fixture: ComponentFixture<PreviewCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewCheckboxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreviewCheckboxComponent);
    component = fixture.componentInstance;

    // Create a test control
    component.control = new ECRFCheckboxClass(undefined, {
      name: 'test',
      title: 'Test Checkbox',
      required: true,
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the control title', () => {
    const titleElement = fixture.nativeElement.querySelector('.font-medium');
    expect(titleElement.textContent).toContain('Test Checkbox');
  });

  it('should get default config when control is not a Checkbox', () => {
    // Set a non-Checkbox control
    component.control = {
      type: FormElementType.INPUT_TEXT,
      title: 'Not a Checkbox',
      iconName: 'test',
    };

    const config = component.getConfig();
    expect(config).toBeDefined();
    expect(config.label).toBe('Not a Checkbox');
    expect(config.disabled).toBe(true);
  });
});
