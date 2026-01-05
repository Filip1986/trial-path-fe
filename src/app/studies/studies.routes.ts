// studies.routes.ts
import { Routes } from '@angular/router';
import { StudyList1Component } from './components/study-list-1/study-list-1.component';
import { StudyResolver } from './resolvers/study.resolver';
import { StudyEditGuard } from './guards/study-edit.guard';
import { StudiesLayoutComponent } from './components/layouts/studies-layout/studies-layout.component';
import { StudiesDashboardComponent } from './components/studies-dashboard/studies-dashboard.component';
import { StudyDetailPageComponent } from './components/study-detail-page/study-detail-page.component';
import { StudyFormPageComponent } from './components/study-form-page/study-form-page.component';

export const studiesRoutes: Routes = [
  {
    path: '',
    component: StudiesLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: StudiesDashboardComponent,
        title: 'Studies Dashboard',
        data: { breadcrumb: 'Dashboard' },
      },
      {
        path: 'list1',
        component: StudyList1Component,
        title: 'All Studies1',
        data: { breadcrumb: 'All Studies1' },
      },
      {
        path: 'list2',
        loadComponent: () =>
          import('./components/study-list-2/study-list-2.component').then(
            (m) => m.StudyList2Component,
          ),
        title: 'All Studies2',
        data: { breadcrumb: 'All Studies2' },
      },
      {
        path: 'create1',
        component: StudyFormPageComponent,
        title: 'Create Study',
        data: {
          breadcrumb: 'Create Study',
          mode: 'create',
        },
      },
      {
        path: 'create2',
        loadComponent: () =>
          import('./components/create-study/create-study.component').then(
            (m) => m.CreateStudyComponent,
          ),
      },
      {
        path: ':id',
        component: StudyDetailPageComponent,
        resolve: { study: StudyResolver },
        title: 'Study Details',
        data: { breadcrumb: 'Study Details' },
      },
      {
        path: ':id/edit',
        component: StudyFormPageComponent,
        resolve: { study: StudyResolver },
        canActivate: [StudyEditGuard],
        title: 'Edit Study',
        data: {
          breadcrumb: 'Edit Study',
          mode: 'edit',
        },
      },
    ],
  },
];
