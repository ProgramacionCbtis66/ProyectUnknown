import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importa el Router
import { SesionService } from '../../Core/service/sesion.service';

@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.component.html',
  styleUrls: ['./alumno.component.css']
})
export class AlumnoComponent implements OnInit {

  constructor(private router: Router, protected sesion: SesionService) { } // Mantén el Router en el constructor

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  // Método para navegar al perfil
  navigateToProfile(): void {
    this.router.navigate(['/Main_Dashboard/Profile_User']); // Asegúrate de que '/profile' sea la ruta correcta
  }
}
