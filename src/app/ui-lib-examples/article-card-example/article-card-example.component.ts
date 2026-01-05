import { Component } from '@angular/core';

import { ArticleCardComponent } from '@artificial-sense/ui-lib';
import { SelectButton } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';

interface ArticleStyleOption {
  name: string;
  value: '1' | '2' | '3';
}

@Component({
  selector: 'app-article-card-example',
  standalone: true,
  imports: [ArticleCardComponent, SelectButton, FormsModule],
  templateUrl: './article-card-example.component.html',
  styleUrl: './article-card-example.component.scss',
})
export class ArticleCardExampleComponent {
  styleOptions: ArticleStyleOption[] = [
    { name: '1', value: '1' },
    { name: '2', value: '2' },
    { name: '3', value: '3' },
  ];

  selectedArticleStyle: '1' | '2' | '3' = '1';
}
