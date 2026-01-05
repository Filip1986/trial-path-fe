import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyDndComponent } from './my-dnd.component';

describe('MyDndComponent', () => {
  let component: MyDndComponent;
  let fixture: ComponentFixture<MyDndComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyDndComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyDndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
