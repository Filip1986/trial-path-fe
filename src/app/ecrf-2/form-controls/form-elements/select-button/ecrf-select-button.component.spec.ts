import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EcrfSelectButtonComponent } from './ecrf-select-button.component';

describe('SelectButtonComponent', () => {
  let component: EcrfSelectButtonComponent;
  let fixture: ComponentFixture<EcrfSelectButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcrfSelectButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EcrfSelectButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
