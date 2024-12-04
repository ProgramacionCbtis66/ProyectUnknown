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
      localStorage.setItem("fotoPerfil", response.foto);
      this.sesion._foto = response.foto;

      const decodedToken = this.authService.decodifica();

      console.log(decodedToken);
      

      this.sesion._usuario = decodedToken.nombre;
      this.sesion._apellido = decodedToken.apellido;
      this.sesion._rol = decodedToken.rol;

      // Establecer datos del alumno si el rol es "Alumno" y el token contiene datos del alumno
      if (decodedToken.rol === 'Alumno' && decodedToken.alumno) {
        const alumno = decodedToken.alumno; // Accede a los datos del alumno dentro del token
        this.sesion._numeroControl = alumno.numero_control;
        this.sesion._especialidad = alumno.especialidad;
        this.sesion._semestre = alumno.semestre;
        this.sesion._turno = alumno.turno;
        this.sesion._curp = alumno.curp;
        this.sesion._grupo = alumno.grupo;
        this.sesion._id_alumno = alumno.id_alumno;
      }
      if (decodedToken.rol === 'Profesor' && decodedToken.profesor) {
        const profesor = decodedToken.profesor; // Accede a los datos del alumno dentro del token
        this.sesion._id_profesor = profesor.id_profesor;
      }

      // Comparar la fecha de nacimiento con la fecha actual para la felicitación
      const today = new Date();
      const birthDate = new Date(decodedToken.fecha_nac); // La fecha de nacimiento del token

      const isBirthday = (today.getDate() === birthDate.getUTCDate() &&
        today.getMonth() === birthDate.getUTCMonth());

      // Redirige según el rol del usuario
      switch (decodedToken.rol) {
        case 'Administrador':
          if (isBirthday) {
            Notiflix.Notify.success('Feliz Cumpleaños ' + this.sesion._usuario);
          } else {
            Notiflix.Notify.success('Bienvenido ' + this.sesion._usuario);
          }
          this.router.navigate(['Main_Dashboard']);
          break;
        case 'Alumno':
          if (isBirthday) {
            Notiflix.Notify.success('Feliz Cumpleaños ' + this.sesion._usuario);
          } else {
            Notiflix.Notify.success('Bienvenido ' + this.sesion._usuario);
          } this.router.navigate(['Main_Dashboard']);
          break;
        case 'Profesor':
          if (isBirthday) {
            Notiflix.Notify.success('Feliz Cumpleaños ' + this.sesion._usuario);
          } else {
            Notiflix.Notify.success('Bienvenido ' + this.sesion._usuario);
          } this.router.navigate(['Main_Dashboard']);
          break;
        default:
          this.router.navigate(['Main_Dashboard']);
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

  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
}

