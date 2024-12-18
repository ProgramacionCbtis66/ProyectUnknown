import { Component, OnInit, HostListener } from '@angular/core';
import { SesionService } from '../../Core/service/sesion.service';


@Component({
  selector: 'app-my-profile-user',
  templateUrl: './my-profile-user.component.html',
  styleUrls: ['./my-profile-user.component.css']
})
export class MyProfileUserComponent implements OnInit {

  // Definimos la propiedad showEmoji para controlar la visibilidad de la carita
  showEmoji = false;
  isCopied = false;
  // Función para mostrar el emoji cuando pasa el mouse
  toggleEmoji(show: boolean) {
    this.showEmoji = show;
  }

  copyToClipboard() {
    const textToCopy = this.sesion._numeroControl;
    navigator.clipboard.writeText(textToCopy).then(() => {
      this.isCopied = true;
      setTimeout(() => this.isCopied = false, 1000); // Duración del efecto de copiado
    }).catch(err => {
      console.error('Error al copiar al portapapeles:', err);
    });
  }

  activeMenu: string = 'perfil'; // Elemento activo por defecto
  sidebarActive: boolean = true; // Mostrar el sidebar por defecto en modo PC

  constructor(public sesion: SesionService) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    window.addEventListener('resize', this.handleResize.bind(this));
    this.handleResize();
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
