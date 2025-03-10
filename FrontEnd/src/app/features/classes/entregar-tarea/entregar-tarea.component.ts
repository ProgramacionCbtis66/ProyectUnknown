import { Component, Input } from '@angular/core';
import { ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SesionService } from 'src/app/Core/service/sesion.service';
import Notiflix from 'notiflix';
import { ClasesService } from 'src/app/Core/service/clases.service';

@Component({
  selector: 'app-entregar-tarea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './entregar-tarea.component.html',
  styleUrls: ['./entregar-tarea.component.css'],
})
export class EntregarTareaComponent {
  @Input() id_tarea!: number; // Recibe el ID de la tarea desde el componente padre
  archivoSeleccionado: File | null = null;
  progreso: number = 0;
  isDragging: boolean = false;
  tarea: any = null;

  constructor(
    private http: HttpClient,
    private sesion: SesionService,
    private clasesService: ClasesService
  ) {
    // Configura Notiflix
    Notiflix.Notify.init({
      position: 'right-top', // Posición de las notificaciones
      timeout: 3000, // Duración de la notificación en milisegundos
      clickToClose: true, // Cerrar al hacer clic
    });
  }

  // Manejar la selección de archivo al hacer clic
  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (this.validarArchivo(file)) {
      this.archivoSeleccionado = file;
      this.iniciarProgreso();
    }
  }

  // Manejar el arrastre de archivos
  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files[0];

    // Verifica si el archivo está definido antes de asignarlo
    if (file && this.validarArchivo(file)) {
      this.archivoSeleccionado = file;
      this.iniciarProgreso();
    }
  }

  // Evitar el comportamiento por defecto al arrastrar sobre el área
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  // Remover el estilo cuando se deja de arrastrar
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  // Eliminar el archivo seleccionado
  eliminarArchivo(): void {
    this.archivoSeleccionado = null;
    this.progreso = 0;
  }

  // Validar el archivo (tipo y tamaño)
  validarArchivo(file: File | undefined): boolean {
    if (!file) return false;

    const formatoValido = file.type === 'application/pdf';
    const tamañoValido = file.size <= 25 * 1024 * 1024; // 25MB

    if (!formatoValido) {
      Notiflix.Notify.failure('Solo se permiten archivos PDF.'); // Notificación de error
      return false;
    }
    if (!tamañoValido) {
      Notiflix.Notify.failure('El archivo no debe superar los 25MB.'); // Notificación de error
      return false;
    }

    return true;
  }

  // Simular el progreso de la carga (puedes adaptarlo a tu lógica real)
  iniciarProgreso(): void {
    this.progreso = 0;
    const intervalo = setInterval(() => {
      if (this.progreso < 100) {
        this.progreso += 10;
      } else {
        clearInterval(intervalo);
      }
    }, 300);
  }

  // Manejar el envío del formulario
  onSubmit(): void {
    if (this.archivoSeleccionado) {
      this.clasesService
        .entregarTarea(this.id_tarea, this.sesion._id_alumno!, this.archivoSeleccionado)
        .subscribe({
          next: (response) => {
            console.log('Tarea enviada exitosamente:', response);
            Notiflix.Notify.success('Tarea enviada exitosamente.');
            this.archivoSeleccionado = null; // Limpiar el archivo después de enviarlo
          },
          error: (error) => {
            console.error('Error al enviar la tarea:', error);
            Notiflix.Notify.failure('Error al enviar la tarea.');
          },
        });
    } else {
      Notiflix.Notify.warning('Por favor, selecciona un archivo.');
    }
  }

}