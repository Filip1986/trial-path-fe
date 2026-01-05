import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactFormExampleComponent } from './contact-form-example.component';

describe('ContactFormExampleComponent', () => {
  let component: ContactFormExampleComponent;
  let fixture: ComponentFixture<ContactFormExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactFormExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactFormExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
