import { Component } from '@angular/core';

@Component({
  selector: 'app-servicios-menu',
  templateUrl: './servicios-menu.component.html',
  styleUrl: './servicios-menu.component.css'
})
export class ServiciosMenuComponent {
  constructor() {
    window.scrollTo(0, 0);
  }
}
