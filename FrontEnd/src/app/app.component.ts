import { Component, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SesionService } from './Core/service/sesion.service';
import { Router } from '@angular/router'; // Importa el servicio de Router
import { AuthService } from '../app/Core/service/auth.service';

declare global {
  interface Window {
    bootstrap: any;
  }
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ADAE';
  menuOpen = false;
  isSwipeEnabled = false;

  constructor(private titleService: Title, protected sesion: SesionService, private router: Router, private authService: AuthService) {
    // Cambiar el título de la página
    this.titleService.setTitle(this.title);
    this.authService.restoreSession(); // Restaurar la sesión al cargar la app
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirige al login después de cerrar la sesión
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    document.body.classList.toggle('no-scroll', this.menuOpen); // Deshabilitar scroll
  }

  closeMenu() {
    this.menuOpen = false;
    document.body.classList.remove('no-scroll'); // Habilita el scroll cuando se cierra el menú
  }

  // Método para redirigir al dashboard correspondiente
  redirigirAlDashboard() {
    if (this.sesion._rol !== 'Sin Rol Actual') {
      const user = this.sesion._rol;

      if (user === 'Alumno') {
        this.router.navigate(['/Main_Dashboard/alumnos']);
      } else if (user === 'Profesor') {
        this.router.navigate(['/Main_Dashboard/docentes']);
      } else if (user === 'Administrador') {
        this.router.navigate(['/Main_Dashboard/administradores']);
      }

    } else {
      this.router.navigate(['/main']); // Si no hay sesión, redirigir a /main
    }
  }


  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const target = event.target as HTMLElement;
    const menu = document.querySelector('.user-icon') as HTMLElement;
    const profileMenu = document.querySelector('.profile-menu') as HTMLElement;

    // Cierra el menú si se hace clic fuera de él y del icono de usuario
    if (menu && profileMenu && !menu.contains(target) && !profileMenu.contains(target)) {
      this.closeMenu();
    }
  }
  
}
