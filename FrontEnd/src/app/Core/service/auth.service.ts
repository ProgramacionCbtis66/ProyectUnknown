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

<<<<<<< HEAD
  private readonly baseApiUrl = environment.HTTPS;
  private readonly authUrl = environment.autorization;
  public estatus = true;
=======
  private ruta = environment.HTTPS;
  private usr = environment.autorization;
  public estatus: boolean = true;

  // Observable para emitir cuando la sesión es restaurada
  private sessionRestoredSubject = new BehaviorSubject<boolean>(false);
  public sessionRestored$ = this.sessionRestoredSubject.asObservable();
>>>>>>> 6012a83e695b27c9f8a5d0866737a6ecdea71c79

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private toastr: ToastrService,
<<<<<<< HEAD
    private sesionService: SesionService
  ) { 
    this.restoreSession();
  }

  public logout(): void {
    localStorage.removeItem("adae");
    this.clearSession();
    this.toastr.info('Sesión cerrada con éxito', 'Info');
  }

  public restoreSession(): void {
    const token = localStorage.getItem('adae');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.decodeToken();
      this.setSessionData(decodedToken);
    }
  }

  private setSessionData(decodedToken: any): void {
    this.sesionService._usuario = decodedToken.nombre;
    this.sesionService._apellido = decodedToken.apellido;
    this.sesionService._foto = localStorage.getItem('fotoPerfil') || "Sin Foto Actual";
    this.sesionService._rol = decodedToken.rol;

    if (decodedToken.alumno) {
      const { numero_control, especialidad, semestre, turno, curp, grupo } = decodedToken.alumno;
      Object.assign(this.sesionService, { _numeroControl: numero_control, _especialidad: especialidad, _semestre: semestre, _turno: turno, _curp: curp, _grupo: grupo });
    }
  }

  private clearSession(): void {
    Object.assign(this.sesionService, { _usuario: "No disponible", _rol: "No disponible", _foto: "No disponible" });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
=======
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
>>>>>>> 6012a83e695b27c9f8a5d0866737a6ecdea71c79
    console.error('Error: ', error);
    this.toastr.error('Ocurrió un error en el servidor', 'Error');
    return throwError(() => error);
  }

  public login(user: any): Observable<any> {
<<<<<<< HEAD
    return this.http.post(`${this.baseApiUrl}/usr/login/`, user)
      .pipe(catchError(this.handleError.bind(this)));
  }

=======
    return this.http.post('http://localhost:4000/apiAdae/usr/login/', user)
      .pipe(catchError(this.handleError.bind(this)));
  }

  // Método para verificar autenticación
>>>>>>> 6012a83e695b27c9f8a5d0866737a6ecdea71c79
  public isAuth(): boolean {
    const token = localStorage.getItem("adae");
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    } else {
      this.toastr.error('Su sesión ha expirado...', 'Error');
      return false;
    }
  }

<<<<<<< HEAD
  public decodeToken(): any {
    const token = localStorage.getItem("adae");
    return token ? decode(token) : null;
  }

  public extendSession(): void {
    const tokenDecoded = this.decodeToken();
    if (tokenDecoded) {
      tokenDecoded.exp += 1800;
      const extendedToken = this.jwtHelper.decodeToken(tokenDecoded);
      localStorage.setItem("adae", extendedToken);
    }
  }

  public isTokenExpired(): boolean {
    const tokenDecoded = this.decodeToken();
    if (!tokenDecoded || (tokenDecoded.exp - Date.now() / 1000) < 0) {
      localStorage.clear();
      return true;
    }
    return false;
  }

  public getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/usr/listUsr/`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  public registerAlum(data: any): Observable<any> {
    return this.http.post(`${this.baseApiUrl}/usr/RegistrarAlumno`, data)
      .pipe(catchError(this.handleError.bind(this)));
  }
  

  public updateStudent(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseApiUrl}/usr/ActualizarAlumno`, data)
      .pipe(catchError(this.handleError.bind(this)));
=======
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
>>>>>>> 6012a83e695b27c9f8a5d0866737a6ecdea71c79
  }
}
