import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ECRFCheckboxComponent } from './ecrf-checkbox.component';

describe('CheckboxComponent', () => {
  let component: ECRFCheckboxComponent;
  let fixture: ComponentFixture<ECRFCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ECRFCheckboxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ECRFCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
