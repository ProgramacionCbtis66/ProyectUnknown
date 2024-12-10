import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrabajosService {
  private apiUrl = `${environment.HTTPS}`; // Ajustado para usar tu configuración existente

  constructor(private http: HttpClient) {}

  // Obtener una tarea específica
  obtenerTarea(idTarea: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/tareas/${idTarea}`, environment.autorization);
  }

  // Obtener todas las entregas de una tarea (vista profesor)
  obtenerEntregas(idTarea: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/tareas/${idTarea}/entregas`, environment.autorization);
  }

  // Obtener la entrega de un alumno específico
  obtenerEntregaAlumno(idTarea: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/tareas/${idTarea}/mi-entrega`, environment.autorization);
  }

  // Calificar una entrega
  calificarEntrega(idEntrega: number, calificacion: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/entregas/${idEntrega}/calificar`, {
      calificacion: calificacion
    }, environment.autorization);
  }

  // Subir una entrega
  subirEntrega(idTarea: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/tareas/${idTarea}/entregar`, formData, environment.autorization);
  }

  // Descargar archivo de una entrega
  descargarArchivo(idEntrega: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/entregas/${idEntrega}/descargar`, {
      ...environment.autorization,
      responseType: 'blob'
    });
  }

  // Eliminar una entrega
  eliminarEntrega(idEntrega: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/entregas/${idEntrega}`, environment.autorization);
  }

  // Obtener todas las tareas de una clase
  obtenerTareasClase(idClase: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/clases/${idClase}/tareas`, environment.autorization);
  }

  // Crear una nueva tarea
  crearTarea(idClase: number, tarea: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/clases/${idClase}/tareas`, tarea, environment.autorization);
  }

  // Editar una tarea existente
  editarTarea(idTarea: number, tarea: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/tareas/${idTarea}`, tarea, environment.autorization);
  }

  // Eliminar una tarea
  eliminarTarea(idTarea: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tareas/${idTarea}`, environment.autorization);
  }
}