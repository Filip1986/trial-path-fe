import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputTextExampleComponent } from './input-text-example.component';

describe('InputTextExampleComponent', () => {
  let component: InputTextExampleComponent;
  let fixture: ComponentFixture<InputTextExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputTextExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputTextExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
