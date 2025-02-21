import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import Notiflix from 'notiflix';
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
    detalles?:{}
    id: number;
    nombre: string;
    grupo: string;
    semestre: number;
    seleccionado?: boolean;
  }

  interface GetUsuario {
  id: number;
  id_profesor: number;
  detalles: any;
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
  modulo: string = '';
  componente: string = '';
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
        Notiflix.Notify.failure('No se pudieron cargar las clases. Intenta nuevamente más tarde.');
      },
    });
    this.subscriptions.add(clasesSub);
  }

  crearClase(): void {
    if (!this.nombreClase.trim() || this.idProfesor === null) {
      Notiflix.Notify.failure('Porfavor Completa los campos');
      return;
    }

    const nuevaClase: any = {
      nombre_clase: this.nombreClase.trim(),
      id_profesor: this.idProfesor,
    };

    this.clasesService.crearClase(nuevaClase).subscribe({
      next: () => {
        Notiflix.Notify.success('Clase creada con exito');
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
          Notiflix.Notify.failure('Clase eliminada');

          this.cargarClases();
        },
        error: (err) => {
          console.error('Error al eliminar clase:', err);
          Notiflix.Notify.failure('Ocurrio un error al eliminar la clase');
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
          .filter((profesor) => profesor.detalles?.id_profesor) // Filtrar directamente
          .map((profesor) => ({
            id_profesor: profesor.detalles?.id_profesor, // Acceder directamente
            nombre_completo: `${profesor.nombre} ${profesor.apellido}`,
          }));
  
        console.log('Profesores mapeados:', this.profesores); // Para depuración
      },
      error: (err) => {
        console.error('Error al cargar los profesores:', err);
        Notiflix.Notify.failure('CNo se pudieron cargar los profesores. Intenta nuevamente más tarde.');

      },
    });
    this.subscriptions.add(profesoresSub);
  }
  
  cargarAlumnos(): void {
    const alumnosSub = this.usuarioService.getAlumnos().subscribe({
      next: (data: GetUsuario[]) => { // Asegúrate de usar la interfaz correcta
        console.log('Datos originales de alumnos:', data); // Para depuración
  
        this.usuarios = data
          .filter((alumno) => alumno.detalles?.id_alumno) // Filtrar alumnos que tengan el ID válido
          .map((alumno) => ({
            id: alumno.detalles.id_alumno, // Asignar al campo 'id' del Alumno
            nombre: `${alumno.nombre} ${alumno.apellido}`,
            grupo: alumno.detalles.grupo,
            semestre: alumno.detalles.semestre,
            // Añade otros campos relevantes según tu interfaz
          }));
  
        this.filteredUsuarios = [...this.usuarios]; // Inicializar filteredUsuarios con los alumnos filtrados
  
        // Obtener valores únicos para grupos y semestres
        this.grupos = [...new Set(this.usuarios.map(u => u.grupo))].sort();
        this.semestres = [...new Set(this.usuarios.map(u => u.semestre))].sort((a, b) => a - b);
  
        console.log('Alumnos mapeados:', this.usuarios); // Para depuración
        console.log('Grupos únicos:', this.grupos);
        console.log('Semestres únicos:', this.semestres);
      },
      error: (err) => {
        console.error('Error al cargar los alumnos:', err);
        Notiflix.Notify.failure('No se pudieron cargar los alumnos. Intenta nuevamente más tarde.');

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
      const coincideSemestre = this.filtroSemestre ? u.semestre == this.filtroSemestre : true;
      return coincideGrupo && coincideSemestre;
    });

    this.filteredUsuarios.forEach(alumno => {
      const alumnoOriginal = this.usuarios.find(u => u.id === alumno.id);
      if (alumnoOriginal) {
        alumno.seleccionado = alumnoOriginal.seleccionado;
      }
    });
  }

  areAllSelected(): boolean {
    return this.filteredUsuarios.length > 0 && 
           this.filteredUsuarios.every(alumno => alumno.seleccionado);
  }

  toggleSelectAll(event: any): void {
    const isChecked = event.target.checked;
    this.filteredUsuarios.forEach(alumno => {
      alumno.seleccionado = isChecked;
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
    console.log(idsSeleccionados, this.idClaseSeleccionada);
    this.clasesService
      .asociarAlumnosAClase(this.idClaseSeleccionada, idsSeleccionados)
      .subscribe({
        next: () => {
          Notiflix.Notify.success('Alumnos agregados correctamente.');

          // Opcional: Actualizar la lista de clases o realizar otra acción
        },
        error: (err) => {
          console.error('Error al agregar alumnos:', err);
          Notiflix.Notify.failure('Ocurrió un error al agregar los alumnos.');

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
