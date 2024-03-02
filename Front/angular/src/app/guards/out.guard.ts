import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/authService';

@Injectable({
  providedIn: 'root'
})
export class OutGuard implements CanDeactivate<any> {
  constructor(private authService: AuthService) {}

  canDeactivate(
    component: any,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
   ): boolean {
    sessionStorage.removeItem('token');
    return true;
  }
}
