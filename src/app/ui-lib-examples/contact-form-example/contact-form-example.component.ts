import { Component } from '@angular/core';

import { ContactFormComponent } from '@artificial-sense/ui-lib';
import { SelectButton } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';

interface ContactFormStyleOption {
  name: string;
  value: '1' | '2' | '3';
}

@Component({
  selector: 'app-contact-form-example',
  standalone: true,
  imports: [ContactFormComponent, SelectButton, FormsModule],
  templateUrl: './contact-form-example.component.html',
  styleUrl: './contact-form-example.component.scss',
})
export class ContactFormExampleComponent {
  styleOptions: ContactFormStyleOption[] = [
    { name: '1', value: '1' },
    { name: '2', value: '2' },
    { name: '3', value: '3' },
  ];

  selectedContactFormStyle: '1' | '2' | '3' = '1';
}
