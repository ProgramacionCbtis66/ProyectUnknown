import { Component, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SesionService } from './Core/service/sesion.service';
import { Router } from '@angular/router';
import { AuthService } from '../app/Core/service/auth.service';

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
    this.titleService.setTitle(this.title);
    this.authService.restaurarSesion();
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.closeMenu();
    this.router.navigate(['/main']);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    document.body.classList.toggle('no-scroll', this.menuOpen);
  }

  closeMenu() {
    this.menuOpen = false;
    document.body.classList.remove('no-scroll');
  }

  redirigirAlDashboard() {
    if (this.sesion._rol !== 'No disponible') {
      const user = this.sesion._rol;

      if (user === 'Alumno' || user === 'Profesor' || user === 'Administrador') {
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

  private lastScrollPosition = 0;

  onScroll(event: any) {
    const currentScroll = event.target.scrollTop;
    
    if (currentScroll > this.lastScrollPosition) {
      document.documentElement.requestFullscreen()
        .catch((err) => console.log('Error al entrar en fullscreen:', err));
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen()
          .catch((err) => console.log('Error al salir de fullscreen:', err));
      }
    }
    
    this.lastScrollPosition = currentScroll;
  }
}