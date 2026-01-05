import { Component, OnInit } from '@angular/core';

import { CsrfTokenService } from '../../core/services/csrf-token.service';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-csrf-token-example',
  standalone: true,
  imports: [ButtonModule, CardModule, ToastModule],
  templateUrl: './csrf-token-example.component.html',
  styleUrl: './csrf-token-example.component.scss',
})
export class CsrfTokenExampleComponent implements OnInit {
  displayToken = 'No token';

  constructor(
    private csrfTokenService: CsrfTokenService,
    private http: HttpClient,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.updateDisplayToken();
  }

  refreshToken() {
    this.csrfTokenService.refreshToken().subscribe({
      next: (token) => {
        this.updateDisplayToken();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'CSRF token refreshed successfully',
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to refresh CSRF token',
        });
      },
    });
  }

  clearToken() {
    this.csrfTokenService.clearToken();
    this.updateDisplayToken();
    this.messageService.add({
      severity: 'info',
      summary: 'Token Cleared',
      detail: 'CSRF token has been cleared',
    });
  }

  testGetRequest() {
    this.http.get('/api/user/me').subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'GET Request Successful',
          detail: 'API call completed successfully',
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'GET Request Failed',
          detail: err.message || 'Unknown error occurred',
        });
      },
    });
  }

  testPostRequest() {
    this.http.post('/api/user/check-verification', {}).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'POST Request Successful',
          detail: 'API call completed successfully',
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'POST Request Failed',
          detail: err.message || 'Unknown error occurred',
        });
      },
    });
  }

  private updateDisplayToken() {
    const token = this.csrfTokenService.getToken();
    this.displayToken = token
      ? `${token.substring(0, 8)}...${token.substring(token.length - 8)}`
      : 'No token';
  }
}
