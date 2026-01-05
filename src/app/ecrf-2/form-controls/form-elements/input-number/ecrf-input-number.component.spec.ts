import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ECRFInputNumberComponent } from './ecrf-input-number.component';

describe('InputNumberComponent', () => {
  let component: ECRFInputNumberComponent;
  let fixture: ComponentFixture<ECRFInputNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ECRFInputNumberComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ECRFInputNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
