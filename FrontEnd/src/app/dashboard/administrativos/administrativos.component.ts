import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importa el Router
import { SesionService } from '../../Core/service/sesion.service';

@Component({
  selector: 'app-administrativos',
  templateUrl: './administrativos.component.html',
  styleUrls: ['./administrativos.component.css']
})
export class AdministrativosComponent implements OnInit {

  constructor(private router: Router, protected sesion: SesionService) {} // Mantén el Router en el constructor

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
