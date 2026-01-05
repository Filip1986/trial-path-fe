import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreviewRadioButtonComponent } from './preview-radio-button.component';

describe('PreviewRadioButtonComponent', () => {
  let component: PreviewRadioButtonComponent;
  let fixture: ComponentFixture<PreviewRadioButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewRadioButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreviewRadioButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
