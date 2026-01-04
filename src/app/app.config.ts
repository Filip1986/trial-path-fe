import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngxs/store';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { AppState } from './store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideStore([AppState]),
    provideAnimations()
  ]
};
