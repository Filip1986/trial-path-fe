import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasePreviewComponent } from './base-preview.component';

describe('BasePreviewComponent', () => {
  let component: BasePreviewComponent;
  let fixture: ComponentFixture<BasePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasePreviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BasePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
