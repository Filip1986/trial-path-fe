import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnimatedLogo2Component } from './animated-logo-2.component';

describe('AnimatedLogo2Component', () => {
  let component: AnimatedLogo2Component;
  let fixture: ComponentFixture<AnimatedLogo2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimatedLogo2Component],
    }).compileComponents();

    fixture = TestBed.createComponent(AnimatedLogo2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
