import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-user-notifications-page',
  templateUrl: './user-notifications-page.component.html',
  styleUrls: ['./user-notifications-page.component.css']
})

export class UserNotificationsPageComponent implements OnInit {
  activeMenu: string = 'perfil'; // Elemento activo por defecto
  sidebarActive: boolean = true; // Mostrar el sidebar por defecto en modo PC

  constructor() {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    // Corregido con bind para mantener el contexto de this
    window.addEventListener('resize', this.handleResize.bind(this));
    this.handleResize(); // Asegurarse de que el sidebar está gestionado según el tamaño de la pantalla
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
