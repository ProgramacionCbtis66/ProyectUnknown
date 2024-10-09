import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Core/service/auth.service';
import { Router } from '@angular/router'; // Importa el servicio de Router

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false; // Nueva propiedad para el estado de carga

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void { }

  onLogin(): void {
    this.isLoading = true; // Iniciar carga
    const userData = { correo_institucional: this.username, password: this.password };

    this.authService.login(userData).subscribe(
      response => {
        console.log('Login exitoso:', response);
        localStorage.setItem("adae", response.token);
        const decodedToken = this.authService.decodifica();
        console.log('Rol del usuario:', decodedToken.rol);

        switch (decodedToken.rol) {
          case 'Administrador':
            this.router.navigate(['/Administrativos_Dashboard']);
            break;
          case 'Alumno':
            this.router.navigate(['/Alumnos_Dashboard']);
            break;
          case 'Profesor':
            this.router.navigate(['/Profesores_Dashboard']);
            break;
          default:
            this.router.navigate(['/Main_Dashboard']);
            break;
        }
      },
      error => {
        console.error('Error de inicio de sesión:', error);
        this.handleError(error);
      },
      () => {
        this.isLoading = false; // Finalizar carga
      }
    );
  }

  private handleError(error: any): void {
    if (error.status === 404) {
      this.errorMessage = 'Correo no encontrado';
    } else if (error.status === 401) {
      this.errorMessage = 'Contraseña incorrecta';
    } else {
      this.errorMessage = 'Error al iniciar sesión. Intente de nuevo.';
    }
  }
}
