import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthUseCase } from 'app/domain/use-cases/auth/auth.use-case';

export const authGuard: CanActivateFn = () => {
  const authUseCase = inject(AuthUseCase);
  const router = inject(Router);
  if (!authUseCase.isLogged) {
    router.navigate(['/']);
  }
  return authUseCase.isLogged;
};
