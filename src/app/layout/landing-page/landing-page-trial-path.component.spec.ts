import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingPageTrialPathComponent } from './landing-page-trial-path.component';

describe('LandingPageTrialPathComponent', () => {
  let component: LandingPageTrialPathComponent;
  let fixture: ComponentFixture<LandingPageTrialPathComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingPageTrialPathComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPageTrialPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page-trial-path',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-page-trial-path.component.html',
  styleUrl: './landing-page-trial-path.component.scss',
})
export class LandingPageTrialPathComponent {
  constructor(private router: Router) {}

  navigateToDemo(): void {
    void this.router.navigate(['/demo']);
  }

  navigateToSignUp(): void {
    void this.router.navigate(['/register']);
  }
}
