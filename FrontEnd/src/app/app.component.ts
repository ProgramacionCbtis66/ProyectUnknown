// app.component.ts

import { Component, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SesionService } from './Core/service/sesion.service';
import { Router } from '@angular/router';
import { AuthService } from '../app/Core/service/auth.service';

<<<<<<< HEAD
declare global {
  interface Window {
    bootstrap: any;
  }
}


=======
>>>>>>> 6012a83e695b27c9f8a5d0866737a6ecdea71c79
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ADAE';
  menuOpen = false;
  isSwipeEnabled = false;

  constructor(
    private titleService: Title,
    protected sesion: SesionService,
    private router: Router,
    private authService: AuthService
  ) {
    this.titleService.setTitle(this.title);
<<<<<<< HEAD
    this.authService.restoreSession(); // Restaurar la sesión al cargar la app
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirige al login después de cerrar la sesión
=======

    // Escucha cuando la sesión ha sido restaurada y redirige al dashboard
    this.authService.sessionRestored$.subscribe((restored) => {
      if (restored) {
        this.redirigirAlDashboard();
      }
    });
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.router.navigate(['/main']); // Redirige al login después de cerrar la sesión
>>>>>>> 6012a83e695b27c9f8a5d0866737a6ecdea71c79
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    document.body.classList.toggle('no-scroll', this.menuOpen);
  }

  closeMenu() {
    this.menuOpen = false;
    document.body.classList.remove('no-scroll');
  }

  // Método para redirigir al dashboard correspondiente
  redirigirAlDashboard() {
    if (this.sesion._rol !== 'Sin Rol Actual') {
      const user = this.sesion._rol;

      if (user === 'Alumno') {
        this.router.navigate(['/Main_Dashboard/options']);
      } else if (user === 'Profesor') {
        this.router.navigate(['/Main_Dashboard/options']);
      } else if (user === 'Administrador') {
        this.router.navigate(['/Main_Dashboard/options']);
      }

    } else {
      this.router.navigate(['/main']);
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const target = event.target as HTMLElement;
    const menu = document.querySelector('.user-icon') as HTMLElement;
    const profileMenu = document.querySelector('.profile-menu') as HTMLElement;

    if (menu && profileMenu && !menu.contains(target) && !profileMenu.contains(target)) {
      this.closeMenu();
    }
  }
  
}
