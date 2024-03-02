import { Component } from '@angular/core';
import {NgForm} from '@angular/forms'
import {environment} from "../../environments/environment";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {RouterLink} from '@angular/router'
import {FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl} from '@angular/forms';
import {deleteCookie, getCookie, setCookie} from "../services/cookie-utils";
import { Token } from "../services/token";
import { HttpErrorResponse } from '@angular/common/http';



@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  name = '';
  password = '';
  message = "";
  constructor(private http: HttpClient) {}
  onSubmit() {
     let bodyData = {
       "name" : this.name,
       "password" : this.password
     };
     this.http.post<Token>(environment.backendURL + "/auth/save", bodyData)
     .subscribe((resultData: any) =>
      {
        sessionStorage.setItem('username', bodyData.name);
        /* setCookie('token', resultData.token); */
        sessionStorage.setItem('token', resultData.token);
        this.message = "Регистрация прошла успешно";
      },
         (error: HttpErrorResponse) => {
           if (error.status === 409) {
             alert("Пользователь с таким именем уже существует");
           }
         }
    );
  }
  registerForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      password: new FormControl('', [Validators.required, Validators.minLength(2)])
    });
}
