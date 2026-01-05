import { Component } from '@angular/core';

import { MessageService } from 'primeng/api';
import { Button2Component } from '@artificial-sense/ui-lib';

@Component({
  selector: 'app-lib-button-2-example',
  standalone: true,
  imports: [Button2Component],
  templateUrl: './lib-button-2-example.component.html',
  styleUrl: './lib-button-2-example.component.scss',
})
export class LibButton2ExampleComponent {
  constructor(private messageService: MessageService) {}

  showMessage(detail: string): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Button Clicked',
      detail: detail,
    });
  }
}
