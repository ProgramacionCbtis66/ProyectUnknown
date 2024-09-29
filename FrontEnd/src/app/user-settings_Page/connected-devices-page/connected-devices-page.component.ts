import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Asegúrate de importar RouterModule si usas navegación

@Component({
  selector: 'app-connected-devices-page',
  standalone: true,
  imports: [RouterModule], // Agrega RouterModule aquí si necesitas navegación
  templateUrl: './connected-devices-page.component.html',
  styleUrls: ['./connected-devices-page.component.css'] // Corrige styleUrl a styleUrls
})
export class ConnectedDevicesPageComponent {
  constructor() { }

  ngOnInit(): void {
    // Lógica de inicialización si es necesario
  }
}
