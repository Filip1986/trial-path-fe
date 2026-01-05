import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DndListItemComponent } from './dnd-list-item.component';

describe('DndListItemComponent', () => {
  let component: DndListItemComponent;
  let fixture: ComponentFixture<DndListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DndListItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DndListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
