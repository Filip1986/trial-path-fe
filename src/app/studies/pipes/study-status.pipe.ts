import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'studyStatus',
  standalone: true,
})
export class StudyStatusPipe implements PipeTransform {
  private statusLabels = {
    draft: 'Draft',
    planning: 'Planning',
    recruiting: 'Recruiting',
    active: 'Active',
    suspended: 'Suspended',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };

  transform(status: string): string {
    const statusLabels: Record<string, string> = {
      draft: 'Draft',
      planning: 'Planning',
      recruiting: 'Recruiting',
      active: 'Active',
      suspended: 'Suspended',
      completed: 'Completed',
      cancelled: 'Cancelled',
    };
    return statusLabels[status] || status;
  }
}
