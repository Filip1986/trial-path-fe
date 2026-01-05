import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidationSettingsComponent } from './validation-settings.component';

describe('ValidationSettingsComponent', () => {
  let component: ValidationSettingsComponent;
  let fixture: ComponentFixture<ValidationSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ValidationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
