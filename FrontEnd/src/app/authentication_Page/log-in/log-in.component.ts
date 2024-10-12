import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Core/service/auth.service';
import { Router } from '@angular/router'; // Importa el servicio de Router
import { firstValueFrom } from 'rxjs';
import Notiflix from 'notiflix';
import { SesionService } from 'src/app/Core/service/sesion.service';

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
    private router: Router,
    protected sesion: SesionService
  ) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
   }

  navigateToQR(): void {
    this.router.navigate(['/QRPage']); // ruta para el iniciar sesion con
  }

  async onLogin(): Promise<void> {
    this.isLoading = true; // Iniciar carga
    const userData = { correo_institucional: this.username, password: this.password };
    try {
      const response = await firstValueFrom(this.authService.login(userData));
      localStorage.setItem("adae", response.token);
      this.sesion._foto = response.foto;
      const decodedToken = this.authService.decodifica();
      this.sesion._usuario = decodedToken.nombre;
      this.sesion._rol = decodedToken.rol;
      switch (decodedToken.rol) {
        case 'Administrador':
          console.error('Nombre del Usuario:', this.sesion._usuario);
          Notiflix.Notify.success('Bienvenido ' + this.sesion._usuario);
          this.router.navigate(['/Administrativos_Dashboard']);

          break;
        case 'Alumno':
          console.error('Nombre del Usuario:', this.sesion._usuario);
          Notiflix.Notify.success('Bienvenido ' + this.sesion._usuario);
          this.router.navigate(['/Alumnos_Dashboard']);
          break;
        case 'Profesor':
          console.error('Nombre del Usuario:', this.sesion._usuario);
          Notiflix.Notify.success('Bienvenido ' + this.sesion._usuario);
          this.router.navigate(['/Profesores_Dashboard']);
          break;
        default:
          this.router.navigate(['/Main_Dashboard']);
          break;
      }
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      this.handleError(error);
    } finally {
      this.isLoading = false; // Finalizar carga
    }
  }

  private handleError(error: any): void {
    if (error.status === 404) {
      this.errorMessage = 'Correo no encontrado';
      Notiflix.Notify.failure('Correo no encontrado');
    } else if (error.status === 401) {
      this.errorMessage = 'Contraseña incorrecta';
      Notiflix.Notify.failure('Contraseña incorrecta');
    } else {
      this.errorMessage = 'Servidor no responde';
      Notiflix.Notify.failure('Error al iniciar sesión. Servidor no responde.');
    }
  }
}
