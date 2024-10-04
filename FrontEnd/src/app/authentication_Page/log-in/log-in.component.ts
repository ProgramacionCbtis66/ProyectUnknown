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

  constructor(
    private authService: AuthService,
    private router: Router // Inyecta el Router para hacer la redirección
  ) { }

  ngOnInit(): void {}

  onLogin(): void {
    const userData = { usuario: this.username, password: this.password };
    
    // Llamada al servicio de autenticación
    this.authService.login(userData).subscribe(
      response => {
        console.log('Login exitoso:', response);

        // Guarda el token en localStorage si el login es exitoso
        localStorage.setItem("adae", response.token);

        // Redirigir a la ruta Main_Dashboard
        this.router.navigate(['/Main_Dashboard']);
      },
      error => {
        console.error('Error de inicio de sesión:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
        alert('Usuario o contraseña incorrectos');
      }
    );
  }
}
