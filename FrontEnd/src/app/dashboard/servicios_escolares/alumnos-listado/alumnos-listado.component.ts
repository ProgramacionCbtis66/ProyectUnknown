import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../../../Core/service/auth.service';

// Usuario con datos extendidos de la tabla 'alumnos'
interface Usuario {
  grupo: string;
  nombre: string;
  apellido: string;
  rol: string;
  foto?: string;
  numero_control: string;
  especialidad: string;
  semestre: number;
  turno: string;
  correo: string;
}

@Component({
  selector: 'app-alumnos-listado',
  templateUrl: './alumnos-listado.component.html',
  styleUrls: ['./alumnos-listado.component.css']
})
export class AlumnosListadoComponent implements OnInit {
  usuarios: Usuario[] = [];
  filteredUsuarios: Usuario[] = [];
  searchQuery = '';
  showOptions: any = null; // Almacena el usuario cuyo menú está visible

  // Variables para los filtros
  selectedTurno = '';
  selectedGrupo = '';
  selectedEspecialidad = '';
  selectedSemestre: number | '' = ''; // Filtro de semestre


  // Listas únicas para cada filtro
  turnos: string[] = [];
  grupos: string[] = [];
  especialidades: string[] = [];
  semestres: number[] = []; // Lista de semestres únicos

  nuevoAlumno: Usuario = { grupo: '', nombre: '', apellido: '', rol: '', numero_control: '', especialidad: '', semestre: 0, turno: '', correo: '' };

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.getUsuarios().subscribe(
      (data) => {
        this.usuarios = data;
        this.filteredUsuarios = data;

        // Inicializa los valores únicos para los filtros
        this.turnos = Array.from(new Set(this.usuarios.map(usuario => usuario.turno)));
        this.grupos = Array.from(new Set(this.usuarios.map(usuario => usuario.grupo)));
        this.especialidades = Array.from(new Set(this.usuarios.map(usuario => usuario.especialidad)));
        this.semestres = Array.from(new Set(this.usuarios.map(usuario => usuario.semestre)));

      },
      (error) => console.error('Error al obtener usuarios:', error)
    );

    this.checkScreenSize();
    document.addEventListener('click', this.hideOptionsDropdown.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.hideOptionsDropdown.bind(this));
  }
  // Escucha el cambio de tamaño de la ventana
  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  onSearch() {
    this.applyFilters();
  }

  // Aplica los filtros según los valores seleccionados
  applyFilters() {
    this.filteredUsuarios = this.usuarios.filter(usuario => {
      const matchesSearch =
        usuario.nombre.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        usuario.apellido.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        usuario.numero_control.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesTurno = this.selectedTurno ? usuario.turno === this.selectedTurno : true;
      const matchesGrupo = this.selectedGrupo ? usuario.grupo === this.selectedGrupo : true;
      const matchesEspecialidad = this.selectedEspecialidad ? usuario.especialidad === this.selectedEspecialidad : true;
      const matchesSemestre = this.selectedSemestre ? usuario.semestre == this.selectedSemestre : true; // Filtro de semestre


      return matchesSearch && matchesTurno && matchesGrupo && matchesEspecialidad && matchesSemestre;
    });
  }

  isModalOpen = false;
  areFiltersVisible = false;

  // Función para alternar entre modal y filtros según el tamaño de pantalla
  toggleFilters() {
    if (window.innerWidth <= 768) {
      this.isModalOpen = !this.isModalOpen; // Pantallas pequeñas: alterna el modal
    } else {
      this.areFiltersVisible = !this.areFiltersVisible; // Pantallas grandes: muestra/oculta filtros
    }
  }

  // Verifica el tamaño de la pantalla y ajusta la visibilidad de los filtros
  private checkScreenSize() {
    if (window.innerWidth > 768) {
      this.isModalOpen = false; // Oculta el modal si la pantalla es grande
    } else {
      this.areFiltersVisible = false; // Oculta los filtros grandes si la pantalla es pequeña
    }
  }

  // Variables para el estado de turno y los iconos/texto asociados
  turnoMatutino = true; // Estado inicial
  turnoIcono = 'fi fi-ss-clouds-sun';

  // Alterna el turno y actualiza el icono y texto, también aplica el filtro
  toggleTurno() {
    this.turnoMatutino = !this.turnoMatutino;

    // Cambia el ícono según el turno
    if (this.turnoMatutino) {
      this.turnoIcono = 'fi fi-ss-clouds-sun';
      this.selectedTurno = 'Matutino'; // Asegúrate de que el valor del filtro se actualice
    } else {
      this.turnoIcono = 'fi fi-ss-clouds-moon';
      this.selectedTurno = 'Vespertino'; // Asegúrate de que el valor del filtro se actualice
    }

    // Aplica los filtros después de cambiar el turno
    this.applyFilters();
  }

  toggleOptionsDropdown(event: Event, usuario: any) {
    event.stopPropagation(); // Evita que el evento se propague
    this.showOptions = this.showOptions === usuario ? null : usuario;
  }

  hideOptionsDropdown() {
    this.showOptions = null;
  }

  editStudent(usuario: any) {
    console.log('Editar estudiante:', usuario);
  }

  deleteStudent(usuario: any) {
    console.log('Eliminar estudiante:', usuario);
  }

  copyStudent(usuario: any) {
    console.log('Copiar estudiante:', usuario);
  }
}
