import { Component } from '@angular/core';
import { UsuarioService } from 'src/app/Core/service/usuario.service';

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  rol: string;
  foto?: string;
  correo_institucional: string;
  detalles?: {
    numero_control: string;
    especialidad: string;
    semestre: number;
    turno: string;
    grupo: string;
  };
}

@Component({
  selector: 'app-alumnos-entrega-horarios',
  templateUrl: './alumnos-entrega-horarios.component.html',
  styleUrls: ['./alumnos-entrega-horarios.component.css']
})
export class AlumnosEntregaHorariosComponent {
  usuarios: Usuario[] = [];
  gruposDisplay: string[] = [];

  // Filtros
  selectedFilters = {
    grupo: '',
    especialidad: '',
    semestre: '' as number | ''
  };

  filterOptions = {
    grupos: [] as string[],
    especialidades: [] as string[],
    semestres: [] as number[]
  };

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.fetchUsuarios();
  }

  private fetchUsuarios(): void {
    this.usuarioService.getAlumnos().subscribe({
      next: (data: Usuario[]) => {
        this.usuarios = data;
        this.initializeFilterOptions();
        this.applyFilters();
      },
      error: (error) => console.error('Error al obtener usuarios:', error)
    });
  }

  private initializeFilterOptions(): void {
    this.filterOptions.grupos = this.getUniqueValues('detalles.grupo');
    this.filterOptions.especialidades = this.getUniqueValues('detalles.especialidad');
    this.filterOptions.semestres = this.getUniqueValues('detalles.semestre');
  }

  private getUniqueValues(key: string): any[] {
    return Array.from(
      new Set(
        this.usuarios
          .map((usuario) => {
            const keys = key.split('.');
            return keys.reduce((obj, k) => obj?.[k], usuario) || null;
          })
          .filter((value) => value !== null)
      )
    );
  }

  applyFilters(): void {
    // Filtramos los usuarios según los filtros seleccionados
    const filteredUsuarios = this.usuarios.filter((usuario) => this.matchesSelectedFilters(usuario));
    this.gruposDisplay = Array.from(
      new Set(
        filteredUsuarios.map((u) => {
          const s = u.detalles?.semestre;
          const g = u.detalles?.grupo;
          return s && g ? `${s}${g}` : '';
        })
        .filter((val) => val !== '')
      )
    );
  }

  private matchesSelectedFilters(usuario: Usuario): boolean {
    const { detalles } = usuario;
    if (!detalles) return false;

    return (
      (!this.selectedFilters.grupo || detalles.grupo === this.selectedFilters.grupo) &&
      (!this.selectedFilters.especialidad || detalles.especialidad === this.selectedFilters.especialidad) &&
      (!this.selectedFilters.semestre || String(detalles.semestre) === String(this.selectedFilters.semestre))
    );
  }

  resetFilters(): void {
    this.selectedFilters = {
      grupo: '',
      especialidad: '',
      semestre: ''
    };
    this.applyFilters();
  }

  onUpload(grupo: string): void {
    console.log('Acción de subir para el grupo:', grupo);
    // Lógica de subir
  }

  onEdit(grupo: string): void {
    console.log('Acción de editar para el grupo:', grupo);
    // Lógica de edición
  }
}
