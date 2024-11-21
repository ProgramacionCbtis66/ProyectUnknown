import { Component, OnInit } from '@angular/core';
import { ClasesService } from '../../../Core/service/clases.service';
import Notiflix from 'notiflix';

interface Clase {
  nombreClase: string;
  nombreProfesor: string;
  foto: string;
  tareas: string[];
}

@Component({
  selector: 'app-alumnos-clases',
  templateUrl: './alumnos-clases.component.html',
  styleUrl: './alumnos-clases.component.css'
})
export class AlumnosClasesComponent {
  clases: any[] = [];
  nombreClase: string = '';
  idProfesor: number | null = null;
  descripcionVisibilidad: { [key: string]: boolean } = {};

  constructor(private dataService: ClasesService) {}

  ngOnInit(): void {
    this.cargarClasesConTareas();
  }

  cargarClasesConTareas(): void {
    this.dataService.obtenerClasesConTareas().subscribe({
      next: (data) => {
        this.clases = data;
      },
      error: (error) => {
        console.error('Error al cargar las clases con tareas:', error);
      }
    });
  }

  crearClase(): void {
    if (!this.nombreClase || !this.idProfesor) {
      Notiflix.Notify.failure('Por favor, completa todos los campos.');
      return;
    }

    this.dataService.crearClase(this.nombreClase, this.idProfesor).subscribe({
      next: (response) => {
        console.log('Clase creada exitosamente:', response);
        Notiflix.Notify.success('Clase creada exitosamente.');
        this.cargarClasesConTareas();
      },
      error: (error) => {
        console.error('Error al crear la clase:', error);
        Notiflix.Notify.failure('Hubo un error al crear la clase. Verifica los datos.');
      }
    });
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
