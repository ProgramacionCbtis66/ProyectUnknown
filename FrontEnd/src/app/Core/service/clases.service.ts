import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClasesService {
  private apiBaseUrl = 'http://localhost:4000/apiAdae/class'; // Cambia por tu base URL real

  constructor(private http: HttpClient) {}

  obtenerClasesConTareas(): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/ListClases`);
  }

  crearClase(nombre_clase: string, id_profesor: number): Observable<any> {
    const payload = { nombre_clase, id_profesor };
    return this.http.post(`${this.apiBaseUrl}/crearClase`, payload);
  }
}
