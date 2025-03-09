import { Component, OnInit} from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { TrabajosService } from 'src/app/Core/service/trabajos.service.service';
import { StudentListComponent } from "./student-list/student-list.component"; // Añadir esta importación
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskListComponent } from "./task-list/task-list.component";
import { TaskEditorModalComponent } from "../tasks/task-editor-modal/task-editor-modal.component";
import { ClasesService } from 'src/app/Core/service/clases.service';
// Importa Bootstrap manualmente
declare var bootstrap: any;

@Component({
  selector: 'app-clases',
  standalone: true,
  templateUrl: './clases.component.html',
  styleUrls: ['./clases.component.css'],
  animations: [
    // 🚀 Nueva animación para las opciones del menú flotante
    trigger('fadeInAnimation', [
      transition(
        ':enter',
        [
          style({ opacity: 0, transform: 'translateY(20px)' }), // Estilo inicial
          animate(
            '{{delay}}ms ease-in-out',
            style({ opacity: 1, transform: 'translateY(0)' })
          ), // Transición
        ],
        { params: { delay: 300 } }
      ), // Retraso por defecto
    ]),
  ],
  imports: [StudentListComponent, CommonModule, FormsModule, TaskListComponent, TaskEditorModalComponent],
})

export class ClasesComponent implements OnInit {
  isModalOpen = false;
  clase: any; // Variable para almacenar los datos de la clase

  obtenerDatosClase(id_clase: number): void {
    this.clasesService.obtenerClase(id_clase).subscribe(
      (data) => {
        this.clase = data; // Asigna los datos de la clase a la variable
        console.log('Datos de la clase:', this.clase);
      },
      (error) => {
        console.error('Error al obtener los datos de la clase:', error);
      }
    );
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
  menuOpen = false;
  claseId!: number; // Variable para almacenar el ID de la clase
  students = [
    { name: 'Juan Pérez', present: false },
    { name: 'María Gómez', present: false },
    { name: 'Carlos Rodríguez', present: false },
    { name: 'Ana Torres', present: false },
  ];

  constructor(
    private route: ActivatedRoute,
    private clasesService: ClasesService,
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id'); // Obtiene el parámetro 'id' de la URL
      if (id) {
        const numericId = +id; // Convierte el ID a número
        if (!isNaN(numericId)) {
          this.claseId = numericId; // Asigna el ID a la variable de clase
          console.log('ID de la clase:', this.claseId);

        }
      }
    });

    this.obtenerDatosClase(1); // Llama al método para obtener los datos de la clase

  }
  saveAttendance() {
    const presentStudents = this.students.filter((student) => student.present);
    console.log('Asistencia guardada:', presentStudents);
    alert('Asistencia guardada correctamente');

    // Cerrar el modal manualmente después de guardar
    const modalElement = document.getElementById('attendanceModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
// Variable para controlar qué vista mostrar
showTaskList: boolean = true;

// Método para alternar entre las vistas
toggleView() {
  this.showTaskList = !this.showTaskList;
}

// Método para el botón secundario
onSecondaryButtonClick() {
  this.toggleView();  // Alterna la vista cuando se presiona el botón secundario
}
}
