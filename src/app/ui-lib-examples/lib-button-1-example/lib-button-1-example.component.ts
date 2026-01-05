import { Component } from '@angular/core';

import { MessageService } from 'primeng/api';
import { Button1Component } from '@artificial-sense/ui-lib';

@Component({
  selector: 'app-lib-button-1-example',
  standalone: true,
  imports: [Button1Component],
  templateUrl: './lib-button-1-example.component.html',
  styleUrl: './lib-button-1-example.component.scss',
})
export class LibButton1ExampleComponent {
  constructor(private messageService: MessageService) {}

  showMessage(detail: string): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Button Clicked',
      detail: detail,
    });
  }
}
