import { Component, OnInit, HostListener } from '@angular/core';
import { SesionService } from 'src/app/Core/service/sesion.service';

@Component({
  selector: 'app-user-segurity',
  templateUrl: './user-segurity.component.html',
  styleUrls: ['./user-segurity.component.css']
})
export class UserSegurityComponent implements OnInit {
   activeMenu: string = 'perfil'; // Elemento activo por defecto
  sidebarActive: boolean = true; // Mostrar el sidebar por defecto en modo PC

  constructor(protected sesion: SesionService) {}

  ngOnInit(): void {
    window.addEventListener('resize', this.handleResize.bind(this));
    this.handleResize();
    window.scrollTo(0, 0);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  setActiveMenu(menu: string): void {
    this.activeMenu = menu;
  }

  toggleSidebar(): void {
    if (window.innerWidth <= 768) {
      this.sidebarActive = !this.sidebarActive; // Alternar el sidebar en móviles
    }
  }

  handleResize(): void {
    if (window.innerWidth > 768) {
      this.sidebarActive = true; // Mostrar sidebar en pantallas grandes
    } else {
      this.sidebarActive = false; // Ocultar sidebar en pantallas pequeñas
    }
  }

  // Detectar clics fuera del sidebar en móviles
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement;
    const isClickInsideSidebar = clickedElement.closest('.sidebar');
    const isMenuBtn = clickedElement.closest('#menuBtn');
    
    if (!isClickInsideSidebar && !isMenuBtn && window.innerWidth <= 768) {
      this.sidebarActive = false; // Ocultar el sidebar
    }
  }
}
