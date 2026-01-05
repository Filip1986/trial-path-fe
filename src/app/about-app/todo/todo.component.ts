import { Component } from '@angular/core';

import { Card } from 'primeng/card';
import { TabsModule } from 'primeng/tabs';
import { Tab } from 'primeng/tabs';
import { Tag } from 'primeng/tag';

/**
 * Interface representing a TODO item
 */
interface TodoItem {
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  completed: boolean;
}

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [Card, TabsModule, Tab, Tag],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent {
  /**
   * TODO list for Frontend tasks
   */
  frontendTodos: TodoItem[] = [
    {
      description: 'Add the input-text component everywhere in the app',
      priority: 'High',
      completed: false,
    },
    {
      description: 'Add the three different sizes for the input-text component.',
      priority: 'High',
      completed: false,
    },
    {
      description:
        'Make it easy for the input-text component to change from rounded borders to square borders.',
      priority: 'High',
      completed: false,
    },
    {
      description: 'Implement 6 theme variants for the app.',
      priority: 'High',
      completed: false,
    },
    {
      description: 'Implement responsive design for dashboard',
      priority: 'High',
      completed: false,
    },
    { description: 'Fix alignment issues in the login form', priority: 'Medium', completed: false },
    {
      description: 'Add unit tests for the registration component',
      priority: 'Low',
      completed: false,
    },
    {
      description: "Avoid putting sensitive logic in Angular — it's visible to users.",
      priority: 'Low',
      completed: false,
    },
    {
      description: 'Enable Content Security Policy (CSP) to prevent malicious script injection.',
      priority: 'Low',
      completed: false,
    },
    {
      description:
        "Use Angular's built-in sanitization ([innerHTML] is dangerous if not sanitized).",
      priority: 'Low',
      completed: false,
    },
    {
      description: 'Disable debug tools in production (ngDevMode, etc.).',
      priority: 'Low',
      completed: false,
    },
  ];

  /**
   * TODO list for Backend tasks
   */
  backendTodos: TodoItem[] = [
    { description: 'Optimize database queries for user data', priority: 'High', completed: false },
    {
      description: 'Implement rate limiting for API endpoints',
      priority: 'Medium',
      completed: false,
    },
    { description: 'Add logging for critical operations', priority: 'Low', completed: false },
    {
      description: 'Add GeoIP lookup to see where traffic comes from.',
      priority: 'Low',
      completed: false,
    },
    {
      description:
        'Visualize logs with Grafana if you sync them into something like Prometheus or a time-series DB later.',
      priority: 'Low',
      completed: false,
    },
    {
      description: 'LOG: Login attempts',
      priority: 'Low',
      completed: false,
    },
    {
      description: 'LOG: Failed requests',
      priority: 'Low',
      completed: false,
    },
    {
      description: 'LOG: Rate limit violations',
      priority: 'Low',
      completed: false,
    },
    {
      description: 'Winston or Pino in NestJS for structured logs.',
      priority: 'Low',
      completed: false,
    },
    {
      description: 'Sentry, Datadog, or Elastic APM for deeper insights.',
      priority: 'Low',
      completed: false,
    },
    {
      description: 'Add a banned: boolean flag to user entities.',
      priority: 'Low',
      completed: false,
    },
  ];

  /**
   * TODO list for Security tasks
   */
  securityTodos: TodoItem[] = [
    { description: 'Implement two-factor authentication', priority: 'High', completed: false },
    {
      description: 'Conduct a security audit for the application',
      priority: 'Medium',
      completed: false,
    },
    { description: 'Sanitize all user inputs to prevent XSS', priority: 'High', completed: false },
    {
      description: 'Use JWT or OAuth2 for secure token-based authentication (NestJS)',
      priority: 'High',
      completed: false,
    },
    {
      description: 'Secure endpoints with Guards (e.g., AuthGuard, RolesGuard) (NestJS)',
      priority: 'High',
      completed: false,
    },
    {
      description: 'Store tokens only in HttpOnly cookies for high-security apps (NestJS)',
      priority: 'High',
      completed: false,
    },
    {
      description: 'Check authentication/authorization client-side to control UI (Angular)',
      priority: 'Medium',
      completed: false,
    },
    {
      description: 'Ensure backend enforces all security rules (Angular)',
      priority: 'High',
      completed: false,
    },
    {
      description: 'Use Throttling to prevent brute-force and abuse with @nestjs/throttler',
      priority: 'High',
      completed: false,
    },
    {
      description: 'Block known malicious IPs using middleware',
      priority: 'High',
      completed: false,
    },
    {
      description: 'Log IPs from suspicious activity to a DB for analysis or dynamic blocking',
      priority: 'Medium',
      completed: false,
    },
    {
      description: 'Use class-validator + class-transformer in NestJS DTOs for input validation',
      priority: 'High',
      completed: false,
    },
    {
      description: 'Sanitize user inputs to avoid XSS or SQL injection (even if using ORM)',
      priority: 'High',
      completed: false,
    },
    {
      description: 'Use HTTPS in production.',
      priority: 'High',
      completed: false,
    },
    {
      description: 'Redirect all traffic from HTTP to HTTPS.',
      priority: 'High',
      completed: false,
    },
    {
      description: 'Secure cookies: Secure, HttpOnly, and SameSite=Strict or Lax.',
      priority: 'High',
      completed: false,
    },
    {
      description: 'Only allow trusted origins: app.enableCors',
      priority: 'High',
      completed: false,
    },
    {
      description: 'Use short-lived access tokens and refresh tokens.',
      priority: 'High',
      completed: false,
    },
    {
      description: 'Store refresh tokens securely (e.g., in an HttpOnly cookie).',
      priority: 'High',
      completed: false,
    },
    {
      description: 'Rotate and revoke tokens on suspicious activity.',
      priority: 'High',
      completed: false,
    },
    {
      description: 'Automatically block based on: Failed login attempts || Excessive API hits',
      priority: 'High',
      completed: false,
    },
    {
      description: 'Notify admin (via email or dashboard) of abuse.',
      priority: 'High',
      completed: false,
    },
    {
      description:
        'Deploy your NestJS app behind: Nginx: Rate limiting, IP filtering, TLS termination.',
      priority: 'High',
      completed: false,
    },
    {
      description:
        'Deploy your NestJS app behind: Cloudflare or AWS WAF: DDoS protection, bot mitigation.',
      priority: 'High',
      completed: false,
    },
    {
      description: 'Use Helmet in NestJS:',
      priority: 'High',
      completed: false,
    },
    {
      description: 'Keep all dependencies updated (npm audit often).',
      priority: 'High',
      completed: false,
    },
    {
      description: 'Enable CSRF protection (especially if using cookies).',
      priority: 'High',
      completed: false,
    },
    {
      description: 'Regular penetration testing or automated scanners like OWASP ZAP.',
      priority: 'High',
      completed: false,
    },
  ];

  remember: TodoItem[] = [
    {
      description:
        "If implementing IP tracking remember that if you're behind a proxy (like AWS ELB or Cloudflare), ensure headers like x-forwarded-for are forwarded correctly.",
      priority: 'High',
      completed: false,
    },
    {
      description: 'Conduct a security audit for the application',
      priority: 'Medium',
      completed: false,
    },
    { description: 'Sanitize all user inputs to prevent XSS', priority: 'High', completed: false },
    {
      description: 'Use JWT or OAuth2 for secure token-based authentication (NestJS)',
      priority: 'High',
      completed: false,
    },
  ];
}
