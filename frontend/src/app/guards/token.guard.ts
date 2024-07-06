import { inject } from '@angular/core';
import { CanActivateFn,CanMatchFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const tokenGuard: CanMatchFn = (route, state) => {

  const auth = inject(AuthService);
  return auth.isAuthenticated();
};
