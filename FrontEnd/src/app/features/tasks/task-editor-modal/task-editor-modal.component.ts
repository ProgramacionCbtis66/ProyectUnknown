import { Component, EventEmitter, Input, Output } from '@angular/core'; // Añade @Input
import { ClasesService } from 'src/app/Core/service/clases.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Notiflix from 'notiflix';

@Component({
  selector: 'app-task-editor-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-editor-modal.component.html',
  styleUrl: './task-editor-modal.component.css'
})
export class TaskEditorModalComponent {
  @Output() close = new EventEmitter<void>(); // Evento para cerrar el modal
  @Input() id_clase!: number; // Recibir el ID de la clase desde el componente padre
  taskForm: FormGroup; // Formulario reactivo para la tarea

  constructor(
    private clasesService: ClasesService,
    private fb: FormBuilder
  ) {
    // Inicializar el formulario reactivo
    this.taskForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      fecha_entrega: ['', Validators.required],
      archivos: [null], // Opcional: para manejar archivos adjuntos
      puntaje: [0, [Validators.min(0)]]
    });
  }

  // Método para cerrar el modal
  closeModal() {
    this.close.emit();
  }

  // Método para guardar la tarea
  saveTask() {
    if (this.taskForm.invalid) {
      Notiflix.Notify.warning('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const { titulo, descripcion, fecha_entrega } = this.taskForm.value;

    // Llamar al servicio para agregar la tarea
    this.clasesService.agregarTarea(this.id_clase, titulo, descripcion, fecha_entrega).subscribe({
      next: (response) => {
        console.log('Tarea guardada exitosamente:', response);
        Notiflix.Notify.success('Tarea guardada exitosamente.');
        this.closeModal(); // Cerrar el modal después de guardar
      },
      error: (error) => {
        console.error('Error al guardar la tarea:', error);
        Notiflix.Notify.failure('Error al guardar la tarea.');
      }
    });
  }

  // Método para manejar la selección de archivos
  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.taskForm.patchValue({ archivos: files });
    }
  }
}