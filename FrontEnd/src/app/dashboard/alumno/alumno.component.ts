import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importa el Router


@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.component.html',
  styleUrls: ['./alumno.component.css']
})
export class AlumnoComponent implements OnInit {

  constructor(private router: Router) { } // Mantén el Router en el constructor

  ngOnInit(): void {
  }

  // Método para navegar al perfil
  navigateToProfile(): void {
    this.router.navigate(['/Profile_User']); // Asegúrate de que '/profile' sea la ruta correcta
  }
}
