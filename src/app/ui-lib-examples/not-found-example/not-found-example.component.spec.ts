import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotFoundExampleComponent } from './not-found-example.component';

describe('NotFoundExampleComponent', () => {
  let component: NotFoundExampleComponent;
  let fixture: ComponentFixture<NotFoundExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
