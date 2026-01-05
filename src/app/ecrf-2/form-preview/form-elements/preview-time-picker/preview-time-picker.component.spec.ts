import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreviewTimePickerComponent } from './preview-time-picker.component';

describe('PreviewTimePickerComponent', () => {
  let component: PreviewTimePickerComponent;
  let fixture: ComponentFixture<PreviewTimePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewTimePickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreviewTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
