import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ClasesService } from 'src/app/Core/service/clases.service';
import { UsuarioService } from 'src/app/Core/service/usuario.service';

  // Interfaces definidas dentro del mismo archivo
  interface Clase {
    id_clase: number;
    nombre_clase: string;
    profesor_nombre: string;
    id_profesor: number;
  }

  interface Profesor {
    id_profesor: number;
    nombre_completo: string;
  }

  interface Alumno {
    id: number;
    nombre: string;
    grupo: string;
    semestre: number;
    seleccionado?: boolean;
  }

  interface GetUsuario {
  id: number;
  id_profesor: number;
  detalle: any;
  grupo: string;
  nombre: string;
  apellido: string;
  rol: string;
  foto?: string;
  numero_control: string;
  especialidad: string;
  semestre: number;
  turno: string;
  correo_institucional: string;
}

@Component({
  selector: 'app-alumnos-clases',
  templateUrl: './alumnos-clases.component.html',
  styleUrls: ['./alumnos-clases.component.css'],
})
export class AlumnosClasesComponent implements OnInit {

  // Variables para manejar las clases
  clases: Clase[] = [];
  profesores: Profesor[] = [];
  nombreClase: string = '';
  idProfesor: number | null = null;

  // Variables para manejar los alumnos
  usuarios: Alumno[] = [];
  filteredUsuarios: Alumno[] = [];
  filtroGrupo: string = '';
  filtroSemestre: number | null = null;
  grupos: string[] = [];
  semestres: number[] = [];
  idClaseSeleccionada: number | null = null;

  // Subscripciones
  private subscriptions: Subscription = new Subscription();

  constructor(
    private clasesService: ClasesService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.cargarClases();
    this.cargarProfesores();
    this.cargarAlumnos();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onProfesorChange(event: any): void {
    console.log('Profesor seleccionado ID:', this.idProfesor);
  }

  // Métodos para manejar clases
  cargarClases(): void {
    const clasesSub = this.clasesService.obtenerClases().subscribe({
      next: (data: Clase[]) => {
        this.clases = data;
      },
      error: (err) => {
        console.error('Error al cargar las clases:', err);
        alert('No se pudieron cargar las clases. Intenta nuevamente más tarde.');
      },
    });
    this.subscriptions.add(clasesSub);
  }

  crearClase(): void {
    if (!this.nombreClase.trim() || this.idProfesor === null) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const nuevaClase: any = {
      nombre_clase: this.nombreClase.trim(),
      id_profesor: this.idProfesor,
    };

    this.clasesService.crearClase(nuevaClase).subscribe({
      next: () => {
        alert('Clase creada con éxito.');
        this.resetCrearClaseForm();
        this.cargarClases();
      },
      error: (err) => {
        console.error('Error al crear la clase:', err);
        this.handleError(err, 'crear clase');
      },
    });
  }

  eliminarClase(idClase: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta clase?')) {
      this.clasesService.eliminarClase(idClase).subscribe({
        next: () => {
          alert('Clase eliminada correctamente.');
          this.cargarClases();
        },
        error: (err) => {
          console.error('Error al eliminar clase:', err);
          alert('Ocurrió un error al eliminar la clase.');
        },
      });
    }
  }

  // Métodos para manejar profesores y alumnos
  cargarProfesores(): void {
    const profesoresSub = this.usuarioService.getProfesores().subscribe({
      next: (data: GetUsuario[]) => { // Usar la interfaz correcta
        console.log('Datos originales de profesores:', data); // Para depuración
  
        this.profesores = data
          .filter((profesor) => profesor.id_profesor) // Filtrar directamente
          .map((profesor) => ({
            id_profesor: profesor.id_profesor, // Acceder directamente
            nombre_completo: `${profesor.nombre} ${profesor.apellido}`,
          }));
  
        console.log('Profesores mapeados:', this.profesores); // Para depuración
      },
      error: (err) => {
        console.error('Error al cargar los profesores:', err);
        alert('No se pudieron cargar los profesores. Intenta nuevamente más tarde.');
      },
    });
    this.subscriptions.add(profesoresSub);
  }
  

  cargarAlumnos(): void {
    const alumnosSub = this.usuarioService.getAlumnos().subscribe({
      next: (data: Alumno[]) => {
        this.usuarios = data;
        this.filteredUsuarios = [...data];
        this.grupos = Array.from(new Set(data.map((u) => u.grupo))).sort();
        this.semestres = Array.from(new Set(data.map((u) => u.semestre))).sort((a, b) => a - b);
      },
      error: (err) => {
        console.error('Error al cargar los alumnos:', err);
        alert('No se pudieron cargar los alumnos. Intenta nuevamente más tarde.');
      },
    });
    this.subscriptions.add(alumnosSub);
  }

  abrirModalAgregarAlumnos(idClase: number): void {
    this.idClaseSeleccionada = idClase;
    this.resetFiltrosAlumnos();
  }

  filtrarAlumnos(): void {
    this.filteredUsuarios = this.usuarios.filter((u) => {
      const coincideGrupo = this.filtroGrupo ? u.grupo === this.filtroGrupo : true;
      const coincideSemestre = this.filtroSemestre ? u.semestre === this.filtroSemestre : true;
      return coincideGrupo && coincideSemestre;
    });
  }

  agregarAlumnosSeleccionados(): void {
    const idsSeleccionados = this.filteredUsuarios
      .filter((alumno) => alumno.seleccionado)
      .map((alumno) => alumno.id);

    if (this.idClaseSeleccionada === null) {
      alert('No se ha seleccionado una clase.');
      return;
    }

    if (idsSeleccionados.length === 0) {
      alert('No has seleccionado ningún alumno.');
      return;
    }

    this.clasesService
      .asociarAlumnosAClase(this.idClaseSeleccionada, idsSeleccionados)
      .subscribe({
        next: () => {
          alert('Alumnos agregados correctamente.');
          // Opcional: Actualizar la lista de clases o realizar otra acción
        },
        error: (err) => {
          console.error('Error al agregar alumnos:', err);
          alert('Ocurrió un error al agregar los alumnos.');
        },
      });
  }

  // Métodos auxiliares
  private resetCrearClaseForm(): void {
    this.nombreClase = '';
    this.idProfesor = null;
    // Opcional: Cerrar el modal programáticamente si lo deseas
  }

  private resetFiltrosAlumnos(): void {
    this.filtroGrupo = '';
    this.filtroSemestre = null;
    this.filteredUsuarios = [...this.usuarios];
  }

  private handleError(error: any, context: string): void {
    if (error.status === 400) {
      alert(`Datos inválidos al ${context}. Por favor, revisa la información enviada.`);
    } else if (error.status === 500) {
      alert('Error interno del servidor. Intenta nuevamente más tarde.');
    } else {
      alert('Error desconocido. Revisa la consola para más detalles.');
    }
  }
}
