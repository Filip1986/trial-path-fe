import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrollRevealText3Component } from './scroll-reveal-text-3.component';

describe('ScrollRevealText3Component', () => {
  let component: ScrollRevealText3Component;
  let fixture: ComponentFixture<ScrollRevealText3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollRevealText3Component],
    }).compileComponents();

    fixture = TestBed.createComponent(ScrollRevealText3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
