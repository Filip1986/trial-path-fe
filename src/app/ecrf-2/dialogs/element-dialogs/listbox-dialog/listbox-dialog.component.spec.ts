import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListBoxDialogComponent } from './listbox-dialog.component';

describe('ListboxDialogComponent', () => {
  let component: ListBoxDialogComponent;
  let fixture: ComponentFixture<ListBoxDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListBoxDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListBoxDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
