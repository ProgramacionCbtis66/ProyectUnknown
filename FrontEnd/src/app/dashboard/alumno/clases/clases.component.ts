import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';  // Importamos ActivatedRoute
import { ClasesService } from 'src/app/Core/service/clases.service';  // Importamos el servicio ClasesService

@Component({
  selector: 'app-clases',
  templateUrl: './clases.component.html',
  styleUrls: ['./clases.component.css']
})
export class ClasesComponent implements OnInit {
  claseId: number | null = null;  // Variable para almacenar el ID de la clase, usando 'number | null' para mejor control
  nombreClase: string = '';  // Nombre de la clase que se cargará dinámicamente
  profesor_nombre: string = '';  // Nombre del profesor que se cargará dinámicamente
  tareas: any[] = [];  // Array para almacenar las tareas de la clase

  constructor(private route: ActivatedRoute, private clasesService: ClasesService) {}

  ngOnInit(): void {
    // Obtener el parámetro 'id' de la ruta
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        const numericId = +id;  // Convertimos el parámetro 'id' a un número
        if (!isNaN(numericId)) {
          this.claseId = numericId;
          console.log('ID de clase:', this.claseId);
          // Llamar al método para cargar la clase y sus tareas
          this.cargarClase(this.claseId);
        } else {
          console.error('El parámetro "id" no es un número válido.');
        }
      } else {
        console.error('El parámetro "id" no se encontró en la ruta.');
      }
    });
  }

  // Método para cargar la información de la clase, el profesor y las tareas
  cargarClase(idClase: number): void {
    this.clasesService.obtenerClases().subscribe(
      (clases: any[]) => {
        const clase = clases.find(c => c.id_clase === idClase);
        if (clase) {
          this.nombreClase = clase.nombre_clase;
          this.profesor_nombre = clase.profesor_nombre;
          this.tareas = clase.tareas;
          console.log('Clase cargada:', this.nombreClase);
        } else {
          console.warn('Clase no encontrada con el ID:', idClase);
        }
      },
      error => {
        console.error('Error al obtener las clases:', error);
      }
    );
  }
}
