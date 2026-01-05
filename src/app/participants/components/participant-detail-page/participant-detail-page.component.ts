import {
  Component,
  OnInit,
  inject,
  signal,
  ChangeDetectionStrategy,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { Participant } from '../../models/interfaces';

@Component({
  selector: 'app-participant-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
    TabsModule,
    TableModule,
    SkeletonModule,
  ],
  templateUrl: './participant-detail-page.component.html',
  styleUrls: ['./participant-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantDetailPageComponent implements OnInit {
  participant: WritableSignal<Participant | null> = signal<Participant | null>(null);
  loading: WritableSignal<boolean> = signal(true);

  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);

  ngOnInit(): void {
    this.loadParticipant();
  }

  private loadParticipant(): void {
    this.loading.set(true);

    // Get participant from resolver
    const resolved = this.route.snapshot.data['participant'] as Participant | null | undefined;
    this.participant.set(resolved ?? null);

    if (!this.participant()) {
      // Try to get from route params if resolver didn't work
      const participantId: any = this.route.snapshot.params['id'];
      console.log('Participant not found in resolver, ID:', participantId);
    }

    this.loading.set(false);
  }

  calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    let age: number = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff: number = today.getMonth() - dateOfBirth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }
    return age;
  }

  getStatusSeverity(
    status: string,
  ): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
    const severityMap: {
      [key: string]: 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast';
    } = {
      active: 'success',
      screening: 'warn',
      enrolled: 'info',
      completed: 'secondary',
      withdrawn: 'danger',
    };
    return severityMap[status] || 'info';
  }

  editParticipant(): void {
    const p: Participant | null = this.participant();
    if (p) {
      void this.router.navigate(['/participants', p.id, 'edit']);
    }
  }

  /**
   * Check if value is an array
   */
  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  /**
   * Convert medical history to string array for iteration
   */
  asStringArray(value: string | string[]): string[] {
    if (Array.isArray(value)) {
      return value;
    }
    return [value];
  }
}
