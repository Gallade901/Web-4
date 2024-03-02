import { Injectable } from '@angular/core';
import {getCookie} from './cookie-utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
//   private loggedIn = false;

  setLoggedIn(value: boolean): void {
    localStorage.setItem('token', String(value));
//     this.loggedIn = value;
  }

  getLoggedIn(): boolean {
    //const token = getCookie('token');
    const jwtToken = sessionStorage.getItem('token');
    return jwtToken !== null;
  }
}
