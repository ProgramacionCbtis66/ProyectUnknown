import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import decode from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { SesionService } from 'src/app/Core/service/sesion.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private ruta = environment.HTTPS;
  private usr = environment.autorization;
  public estatus: boolean = true;

  // Observable para emitir cuando la sesión es restaurada
  private sessionRestoredSubject = new BehaviorSubject<boolean>(false);
  public sessionRestored$ = this.sessionRestoredSubject.asObservable();

  constructor(
    private http: HttpClient,
    private jwt: JwtHelperService,
    private toastr: ToastrService,
    protected sesion: SesionService
  ) { 
    this.restaurarSesion();
  }

  // Método para cerrar sesión
  public cerrarSesion(): void {
    localStorage.removeItem("adae");
    this.limpiarSesion();
    
  }

  // Método para restaurar sesión
  restaurarSesion(): void {
    const token = localStorage.getItem('adae');
    if (token && !this.jwt.isTokenExpired(token)) {
      const decodedToken = this.decodifica();
      this.sesion._usuario = decodedToken.nombre;
      this.sesion._apellido = decodedToken.apellido;
      this.sesion._foto = localStorage.getItem('fotoPerfil') || "Sin Foto Actual";
      this.sesion._rol = decodedToken.rol;

      if (decodedToken.alumno) {
        const alumno = decodedToken.alumno;
        this.sesion._numeroControl = alumno.numero_control;
        this.sesion._especialidad = alumno.especialidad;
        this.sesion._semestre = alumno.semestre;
        this.sesion._turno = alumno.turno;
        this.sesion._curp = alumno.curp;
        this.sesion._grupo = alumno.grupo;
      }

      // Emitir que la sesión ha sido restaurada
      this.sessionRestoredSubject.next(true);
    }
  }

  // Método para limpiar la sesión completamente
  limpiarSesion(): void {
    this.sesion._usuario = "Sin Usuario Actual";
    this.sesion._apellido = "Sin Apellido Actual";
    this.sesion._rol = "Sin Rol Actual";
    this.sesion._foto = "Sin Foto Actual";
    this.sesion._numeroControl = "No disponible";
    this.sesion._especialidad = "No disponible";
    this.sesion._semestre = null;
    this.sesion._turno = "No disponible";
    this.sesion._curp = "No disponible";
    this.sesion._grupo = "No disponible";
  }

  // Método para manejar errores en solicitudes HTTP
  private handleError(error: HttpErrorResponse) {
    console.error('Error: ', error);
    const status = error.status;
    console.error(`Status ${status}`);
    return throwError(() => error);
  }

  // Método para iniciar sesión
  public login(user: any): Observable<any> {
    return this.http.post('http://localhost:4000/apiAdae/usr/login/', user)
      .pipe(catchError(this.handleError.bind(this)));
  }

  // Método para verificar autenticación
  public isAuth(): boolean {
    const token = localStorage.getItem("adae");
    if (token && !this.jwt.isTokenExpired(token)) {
      return true;
    } else {
      this.toastr.error('Su sesión ha expirado...', 'Error');
      return false;
    }
  }

  // Método para decodificar el token
  public decodifica(): any {
    const token = localStorage.getItem("adae");
    if (token) {
      return decode(token);
    }
    return null;
  }

  // Método para obtener la lista de usuarios
  public getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.ruta}/usr/listUsr/`).pipe(
      catchError(this.handleError.bind(this))
    );
  }
}
