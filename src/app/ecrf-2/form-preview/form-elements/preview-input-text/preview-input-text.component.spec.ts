import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreviewInputTextComponent } from './preview-input-text.component';

describe('PreviewTextInputComponent', () => {
  let component: PreviewInputTextComponent;
  let fixture: ComponentFixture<PreviewInputTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewInputTextComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreviewInputTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
