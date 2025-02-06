import { CanActivateFn } from '@angular/router';

export const collectorGuard: CanActivateFn = (route, state) => {
  return true;
};
