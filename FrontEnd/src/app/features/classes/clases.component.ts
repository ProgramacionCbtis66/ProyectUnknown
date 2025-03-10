import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { ClasesService } from 'src/app/Core/service/clases.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentListComponent } from "./student-list/student-list.component";
import { TaskListComponent } from "./task-list/task-list.component";
import { TaskEditorModalComponent } from "../tasks/task-editor-modal/task-editor-modal.component";
import { SesionService } from 'src/app/Core/service/sesion.service';

declare var bootstrap: any;

@Component({
  selector: 'app-clases',
  standalone: true,
  templateUrl: './clases.component.html',
  styleUrls: ['./clases.component.css'],
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('{{delay}}ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ], { params: { delay: 300 } })
    ]),
  ],
  imports: [StudentListComponent, CommonModule, FormsModule, TaskListComponent, TaskEditorModalComponent],
})
export class ClasesComponent implements OnInit {
  isModalOpen = false;
  menuOpen = false;
  showTaskList = true;
  claseId!: number;
  clase: any;
  students = [
    { name: 'Juan Pérez', present: false },
    { name: 'María Gómez', present: false },
    { name: 'Carlos Rodríguez', present: false },
    { name: 'Ana Torres', present: false },
  ];

  constructor(
    private route: ActivatedRoute,
    private clasesService: ClasesService,
    protected sesion: SesionService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        const numericId = +id;
        if (!isNaN(numericId)) {
          this.claseId = numericId;
          this.obtenerDatosClase(this.claseId);
        }
      }
    });
  }

  obtenerDatosClase(id_clase: number): void {
    this.clasesService.obtenerClase(id_clase).subscribe({
      next: (data) => {
        this.clase = data;
        console.log('Datos de la clase:', this.clase);
      },
      error: (error) => {
        console.error('Error al obtener los datos de la clase:', error);
      }
    });
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  saveAttendance(): void {
    const presentStudents = this.students.filter(student => student.present);
    console.log('Asistencia guardada:', presentStudents);
    alert('Asistencia guardada correctamente');

    const modalElement = document.getElementById('attendanceModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  toggleView(): void {
    this.showTaskList = !this.showTaskList;
  }

  onSecondaryButtonClick(): void {
    this.toggleView();
  }
}