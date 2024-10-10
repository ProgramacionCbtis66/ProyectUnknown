import { Component, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SesionService } from './Core/service/sesion.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ADAE';
  menuOpen = false;
  isSwipeEnabled = false;
  
  constructor(private titleService: Title, protected sesion: SesionService) { 
    // Cambiar el título de la página
    this.titleService.setTitle(this.title);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    document.body.classList.toggle('no-scroll', this.menuOpen); // Deshabilitar scroll
  }

  closeMenu() {
    this.menuOpen = false;
    document.body.classList.remove('no-scroll'); // Habilita el scroll cuando se cierra el menú
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
