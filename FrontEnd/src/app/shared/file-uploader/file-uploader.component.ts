import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadService } from 'src/app/Core/service/file-upload.service';

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css'],
})
export class FileUploaderComponent {
  @Input() tipo: string = 'tarea'; // Tipo de archivo a subir (por defecto: 'tarea')
  @Input() idTarea: number | null = null; // ID de la tarea (opcional)
  @Input() idAlumno: number | null = null; // ID del alumno (opcional)
  @Input() grupo: string = ''; // Grupo para horarios (opcional)
  @Input() grado: string = ''; // Grado para horarios (opcional)
  @Output() fileUploaded = new EventEmitter<File>();

  isOpen = false;
  isDragging = false; // Para resaltar el área de arrastre
  selectedFile: File | null = null; // Archivo seleccionado

  constructor(private fileUploadService: FileUploadService) {}

  // Abrir el modal
  openModal() {
    this.isOpen = true;
  }

  // Cerrar el modal
  closeModal() {
    this.isOpen = false;
    this.isDragging = false; // Reiniciar el estado de arrastre
    this.selectedFile = null; // Reiniciar el archivo seleccionado
  }

  // Manejar el evento de arrastrar sobre el área
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true; // Resaltar el área de arrastre
  }

  // Manejar el evento de salir del área de arrastre
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false; // Quitar el resaltado
  }

  // Manejar el evento de soltar el archivo
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false; // Quitar el resaltado

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.selectedFile = event.dataTransfer.files[0];
    }
  }

  // Manejar la selección de archivo desde el input
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  // Método para subir el archivo usando el servicio
  uploadFile(): void {
    if (!this.selectedFile) {
      console.error('No se ha seleccionado ningún archivo.');
      return;
    }

    const body = {
      tipo: this.tipo, // Usar el tipo proporcionado
      id_tarea: this.idTarea, // Usar el ID de la tarea si está disponible
      id_alumno: this.idAlumno, // Usar el ID del alumno si está disponible
      grupo: this.grupo, // Grupo para horarios
      grado: this.grado, // Grado para horarios
    };

    this.fileUploadService.uploadFile(this.selectedFile, this.tipo, body).subscribe({
      next: (response) => {
        console.log('Archivo subido exitosamente:', response);
        this.fileUploaded.emit(this.selectedFile!); // Emitir el archivo subido
        this.closeModal(); // Cerrar el modal después de subir el archivo
      },
      error: (error) => {
        console.error('Error al subir el archivo:', error);
      },
    });
  }
}