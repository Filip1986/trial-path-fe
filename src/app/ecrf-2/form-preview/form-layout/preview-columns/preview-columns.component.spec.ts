import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreviewColumnsComponent } from './preview-columns.component';

describe('PreviewColumnsComponent', () => {
  let component: PreviewColumnsComponent;
  let fixture: ComponentFixture<PreviewColumnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewColumnsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreviewColumnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
