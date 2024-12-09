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
  // Respuesta: Array de objetos con las propiedades:
  // - id_clase: number
  // - nombre_clase: string
  // - id_profesor: number
  // - profesor_nombre: string
  // - tareas: Array de objetos con propiedades id_tarea, titulo, descripcion, fecha_asignacion, fecha_entrega
  obtenerClases(): Observable<any> {
    return this.http.get(`${this.baseUrl}/class/ListClases`);
  }

  // Obtener clases por alumno
  // Respuesta: Array de objetos con las propiedades:
  // - id_clase: number
  // - nombre_clase: string
  // - id_profesor: number
  // - profesor_nombre: string
  // - tareas: Array de objetos con propiedades id_tarea, titulo, descripcion, fecha_asignacion, fecha_entrega
  obtenerClasesPorAlumno(id_alumno: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/class/ListClasesByAlumno/${id_alumno}`);
  }

  // Obtener clases por profesor
  // Respuesta: Array de objetos con las propiedades:
  // - id_clase: number
  // - nombre_clase: string
  // - profesor_nombre: string
  // - tareas: Array de objetos con propiedades id_tarea, titulo, descripcion, fecha_asignacion, fecha_entrega
  obtenerClasesPorProfesor(id_profesor: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/class/ListClasesByProfesor/${id_profesor}`);
  }

  // Crear una nueva clase
  // Respuesta: Objeto con las propiedades:
  // - mensaje: string
  // - id_clase: number
  crearClase(clase: { nombre_clase: string; id_profesor: number }): Observable<any> {
    return this.http.post(`${this.baseUrl}/class/crearClase`, clase);
  }

// Modificación en el servicio para agregar una tarea a una clase
agregarTarea(id_clase: number, titulo: string, descripcion: string, fecha_entrega: string): Observable<any> {
  const payload = { id_clase, titulo, descripcion, fecha_entrega };
  return this.http.post(`${this.baseUrl}/class/agregarTarea`, payload);
}

  // Asociar alumnos a una clase
  // Respuesta: Objeto con la propiedad:
  // - mensaje: string
  asociarAlumnosAClase(id_clase: number, alumnos: number[]): Observable<any> {
    const payload = { id_clase, alumnos };
    return this.http.post(`${this.baseUrl}/class/asociarAlumnosAClase`, payload);
  }

  // Obtener tareas pendientes de un alumno
  // Respuesta: Array de objetos con las propiedades:
  // - id_tarea: number
  // - titulo: string
  // - descripcion: string
  // - fecha_asignacion: string
  // - fecha_entrega: string
  obtenerTareasPendientes(id_alumno: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/class/obtenerTareasPendientes/${id_alumno}`);
  }

  // Actualizar el estado y calificación de una tarea
  // Respuesta: Objeto con la propiedad:
  // - mensaje: string
  actualizarEstadoYCalificacion(
    id_tarea: number,
    estado: string,
    calificacion: number
  ): Observable<any> {
    const payload = { id_tarea, estado, calificacion };
    return this.http.put(`${this.baseUrl}/class/actualizarEstadoYCalificacion`, payload);
  }

  // Eliminar una clase por su ID
  // Respuesta: Objeto con la propiedad:
  // - mensaje: string
  eliminarClase(id_clase: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/class/eliminarClase/${id_clase}`);
  }

    // Obtener alumnos por clase
  // Respuesta: Array de objetos con las propiedades:
  // - id_alumno: number
  // - numero_control: string
  // - grupo: string
  // - especialidad: string
  // - turno: string
  // - curp: string
  // - nombre: string
  // - apellido: string
  obtenerAlumnosPorClase(id_clase: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/class/obtenerAlumnosPorClase/${id_clase}`);
  }

  // Registrar asistencia
  // Respuesta: Objeto con la propiedad:
  // - mensaje: string
  registrarAsistencia(asistencia: { id_clase: number; id_alumno: number; fecha: string; estado_asistencia: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/class/registrarAsistencia`, asistencia);
  }
}
