import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrollRevealText5Component } from './scroll-reveal-text-5.component';

describe('ScrollRevealText5Component', () => {
  let component: ScrollRevealText5Component;
  let fixture: ComponentFixture<ScrollRevealText5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollRevealText5Component],
    }).compileComponents();

    fixture = TestBed.createComponent(ScrollRevealText5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
