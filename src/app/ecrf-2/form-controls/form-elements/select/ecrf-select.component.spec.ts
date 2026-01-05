import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EcrfSelectComponent } from './ecrf-select.component';

describe('SelectComponent', () => {
  let component: EcrfSelectComponent;
  let fixture: ComponentFixture<EcrfSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcrfSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EcrfSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
