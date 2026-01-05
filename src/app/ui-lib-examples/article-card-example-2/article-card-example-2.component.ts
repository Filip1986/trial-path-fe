import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CardComponent } from '@artificial-sense/ui-lib';
import { ButtonModule } from 'primeng/button';
import { ColorPickerChangeEvent, ColorPickerModule } from 'primeng/colorpicker';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';

interface CardData {
  id: number;
  style:
    | 'default'
    | 'elevated'
    | 'outlined'
    | 'filled'
    | 'glass'
    | 'minimal'
    | 'gradient'
    | 'neon'
    | 'modern'
    | 'vintage';
  title: string;
  subtitle: string;
  description: string;
  headerColor: string;
  tags: Array<{
    label: string;
    severity?: 'success' | 'warn' | 'info' | 'secondary' | 'danger' | 'contrast';
  }>;
  status: 'success' | 'warn' | 'error' | 'info' | 'active' | 'inactive';
  headerImage?: string;
  headerIcon?: string;
  primaryAction?: {
    label: string;
    icon?: string;
    severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'help' | 'danger';
    action?: () => void;
  };
  secondaryAction?: {
    label: string;
    icon?: string;
    severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'help' | 'danger';
    action?: () => void;
  };
}

@Component({
  selector: 'app-article-card-example-2',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    ColorPickerModule,
    DialogModule,
    TooltipModule,
    CardComponent
],
  templateUrl: './article-card-example-2.component.html',
  styleUrls: ['./article-card-example-2.component.scss'],
})
export class ArticleCardExample2Component implements OnInit {
  // Color picker properties
  selectedColor = '#3B82F6'; // Default blue color
  showColorPicker = false;

  // Preset colors for quick selection
  presetColors = [
    '#ffffff', // White
    '#f8f9fa', // Light gray
    '#e9ecef', // Gray
    '#dee2e6', // Dark gray
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#1F2937', // Dark blue-gray
    '#374151', // Dark gray
    '#6B7280', // Medium gray
    '#9CA3AF', // Light gray
  ];

