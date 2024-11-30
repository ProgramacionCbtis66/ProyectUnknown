import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClasesService {
  private baseUrl = environment.HTTPS;

  constructor(private http: HttpClient) {}

  // Obtener todas las clases
  obtenerClases(): Observable<any> {
    return this.http.get(`${this.baseUrl}/class/ListClases`);
  }

  // Obtener clases por alumno
  obtenerClasesPorAlumno(id_alumno: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/class/ListClasesByAlumno/${id_alumno}`);
  }

  // Crear una nueva clase
  crearClase(clase: { nombre_clase: string; id_profesor: number }): Observable<any> {
    return this.http.post(`${this.baseUrl}/class/crearClase`, clase);
  }

  // Agregar una tarea a una clase
  agregarTarea(id_clase: number, descripcion_tarea: string): Observable<any> {
    const payload = { id_clase, descripcion_tarea };
    return this.http.post(`${this.baseUrl}/class/agregarTarea`, payload);
  }

  // Asociar alumnos a una clase
  asociarAlumnosAClase(id_clase: number, ids_alumnos: number[]): Observable<any> {
    const payload = { id_clase, ids_alumnos };
    return this.http.post(`${this.baseUrl}/class/asociarAlumnosAClase`, payload);
  }

  // Obtener tareas pendientes de un alumno
  obtenerTareasPendientes(id_alumno: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/class/obtenerTareasPendientes/${id_alumno}`);
  }

  // Actualizar el estado y calificación de una tarea
  actualizarEstadoYCalificacion(
    id_tarea: number,
    estado: string,
    calificacion: number
  ): Observable<any> {
    const payload = { id_tarea, estado, calificacion };
    return this.http.put(`${this.baseUrl}/class/actualizarEstadoYCalificacion`, payload);
  }

  // Eliminar una clase por su ID
  eliminarClase(id_clase: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/class/eliminarClase/${id_clase}`);
  }
}
