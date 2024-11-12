import { Component } from '@angular/core';

@Component({
  selector: 'app-drop-menu',
  templateUrl: './drop-menu.component.html',
  styleUrls: ['./drop-menu.component.css']
})
export class DropMenuComponent {
  isDropdownVisible = false;
  options = ['Opción 1', 'Opción 2', 'Opción 3'];

  toggleDropdown(): void {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  selectOption(option: string): void {
    console.log('Opción seleccionada:', option);
    this.isDropdownVisible = false; // Ocultar el menú después de seleccionar
  }
}
