import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'studyPhase',
  standalone: true,
})
export class StudyPhasePipe implements PipeTransform {
  private phaseLabels = {
    phase_1: 'Phase I',
    phase_2: 'Phase II',
    phase_3: 'Phase III',
    phase_4: 'Phase IV',
    preclinical: 'Preclinical',
  };

  transform(phase: string): string {
    const phaseLabels: Record<string, string> = {
      phase_1: 'Phase I',
      phase_2: 'Phase II',
      phase_3: 'Phase III',
      phase_4: 'Phase IV',
      preclinical: 'Preclinical',
    };
    return phaseLabels[phase] || phase;
  }
}
