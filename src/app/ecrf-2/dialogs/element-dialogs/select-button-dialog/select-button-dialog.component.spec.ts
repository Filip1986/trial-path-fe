import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectButtonDialogComponent } from './select-button-dialog.component';

describe('SelectButtonDialogComponent', () => {
  let component: SelectButtonDialogComponent;
  let fixture: ComponentFixture<SelectButtonDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectButtonDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectButtonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
