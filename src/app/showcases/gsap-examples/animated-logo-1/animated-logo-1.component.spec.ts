import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnimatedLogo1Component } from './animated-logo-1.component';

describe('AnimatedLogo1Component', () => {
  let component: AnimatedLogo1Component;
  let fixture: ComponentFixture<AnimatedLogo1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimatedLogo1Component],
    }).compileComponents();

    fixture = TestBed.createComponent(AnimatedLogo1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
