import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./presentation/pages/landing/landing-page.component').then(
        (m) => m.LandingPageComponent,
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./presentation/pages/landing/landing-page.component').then(
        (m) => m.LandingPageComponent,
      ),
  },
];
