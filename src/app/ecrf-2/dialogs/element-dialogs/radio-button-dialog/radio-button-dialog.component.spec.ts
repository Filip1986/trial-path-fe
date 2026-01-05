import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RadioButtonDialogComponent } from './radio-button-dialog.component';

describe('RadioButtonDialogComponent', () => {
  let component: RadioButtonDialogComponent;
  let fixture: ComponentFixture<RadioButtonDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioButtonDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RadioButtonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
