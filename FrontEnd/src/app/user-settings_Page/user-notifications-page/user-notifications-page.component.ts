import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Asegúrate de importar RouterModule

@Component({
  selector: 'app-user-notifications-page',
  standalone: true,
  imports: [RouterModule], // Importa RouterModule aquí
  templateUrl: './user-notifications-page.component.html',
  styleUrls: ['./user-notifications-page.component.css'] // Corrige styleUrl a styleUrls
})
export class UserNotificationsPageComponent {
  constructor() { }

  ngOnInit(): void {
  }
}
