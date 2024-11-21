import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importa el Router
import { SesionService } from '../../Core/service/sesion.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-options',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './options.component.html',
  styleUrl: './options.component.css'
})
export class OptionsComponent {
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

  goToClases() {
    this.router.navigate(['/Main_Dashboard/clases']);
  }

  goToMakeClases() {
    this.router.navigate(['/Main_Dashboard/alumnos-clases-registro']);
  }

}
