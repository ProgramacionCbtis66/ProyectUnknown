import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // Importamos ActivatedRoute
import { ClasesService } from 'src/app/Core/service/clases.service'; // Importamos el servicio ClasesService
import { SesionService } from 'src/app/Core/service/sesion.service';

@Component({
  selector: 'app-clases',
  templateUrl: './clases.component.html',
  styleUrls: ['./clases.component.css']
})
export class ClasesComponent implements OnInit {
  claseId: number | null = null;
  nombreClase: string = '';
  profesor_nombre: string = '';
  tareas: any[] = [];
  esProfesor: boolean = false;

  tareaTitulo: string = ''; // Título de la tarea
  tareaDescripcion: string = ''; // Descripción de la tarea
  fechaEntrega: string = ''; // Fecha de entrega

  expandedTareaIndex: number | null = null; // Índice de la tarea actualmente expandida


  constructor(
    private route: ActivatedRoute,
    private clasesService: ClasesService,
    protected sessionService: SesionService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        const numericId = +id;
        if (!isNaN(numericId)) {
          this.claseId = numericId;
          this.cargarClase(this.claseId);
        }
      }
    });

    this.esProfesor = this.sessionService._rol == 'Profesor';
  }

  cargarClase(idClase: number): void {
    this.clasesService.obtenerClases().subscribe(
      (clases: any[]) => {
        const clase = clases.find(c => c.id_clase === idClase);
        if (clase) {
          this.nombreClase = clase.nombre_clase;
          this.profesor_nombre = clase.profesor_nombre;
          this.tareas = clase.tareas;
        }
      },
      error => {
        console.error('Error al obtener las clases:', error);
      }
    );
  }

  // Crear tarea
  crearTarea(): void {
    if (this.claseId && this.tareaTitulo && this.tareaDescripcion && this.fechaEntrega) {
      this.clasesService.agregarTarea(
        this.claseId,
        this.tareaTitulo,
        this.tareaDescripcion,
        this.fechaEntrega
      ).subscribe(
        response => {
          console.log('Tarea creada:', response);
          this.cargarClase(this.claseId!); // Recargar la información de la clase
          this.limpiarFormulario(); // Limpiar los campos del formulario
        },
        error => {
          console.error('Error al crear la tarea:', error);
        }
      );
    } else {
      console.error('Faltan campos en el formulario');
    }
  }

  limpiarFormulario(): void {
    this.tareaTitulo = '';
    this.tareaDescripcion = '';
    this.fechaEntrega = '';
  }

  toggleTareaExpand(index: number): void {
    // Alterna entre expandir y contraer
    this.expandedTareaIndex = this.expandedTareaIndex === index ? null : index;
  }
}
