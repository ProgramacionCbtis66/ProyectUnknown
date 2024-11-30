import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

interface Usuario {
  id?: number;
  correo_institucional: string;
  nombre: string;
  apellido: string;
  rol: string;
  password: string;
  numero_control?: string;
  especialidad?: string;
  semestre?: number;
  grupo?: string;
  turno?: string;
  curp?: string;
  departamento?: string;
  telefono?: string;
  foto?: string;
}

interface GetUsuario {
  id: number;
  id_profesor: number;
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
export class UsuarioService {
  private apiBaseUrl = environment.HTTPS; // Base URL desde environment.ts

  constructor(private http: HttpClient) {}

  registrarUsuario(usuario: Usuario): Observable<any> {
    const url = `${this.apiBaseUrl}/usr/registrarUsr`;
    return this.http.post(url, usuario);
  }

  updateUsuario(usuario: any): Observable<any> {
    const url = `${this.apiBaseUrl}/usr/actualizarUsr/${usuario.id}`;
    return this.http.put(url, usuario);
  }

  deleteUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiBaseUrl}/usr/eliminarUsr/${id}`);
  }

  getAlumnos(): Observable<GetUsuario[]> {
    return this.http.get<GetUsuario[]>(`${this.apiBaseUrl}/usr/listUsr?rol=Alumno`);
  }

  getProfesores(): Observable<GetUsuario[]> {
    return this.http.get<GetUsuario[]>(`${this.apiBaseUrl}/usr/listUsr?rol=Profesor`);
  }
}
