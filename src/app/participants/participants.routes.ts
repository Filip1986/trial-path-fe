import { Routes } from '@angular/router';
import { ParticipantsDashboardComponent } from './components/participants-dashboard/participants-dashboard.component';
import { AllParticipantsComponent } from './components/all-participants/all-participants.component';
import { EnrollParticipantComponent } from './components/enroll-participant/enroll-participant.component';
import { ScreeningComponent } from './components/screening/screening.component';
import { ParticipantDetailPageComponent } from './components/participant-detail-page/participant-detail-page.component';
import { participantResolver } from './resolvers/participant.resolver';
import { ParticipantsLayoutComponent } from './components/participants-layout/participants-layout.component';
import { ParticipantEditGuard } from './guards/participant-edit.guard';
import { ParticipantFormPageComponent } from './components/participant-form-page/participant-form-page.component';

export const participantsRoutes: Routes = [
  {
    path: '',
    component: ParticipantsLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: ParticipantsDashboardComponent,
        title: 'Participants Dashboard',
        data: { breadcrumb: 'Dashboard' },
      },
      {
        path: 'all',
        component: AllParticipantsComponent,
        title: 'All Participants',
        data: { breadcrumb: 'All Participants' },
      },
      {
        path: 'enroll',
        component: EnrollParticipantComponent,
        title: 'Enroll Participant',
        data: {
          breadcrumb: 'Enroll Participant',
          permission: 'canEditStudyData',
        },
      },
      {
        path: 'screening',
        component: ScreeningComponent,
        title: 'Participant Screening',
        data: { breadcrumb: 'Screening' },
      },
      {
        path: ':id',
        component: ParticipantDetailPageComponent,
        resolve: { participant: participantResolver },
        title: 'Participant Details',
        data: { breadcrumb: 'Participant Details' },
      },
      {
        path: ':id/edit',
        component: ParticipantFormPageComponent,
        resolve: { participant: participantResolver },
        canActivate: [ParticipantEditGuard],
        title: 'Edit Participant',
        data: {
          breadcrumb: 'Edit Participant',
          mode: 'edit',
        },
      },
    ],
  },
];
