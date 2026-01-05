import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomValidationSettingsComponent } from './custom-validation-settings.component';

describe('CustomValidationSettingsComponent', () => {
  let component: CustomValidationSettingsComponent;
  let fixture: ComponentFixture<CustomValidationSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomValidationSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomValidationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
