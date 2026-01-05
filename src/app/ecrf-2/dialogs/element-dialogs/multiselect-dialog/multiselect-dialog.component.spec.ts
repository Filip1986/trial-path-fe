import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MultiselectDialogComponent } from './multiselect-dialog.component';

describe('MultiselectDialogComponent', () => {
  let component: MultiselectDialogComponent;
  let fixture: ComponentFixture<MultiselectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiselectDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiselectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
