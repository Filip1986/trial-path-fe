import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputTextDialogComponent } from './input-text-dialog.component';

describe('TextInputDialogComponent', () => {
  let component: InputTextDialogComponent;
  let fixture: ComponentFixture<InputTextDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputTextDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputTextDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
