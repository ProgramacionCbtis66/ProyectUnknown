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
}
