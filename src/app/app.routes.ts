import { Routes } from '@angular/router';
import { Landing } from 'app/presentation/pages/landing/landing';
import { Login } from 'app/presentation/pages/login/login';

export const routes: Routes = [
  {
    path: '',
    component: Landing,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: '**',
    component: Landing,
  },
];
