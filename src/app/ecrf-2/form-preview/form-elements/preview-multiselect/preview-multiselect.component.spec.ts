import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreviewMultiselectComponent } from './preview-multiselect.component';

describe('PreviewMultiselectComponent', () => {
  let component: PreviewMultiselectComponent;
  let fixture: ComponentFixture<PreviewMultiselectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewMultiselectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreviewMultiselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
