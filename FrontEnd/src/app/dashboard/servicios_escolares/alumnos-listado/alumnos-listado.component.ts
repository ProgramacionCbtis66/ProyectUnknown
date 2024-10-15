import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-alumnos-listado',
  templateUrl: './alumnos-listado.component.html',
  styleUrl: './alumnos-listado.component.css'
})
export class AlumnosListadoComponent {
  constructor() {
    window.scrollTo(0, 0);
  }
}
