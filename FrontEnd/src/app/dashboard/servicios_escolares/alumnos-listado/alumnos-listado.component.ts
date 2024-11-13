import { Component, OnInit } from '@angular/core';
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

  // Variables para los filtros
  selectedTurno = '';
  selectedGrupo = '';
  selectedEspecialidad = '';

  // Listas únicas para cada filtro
  turnos: string[] = [];
  grupos: string[] = [];
  especialidades: string[] = [];

  // Modal y nuevo alumno
  isModalOpen = false;
  nuevoAlumno: Usuario = { grupo: '', nombre: '', apellido: '', rol: '', numero_control: '', especialidad: '', semestre: 0, turno: '', correo: '' };

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getUsuarios().subscribe(
      (data) => {
        this.usuarios = data;
        this.filteredUsuarios = data;
        
        // Inicializa los valores únicos para los filtros
        this.turnos = Array.from(new Set(this.usuarios.map(usuario => usuario.turno)));
        this.grupos = Array.from(new Set(this.usuarios.map(usuario => usuario.grupo)));
        this.especialidades = Array.from(new Set(this.usuarios.map(usuario => usuario.especialidad)));
      },
      (error) => console.error('Error al obtener usuarios:', error)
    );

    document.addEventListener('click', this.closeContextMenu.bind(this));

  }

  ngOnDestroy() {
    document.removeEventListener('click', this.closeContextMenu.bind(this));
  }
  

  onSearch() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredUsuarios = this.usuarios.filter(usuario => {
      const matchesSearch =
        usuario.nombre.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        usuario.apellido.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        usuario.numero_control.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesTurno = this.selectedTurno ? usuario.turno === this.selectedTurno : true;
      const matchesGrupo = this.selectedGrupo ? usuario.grupo === this.selectedGrupo : true;
      const matchesEspecialidad = this.selectedEspecialidad ? usuario.especialidad === this.selectedEspecialidad : true;

      return matchesSearch && matchesTurno && matchesGrupo && matchesEspecialidad;
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.nuevoAlumno = { grupo: '', nombre: '', apellido: '', rol: '', numero_control: '', especialidad: '', semestre: 0, turno: '', correo: '' };
  }

  addAlumno() {
    // Aquí puedes agregar la lógica para añadir el nuevo alumno a tu lista o hacer una llamada al servicio
    console.log('Nuevo alumno:', this.nuevoAlumno);
    this.closeModal();
  }

  // Propiedades para el menú contextual
  isContextMenuVisible = false;
  contextMenuPosition = { x: '0px', y: '0px' };
  selectedAlumno!: Usuario;

  // Método para abrir el menú contextual
  onRightClick(event: MouseEvent, alumno: Usuario) {
    event.preventDefault();
    this.isContextMenuVisible = true;
    this.contextMenuPosition = {
      x: `${event.clientX}px`,
      y: `${event.clientY}px`
    };
    this.selectedAlumno = alumno;
  }

  // Métodos para cada acción del menú
  copyNumeroControl() {
    navigator.clipboard.writeText(this.selectedAlumno.numero_control);
    this.closeContextMenu();
  }

  copyNombre() {
    navigator.clipboard.writeText(`${this.selectedAlumno.nombre} ${this.selectedAlumno.apellido}`);
    this.closeContextMenu();
  }

  copyDatos() {
    const datos = `Nombre: ${this.selectedAlumno.nombre} ${this.selectedAlumno.apellido} Num.C: ${this.selectedAlumno.numero_control}`;
    navigator.clipboard.writeText(datos);
    this.closeContextMenu();
  }

  eliminarAlumno() {
    // Lógica para eliminar al alumno
    console.log('Eliminando alumno:', this.selectedAlumno);
    this.closeContextMenu();
  }

  editarAlumno() {
    // Lógica para editar al alumno
    console.log('Editando alumno:', this.selectedAlumno);
    this.closeContextMenu();
  }

  // Cierra el menú contextual
  closeContextMenu() {
    this.isContextMenuVisible = false;
  }
}

