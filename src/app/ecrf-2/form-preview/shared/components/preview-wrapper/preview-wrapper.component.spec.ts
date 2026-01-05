import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreviewWrapperComponent } from './preview-wrapper.component';

describe('PreviewWrapperComponent', () => {
  let component: PreviewWrapperComponent;
  let fixture: ComponentFixture<PreviewWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreviewWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
