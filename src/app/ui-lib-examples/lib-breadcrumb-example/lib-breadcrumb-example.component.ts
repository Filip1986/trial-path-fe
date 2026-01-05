import { Component } from '@angular/core';

import { BreadcrumbItem, BreadcrumbsComponent, BreadcrumbVariant } from '@artificial-sense/ui-lib';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lib-breadcrumb-example',
  standalone: true,
  imports: [FormsModule, BreadcrumbsComponent],
  templateUrl: './lib-breadcrumb-example.component.html',
  styleUrl: './lib-breadcrumb-example.component.scss',
})
export class LibBreadcrumbExampleComponent {
  selectedVariant: BreadcrumbVariant = '1';
  separator = '/';
  homePage: BreadcrumbItem = { label: 'Home', url: '/', icon: 'pi-home' };

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Products', url: '/products', icon: 'pi-shopping-bag' },
    { label: 'Electronics', url: '/products/electronics', icon: 'pi-desktop' },
    {
      label: 'Smartphones',
      url: '/products/electronics/smartphones',
      icon: 'pi-mobile',
    },
    { label: 'Product XYZ', icon: 'pi-info-circle' },
  ];
}
