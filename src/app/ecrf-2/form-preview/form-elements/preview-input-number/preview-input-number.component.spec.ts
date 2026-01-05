import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreviewInputNumberComponent } from './preview-input-number.component';

describe('PreviewInputNumberComponent', () => {
  let component: PreviewInputNumberComponent;
  let fixture: ComponentFixture<PreviewInputNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewInputNumberComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreviewInputNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
