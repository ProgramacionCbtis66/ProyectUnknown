import { Component, OnInit } from '@angular/core';

interface Clase {
  nombreClase: string;
  nombreProfesor: string;
  foto: string; // URL de la foto de la clase
  tareas: string[]; // Lista de tareas pendientes
}


@Component({
  selector: 'app-clases',
  templateUrl: './clases.component.html',
  styleUrls: ['./clases.component.css']
})
export class ClasesComponent implements OnInit {

  clases: Clase[] = [];

  constructor() {}

  ngOnInit() {
    // Simulación de datos; reemplaza esta parte con una llamada real a un servicio si tienes los datos en la base de datos
    this.clases = [
      {
        nombreClase: 'Calculo Diferencial',
        nombreProfesor: 'Guillermo Montero Ramos',
        foto: 'https://as1.ftcdn.net/v2/jpg/02/43/51/48/1000_F_243514868_XDIMJHNNJYKLRST05XnnTj0MBpC4hdT5.jpg',
        tareas: ['Tarea-1', 'Tarea-2', 'Tarea-3', 'Tarea-4']
      },
      {
        nombreClase: 'Quimica',
        nombreProfesor: 'Jazmin',
        foto: 'https://as1.ftcdn.net/v2/jpg/02/43/51/48/1000_F_243514868_XDIMJHNNJYKLRST05XnnTj0MBpC4hdT5.jpg',
        tareas: ['Tarea-1', 'Tarea-2', 'Tarea-3', 'Tarea-4']
      },
      {
        nombreClase: 'Base de Datos',
        nombreProfesor: 'Maria Teresa De la Condesa De La Cruz',
        foto: 'https://as1.ftcdn.net/v2/jpg/02/43/51/48/1000_F_243514868_XDIMJHNNJYKLRST05XnnTj0MBpC4hdT5.jpg',
        tareas: ['Tarea-1', 'Tarea-2', 'Tarea-3', 'Tarea-4']
      },
      {
        nombreClase: 'Ingles',
        nombreProfesor: 'Naxhieli Perez',
        foto: 'https://as1.ftcdn.net/v2/jpg/02/43/51/48/1000_F_243514868_XDIMJHNNJYKLRST05XnnTj0MBpC4hdT5.jpg',
        tareas: ['Tarea-1', 'Tarea-2', 'Tarea-3', 'Tarea-4']
      },
      // Agrega más clases aquí...
    ];
  }

  getTruncatedTareas(clase: Clase): string[] {
    const maxTareas = 3;
    return clase.tareas.length > maxTareas ? clase.tareas.slice(0, maxTareas) : clase.tareas;
  }

  hasMoreTareas(clase: Clase): boolean {
    return clase.tareas.length > 3;
  }
}
