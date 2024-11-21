import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  rol: string;
  foto?: string;
  correo: string;
  detalles?: {
    numero_control: string;
    especialidad: string;
    semestre: number;
    turno: string;
    grupo: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private http: HttpClient,
  ) { }

  updateUsuario(usuario: any): Observable<any> {
    const url = `http://localhost:4000/apiAdae/usr/actualizarUsr/${usuario.id}`;
    return this.http.put(url, usuario); // Enviar los datos planos
  }

  deleteUsuario(id: number) {
    return this.http.delete(`http://localhost:4000/apiAdae/usr/eliminarUsr/${id}`);
  }
  
  
}
