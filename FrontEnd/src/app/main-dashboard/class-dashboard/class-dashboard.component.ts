import { Component, OnInit } from '@angular/core';
import { ClasesService } from 'src/app/Core/service/clases.service';
import { SesionService } from 'src/app/Core/service/sesion.service';
import Notiflix from 'notiflix';
import { CommonModule } from '@angular/common';

interface Clase {
  nombreClase: string;
  nombreProfesor: string;
  foto: string;
  tareas: string[];
}

@Component({
  selector: 'app-class-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './class-dashboard.component.html',
  styleUrl: './class-dashboard.component.css',
})
export class ClassDashboardComponent implements OnInit {
  constructor(private clasesService: ClasesService, private sesionService: SesionService) {}

  clases: any[] = [];
  nombreClase: string = '';
  idProfesor: number | null = null;
  descripcionVisibilidad: { [key: string]: boolean } = {};
  idAlumno: number | null = null; // Replace this with dynamic user input or user session data

  ngOnInit(): void {
    this.idAlumno = this.sesionService._id_alumno;
    this.cargarClasesConTareas();
  }

  cargarClasesConTareas(): void {
    if (this.idAlumno != null) {
      this.clasesService.obtenerClasesPorAlumno(this.idAlumno).subscribe({
        next: (data) => {
          this.clases = data;
        },
        error: (error) => {
          console.error('Error al cargar las clases con tareas:', error);
          Notiflix.Notify.failure('Error al cargar las clases. Intenta nuevamente.');
        },
      });
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
}
