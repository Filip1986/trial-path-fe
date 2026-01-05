import { Component } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page-tyme',
  standalone: true,
  imports: [],
  templateUrl: './landing-page-tyme.component.html',
  styleUrls: ['./landing-page-tyme.component.scss'],
})
export class LandingPageTymeComponent {
  constructor(private router: Router) {}

  navigateToRegister(): void {
    void this.router.navigate(['/register']);
  }
}
