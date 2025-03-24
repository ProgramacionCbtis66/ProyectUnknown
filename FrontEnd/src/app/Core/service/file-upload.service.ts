// src/app/services/file-upload.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root', // El servicio está disponible en toda la aplicación
})
export class FileUploadService {
  private apiUrl = environment.HTTPS; // Ajusta la URL según tu backend

  constructor(private http: HttpClient) {}

  // Método para subir un archivo
  uploadFile(file: File, tipo: string, body: any): Observable<any> {
    const formData = new FormData();
    formData.append('archivo', file);

    // Agrega los campos adicionales al FormData
    Object.keys(body).forEach((key) => {
      formData.append(key, body[key]);
    });

    return this.http.post(`${this.apiUrl}/file/upload`, formData);
  }

  // Método para obtener un archivo de tarea
  getTaskFile(idTarea: number, idAlumno: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/file/tarea/${idTarea}/${idAlumno}`, {
      responseType: 'blob', // Para manejar archivos binarios
    });
  }
}