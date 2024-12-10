import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClasesService } from 'src/app/Core/service/clases.service';
import { SesionService } from 'src/app/Core/service/sesion.service';
import { Router } from '@angular/router';
import { TrabajosService } from 'src/app/Core/service/trabajos.service.service'; // Añadir esta importación

@Component({
 selector: 'app-clases',
 templateUrl: './clases.component.html',
 styleUrls: ['./clases.component.css']
})
export class ClasesComponent implements OnInit, OnDestroy {
 isActionMenuVisible: boolean = false;
 claseId: number | null = null;
 nombreClase: string = '';
 profesor_nombre: string = '';
 tareas: any[] = [];
 esProfesor: boolean = false;
 selectedFile: File | null = null;
 tareaTitulo: string = '';
 tareaDescripcion: string = '';
 fechaEntrega: string = '';
 entregaActual: any = null;
 tarea: any = null;
 expandedTareaIndex: number | null = null;

 alumnos: any[] = [];
 asistencia: { id_alumno: number; estado: string }[] = [];

 constructor(
  private route: ActivatedRoute,
  private router: Router,
  private clasesService: ClasesService,
  private trabajosService: TrabajosService,
  protected sessionService: SesionService
 ) {
   document.addEventListener('click', this.onDocumentClick.bind(this));
 }

 ngOnDestroy() {
   // Remover el listener cuando el componente se destruye
   document.removeEventListener('click', this.onDocumentClick.bind(this));
 }

 toggleActionMenu(event?: Event): void {
   if (event) {
     event.stopPropagation(); // Prevenir que el clic se propague al documento
   }
   this.isActionMenuVisible = !this.isActionMenuVisible;
 }

 onDocumentClick(event: MouseEvent): void {
   // Verificar si el clic fue fuera del menú y del botón
   const actionMenu = document.querySelector('.action-menu');
   const fabButton = document.querySelector('.fab-button');
   
   if (this.isActionMenuVisible && actionMenu && fabButton) {
     const clickedElement = event.target as HTMLElement;
     
     if (!actionMenu.contains(clickedElement) && !fabButton.contains(clickedElement)) {
       this.isActionMenuVisible = false;
     }
   }
 }

 ngOnInit(): void {
   this.route.paramMap.subscribe(params => {
     const id = params.get('id');
     if (id) {
       const numericId = +id;
       if (!isNaN(numericId)) {
         this.claseId = numericId;
         this.cargarClase(this.claseId);
         this.obtenerAlumnos(this.claseId);
       }
     }
   });

   this.esProfesor = this.sessionService._rol == 'Profesor';
 }

 cargarClase(idClase: number): void {
   this.clasesService.obtenerClases().subscribe(
     (clases: any[]) => {
       const clase = clases.find(c => c.id_clase === idClase);
       if (clase) {
         this.nombreClase = clase.nombre_clase;
         this.profesor_nombre = clase.profesor_nombre;
         this.tareas = clase.tareas;
       }
     },
     error => {
       console.error('Error al obtener las clases:', error);
     }
   );
 }

 crearTarea(): void {
   if (this.claseId && this.tareaTitulo && this.tareaDescripcion && this.fechaEntrega) {
     this.clasesService.agregarTarea(
       this.claseId,
       this.tareaTitulo,
       this.tareaDescripcion,
       this.fechaEntrega
     ).subscribe(
       response => {
         console.log('Tarea creada:', response);
         this.cargarClase(this.claseId!);
         this.limpiarFormulario();
       },
       error => {
         console.error('Error al crear la tarea:', error);
       }
     );
   } else {
     console.error('Faltan campos en el formulario');
   }
 }

 limpiarFormulario(): void {
   this.tareaTitulo = '';
   this.tareaDescripcion = '';
   this.fechaEntrega = '';
 }

 toggleTareaExpand(index: number, idTarea: number): void {
  if (this.expandedTareaIndex === index) {
    this.router.navigate(['/Main_Dashboard/trabajos-detalles', idTarea]);
  } else {
    this.expandedTareaIndex = index;
  }
}


 obtenerAlumnos(idClase: number): void {
   this.clasesService.obtenerAlumnosPorClase(idClase).subscribe({
     next: (data) => {
       this.alumnos = data.alumnos;
       console.log(this.alumnos);
     },
     error: (error) => {
       console.error('Error al obtener los alumnos:', error);
     },
   });
 }

 marcarAsistencia(alumnoId: number, estado: string): void {
   const fechaActual = new Date().toISOString().split('T')[0];
 
   const asistencia = {
     id_clase: this.claseId!,
     id_alumno: alumnoId,
     fecha: fechaActual,
     estado_asistencia: estado,
   };
 
   this.clasesService.registrarAsistencia(asistencia).subscribe(response => {
     console.log(response.mensaje);
   });
 }

 onFileSelected(event: any): void {
  const file = event.target.files[0];
  if (file && file.type === 'application/pdf') {
    this.selectedFile = file;
  } else {
    // Mostrar error - solo se permiten PDFs
    this.selectedFile = null;
  }
}

submitTask(): void {
  if (!this.selectedFile) return;

  const formData = new FormData();
  formData.append('archivo', this.selectedFile);
  
  // Asumiendo que estás trabajando con una tarea específica
  const tareaActual = this.tareas[this.expandedTareaIndex || 0];
  
  this.trabajosService.subirEntrega(tareaActual.id_tarea, formData).subscribe({
    next: (entrega) => {
      this.entregaActual = entrega;
      this.selectedFile = null;
      // Mostrar mensaje de éxito
    },
    error: (error) => {
      console.error('Error al subir la tarea:', error);
      // Mostrar mensaje de error
    }
  });
}
}