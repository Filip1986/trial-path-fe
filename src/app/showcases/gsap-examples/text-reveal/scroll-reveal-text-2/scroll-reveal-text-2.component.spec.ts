import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrollRevealText2Component } from './scroll-reveal-text-2.component';

describe('ScrollRevealText2Component', () => {
  let component: ScrollRevealText2Component;
  let fixture: ComponentFixture<ScrollRevealText2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollRevealText2Component],
    }).compileComponents();

    fixture = TestBed.createComponent(ScrollRevealText2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
