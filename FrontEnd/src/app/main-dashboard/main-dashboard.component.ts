import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importa el Router
import { SesionService } from '../Core/service/sesion.service';


@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css']
})
export class MainDashboardComponent implements OnInit {

  constructor(private router: Router, protected sesion: SesionService) { } // Inyecta el Router en el constructor

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  goToAlumnos() {
    this.router.navigate(['/alumnos-listado']);
  }

  goToServicios() {
    this.router.navigate(['/servicios-menu']);
  }

  // Método para navegar al perfil
  navigateToProfile(): void {
    this.router.navigate(['/Profile_User']); // Asegúrate de que '/profile' sea la ruta correcta
  }
}
