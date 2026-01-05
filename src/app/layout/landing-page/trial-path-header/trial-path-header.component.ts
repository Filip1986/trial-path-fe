import { Component } from '@angular/core';

import { AnimatedLogo1Component } from '../../../showcases/gsap-examples/animated-logo-1/animated-logo-1.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trial-path-header',
  standalone: true,
  imports: [AnimatedLogo1Component],
  templateUrl: './trial-path-header.component.html',
  styleUrl: './trial-path-header.component.scss',
})
export class TrialPathHeaderComponent {
  mobileMenuOpen = false;

  constructor(private router: Router) {}

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  navigateToLogin(): void {
    void this.router.navigate(['/login']);
  }

  navigateToSignUp(): void {
    void this.router.navigate(['/register']);
  }

  navigateToDemo(): void {
    void this.router.navigate(['/demo']);
  }
}
