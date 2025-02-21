import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SesionService } from '../../Core/service/sesion.service';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css']
})
export class MainDashboardComponent implements OnInit {

  constructor(private router: Router, protected sesion: SesionService) {}

  menuItems = {
    Administrador: [
      { path: '/Main_Dashboard/options', label: 'Home', icon: 'fi fi-ss-house-chimney' },
      { path: '/Main_Dashboard/alumnos-listado', label: 'Alumnos', icon: 'fi fi-ss-people' },
      { path: '/Main_Dashboard/servicios-menu', label: 'Servicios', icon: 'fi fi-ss-tools' },
    ],
    Profesor: [
      { path: '/Main_Dashboard/options', label: 'Home', icon: 'fi fi-ss-house-chimney' },
      { path: '/Main_Dashboard/clases-dashboard', label: 'Clases', icon: 'fi fi-ss-graduation-cap' },
      { path: '/Main_Dashboard/horario', label: 'Horario', icon: 'fi fi-ss-calendar' },
    ],
    Alumno: [
      { path: '/Main_Dashboard/options', label: 'Home', icon: 'fi fi-ss-house-chimney' },
      { path: '/Main_Dashboard/clases-dashboard', label: 'Clases', icon: 'fi fi-ss-graduation-cap' },
      { path: '/Main_Dashboard/horario', label: 'Horario', icon: 'fi fi-ss-calendar' },
    ],
  };

  ngOnInit(): void {
    window.scrollTo(0, 0);
    
    // Redirección predeterminada al cargar la página
    this.router.navigate(['Main_Dashboard/options']);
  }

  goToAlumnos() {
    this.router.navigate(['/Main_Dashboard/alumnos-listado']);
  }

  goToServicios() {
    this.router.navigate(['/Main_Dashboard/servicios-menu']);
  }

  navigateToProfile(): void {
    this.router.navigate(['/Main_Dashboard/Profile_User']);
  }
}
