import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import decode from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { SesionService } from 'src/app/Core/service/sesion.service';

interface Usuario {
  id: number;
  detalle: any;
  grupo: string;
  nombre: string;
  apellido: string;
  rol: string;
  foto?: string;
  numero_control: string;
  especialidad: string;
  semestre: number;
  turno: string;
  correo_institucional: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private ruta = environment.HTTPS;
  private usr = environment.autorization;
  public estatus: boolean = true;

  constructor(
    private http: HttpClient,
    private jwt: JwtHelperService,
    private toastr: ToastrService,
    protected sesion: SesionService
  ) { 
    this.restaurarSesion();
  }

  public cerrarSesion(): void {
    localStorage.removeItem("adae");
    localStorage.removeItem("fotoPerfil");
    this.limpiarSesion();
    this.toastr.info('Sesión cerrada con éxito', 'Info');
  }

  limpiarSesion(): void {
    this.sesion._usuario = "No disponible";
    this.sesion._rol = "No disponible";
    this.sesion._foto = "";
    this.sesion._apellido = "";
    this.sesion._numeroControl = "";
    this.sesion._especialidad = "";
    this.sesion._semestre = null;
    this.sesion._turno = "";
    this.sesion._curp = "";
    this.sesion._grupo = "";
    this.sesion._id_alumno = null;
    this.sesion._id_profesor = null;
    this.sesion._departamento = null;
    this.sesion._especialidad_Prof = null;
    this.sesion._telefono = null;
    this.sesion._id = null;
  }

  restaurarSesion(): void {
    const token = localStorage.getItem('adae');
    if (token && !this.jwt.isTokenExpired(token)) {
        const decodedToken = this.decodifica();
        if (decodedToken) {
            this.sesion._usuario = decodedToken.nombre;
            this.sesion._apellido = decodedToken.apellido;
            this.sesion._foto = localStorage.getItem('fotoPerfil') || "";
            this.sesion._rol = decodedToken.rol;
            this.sesion._id = decodedToken.id;

            if (decodedToken.alumno) {
                const alumno = decodedToken.alumno;
                this.sesion._numeroControl = alumno.numero_control;
                this.sesion._especialidad = alumno.especialidad;
                this.sesion._semestre = alumno.semestre;
                this.sesion._turno = alumno.turno;
                this.sesion._curp = alumno.curp;
                this.sesion._grupo = alumno.grupo;
                this.sesion._id_alumno = alumno.id_alumno;
            }

            if (decodedToken.profesor) {
                const profesor = decodedToken.profesor;
                this.sesion._id_profesor = profesor.id_profesor;
                this.sesion._departamento = profesor.departamento;
                this.sesion._especialidad_Prof = profesor.especialidad_Prof;
                this.sesion._telefono = profesor.telefono;
            }
        }
    } else {
        this.limpiarSesion();
    }
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error: ', error);
    const status = error.status;
    console.error(`Status ${status}`);
    return throwError(() => error);
  }

  public login(user: any): Observable<any> {
    return this.http.post(`${this.ruta}/usr/login/`, user)
      .pipe(catchError(this.handleError.bind(this)));
  }

  public isAuth(): boolean {
    const token = localStorage.getItem("adae");
    if (token && !this.jwt.isTokenExpired(token)) {
      return true;
    } else {
      this.toastr.error('Su sesión ha expirado...', 'Error');
      return false;
    }
  }

  public decodifica(): any {
    const token = localStorage.getItem("adae");
    if (token) {
      return decode(token);
    }
    return null;
  }

  public continuar(): void {
    let tokedecode = this.decodifica();
    if (tokedecode) {
      tokedecode.exp += 1800;
      let tokecode = this.jwt.decodeToken(tokedecode);
      localStorage.setItem("adae", tokecode);
    }
  }

  public tokeExpired(): boolean {
    const tokenDecode = this.decodifica();
    if (!tokenDecode) {
      return true;
    }
    const tiempo = (tokenDecode.exp - Date.now() / 1000);
    if (tiempo < 0) {
      localStorage.clear();
      return true;
    }
    return false;
  }
}
