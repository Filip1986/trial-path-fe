import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutPaletteComponent } from './layout-palette.component';

describe('LayoutPaletteComponent', () => {
  let component: LayoutPaletteComponent;
  let fixture: ComponentFixture<LayoutPaletteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutPaletteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutPaletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
