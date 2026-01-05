import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CsrfTokenExampleComponent } from './csrf-token-example.component';

describe('CsrfTokenExampleComponent', () => {
  let component: CsrfTokenExampleComponent;
  let fixture: ComponentFixture<CsrfTokenExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CsrfTokenExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CsrfTokenExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
