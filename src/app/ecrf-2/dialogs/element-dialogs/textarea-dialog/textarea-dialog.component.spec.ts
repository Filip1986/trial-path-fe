import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextareaDialogComponent } from './textarea-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IconMappingService } from '@core/services/icon-mapping.service';

describe('TextareaDialogComponent', () => {
  let component: TextareaDialogComponent;
  let fixture: ComponentFixture<TextareaDialogComponent>;
  let iconService: jasmine.SpyObj<IconMappingService>;

  beforeEach(async () => {
    const iconServiceSpy = jasmine.createSpyObj('IconMappingService', ['getPrimeIcon']);

    await TestBed.configureTestingModule({
      imports: [TextareaDialogComponent, ReactiveFormsModule, NoopAnimationsModule],
      providers: [{ provide: IconMappingService, useValue: iconServiceSpy }],
    }).compileComponents();

    iconService = TestBed.inject(IconMappingService) as jasmine.SpyObj<IconMappingService>;
    fixture = TestBed.createComponent(TextareaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    component.onDialogShow();
    expect(component.form.value.label).toBe('Text Area');
    expect(component.form.value.rows).toBe(3);
    expect(component.form.value.autoResize).toBe(false);
  });

  it('should emit save event when form is valid and save is called', () => {
    spyOn(component.save, 'emit');
    component.onDialogShow();
    component.form.patchValue({
      label: 'Custom Text Area',
      rows: 5,
      cols: 40,
    });
    component.onSave();
    expect(component.save.emit).toHaveBeenCalled();
  });

  it('should not emit save event when form is invalid', () => {
    spyOn(component.save, 'emit');
    component.onDialogShow();
    component.form.get('label')?.setValue(''); // Make the form invalid
    component.onSave();
    expect(component.save.emit).not.toHaveBeenCalled();
  });

  it('should emit visibleChange event when hideDialog is called', () => {
    spyOn(component.visibleChange, 'emit');
    component.hideDialog();
    expect(component.visibleChange.emit).toHaveBeenCalledWith(false);
  });
});
