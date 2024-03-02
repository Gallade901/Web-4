import { CommonModule, DatePipe } from '@angular/common';
import { Component} from '@angular/core';
import { interval } from 'rxjs/internal/observable/interval';
import { HttpClient } from '@angular/common/http';
import {RouterLink} from '@angular/router'

@Component({
 selector: 'app-time-index',
 standalone: true,
 imports: [DatePipe, RouterLink],
 templateUrl: './time-index.component.html',
 styleUrls: ['./time-index.component.css']
})

export class TimeIndexComponent {
 currentDateTime: Date = new Date();

 timer() {
   setTimeout(() => {
     setInterval(() => {
       this.currentDateTime = new Date();
     }, 1000);
   });
 }
}
