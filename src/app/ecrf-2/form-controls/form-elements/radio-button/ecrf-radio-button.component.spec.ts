import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EcrfRadioButtonComponent } from './ecrf-radio-button.component';

describe('RadioButtonComponent', () => {
  let component: EcrfRadioButtonComponent;
  let fixture: ComponentFixture<EcrfRadioButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcrfRadioButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EcrfRadioButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
