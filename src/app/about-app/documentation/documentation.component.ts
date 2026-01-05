import { Component } from '@angular/core';

import { TabsModule } from 'primeng/tabs';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [
    TabsModule,
    CardModule,
    AccordionModule,
    DividerModule,
    ButtonModule,
    TableModule,
    TagModule
],
  templateUrl: './documentation.component.html',
  styleUrl: './documentation.component.scss',
})
export class DocumentationComponent {
  securityFeatures = [
    {
      name: 'JWT Authentication',
      description: 'JSON Web Token based authentication using HTTP-only cookies',
      location: 'Backend: auth.service.ts, jwt.strategy.ts',
    },
    {
      name: 'CSRF Protection',
      description: 'Cross-Site Request Forgery protection with token validation',
      location: 'Backend: main.ts, Frontend: auth-interceptor.ts',
    },
    {
      name: 'Helmet Integration',
      description: 'HTTP security headers implementation using Helmet',
      location: 'Backend: main.ts',
    },
    {
      name: 'Role-Based Authorization',
      description: 'Route protection based on user roles (admin, user, manager)',
      location: 'Backend: roles.guard.ts, Frontend: auth.guard.ts',
    },
    {
      name: 'Password Hashing',
      description: 'Secure password hashing using bcrypt',
      location: 'Backend: user.service.ts',
    },
    {
      name: 'Password Strength Validation',
      description: 'Password strength checking using zxcvbn',
      location: 'Backend: registration.service.ts',
    },
    {
      name: 'Refresh Token Rotation',
      description: 'Secure token refresh mechanism with token rotation',
      location: 'Backend: token.service.ts, Frontend: auth.service.ts',
    },
    {
      name: 'Rate Limiting',
      description: 'Request throttling to prevent brute force attacks',
      location: 'Backend: app.module.ts',
    },
  ];

  frontendFeatures = [
    {
      name: 'Component Library',
      description: 'Reusable UI components library with standardized interfaces',
      location: 'libs/ui-lib/',
    },
    {
      name: 'Responsive Design',
      description: 'Mobile-first responsive design using Tailwind CSS',
      location: 'Throughout application',
    },
    {
      name: 'PrimeNG Integration',
      description: 'Rich UI components from PrimeNG library',
      location: 'Throughout application',
    },
    {
      name: 'Standalone Components',
      description: 'Angular standalone components for better modularity',
      location: 'Throughout application',
    },
    {
      name: 'State Management',
      description: 'Centralized state management using NGXS store',
      location: 'apps/draft-fe/src/app/core/store/',
    },
    {
      name: 'Error Handling',
      description: 'Consistent error handling and user feedback',
      location: 'Throughout application',
    },
    {
      name: 'Form Validation',
      description: 'Comprehensive form validation with reactive forms',
      location: 'Login, Register, and other form components',
    },
    {
      name: 'Breadcrumbs',
      description: 'Navigation breadcrumbs with multiple style variants',
      location: 'libs/ui-lib/src/lib/breadcrumbs/',
    },
    {
      name: 'WYSIWYG Editor',
      description: 'Rich text editor integration',
      location: 'libs/ui-lib/src/lib/wysiwyg-editors/',
    },
  ];

  backendFeatures = [
    {
      name: 'NestJS Architecture',
      description: 'Modular backend architecture using NestJS framework',
      location: 'apps/draft-be/src/app/',
    },
    {
      name: 'Prisma ORM',
      description: 'Type-safe database access using Prisma ORM',
      location: 'apps/draft-be/src/app/prisma/',
    },
    {
      name: 'Email Service',
      description: 'Email sending capability for notifications and verification',
      location: 'apps/draft-be/src/app/mail/',
    },
    {
      name: 'Internationalization',
      description: 'Multi-language support using nestjs-i18n',
      location: 'apps/draft-be/src/assets/i18n/',
    },
    {
      name: 'Swagger Documentation',
      description: 'API documentation using Swagger/OpenAPI',
      location: 'apps/draft-be/src/main.ts',
    },
    {
      name: 'PDF Generation',
      description: 'Server-side PDF generation using Puppeteer',
      location: 'apps/draft-be/src/app/pdf/',
    },
    {
      name: 'Scheduled Tasks',
      description: 'Background jobs and scheduled tasks using Cron',
      location: 'apps/draft-be/src/app/cron/',
    },
    {
      name: 'Logging',
      description: 'Advanced logging with Winston',
      location: 'apps/draft-be/winston-logger.ts',
    },
  ];

  userFlows = [
    {
      name: 'User Registration',
      description: 'Account creation with validation and email verification',
      components: 'Frontend: RegisterComponent, Backend: RegistrationService',
    },
    {
      name: 'Authentication',
      description: 'Login with remember me functionality and token-based session management',
      components: 'Frontend: LoginComponent, Backend: LoginService, TokenService',
    },
    {
      name: 'Email Verification',
      description: 'User email verification flow with token validation',
      components: 'Frontend: EmailVerificationComponent, Backend: UserService',
    },
    {
      name: 'Password Reset',
      description: 'Forgot password and reset password flow',
      components: 'Frontend: ForgotPasswordComponent, ResetPasswordComponent, Backend: UserService',
    },
    {
      name: 'User Profile Management',
      description: 'View and update user profile information',
      components: 'Frontend: UserProfileComponent, Backend: UserService',
    },
    {
      name: 'Admin User Management',
      description: 'Admin interface for managing users',
      components: 'Frontend: AdminViewComponent, Backend: UserService',
    },
  ];

  deploymentOptions = [
    {
      name: 'Web Application',
      description: 'Standard web deployment with Angular frontend and NestJS backend',
      files: 'apps/draft-fe/, apps/draft-be/',
    },
    {
      name: 'Desktop Application',
      description: 'Electron-based desktop application',
      files: 'draft-desktop/',
    },
    {
      name: 'Mobile Application',
      description: 'Mobile application using Capacitor',
      files: 'draft-mobile/',
    },
  ];
}
