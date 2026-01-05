import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudyList1Component } from './study-list-1.component';

describe('StudyListPageComponent', () => {
  let component: StudyList1Component;
  let fixture: ComponentFixture<StudyList1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudyList1Component],
    }).compileComponents();

    fixture = TestBed.createComponent(StudyList1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
