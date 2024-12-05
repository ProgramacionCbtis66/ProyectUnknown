import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importa el Router
import { SesionService } from '../Core/service/sesion.service';


@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css']
})
export class MainDashboardComponent implements OnInit {

  constructor(private router: Router, protected sesion: SesionService) {

    switch (sesion._rol) {
      case "Administrador":
        this.router.navigate(['Main_Dashboard/options']);
        break;

      case "Alumno":
        this.router.navigate(['Main_Dashboard/options']);
        break;

      case "Profesor":
        this.router.navigate(['Main_Dashboard/options']);
        break;

      default:
        break;
    }
  }

  menuItems = {
    Administrador: [
      { path: '/Main_Dashboard/options', label: 'Home', icon: 'fi fi-ss-house-chimney' },
      { path: '/Main_Dashboard/alumnos-listado', label: 'Alumnos', icon: 'fi fi-ss-people' },
      { path: '/Main_Dashboard/servicios-menu', label: 'Servicios', icon: 'fi fi-ss-tools' },
    ],
    Profesor: [
      { path: '/Main_Dashboard/options', label: 'Home', icon: 'fi fi-ss-house-chimney' },
      { path: '/Main_Dashboard/clases', label: 'Clases', icon: 'fi fi-ss-graduation-cap' },
      { path: '/Main_Dashboard/horario', label: 'Horario', icon: 'fi fi-ss-calendar' },
    ],
    Alumno: [
      { path: '/Main_Dashboard/options', label: 'Home', icon: 'fi fi-ss-house-chimney' },
      { path: '/Main_Dashboard/clases', label: 'Clases', icon: 'fi fi-ss-graduation-cap' },
      { path: '/Main_Dashboard/horario', label: 'Horario', icon: 'fi fi-ss-calendar' },
    ],
  };
  
  

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  goToAlumnos() {
    this.router.navigate(['/Main_Dashboard/alumnos-listado']);
  }

  goToServicios() {
    this.router.navigate(['/Main_Dashboard/servicios-menu']);
  }

  // Método para navegar al perfil
  navigateToProfile(): void {
    this.router.navigate(['/Main_Dashboard/Profile_User']);
  }
}
