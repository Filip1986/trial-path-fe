import { Route } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { RegisterViewComponent } from './auth/register-view/register.component';
import { LoginViewComponent } from './auth/login-view/login-view.component';
import { ForgotPasswordViewComponent } from './auth/forgot-password-view/forgot-password-view.component';
import { ResetPasswordViewComponent } from './auth/reset-password-view/reset-password-view.component';
import { EmailVerificationComponent } from './auth/email-verification/email-verification.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { UserSettingsComponent } from './user/user-settings/user-settings.component';
import { LibBreadcrumbExampleComponent } from './ui-lib-examples/lib-breadcrumb-example/lib-breadcrumb-example.component';
import { LibButton1ExampleComponent } from './ui-lib-examples/lib-button-1-example/lib-button-1-example.component';
import { LibButton2ExampleComponent } from './ui-lib-examples/lib-button-2-example/lib-button-2-example.component';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';
import { WysiwygEditorExampleComponent } from './ui-lib-examples/wysiwyg-editor-example/wysiwyg-editor-example.component';
import { DocumentationComponent } from './about-app/documentation/documentation.component';
import { SidenavExampleComponent } from './ui-lib-examples/sidenav-example/sidenav-example.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { TestingFlowsComponent } from './testing-flows/testing-flows.component';
import { Roles } from './core/models/roles';
import { TodoComponent } from './about-app/todo/todo.component';
import { ArticleCardExampleComponent } from './ui-lib-examples/article-card-example/article-card-example.component';
import { NotFoundExampleComponent } from './ui-lib-examples/not-found-example/not-found-example.component';
import { ContactFormExampleComponent } from './ui-lib-examples/contact-form-example/contact-form-example.component';
import { InputTextExampleComponent } from './ui-lib-examples/input-text-example/input-text-example.component';
import { FeaturesComponent } from './about-app/features/features.component';
import { NestedDndExampleComponent } from './nested-dnd-example/nested-dnd-example.component';
import { DynamicLayoutBuilderComponent } from './dynamic-layout-builder/dynamic-layout-builder.component';
import { MyDndComponent } from './my-dnd/my-dnd.component';
import { Ecrf2BuilderComponent } from './ecrf-2/ecrf2-builder.component';
import { EcrfBuilderComponent } from './ecrf-builder/ecrf-builder.component';
import { ArticleCardExample2Component } from './ui-lib-examples/article-card-example-2/article-card-example-2.component';
import { LandingPageTrialPathComponent } from './layout/landing-page/landing-page-trial-path.component';
import { GsapShowcaseComponent } from './showcases/gsap-showcase/gsap-showcase.component';
import { ScrollAnimation1Component } from './showcases/gsap-examples/scroll/scroll-animation-1/scroll-animation-1.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: LandingPageTrialPathComponent,
        pathMatch: 'full',
      },
      {
        path: 'studies',
        loadChildren: () => import('./studies/studies.routes').then((m) => m.studiesRoutes),
      },
      {
        path: 'users-view',
        canActivate: [authGuard],
        data: { roles: [Roles.USER, Roles.ADMIN] },
        loadComponent: () =>
          import('./views/user-view/user-view.component').then((m) => m.UserViewComponent),
      },
      {
        path: 'dashboard',
        canActivate: [authGuard],
        data: { roles: [Roles.USER, Roles.ADMIN] },
        loadComponent: () =>
          import('./views/admin-dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent,
          ),
      },
      {
        path: 'users',
        canActivate: [authGuard],
        data: { roles: [Roles.USER] },
        loadComponent: () => import('./users/users.component').then((m) => m.UsersComponent),
      },
      {
        path: 'profile',
        component: UserProfileComponent,
        canActivate: [authGuard],
      },
      {
        path: 'settings',
        component: UserSettingsComponent,
        canActivate: [authGuard],
      },
      {
        path: 'email-verification',
        component: EmailVerificationComponent,
        canActivate: [authGuard],
      },
      {
        path: 'documentation',
        component: DocumentationComponent,
      },
      {
        path: 'features',
        component: FeaturesComponent,
      },
      {
        path: 'testing-flows',
        component: TestingFlowsComponent,
      },
      {
        path: 'to-do',
        component: TodoComponent,
      },
      {
        path: 'ecrf',
        component: EcrfBuilderComponent,
      },
      {
        path: 'ecrf2',
        component: Ecrf2BuilderComponent,
      },
      {
        path: 'gsap-showcase',
        component: GsapShowcaseComponent,
        title: 'GSAP Showcase',
        data: { breadcrumb: 'GSAP Showcase' },
      },
      {
        path: 'gsap/scroll-animation-1',
        component: ScrollAnimation1Component,
        title: 'GSAP Showcase',
        data: { breadcrumb: 'GSAP Showcase' },
      },
      {
        path: 'nested-dnd-example',
        component: NestedDndExampleComponent,
      },
      {
        path: 'dynamic-layout-builder',
        component: DynamicLayoutBuilderComponent,
      },
      {
        path: 'my-dnd',
        component: MyDndComponent,
      },
      {
        path: 'lib-breadcrumbs-example',
        component: LibBreadcrumbExampleComponent,
      },
      {
        path: 'lib-button-1-example',
        component: LibButton1ExampleComponent,
      },
      {
        path: 'lib-button-2-example',
        component: LibButton2ExampleComponent,
      },
      {
        path: 'sidenav-example',
        component: SidenavExampleComponent,
      },
      {
        path: 'wysiwyg-editor-example',
        component: WysiwygEditorExampleComponent,
      },
      {
        path: 'article-card-1',
        component: ArticleCardExampleComponent,
      },
      {
        path: 'article-card-2',
        component: ArticleCardExample2Component,
      },
      {
        path: 'not-found-example',
        component: NotFoundExampleComponent,
      },
      {
        path: 'contact-form-example',
        component: ContactFormExampleComponent,
      },
      {
        path: 'input-text-example',
        component: InputTextExampleComponent,
      },
      {
        path: 'participants',
        loadChildren: () =>
          import('./participants/participants.routes').then((m) => m.participantsRoutes),
      },
      {
        path: 'data/entry',
        loadComponent: () =>
          import('./data-management/data-entry/data-entry.component').then(
            (m) => m.DataEntryComponent,
          ),
        title: 'Data Entry',
        data: { breadcrumb: 'Data Entry' },
      },
      {
        path: 'data/queries',
        loadComponent: () =>
          import('./data-management/query-management/query-management.component').then(
            (m) => m.QueryManagementComponent,
          ),
        title: 'Query Management',
        data: { breadcrumb: 'Query Management' },
      },
      {
        path: 'safety/adverse-events',
        loadComponent: () =>
          import('./safety-and-monitoring/adverse-events/adverse-events.component').then(
            (m) => m.AdverseEventsComponent,
          ),
        title: 'Adverse Events',
        data: { breadcrumb: 'Adverse Events' },
      },
      {
        path: 'safety/deviations',
        loadComponent: () =>
          import('./safety-and-monitoring/protocol-deviations/protocol-deviations.component').then(
            (m) => m.ProtocolDeviationsComponent,
          ),
        title: 'Protocol Deviations',
        data: { breadcrumb: 'Protocol Deviations' },
      },
      {
        path: 'safety/site-visits',
        loadComponent: () =>
          import('./safety-and-monitoring/site-visits/site-visits.component').then(
            (m) => m.SiteVisitsComponent,
          ),
        title: 'Site Visits',
        data: { breadcrumb: 'Site Visits' },
      },
      {
        path: 'regulatory/documents',
        loadComponent: () =>
          import('./regulatory/documents/documents.component').then((m) => m.DocumentsComponent),
        title: 'Documents',
        data: { breadcrumb: 'Documents' },
      },
    ],
  },
  // These routes are kept outside the main layout as they have their own specialized layouts
  {
    path: 'register',
    component: RegisterViewComponent,
  },
  {
    path: 'login',
    component: LoginViewComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordViewComponent,
  },
  {
    path: 'reset-password/:token',
    component: ResetPasswordViewComponent,
  },
  {
    path: 'verify-email/:token',
    component: VerifyEmailComponent,
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
