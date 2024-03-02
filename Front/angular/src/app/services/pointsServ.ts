
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PointsServ {
  setPoints(value: object): void {
    localStorage.setItem('points', JSON.stringify(value));
  }

  getPoints(): object | null {
    const token = localStorage.getItem('points');
    return token ? JSON.parse(token) : null;
  }
  clearPoints(): void {
    localStorage.removeItem('points');
  }

}
