import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ECRFDatePickerComponent } from './ecrf-date-picker.component';

describe('DatePickerComponent', () => {
  let component: ECRFDatePickerComponent;
  let fixture: ComponentFixture<ECRFDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ECRFDatePickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ECRFDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
