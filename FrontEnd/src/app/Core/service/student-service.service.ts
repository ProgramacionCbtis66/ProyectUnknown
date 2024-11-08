import { Injectable } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Observable } from 'rxjs';

interface Usuario {
  grupo: string;
  nombre: string;
  apellido: string;
  rol: string;
  foto?: string;
  numero_control: string;
  especialidad: string;
  semestre: number;
  turno: string;
  correo: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(private authService: AuthService) {}

  getStudents(): Observable<Usuario[]> {
    return this.authService.getUsuarios();
  }

  // Add methods for adding, editing, and deleting students
}
