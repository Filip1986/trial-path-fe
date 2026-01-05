import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseOptionsPreviewComponent } from './base-options-preview.component';

describe('BaseOptionsPreviewComponent', () => {
  let component: BaseOptionsPreviewComponent;
  let fixture: ComponentFixture<BaseOptionsPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseOptionsPreviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseOptionsPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
