import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {FormsModule, NgForm} from '@angular/forms';
import {environment} from "../../environments/environment";
import { AuthService } from '../services/authService';
import {RouterLink} from '@angular/router';
import {deleteCookie, getCookie, setCookie} from "../services/cookie-utils";
import { Token } from "../services/token";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  name: string ="";
  password: string ="";
  message = "";
  constructor(private router: Router,private http: HttpClient, private authService: AuthService) {}

  Login() {

    let bodyData = {
      name: this.name,
      password: this.password,
    };

      this.http.post<Token>(environment.backendURL + "/auth/login", bodyData).subscribe(  (resultData: any) => {
      if (resultData.error != null) {
        this.message = "Неверный логин или пароль";
      } else {
        sessionStorage.setItem('username', bodyData.name);
        /* setCookie('token', resultData.token); */
        sessionStorage.setItem('token', resultData.token);
        this.router.navigateByUrl('/main');
      }
   },
       (error: HttpErrorResponse) => {
         if (error.status === 403) {
           alert("Неверный логин или пароль");
         }
       }
     );
  }
}
