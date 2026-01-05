import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreviewDatePickerComponent } from './preview-date-picker.component';

describe('PreviewDatePickerComponent', () => {
  let component: PreviewDatePickerComponent;
  let fixture: ComponentFixture<PreviewDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewDatePickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreviewDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
