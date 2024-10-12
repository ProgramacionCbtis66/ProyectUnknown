import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importa el Router

@Component({
  selector: 'app-administrativos',
  templateUrl: './administrativos.component.html',
  styleUrls: ['./administrativos.component.css']
})
export class AdministrativosComponent implements OnInit {

  constructor(private router: Router) { } // Mantén el Router en el constructor

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  // Método para navegar al perfil
  navigateToProfile(): void {
    this.router.navigate(['/Profile_User']); // Asegúrate de que '/profile' sea la ruta correcta
  }
}
