import { Component, OnInit } from '@angular/core';
import { ClasesService } from 'src/app/Core/service/clases.service';
import { UsuarioService } from 'src/app/Core/service/usuario.service';

@Component({
  selector: 'app-alumnos-clases',
  templateUrl: './alumnos-clases.component.html',
  styleUrls: ['./alumnos-clases.component.css'],
})
export class AlumnosClasesComponent implements OnInit {
  // Variables para manejar las clases
  clases: any[] = [];
  profesores: any[] = [];
  nombreClase: string = '';
  idProfesor: number | null = null;

  // Variables para manejar los alumnos
  usuarios: any[] = [];
  filteredUsuarios: any[] = [];
  filtroGrupo: string = '';
  filtroSemestre: number | '' = '';
  grupos: string[] = [];
  semestres: number[] = [];
  idClaseSeleccionada: number | null = null;

  constructor(private clasesService: ClasesService, private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarClases();
    this.cargarProfesores();
    this.cargarAlumnos();
  }

  // Métodos para manejar clases
  cargarClases(): void {
    this.clasesService.obtenerClases().subscribe((data) => {
      this.clases = data;
    });
  }

  crearClase(): void {
    if (!this.nombreClase || !this.idProfesor) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const nuevaClase = {
      nombre_clase: this.nombreClase,
      id_profesor: this.idProfesor,
    };
    
    console.log('Datos enviados:', nuevaClase);
    this.clasesService.crearClase(nuevaClase).subscribe({
      next: () => {
        alert('Clase creada con éxito.');
        this.cargarClases();
      },
      error: (err) => {
        console.error('Error al crear la clase:', err);
        if (err.status === 400) {
          alert('Datos inválidos. Por favor, revisa la información enviada.');
        } else if (err.status === 500) {
          alert('Error interno del servidor. Intenta nuevamente más tarde.');
        } else {
          alert('Error desconocido. Revisa la consola para más detalles.');
        }
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

  // Métodos para manejar alumnos
  cargarProfesores(): void {
    this.usuarioService.getProfesores().subscribe((data) => {
      console.log(data);
      this.profesores = data
        .filter((profesor) => profesor.detalle && profesor.detalle.id_profesor) // Filtrar los profesores con "detalle"
        .map((profesor) => ({
          id_profesor: profesor.detalle.id_profesor,
          nombre: `${profesor.nombre} ${profesor.apellido}`,
        }));
        
    });
  }

  cargarAlumnos(): void {
    this.usuarioService.getAlumnos().subscribe((data) => {
      this.usuarios = data;
      this.filteredUsuarios = [...data];
      this.grupos = [...new Set(data.map((u) => u.grupo))];
      this.semestres = [...new Set(data.map((u) => u.semestre))];
    });
  }

  abrirModalAgregarAlumnos(idClase: number): void {
    this.idClaseSeleccionada = idClase;
    this.filteredUsuarios = [...this.usuarios]; // Resetear filtro
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

    if (this.idClaseSeleccionada) {
      this.clasesService.asociarAlumnosAClase(this.idClaseSeleccionada, idsSeleccionados).subscribe({
        next: () => {
          alert('Alumnos agregados correctamente.');
        },
        error: (err) => {
          console.error('Error al agregar alumnos:', err);
          alert('Ocurrió un error al agregar los alumnos.');
        },
      });
    }
  }
}
