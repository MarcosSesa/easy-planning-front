import { Routes } from '@angular/router';
import { authGuard } from 'app/domain/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./presentation/pages/landing/landing-page.component').then(
        (m) => m.LandingPageComponent,
      ),
  },
  {
    path: 'create-trip',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./presentation/pages/create-trip/create-trip-page.component').then(
        (m) => m.CreateTripPageComponent,
      ),
  },
  {
    path: 'my-trips',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./presentation/pages/my-trips/my-trips-page.component').then(
        (m) => m.MyTripsPageComponent,
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
