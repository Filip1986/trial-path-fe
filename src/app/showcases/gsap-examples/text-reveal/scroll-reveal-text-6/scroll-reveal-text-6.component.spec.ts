import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrollRevealText6Component } from './scroll-reveal-text-6.component';

describe('ScrollRevealText6Component', () => {
  let component: ScrollRevealText6Component;
  let fixture: ComponentFixture<ScrollRevealText6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollRevealText6Component],
    }).compileComponents();

    fixture = TestBed.createComponent(ScrollRevealText6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
