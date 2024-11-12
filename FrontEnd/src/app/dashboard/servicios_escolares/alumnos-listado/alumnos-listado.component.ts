import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Core/service/auth.service';
import Notiflix from 'notiflix';


declare var bootstrap: any; // Para poder usar Bootstrap en Angular

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
  isDropdownVisible: boolean; // Cambiar de 'false' a 'boolean'
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

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getUsers().subscribe(
      (data) => {
        // Asegurarse de que cada usuario tenga la propiedad isDropdownVisible en false
        this.usuarios = data.map(usuario => ({
          ...usuario,
          isDropdownVisible: false // Inicializa isDropdownVisible como false para cada usuario
        }));
  
        this.filteredUsuarios = this.usuarios;
        
        // Inicializa los valores únicos para los filtros
        this.turnos = Array.from(new Set(this.usuarios.map(usuario => usuario.turno)));
        this.grupos = Array.from(new Set(this.usuarios.map(usuario => usuario.grupo)));
        this.especialidades = Array.from(new Set(this.usuarios.map(usuario => usuario.especialidad)));
      },
      (error) => console.error('Error al obtener usuarios:', error)
    );
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

  nuevoAlumno = {
    correo_institucional: '',
    nombre: '',
    apellido: '',
    rol: 'Alumno',
    password: '',
    numero_control: '',
    especialidad: '',
    semestre: "1",
    turno: '',
    curp: '',
    grupo: '',
    foto: 'data:image/png;base64,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',
  };

  abrirModal() {
    const modalElement = document.getElementById('alumnoModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  guardarAlumno() {
        // Aquí validas si los campos del alumno son válidos, dependiendo de tu lógica
        if (this.nuevoAlumno.correo_institucional && this.nuevoAlumno.nombre && this.nuevoAlumno.apellido) {
          this.authService.registerAlum(this.nuevoAlumno).subscribe(
            response => {
              // Muestra un mensaje de éxito
              Notiflix.Notify.success('Alumno registrado exitosamente');
              console.log(this.nuevoAlumno);
              console.log(response); // Muestra la respuesta del servidor si es necesario
            },
            error => {
              // Muestra un mensaje de error
              Notiflix.Notify.success('Hubo un error al registrar al alumno');
            }
          );
        } else {
          Notiflix.Notify.failure('Hubo un error al registrar al alumno');
        }
    console.log('Alumno guardado:', this.nuevoAlumno);
  }

  
  options = ['Editar', 'Eliminar', 'Copiar'];

  toggleDropdown(usuario: Usuario): void {
    usuario.isDropdownVisible = !usuario.isDropdownVisible;
  }
  
  

  selectOption(option: string, usuario: Usuario): void {
    console.log('Opción seleccionada:', option);
    usuario.isDropdownVisible = false; // Ocultar el menú después de seleccionar
  }
  
  
}
