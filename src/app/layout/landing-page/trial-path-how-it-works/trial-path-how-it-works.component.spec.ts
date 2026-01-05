import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrialPathHowItWorksComponent } from './trial-path-how-it-works.component';

describe('TrialPathHowItWorksComponent', () => {
  let component: TrialPathHowItWorksComponent;
  let fixture: ComponentFixture<TrialPathHowItWorksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrialPathHowItWorksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrialPathHowItWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
