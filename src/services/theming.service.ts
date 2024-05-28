import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemingService {
  public darkMode: boolean = false;
  constructor(){
    this.darkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark', this.darkMode);
  }
  public toggleDarkMode() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark', this.darkMode);
    localStorage.setItem('darkMode', this.darkMode.toString());
  }
}
