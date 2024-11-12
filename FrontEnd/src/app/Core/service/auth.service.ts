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

  private readonly baseApiUrl = environment.HTTPS;
  private readonly authUrl = environment.autorization;
  public estatus = true;

  // BehaviorSubject para emitir el estado de restauración de la sesión
  private sessionRestoredSource = new BehaviorSubject<boolean>(false);
  public sessionRestored$ = this.sessionRestoredSource.asObservable();

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private toastr: ToastrService,
    private sesionService: SesionService
  ) { 
    this.restoreSession();
  }

  public logout(): void {
    localStorage.removeItem("adae");
    this.clearSession();
  }

  public restoreSession(): void {
    const token = localStorage.getItem('adae');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.decodeToken();
      this.setSessionData(decodedToken);
      this.sessionRestoredSource.next(true);  // Emite 'true' indicando que la sesión ha sido restaurada
    } else {
      this.sessionRestoredSource.next(false); // Emite 'false' si no se restaura la sesión
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
    console.error('Error: ', error);
    this.toastr.error('Ocurrió un error en el servidor', 'Error');
    return throwError(() => error);
  }

  public login(user: any): Observable<any> {
    return this.http.post(`${this.baseApiUrl}/usr/login/`, user)
      .pipe(catchError(this.handleError.bind(this)));
  }

  public isAuth(): boolean {
    const token = localStorage.getItem("adae");
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    } else {
      this.toastr.error('Su sesión ha expirado...', 'Error');
      return false;
    }
  }

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
  }
}
