import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrabajosService } from 'src/app/Core/service/trabajos.service.service';
import { SesionService } from 'src/app/Core/service/sesion.service';

interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  puntos: number;
  fechaEntrega: Date;
}

interface Entrega {
  id: number;
  id_alumno: number;
  alumno: {
    id: number;
    nombre: string;
    foto?: string;
  };
  nombreArchivo: string;
  fechaEntrega: Date;
  calificacion?: number;
}

@Component({
  selector: 'app-trabajos-detalles',
  templateUrl: './trabajos-detalles.component.html',
  styleUrl: './trabajos-detalles.component.css'
})
export class TrabajosDetallesComponent {
  tarea: Tarea = {
    id: 0,
    titulo: '',
    descripcion: '',
    puntos: 0,
    fechaEntrega: new Date()
  };

  // Propiedades para las entregas
  entregas: Entrega[] = [];
  entregaActual: Entrega | null = null;
  totalAlumnos: number = 0;
  esProfesor: boolean = false;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private trabajosService: TrabajosService,
    protected sessionService: SesionService
  ) {}

  ngOnInit(): void {
    this.esProfesor = this.sessionService._rol === 'Profesor';
    
    // Obtener el ID de la tarea de los parámetros de la ruta
    this.route.params.subscribe(params => {
      const idTarea = +params['id'];
      if (idTarea) {
        this.cargarTarea(idTarea);
        if (this.esProfesor) {
          this.cargarEntregas(idTarea);
        } else {
          this.cargarEntregaAlumno(idTarea);
        }
      }
    });
  }

  cargarTarea(idTarea: number): void {
    this.trabajosService.obtenerTarea(idTarea).subscribe({
      next: (tarea) => {
        this.tarea = tarea;
      },
      error: (error) => {
        console.error('Error al cargar la tarea:', error);
      }
    });
  }

  cargarEntregas(idTarea: number): void {
    this.trabajosService.obtenerEntregas(idTarea).subscribe({
      next: (data) => {
        this.entregas = data.entregas;
        this.totalAlumnos = data.totalAlumnos;
      },
      error: (error) => {
        console.error('Error al cargar las entregas:', error);
      }
    });
  }

  cargarEntregaAlumno(idTarea: number): void {
    this.trabajosService.obtenerEntregaAlumno(idTarea).subscribe({
      next: (entrega) => {
        this.entregaActual = entrega;
      },
      error: (error) => {
        if (error.status !== 404) {
          console.error('Error al cargar la entrega:', error);
        }
      }
    });
  }

  calificarEntrega(idEntrega: number, event: any): void {
    const calificacion = event.target.value;
    if (calificacion > this.tarea.puntos) {
      event.target.value = this.tarea.puntos;
      return;
    }

    this.trabajosService.calificarEntrega(idEntrega, calificacion).subscribe({
      next: () => {
        console.log('Calificación guardada');
      },
      error: (error) => {
        console.error('Error al calificar:', error);
        event.target.value = this.entregas.find(e => e.id === idEntrega)?.calificacion || 0;
      }
    });
  }

  abrirSelectorArchivo(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('archivo', file);
      
      this.trabajosService.subirEntrega(this.tarea.id, formData).subscribe({
        next: (entrega) => {
          this.entregaActual = entrega;
        },
        error: (error) => {
          console.error('Error al subir el archivo:', error);
        }
      });
    }
  }

  descargarArchivo(idEntrega: number): void {
    this.trabajosService.descargarArchivo(idEntrega).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.entregaActual?.nombreArchivo || 'archivo';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      },
      error: (error) => {
        console.error('Error al descargar el archivo:', error);
      }
    });
  }

  eliminarEntrega(idEntrega: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta entrega?')) {
      this.trabajosService.eliminarEntrega(idEntrega).subscribe({
        next: () => {
          this.entregaActual = null;
        },
        error: (error) => {
          console.error('Error al eliminar la entrega:', error);
        }
      });
    }
  }
}
