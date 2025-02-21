import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-task-editor-modal',
  standalone: true,
  imports: [],
  templateUrl: './task-editor-modal.component.html',
  styleUrl: './task-editor-modal.component.css'
})
export class TaskEditorModalComponent {

  @Output() close = new EventEmitter<void>(); // Evento para cerrar el modal

  closeModal() {
    this.close.emit(); // Dispara el evento para cerrar el modal
  }

  saveTask() {
    // Aquí puedes manejar la lógica de guardar la tarea
    console.log('Tarea guardada');
    this.closeModal(); // Cierra el modal después de guardar
  }

}