  // Card data with header color support - ALL card styles included
  cardData: CardData[] = [
    {
      id: 1,
      style: 'default',
      title: 'Default Card',
      subtitle: 'Clean and simple subtitle',
      description: 'This is the default card style with subtle shadows and clean design.',
      headerColor: '#3B82F6', // Blue header
      tags: [
        { label: 'Angular', severity: 'info' },
        { label: 'UI Library', severity: 'success' },
      ],
      status: 'active',
      headerIcon: 'pi pi-star',
      primaryAction: {
        label: 'View Details',
        icon: 'pi pi-eye',
        severity: 'primary',
        action: () => this.handleCardAction('View Details', 'Default Card'),
      },
      secondaryAction: {
        label: 'Edit',
        icon: 'pi pi-pencil',
        severity: 'secondary',
        action: () => this.handleCardAction('Edit', 'Default Card'),
      },
    },
    {
      id: 2,
      style: 'elevated',
      title: 'Elevated Card',
      subtitle: 'Enhanced shadow effect',
      description: 'This card has an elevated appearance with stronger shadows for better depth.',
      headerColor: '#10B981', // Green header
      tags: [
        { label: 'Premium', severity: 'success' },
        { label: 'Featured', severity: 'warn' },
      ],
      status: 'success',
      headerIcon: 'pi pi-crown',
      primaryAction: {
        label: 'Explore',
        icon: 'pi pi-external-link',
        severity: 'success',
        action: () => this.handleCardAction('Explore', 'Elevated Card'),
      },
    },
    {
      id: 3,
      style: 'outlined',
      title: 'Outlined Card',
      subtitle: 'Border-focused design',
      description: 'This card uses borders instead of shadows for a cleaner, outlined appearance.',
      headerColor: '#F59E0B', // Yellow header
      tags: [
        { label: 'Minimal', severity: 'secondary' },
        { label: 'Clean', severity: 'info' },
      ],
      status: 'info',
      headerIcon: 'pi pi-bookmark',
      primaryAction: {
        label: 'Read More',
        icon: 'pi pi-book',
        severity: 'info',
        action: () => this.handleCardAction('Read More', 'Outlined Card'),
      },
    },
    {
      id: 4,
      style: 'filled',
      title: 'Filled Card',
      subtitle: 'Solid background style',
      description:
        'This card has a filled background with subtle gradient effects for a modern look.',
      headerColor: '#8B5CF6', // Purple header
      tags: [
        { label: 'Modern', severity: 'secondary' },
        { label: 'Stylish', severity: 'info' },
      ],
      status: 'active',
      headerIcon: 'pi pi-palette',
      primaryAction: {
        label: 'Customize',
        icon: 'pi pi-cog',
        severity: 'help',
        action: () => this.handleCardAction('Customize', 'Filled Card'),
      },
    },
    {
      id: 5,
      style: 'glass',
      title: 'Glass Card',
      subtitle: 'Glassmorphism effect',
      description: 'Modern glassmorphism design with backdrop blur and transparency effects.',
      headerColor: '#06B6D4', // Cyan header
      tags: [
        { label: 'Glassmorphism', severity: 'info' },
        { label: 'Modern', severity: 'success' },
      ],
      status: 'active',
      headerIcon: 'pi pi-sparkles',
      primaryAction: {
        label: 'Experience',
        icon: 'pi pi-play',
        severity: 'info',
        action: () => this.handleCardAction('Experience', 'Glass Card'),
      },
    },
    {
      id: 6,
      style: 'minimal',
      title: 'Minimal Card',
      subtitle: 'Less is more approach',
      description:
        'Minimalist design focusing on content with subtle styling and clean typography.',
      headerColor: '#6B7280', // Gray header
      tags: [
        { label: 'Minimal', severity: 'secondary' },
        { label: 'Clean', severity: 'info' },
      ],
      status: 'active',
      headerIcon: 'pi pi-minus',
      primaryAction: {
        label: 'Simplify',
        icon: 'pi pi-check',
        severity: 'secondary',
        action: () => this.handleCardAction('Simplify', 'Minimal Card'),
      },
    },
    {
      id: 7,
      style: 'gradient',
      title: 'Gradient Card',
      subtitle: 'Beautiful color transitions',
      description:
        'Eye-catching gradient backgrounds with smooth color transitions and vibrant effects.',
      headerColor: '#EC4899', // Pink header
      tags: [
        { label: 'Gradient', severity: 'danger' },
        { label: 'Vibrant', severity: 'warn' },
      ],
      status: 'active',
      headerIcon: 'pi pi-image',
      primaryAction: {
        label: 'Admire',
        icon: 'pi pi-heart',
        severity: 'danger',
        action: () => this.handleCardAction('Admire', 'Gradient Card'),
      },
    },
    {
      id: 8,
      style: 'neon',
      title: 'Neon Card',
      subtitle: 'Glowing border effects',
      description: 'Futuristic neon styling with glowing borders and electric color schemes.',
      headerColor: '#84CC16', // Lime header
      tags: [
        { label: 'Neon', severity: 'success' },
        { label: 'Futuristic', severity: 'info' },
      ],
      status: 'active',
      headerIcon: 'pi pi-bolt',
      primaryAction: {
        label: 'Electrify',
        icon: 'pi pi-flash',
        severity: 'success',
        action: () => this.handleCardAction('Electrify', 'Neon Card'),
      },
    },
    {
      id: 9,
      style: 'modern',
      title: 'Modern Card',
      subtitle: 'Contemporary design',
      description: 'Contemporary card design with rounded corners and modern typography.',
      headerColor: '#EF4444', // Red header
      tags: [
        { label: 'Modern', severity: 'danger' },
        { label: 'Contemporary', severity: 'warn' },
      ],
      status: 'active',
      headerIcon: 'pi pi-mobile',
      primaryAction: {
        label: 'Modernize',
        icon: 'pi pi-refresh',
        severity: 'danger',
        action: () => this.handleCardAction('Modernize', 'Modern Card'),
      },
    },
    {
      id: 10,
      style: 'vintage',
      title: 'Vintage Card',
      subtitle: 'Classic retro styling',
      description: 'Nostalgic vintage design with classic colors and traditional typography.',
      headerColor: '#92400E', // Brown header
      tags: [
        { label: 'Vintage', severity: 'warn' },
        { label: 'Classic', severity: 'secondary' },
      ],
      status: 'active',
      headerIcon: 'pi pi-clock',
      primaryAction: {
        label: 'Reminisce',
        icon: 'pi pi-history',
        severity: 'warn',
        action: () => this.handleCardAction('Reminisce', 'Vintage Card'),
      },
    },
  ];

  ngOnInit(): void {
    // Initialize with the first card's header color
    this.selectedColor = this.cardData[0]?.headerColor || '#3B82F6';
  }

  /**
   * Handle color picker change event
   */
  onColorChange(event: ColorPickerChangeEvent, cardId: number): void {
    const card = this.cardData.find((c) => c.id === cardId);
    if (card) {
      card.headerColor = '#' + event.value;
    }
  }

  /**
   * Apply preset color to specific card
   */
  applyPresetColor(color: string, cardId: number): void {
    const card = this.cardData.find((c) => c.id === cardId);
    if (card) {
      card.headerColor = color;
    }
  }

