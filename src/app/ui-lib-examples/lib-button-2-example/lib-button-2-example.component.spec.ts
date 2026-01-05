import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibButton2ExampleComponent } from './lib-button-2-example.component';

describe('LibButton2ExampleComponent', () => {
  let component: LibButton2ExampleComponent;
  let fixture: ComponentFixture<LibButton2ExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibButton2ExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LibButton2ExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
