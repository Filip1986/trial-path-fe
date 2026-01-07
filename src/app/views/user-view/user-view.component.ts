import { Component } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/app-auth.service';

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss'],
})
export class UserViewComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  async logout(): Promise<void> {
    this.authService.logout();
    try {
      await this.router.navigate(['/login']);
      console.log('Navigation to login successful');
    } catch (error) {
      console.error('Navigation to login failed', error);
    }
  }
}
