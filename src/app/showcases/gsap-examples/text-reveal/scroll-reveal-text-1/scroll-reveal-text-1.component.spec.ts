import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrollRevealText1Component } from './scroll-reveal-text-1.component';

describe('ScrollRevealText1Component', () => {
  let component: ScrollRevealText1Component;
  let fixture: ComponentFixture<ScrollRevealText1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollRevealText1Component],
    }).compileComponents();

    fixture = TestBed.createComponent(ScrollRevealText1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
