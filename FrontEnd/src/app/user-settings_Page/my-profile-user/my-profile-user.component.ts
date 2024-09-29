import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-profile-user',
  templateUrl: './my-profile-user.component.html',
  styleUrls: ['./my-profile-user.component.css']
})
export class MyProfileUserComponent implements OnInit {
  activeMenu: string = 'perfil'; // Establece el elemento activo por defecto

  constructor() { }

  ngOnInit(): void {
  }

  // Método para cambiar el elemento activo
  setActiveMenu(menu: string): void {
    this.activeMenu = menu;
  }
}
