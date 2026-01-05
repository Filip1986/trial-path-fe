import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrollRevealText4Component } from './scroll-reveal-text-4.component';

describe('ScrollRevealText4Component', () => {
  let component: ScrollRevealText4Component;
  let fixture: ComponentFixture<ScrollRevealText4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollRevealText4Component],
    }).compileComponents();

    fixture = TestBed.createComponent(ScrollRevealText4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