  /**
   * Apply color to all cards
   */
  applyColorToAll(color: string | object): void {
    const colorString = typeof color === 'string' ? color : '#' + (color as any).value; // Ensure color is a string
    this.cardData.forEach((card) => {
      card.headerColor = colorString;
    });
    this.selectedColor = colorString;
  }

  /**
   * Reset all cards to default colors (now with all 10 cards)
   */
  resetToDefaults(): void {
    const defaultColors = [
      '#3B82F6', // Blue
      '#10B981', // Green
      '#F59E0B', // Yellow
      '#8B5CF6', // Purple
      '#06B6D4', // Cyan
      '#6B7280', // Gray
      '#EC4899', // Pink
      '#84CC16', // Lime
      '#EF4444', // Red
      '#92400E', // Brown
    ];
    this.cardData.forEach((card, index) => {
      card.headerColor = defaultColors[index] || '#3B82F6';
    });
    this.selectedColor = '#3B82F6';
  }

  /**
   * Get card styles object for dynamic styling (works with lib-card component)
   * This method combines both header color and background color logic
   */
  getCardStyles(card: CardData): any {
    const headerColor = card.headerColor;
    const headerTextColor = this.getContrastColor(headerColor);

    // Create gradient background based on header color
    const lighterBg = this.lightenColor(headerColor, 0.95);
    const darkerBg = this.lightenColor(headerColor, 0.98);

    return {
      // Header styling
      '--header-bg-color': headerColor,
      '--header-text-color': headerTextColor,
      '--header-border-radius': '8px 8px 0 0',

      // Card background styling based on header color
      '--card-bg-color': lighterBg,
      '--card-bg-gradient': `linear-gradient(135deg, ${lighterBg} 0%, ${darkerBg} 100%)`,
      '--card-border-color': this.lightenColor(headerColor, 0.8),
      '--card-shadow-color': this.addAlpha(headerColor, 0.2),

      // Dynamic accent color
      '--accent-color': headerColor,
      '--accent-light': this.lightenColor(headerColor, 0.9),
      '--accent-dark': this.darkenColor(headerColor, 0.1),
    };
  }

  /**
   * Lighten a hex color by a given amount (0-1)
   */
  private lightenColor(hex: string, amount: number): string {
    const color = hex.replace('#', '');
    const num = parseInt(color, 16);
    const r = Math.min(255, Math.floor((num >> 16) + (255 - (num >> 16)) * amount));
    const g = Math.min(
      255,
      Math.floor(((num >> 8) & 0x00ff) + (255 - ((num >> 8) & 0x00ff)) * amount),
    );
    const b = Math.min(255, Math.floor((num & 0x0000ff) + (255 - (num & 0x0000ff)) * amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }

  /**
   * Darken a hex color by a given amount (0-1)
   */
  private darkenColor(hex: string, amount: number): string {
    const color = hex.replace('#', '');
    const num = parseInt(color, 16);
    const r = Math.max(0, Math.floor((num >> 16) * (1 - amount)));
    const g = Math.max(0, Math.floor(((num >> 8) & 0x00ff) * (1 - amount)));
    const b = Math.max(0, Math.floor((num & 0x0000ff) * (1 - amount)));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }

  /**
   * Add alpha channel to hex color
   */
  private addAlpha(hex: string, alpha: number): string {
    const color = hex.replace('#', '');
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  /**
   * Determine text color based on background color for better contrast
   */
  private getContrastColor(hexColor: string): string {
    // Remove # if present
    const color = hexColor.replace('#', '');

    // Convert to RGB
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return white or black based on luminance
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }

  /**
   * Helper method to handle card actions
   */
  private handleCardAction(action: string, cardTitle: string): void {
    console.log(`${action} action triggered for ${cardTitle}`);
    // Add your specific action logic here
  }

  /**
   * Handle card click events
   */
  onCardClick(card: CardData): void {
    console.log('Card clicked:', card.title);
    // Implement your card click logic here
  }

  /**
   * Handle card action clicks
   */
  onCardAction(action: string, card: CardData): void {
    console.log(`${action} clicked for card:`, card.title);
    // Implement your action logic here

    // Call the action function if it exists
    if (action === 'primary' && card.primaryAction?.action) {
      card.primaryAction.action();
    } else if (action === 'secondary' && card.secondaryAction?.action) {
      card.secondaryAction.action();
    }
  }

  /**
   * Get random color for demonstration
   */
  getRandomColor(): string {
    const colors = this.presetColors.filter((c) => c !== '#ffffff');
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * Randomize all card colors
   */
  randomizeColors(): void {
    this.cardData.forEach((card) => {
      card.headerColor = this.getRandomColor();
    });
  }
}
