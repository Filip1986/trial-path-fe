import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  output,
  InputSignal,
  OutputEmitterRef,
  Signal,
} from '@angular/core';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { StudyPhasePipe } from '../../../pipes/study-phase.pipe';
import { StudyStatusPipe } from '../../../pipes/study-status.pipe';
import { StatusSeverity } from '../../../models/types';
import { StudyStatus } from '../../../models/enums';
import { Study } from '../../../models/interfaces/study.interface';

@Component({
  selector: 'app-study-card',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    TagModule,
    ProgressBarModule,
    StudyPhasePipe,
    StudyStatusPipe
],
  templateUrl: './study-card.component.html',
  styleUrls: ['./study-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudyCardComponent {
  // Inputs as signals
  study: InputSignal<Study> = input.required<Study>();
  canEdit: InputSignal<boolean> = input<boolean>(true);

  // Outputs as signals
  view: OutputEmitterRef<Study> = output<Study>();
  edit: OutputEmitterRef<Study> = output<Study>();

  // Derived/computed signals
  enrollmentProgress: Signal<number> = computed((): number => {
    const s: Study = this.study();
    if (!s) return 0;
    return s.plannedEnrollment > 0
      ? Math.round((s.currentEnrollment / s.plannedEnrollment) * 100)
      : 0;
  });

  statusSeverity: Signal<StatusSeverity> = computed<StatusSeverity>(() => {
    const s: Study = this.study();
    const severityMap: Record<StudyStatus, StatusSeverity> = {
      recruiting: 'success',
      active: 'success',
      planning: 'info',
      completed: 'secondary',
      suspended: 'warn',
      cancelled: 'danger',
      draft: 'danger',
    };
    return s ? severityMap[s.status] || 'info' : 'info';
  });

  onView(): void {
    const s: Study = this.study();
    if (s) this.view.emit(s);
  }

  onEdit(): void {
    const s: Study = this.study();
    if (s) this.edit.emit(s);
  }
}
