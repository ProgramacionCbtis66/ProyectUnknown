import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Core/service/auth.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import Notiflix from 'notiflix';
import { SesionService } from 'src/app/Core/service/sesion.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    protected sesion: SesionService
  ) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  navigateToQR(): void {
    this.router.navigate(['/QRPage']);
  }

  async onLogin(): Promise<void> {
    this.isLoading = true;
    const userData = { correo_institucional: this.username, password: this.password };

    try {
      const response = await firstValueFrom(this.authService.login(userData));
      this.storeSessionData(response);
      this.handleLoginSuccess();
    } catch (error) {
      this.handleError(error);
    } finally {
      this.isLoading = false;
    }
  }

  private storeSessionData(response: any): void {
    localStorage.setItem("adae", response.token);
    localStorage.setItem("fotoPerfil", response.foto);
    this.sesion._foto = response.foto;

    const decodedToken = this.authService.decodeToken();
    this.sesion._usuario = decodedToken.nombre;
    this.sesion._apellido = decodedToken.apellido;
    this.sesion._rol = decodedToken.rol;

    if (decodedToken.rol === 'Alumno' && decodedToken.alumno) {
      const alumno = decodedToken.alumno;
      this.sesion._numeroControl = alumno.numero_control;
      this.sesion._especialidad = alumno.especialidad;
      this.sesion._semestre = alumno.semestre;
      this.sesion._turno = alumno.turno;
      this.sesion._curp = alumno.curp;
      this.sesion._grupo = alumno.grupo;
    }
  }

  private handleLoginSuccess(): void {
    const decodedToken = this.authService.decodeToken();
    const isBirthday = this.checkIfBirthday(decodedToken.fecha_nac);
    
    this.showWelcomeMessage(isBirthday);
    this.redirectBasedOnRole(decodedToken.rol);
  }

  private checkIfBirthday(birthDateStr: string): boolean {
    const today = new Date();
    const birthDate = new Date(birthDateStr);
    return today.getDate() === birthDate.getUTCDate() && today.getMonth() === birthDate.getUTCMonth();
  }

  private showWelcomeMessage(isBirthday: boolean): void {
    const message = isBirthday ? `Feliz Cumpleaños ${this.sesion._usuario}` : `Bienvenido ${this.sesion._usuario}`;
    Notiflix.Notify.success(message);
  }

  private redirectBasedOnRole(role: string): void {
    const validRoles = ['Administrador', 'Alumno', 'Profesor'];
    const route = validRoles.includes(role) ? 'Main_Dashboard' : 'Main_Dashboard';
    this.router.navigate([route]);
  }

  private handleError(error: any): void {
    switch (error.status) {
      case 404:
        this.errorMessage = 'Correo no encontrado';
        break;
      case 401:
        this.errorMessage = 'Contraseña incorrecta';
        break;
      default:
        this.errorMessage = 'Servidor no responde';
    }
    Notiflix.Notify.failure(this.errorMessage);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}