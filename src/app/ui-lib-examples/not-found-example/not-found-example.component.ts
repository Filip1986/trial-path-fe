import { Component } from '@angular/core';

import { NotFoundComponent } from '@artificial-sense/ui-lib';
import { SelectButton } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';

interface NotFoundStyleOption {
  name: string;
  value: '1' | '2' | '3';
}

@Component({
  selector: 'app-not-found-example',
  standalone: true,
  imports: [NotFoundComponent, SelectButton, FormsModule],
  templateUrl: './not-found-example.component.html',
  styleUrl: './not-found-example.component.scss',
})
export class NotFoundExampleComponent {
  styleOptions: NotFoundStyleOption[] = [
    { name: '1', value: '1' },
    { name: '2', value: '2' },
    { name: '3', value: '3' },
  ];

  selectedNotFoundStyle: '1' | '2' | '3' = '1';

  navigateBack() {
    console.log('NOT FOUND');
  }

  navigateToHome() {
    console.log('GO HOME');
  }

  handleSearch(event: Event) {
    console.log('SEARCH', event);
  }
}
