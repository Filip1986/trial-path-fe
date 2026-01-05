import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingPageTymeComponent } from './landing-page-tyme.component';

describe('LandingPageTymeComponent', () => {
  let component: LandingPageTymeComponent;
  let fixture: ComponentFixture<LandingPageTymeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingPageTymeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPageTymeComponent);
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
  selector: 'app-landing-page-tyme',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-page-tyme.component.html',
  styleUrl: './landing-page-tyme.component.scss',
})
export class LandingPageTymeComponent {
  constructor(private router: Router) {}

  navigateToRegister(): void {
    void this.router.navigate(['/register']);
  }
}
