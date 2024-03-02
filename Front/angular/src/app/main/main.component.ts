import { AfterViewInit, Component, ElementRef, Inject, ViewChild, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { Task } from '../entity/task'
import { Response } from '../entity/response'
import { LoginComponent } from '../login/login.component'
import {HttpClient, HttpClientModule, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl} from '@angular/forms';
import { PointsServ } from "../services/pointsServ"
import { AuthService } from '../services/authService';
import {RouterLink} from '@angular/router'
import { Router } from '@angular/router';
import {deleteCookie, getCookie, setCookie} from "../services/cookie-utils";
import { CookieService } from 'ngx-cookie-service';



@Component({
  selector: 'app-main',
  standalone: true,
  imports: [HeaderComponent, FormsModule, ReactiveFormsModule, HttpClientModule, RouterLink, LoginComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements AfterViewInit {
  @ViewChild('plot') canvasRef!: ElementRef<HTMLCanvasElement>
  private ctx!: CanvasRenderingContext2D
  private canvas!: HTMLCanvasElement
  public selectedX: number[] = [6, 6, 6, 6, 6, 6, 6, 6, 6];
  public readonly availableX = [-3, -2, -1, 0, 1, 2, 3, 4, 5];
  public selectedR: number[] = [0, 0, 0, 0, 0];
  public readonly availableR = [1, 2, 3, 4, 5];
  public lastR: number = 1;
  public res: Response = {x: "1", y: "1", r: "1", ans: "pypypy"};
  public task_req: Task = {x: "0", y: "0", r: "0"}
  public reqs: Response[] = [];



  constructor(private router: Router, private http: HttpClient, private pointsServ: PointsServ, private authService: AuthService, private cookieService: CookieService) {
    const points = this.pointsServ.getPoints();
    this.reqs = Array.isArray(points) ? points : [];
    let rad = localStorage.getItem("rad");
    if (rad != null) {
      this.lastR = Number(rad);
    }
    //const jwtToken = getCookie('token');
    const jwtToken = sessionStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${jwtToken}`);
   /*  this.reqs = JSON.parse(sessionStorage.getItem('shots') ?? '[]') */
    this.http.get<Response[]>(environment.backendURL + "/main/getTask", { headers: headers })
      .subscribe(result => {
        this.reqs = result;
        sessionStorage.setItem('shots', JSON.stringify(this.reqs));
        this.drawPoints();
      });
  }


  ngAfterViewInit(): void {
    this.canvas = this.canvasRef.nativeElement
    this.ctx = this.canvas.getContext('2d')!
    this.canvas.width = 500;
    this.canvas.height = 500;
    this.drawGraph();
    this.drawPoints();
  }

  profileForm = new FormGroup({
      myCheckboxGroupX: new FormGroup({
        x_3: new FormControl(false),
        x_2: new FormControl(false),
        x_1: new FormControl(false),
        x0: new FormControl(false),
        x1: new FormControl(false),
        x2: new FormControl(false),
        x3: new FormControl(false),
        x4: new FormControl(false),
        x5: new FormControl(false),
      }, this.requireCheckboxesToBeCheckedValidator()),
      myCheckboxGroupR: new FormGroup({
              r_3: new FormControl({value: false, disabled: true}),
              r_2: new FormControl({value: false, disabled: true}),
              r_1: new FormControl({value: false, disabled: true}),
              r0: new FormControl({value: false, disabled: true}),
              r1: new FormControl(false),
              r2: new FormControl(false),
              r3: new FormControl(false),
              r4: new FormControl(false),
              r5: new FormControl(false),
            }, this.requireCheckboxesToBeCheckedValidator()),
      y: new FormControl('', [Validators.required, Validators.min(-3), Validators.max(3), Validators.pattern("^-?[0-9]+(\\.[0-9]+)?$")]),
    });


  handleSubmit() {
    for (let i = 0; i < this.selectedX.length; i++) {
      if (this.selectedX[i] != 6) {
        this.task_req.x = this.selectedX[i].toString();
        const yControl = this.profileForm.get('y')as FormControl;
        if (yControl.value !== null) {
         this.task_req.y = yControl.value.toString();
        }
        this.task_req.r = this.lastR.toString();
        /* const jwtToken = getCookie('token'); */
        const jwtToken = sessionStorage.getItem('token');
        let headers = new HttpHeaders();
        headers = headers.set('Authorization', `Bearer ${jwtToken}`);
        this.http.post<Response>(environment.backendURL + "/main/task", this.task_req, { headers: headers })
          .subscribe(result => {
                this.reqs.push(result);
                sessionStorage.setItem('shots', JSON.stringify(this.reqs));
                //this.pointsServ.setPoints(this.reqs);
                this.drawPoints();
              });

      }
    }
  }
  canvasClick(event: MouseEvent) {
    let rect = this.canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    let r = this.lastR;
    x = parseFloat(((x -  250) /  150 * r).toFixed(5));
    y = parseFloat(((-(y -  250)) /  150 * r).toFixed(5));
    this.task_req.r = r.toString();
    this.task_req.x = x.toString();
    this.task_req.y = y.toString();
    const jwtToken = sessionStorage.getItem('token');
    /* const jwtToken = getCookie('token'); */
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${jwtToken}`);
    this.http.post<Response>(environment.backendURL + "/main/task", this.task_req, { headers: headers })
      .subscribe(result => {
        this.reqs.push(result);
        sessionStorage.setItem('shots', JSON.stringify(this.reqs));
        /* this.pointsServ.setPoints(this.reqs); */
        this.drawPoints();
      });
  }

  clearReqs() {
   this.reqs = [];
   sessionStorage.setItem('shots', '[]');
   //const jwtToken = getCookie('token');
   /* console.log(jwtToken);
   deleteCookie('token');
   const jwtToken2 = getCookie('token');
   console.log(jwtToken2); */
   const jwtToken = sessionStorage.getItem('token');
   let headers = new HttpHeaders();
   headers = headers.set('Authorization', `Bearer ${jwtToken}`);
   console.log("del");
   this.http.delete(environment.backendURL + '/main', { headers: headers }).subscribe(() => {});
   this.ctx.clearRect(0, 0, 500, 500);
   this.drawGraph();
   this.drawPoints();
  }

  outServ() {
    /* deleteCookie('token'); */
    sessionStorage.removeItem('token');
    /* location.reload(); */
    this.router.navigate(['/login']);
  }

  drawPoints() {
    for (let i = 0; i < this.reqs.length; i++) {
      let x = parseFloat(this.reqs[i].x);
      let y = parseFloat(this.reqs[i].y);
      let r = this.lastR;
      let r_ist = parseFloat(this.reqs[i].r);
      if (this.checkArea(x, y, r) == true) {
        this.ctx.fillStyle = "green";
      } else {
        this.ctx.fillStyle = "red";
      }
      this.ctx.beginPath();
      this.ctx.arc(
          x / r * 150 + 500 / 2,
          - y / r * 150 + 500 / 2,
          4, 0, 2 * Math.PI);
      this.ctx.fill();
    }
  }

  checkArea(x: number, y: number, r: number) {
    if ((x >= -r && x <= 0 && y >= 0 && y <= r) ||
      (x * x + y * y < r * r && x < 0 && y < 0) ||
      (x - r / 2 < y && x > 0 && y < 0)) {
        return true;
      } else { return false;}
  }

  updateX(value: string) {
    const numX = Number(value) + 3;
    if (this.selectedX[numX] == 6) {
      this.selectedX[numX] = numX - 3;
    }
    else {
      this.selectedX[numX] = 6;
    }
  }

  updateLastR(value: string) {
    const numValue = Number(value) - 1;
    if (this.selectedR[numValue] == 0) {
      this.selectedR[numValue] = numValue + 1;
      this.lastR = numValue + 1;
    }
    else {
      this.selectedR[numValue] = 0;
      this.lastR = 1;
      for(let i = 0; i < this.selectedR.length; i++) {
        if (this.selectedR[i] != 0) {
          this.lastR = this.selectedR[i];
          break;
        }
      }
    }
    localStorage.setItem("rad", String(this.lastR));
    this.ctx.clearRect(0, 0, 500, 500);
    this.drawGraph();
    this.drawPoints();

  }



  requireCheckboxesToBeCheckedValidator(minRequired = 1): ValidatorFn {
    return function validate (abstractControl: AbstractControl) {
      const formGroup = abstractControl as FormGroup;
      let checked = 0;

      Object.keys(formGroup.controls).forEach(key => {
        const control = formGroup.controls[key];

        if (control.value === true) {
          checked ++;
        }
      });

      if (checked < minRequired) {
        return {
          requireCheckboxesToBeChecked: true,
        };
      }

      return null;
    };
  }

  drawGraph() {
      let x = 50;
      let y = 50;
      this.ctx.beginPath();
      this.ctx.fillStyle = '#09f';
      this.ctx.arc(x * 5, y * 5, 150, Math.PI / 2, Math.PI);
      this.ctx.arc(x * 5, y * 5, 150, Math.PI / 2, Math.PI);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.moveTo(x * 5, y * 5);
      this.ctx.lineTo(x * 2, y * 5);
      this.ctx.lineTo(x * 5, y * 8);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.strokeStyle = '#09f';
      this.ctx.lineTo(x * 5, y * 8);
      this.ctx.lineTo(x * 2, y * 5);
      this.ctx.stroke();
      //Прямоугольник
      this.ctx.fillRect(x * 2, y * 2, 150, 150);
      //Треугольник
      this.ctx.beginPath();
      this.ctx.moveTo(x * 5, y * 6.5);
      this.ctx.lineTo(x * 5, y * 5);
      this.ctx.lineTo(x * 6.5, y * 5);
      this.ctx.closePath();
      this.ctx.fill();

      this.ctx.strokeStyle = '#000';
      this.ctx.fillStyle = '#000';
      this.ctx.beginPath();
      this.ctx.moveTo(x * 5, y);
      this.ctx.lineTo(x * 5, y * 9);
      this.ctx.moveTo(x * 5, y);
      this.ctx.lineTo(x * 5.2, y * 1.2)
      this.ctx.moveTo(x * 5, y);
      this.ctx.lineTo(x * 4.8, y * 1.2)
      this.ctx.moveTo(x, y * 5);
      this.ctx.lineTo(x * 9, y * 5);
      this.ctx.lineTo(x * 8.8, y * 5.2);
      this.ctx.moveTo(x * 9, y * 5);
      this.ctx.lineTo(x * 8.8, y * 4.8);
      this.ctx.moveTo(x * 4.9, y * 2);
      this.ctx.lineTo(x * 5.1, y * 2);
      this.ctx.moveTo(x * 4.9, y * 3.5);
      this.ctx.lineTo(x * 5.1, y * 3.5);
      this.ctx.moveTo(x * 4.9, y * 6.5);
      this.ctx.lineTo(x * 5.1, y * 6.5);
      this.ctx.moveTo(x * 4.9, y * 8);
      this.ctx.lineTo(x * 5.1, y * 8);
      this.ctx.moveTo(x * 2, y * 4.9);
      this.ctx.lineTo(x * 2, y * 5.1);
      this.ctx.moveTo(x * 3.5, y * 4.9);
      this.ctx.lineTo(x * 3.5, y * 5.1);
      this.ctx.moveTo(x * 6.5, y * 4.9);
      this.ctx.lineTo(x * 6.5, y * 5.1);
      this.ctx.moveTo(x * 8, y * 4.9);
      this.ctx.lineTo(x * 8, y * 5.1);
      this.ctx.font = "20px Arial";
      this.ctx.fillText("y", x * 5.1, y);
      this.ctx.fillText("x", x * 9, y * 4.9);
      this.ctx.fillText("R", x * 5.2, y * 2.1);
      this.ctx.fillText("R/2", x * 5.2, y * 3.6);
      this.ctx.fillText("-R/2", x * 5.2, y * 6.6);
      this.ctx.fillText("-R", x * 5.2, y * 8.1);
      this.ctx.fillText("-R", x * 2.1, y * 4.8);
      this.ctx.fillText("-R/2", x * 3.6, y * 4.8);
      this.ctx.fillText("R/2", x * 6.6, y * 4.8);
      this.ctx.fillText("R", x * 8.1, y * 4.8);
      this.ctx.stroke();
  }
}
