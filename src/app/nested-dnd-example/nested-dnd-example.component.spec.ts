import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NestedDndExampleComponent } from './nested-dnd-example.component';

describe('NestedDndExampleComponent', () => {
  let component: NestedDndExampleComponent;
  let fixture: ComponentFixture<NestedDndExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NestedDndExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NestedDndExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
