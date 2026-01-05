import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreviewSelectButtonComponent } from './preview-select-button.component';

describe('PreviewSelectButtonComponent', () => {
  let component: PreviewSelectButtonComponent;
  let fixture: ComponentFixture<PreviewSelectButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewSelectButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreviewSelectButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
