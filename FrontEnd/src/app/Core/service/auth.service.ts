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
  detalle: any;
  grupo: string;
  nombre: string;
  apellido: string;
  rol: string;
  foto?: string;
  numero_control: string; // Verifica este campo en la respuesta
  especialidad: string;
  semestre: number; // Asegúrate de que sea número
  turno: string; // Asegúrate de que sea 'Matutino' o 'Vespertino'
  correo: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private ruta = environment.HTTPS; // URL base del servidor
  private usr = environment.autorization; // URL de autorización
  public estatus: boolean = true; // Estado de autenticación

  constructor(
    private http: HttpClient,
    private jwt: JwtHelperService,
    private toastr: ToastrService,
    protected sesion: SesionService

  ) { 
    this.restaurarSesion(); // Restauramos la sesión al cargar el servicio
  }

  // Cierra la sesion del usuario
  public cerrarSesion(): void {
    localStorage.removeItem("adae"); // Elimina el token
    this.limpiarSesion(); // Limpia los datos de la sesión en memoria
    this.toastr.info('Sesión cerrada con éxito', 'Info');
  }

  restaurarSesion(): void {
    const token = localStorage.getItem('adae');
    if (token && !this.jwt.isTokenExpired(token)) {
        const decodedToken = this.decodifica();
        this.sesion._usuario = decodedToken.nombre;
        this.sesion._apellido = decodedToken.apellido;
        this.sesion._foto = localStorage.getItem('fotoPerfil') || "Sin Foto Actual";
        this.sesion._rol = decodedToken.rol;

        // Establecer datos del alumno si existen en el token
        if (decodedToken.alumno) {
            const alumno = decodedToken.alumno; // Accede a los datos del alumno dentro del token
            this.sesion._numeroControl = alumno.numero_control;
            this.sesion._especialidad = alumno.especialidad;
            this.sesion._semestre = alumno.semestre;
            this.sesion._turno = alumno.turno;
            this.sesion._curp = alumno.curp;
            this.sesion._grupo = alumno.grupo;
        }
    }
}


  // Método para limpiar la sesión al cerrar sesión
  limpiarSesion(): void {
    this.sesion._usuario = "Sin Usuario Actual";
    this.sesion._rol = "Sin Rol Actual";
    this.sesion._foto = "Sin Foto Actual";
  }

  // Manejo de errores para las solicitudes HTTP
  private handleError(error: HttpErrorResponse) {
    console.error('Error: ', error);
    const status = error.status;
    console.error(`Status ${status}`);
    return throwError(() => error);
  }

  // Método para iniciar sesión
  public login(user: any): Observable<any> {
    return this.http.post('http://localhost:4000/apiAdae/usr/login/', user)
      .pipe(catchError(this.handleError.bind(this))); // Manejo de errores
  }

  // Verifica si el usuario está autenticado
  public isAuth(): boolean {
    const token = localStorage.getItem("adae");
    if (token && !this.jwt.isTokenExpired(token)) {
      return true;
    } else {
      this.toastr.error('Su sesión ha expirado...', 'Error');
      return false;
    }
  }

  // Decodifica el token
  public decodifica(): any {
    const token = localStorage.getItem("adae");
    if (token) {
      return decode(token); // Decodifica el token si no es nulo
    }
    return null; // Retorna null si no hay token
  }

  // Continúa la sesión aumentando la expiración del token
  public continuar(): void {
    let tokedecode = this.decodifica();
    if (tokedecode) {
      tokedecode.exp += 1800; // Aumenta el tiempo de expiración
      let tokecode = this.jwt.decodeToken(tokedecode);
      localStorage.setItem("adae", tokecode);
    }
  }

  // Verifica si el token ha expirado
  public tokeExpired(): boolean {
    const tokenDecode = this.decodifica();
    if (!tokenDecode) {
      return true; // Si no hay token, considera que ha expirado
    }
    const tiempo = (tokenDecode.exp - Date.now() / 1000);
    if (tiempo < 0) {
      localStorage.clear(); // Limpia el localStorage si ha expirado
      return true;
    }
    return false;
  }

  //metodo para la lista jeje luego lo muevo para organizarlo bien

  // Nuevo método para obtener usuarios
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>("http://localhost:4000/apiAdae/usr/listUsr?rol=Alumno");
  }
  

  updateAlumno(id: number, data: any): Observable<any> {
    return this.http.put("http://localhost:4000/apiAdae/usr/ActualizarAlumno", data);
  }
}
