import {CanActivateFn, Router, Routes, CanActivate} from '@angular/router'
import { MainComponent } from './main/main.component';
import { TimeIndexComponent } from './time-index/time-index.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {inject} from '@angular/core'
import { AuthService } from './services/authService';
import { OutGuard } from "./guards/out.guard"

const authGuard: CanActivateFn = (route, state) => {
  if (inject(AuthService).getLoggedIn()) {
    //inject(Router).navigate(['main']);
    return true;
  }
  inject(Router).navigate(['login']);
  return false;
}

export const routes: Routes = [
  {path: '', component: TimeIndexComponent, pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'main', component: MainComponent, canActivate: [authGuard], canDeactivate: [OutGuard]},
  {path: 'register', component: RegisterComponent},
];
