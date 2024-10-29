import { Component } from '@angular/core';
import { SesionService } from '../../../Core/service/sesion.service';

@Component({
  selector: 'app-servicios-menu',
  templateUrl: './servicios-menu.component.html',
  styleUrl: './servicios-menu.component.css'
})
export class ServiciosMenuComponent {
  constructor(protected sesion: SesionService) {
    window.scrollTo(0, 0);
  }
}
