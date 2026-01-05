import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EcrfListboxComponent } from './ecrf-listbox.component';

describe('ListboxComponent', () => {
  let component: EcrfListboxComponent;
  let fixture: ComponentFixture<EcrfListboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcrfListboxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EcrfListboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
