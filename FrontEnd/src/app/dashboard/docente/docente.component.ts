import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importa el Router


@Component({
  selector: 'app-docente',
  templateUrl: './docente.component.html',
  styleUrls: ['./docente.component.css']
})
export class DocenteComponent implements OnInit {

  constructor(private router: Router) { } // Mantén el Router en el constructor

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  // Método para navegar al perfil
  navigateToProfile(): void {
    this.router.navigate(['/Profile_User']); // Asegúrate de que '/profile' sea la ruta correcta
  }
}
