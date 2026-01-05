import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibButton1ExampleComponent } from './lib-button-1-example.component';

describe('LibButtonExampleComponent', () => {
  let component: LibButton1ExampleComponent;
  let fixture: ComponentFixture<LibButton1ExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibButton1ExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LibButton1ExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
