import { CanActivateFn } from '@angular/router';

export const routeGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    return true;
  }
  return false;
};
