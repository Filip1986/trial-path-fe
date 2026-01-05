import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreviewListboxComponent } from './preview-listbox.component';

describe('PreviewListboxComponent', () => {
  let component: PreviewListboxComponent;
  let fixture: ComponentFixture<PreviewListboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewListboxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreviewListboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
