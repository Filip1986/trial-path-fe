import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrollAnimation1Component } from './scroll-animation-1.component';

describe('ScrollAnimation1Component', () => {
  let component: ScrollAnimation1Component;
  let fixture: ComponentFixture<ScrollAnimation1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollAnimation1Component],
    }).compileComponents();

    fixture = TestBed.createComponent(ScrollAnimation1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
