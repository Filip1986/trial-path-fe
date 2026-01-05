import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreviewSelectComponent } from './preview-select.component';

describe('PreviewSelectComponent', () => {
  let component: PreviewSelectComponent;
  let fixture: ComponentFixture<PreviewSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreviewSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
