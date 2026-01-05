import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IValidationResult } from '../../../../core/models/interfaces/validation.interfaces';

@Component({
  selector: 'app-validation-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './validation-summary.component.html',
  styleUrl: './validation-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidationSummaryComponent {
  @Input() validationResult: IValidationResult | null = null;
  @Input() showWarnings = true;
  @Input() showQualityScore = true;
  @Input() compact = false; // For inline display

  /**
   * Get quality status based on a validation result
   */
  get qualityStatus(): 'excellent' | 'good' | 'needs-improvement' {
    if (!this.validationResult) return 'needs-improvement';

    if (this.validationResult.valid && this.validationResult.warnings.length === 0) {
      return 'excellent';
    } else if (this.validationResult.valid && this.validationResult.warnings.length > 0) {
      return 'good';
    } else {
      return 'needs-improvement';
    }
  }

  /**
   * Get quality status text
   */
  get qualityStatusText(): string {
    const statusMap = {
      excellent: 'Excellent',
      good: 'Good',
      'needs-improvement': 'Needs Improvement',
    };
    return statusMap[this.qualityStatus];
  }

  /**
   * Get quality status icon
   */
  get qualityStatusIcon(): string {
    const iconMap = {
      excellent: 'pi pi-check-circle text-green-600',
      good: 'pi pi-info-circle text-yellow-600',
      'needs-improvement': 'pi pi-times-circle text-red-600',
    };
    return iconMap[this.qualityStatus];
  }

  /**
   * Get container CSS classes for quality score
   */
  get qualityScoreClasses(): string {
    const baseClasses = 'form-quality-score p-3 border rounded';
    const statusClasses = {
      excellent: 'bg-green-50 border-green-200',
      good: 'bg-yellow-50 border-yellow-200',
      'needs-improvement': 'bg-red-50 border-red-200',
    };

    return `${baseClasses} ${statusClasses[this.qualityStatus]}`;
  }

  /**
   * Get text color classes for quality score
   */
  get qualityTextClasses(): string {
    const statusClasses = {
      excellent: 'text-green-800',
      good: 'text-yellow-800',
      'needs-improvement': 'text-red-800',
    };

    return `text-sm font-medium ${statusClasses[this.qualityStatus]}`;
  }

  /**
   * Get summary color classes
   */
  get summaryColorClasses(): string {
    const statusClasses = {
      excellent: 'text-green-600',
      good: 'text-yellow-600',
      'needs-improvement': 'text-red-600',
    };

    return `text-xs ${statusClasses[this.qualityStatus]}`;
  }

  /**
   * Check if there are any warnings to display
   */
  get hasWarnings(): boolean {
    return !!this.validationResult?.warnings?.length;
  }

  /**
   * Check if a validation result exists and should be displayed
   */
  get shouldShow(): boolean {
    return !!(this.validationResult && (this.hasWarnings || this.showQualityScore));
  }
}
