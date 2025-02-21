import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrabajosService } from 'src/app/Core/service/trabajos.service.service'; // Añadir esta importación
import {trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';


@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  animations: [
    trigger('expandCollapse', [
      state(
        'collapsed',
        style({
          height: '0px',
          opacity: 0,
          overflow: 'hidden',
        })
      ),
      state(
        'expanded',
        style({
          height: '*',
          opacity: 1,
        })
      ),
      transition('collapsed <=> expanded', [animate('300ms ease-in-out')]),
    ])
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent {
  @Input() claseId!: number;

  tasks: any[] = []; // Se inicializa vacía y se llenará con los datos obtenidos

  constructor(private clasesService: TrabajosService, private router: Router) {}

  ngOnInit(): void {
    this.cargarTareasProfesor(this.claseId);
  }

  cargarTareasProfesor(idClase: number): void {
    this.clasesService.obtenerTareasClaseProfesor(idClase).subscribe({
      next: (tareas) => {
        this.tasks = tareas; // Asigna las tareas obtenidas desde el backend
        console.log('Tareas del profesor cargadas:', this.tasks);
      },
      error: (error) => {
        console.error('Error al obtener las tareas del profesor:', error);
      },
    });
  }
  toggleTask(task: any): void {
    task.isExpanded = !task.isExpanded;
  }
  goToClassSelect(tareaId: number): void {
    this.router.navigate([`/Main_Dashboard/trabajos-detalles/${tareaId}`]);
  }
}
