import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  WritableSignal,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import {
  PrivacyPolicyAcceptanceResponseDto,
  PrivacyPolicyDto,
  PrivacyPolicyService,
} from '../../../../../../shared/src/lib/api';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-privacy-policy-acceptance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    CheckboxModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './privacy-policy-acceptance.component.html',
  styleUrls: ['./privacy-policy-acceptance.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPolicyAcceptanceComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() policyAccepted: EventEmitter<boolean> = new EventEmitter<boolean>();

  privacyPolicy: PrivacyPolicyDto | null = null;

  // UI state as signals (keep acceptanceChecked as boolean for [(ngModel)] compatibility)
  isLoading: WritableSignal<boolean> = signal(true);
  isAccepting: WritableSignal<boolean> = signal(false);
  acceptanceChecked = false;
  errorMessage: WritableSignal<string> = signal('');

  constructor(private privacyPolicyService: PrivacyPolicyService) {}

  ngOnInit(): void {
    if (this.visible) {
      this.loadLatestPrivacyPolicy();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && changes['visible'].currentValue) {
      this.loadLatestPrivacyPolicy();
    }
  }

  loadLatestPrivacyPolicy(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.privacyPolicyService
      .privacyPolicyControllerGetLatestPrivacyPolicy()
      .pipe(finalize((): void => this.isLoading.set(false)))
      .subscribe({
        next: (privacyPolicyDto: PrivacyPolicyDto): void => {
          this.privacyPolicy = privacyPolicyDto;
        },
        error: (_error: any): void => {
          this.errorMessage.set('Failed to load privacy policy. Please try again later.');
        },
      });
  }

  acceptPolicy(): void {
    if (!this.acceptanceChecked || !this.privacyPolicy) {
      return;
    }

    this.isAccepting.set(true);
    this.errorMessage.set('');

    // Accept the policy directly
    this.privacyPolicyService
      .privacyPolicyControllerAcceptPrivacyPolicy({
        version: this.privacyPolicy!.version,
      })
      .pipe(finalize((): void => this.isAccepting.set(false)))
      .subscribe({
        next: (_resp: PrivacyPolicyAcceptanceResponseDto): void => {
          this.policyAccepted.emit(true);
          this.closeDialog();
        },
        error: (_error: any): void => {
          this.errorMessage.set('Failed to record your acceptance. Please try again.');
        },
      });
  }

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
