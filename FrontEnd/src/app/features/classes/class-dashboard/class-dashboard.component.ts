// class-dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importa el Router
import { ClasesService } from 'src/app/Core/service/clases.service';
import { SesionService } from 'src/app/Core/service/sesion.service';
import Notiflix from 'notiflix';
import { CommonModule } from '@angular/common';

interface Clase {
  id_clase: number; // Asegúrate de que existe un ID para cada clase
  nombre_clase: string;
  profesor_nombre: string;
  tareas: any[]; // Define una interfaz más específica si es posible
}

@Component({
  selector: 'app-class-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './class-dashboard.component.html',
  styleUrls: ['./class-dashboard.component.css'], // Corregido de 'styleUrl' a 'styleUrls'
})
export class ClassDashboardComponent implements OnInit {
  clases: Clase[] = [];
  descripcionVisibilidad: { [key: string]: boolean } = {};
  idAlumno: number | null = null;
  idProfesor: number | null = null; // Suponiendo que tienes el ID del profesor
  rol: string = '';

  constructor(
    private clasesService: ClasesService,
    private sesionService: SesionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.rol = this.sesionService._rol;
    if (this.rol === 'Alumno') {
      this.idAlumno = this.sesionService._id_alumno;
      this.cargarClasesPorAlumno();
    } else if (this.rol === 'Profesor') {
      this.idProfesor = this.sesionService._id_profesor; // Asegúrate de tener este método en SesionService
      this.cargarClasesPorProfesor();
    } else {
      Notiflix.Notify.failure('Rol de usuario desconocido.');
    }
  }

  cargarClasesPorAlumno(): void {
    if (this.idAlumno != null) {
      this.clasesService.obtenerClasesPorAlumno(this.idAlumno).subscribe({
        next: (data: Clase[]) => {
          this.clases = data;
        },
        error: (error) => {
          console.error('Error al cargar las clases con tareas:', error);

          if (error.error?.mensaje === 'El alumno no está inscrito en ninguna clase.') {
            Notiflix.Notify.failure('No estás inscrito en ninguna clase.');
          } else {
            Notiflix.Notify.failure('Error al cargar las clases. Intenta nuevamente.');
          }
        },
      });
    } else {
      Notiflix.Notify.failure('ID de alumno no disponible.');
    }
  }

  cargarClasesPorProfesor(): void {
    if (this.idProfesor != null) {
      this.clasesService.obtenerClasesPorProfesor(this.idProfesor).subscribe({
        next: (data: Clase[]) => {
          this.clases = data;
        },
        error: (error) => {
          console.error('Error al cargar las clases del profesor:', error);

          if (error.error?.mensaje === 'El profesor no está asignado a ninguna clase.') {
            Notiflix.Notify.failure('No tienes clases asignadas.');
          } else {
            Notiflix.Notify.failure('Error al cargar las clases. Intenta nuevamente.');
          }
        },
      });
    } else {
      Notiflix.Notify.failure('ID de profesor no disponible.');
    }
  }

  toggleDescripcion(claseId: number, tareaIndex: number): void {
    const key = `${claseId}-${tareaIndex}`;
    this.descripcionVisibilidad[key] = !this.descripcionVisibilidad[key];
  }

  isDescripcionVisible(claseId: number, tareaIndex: number): boolean {
    const key = `${claseId}-${tareaIndex}`;
    return !!this.descripcionVisibilidad[key];
  }

  goToClassSelect(claseId: number): void {
    this.router.navigate([`/Main_Dashboard/clase/${claseId}`]);
  }
  
}
