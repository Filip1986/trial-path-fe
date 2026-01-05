import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckboxDialogComponent } from './checkbox-dialog.component';

describe('CheckboxDialogComponent', () => {
  let component: CheckboxDialogComponent;
  let fixture: ComponentFixture<CheckboxDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
