import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EcrfTimePickerComponent } from './ecrf-time-picker.component';

describe('TimePickerComponent', () => {
  let component: EcrfTimePickerComponent;
  let fixture: ComponentFixture<EcrfTimePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcrfTimePickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EcrfTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
