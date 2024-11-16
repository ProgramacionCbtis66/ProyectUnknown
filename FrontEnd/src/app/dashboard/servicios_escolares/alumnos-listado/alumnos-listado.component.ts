import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { AuthService } from '../../../Core/service/auth.service';
import { EmailService } from '../../../Core/service/email.service';

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
export class AlumnosListadoComponent implements OnInit, OnDestroy {
  usuarios: Usuario[] = [];
  filteredUsuarios: Usuario[] = [];
  searchQuery = '';
  showOptions: Usuario | null = null;
  selectedFilters = {
    turno: '',
    grupo: '',
    especialidad: '',
    semestre: '' as number | ''
  };
  filterOptions = {
    turnos: [] as string[],
    grupos: [] as string[],
    especialidades: [] as string[],
    semestres: [] as number[]
  };

  uiState = {
    isModalOpen: false,
    areFiltersVisible: false,
    turnoMatutino: true,
    turnoIcono: 'fi fi-ss-clouds-sun'
  };



  // Declaración de datos para el nuevo alumno
  correoData = {
    nombre: '',
    apellido: '',
    correoInstitucional: '',
    contrasena: '',
    semestre: null,
    grupo: '',
    especialidad: '',
    numeroControl: '',
    turno: '',
    curp: ''
  };
  isAddStudentModalOpen = false;

  constructor(
    private readonly authService: AuthService,
    private emailService: EmailService
  ) { }

  ngOnInit() {
    this.fetchUsuarios();
    this.checkScreenSize();
    document.addEventListener('click', this.hideOptionsDropdown.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.hideOptionsDropdown.bind(this));
  }

  private fetchUsuarios() {
    this.authService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.filteredUsuarios = data;
        this.initializeFilterOptions();
      },
      error: (error) => console.error('Error al obtener usuarios:', error)
    });
  }

  private initializeFilterOptions() {
    this.filterOptions.turnos = this.getUniqueValues('turno');
    this.filterOptions.grupos = this.getUniqueValues('grupo');
    this.filterOptions.especialidades = this.getUniqueValues('especialidad');
    this.filterOptions.semestres = this.getUniqueValues('semestre');
  }

  private getUniqueValues(key: keyof Usuario): any[] {
    return Array.from(new Set(this.usuarios.map(usuario => usuario[key])));
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  onSearch() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredUsuarios = this.usuarios.filter(usuario =>
      this.matchesSearch(usuario) && this.matchesSelectedFilters(usuario)
    );
  }

  private matchesSelectedFilters(usuario: Usuario): boolean {
    return (!this.selectedFilters.turno || usuario.turno === this.selectedFilters.turno) &&
      (!this.selectedFilters.grupo || usuario.grupo === this.selectedFilters.grupo) &&
      (!this.selectedFilters.especialidad || usuario.especialidad === this.selectedFilters.especialidad) &&
      (!this.selectedFilters.semestre || String(usuario.semestre) === String(this.selectedFilters.semestre));
  }

  private matchesSearch(usuario: Usuario): boolean {
    const query = this.searchQuery.toLowerCase();
    return usuario.nombre.toLowerCase().includes(query) ||
      usuario.apellido.toLowerCase().includes(query) ||
      usuario.numero_control.toLowerCase().includes(query);
  }

  toggleFilters() {
    if (window.innerWidth <= 768) {
      this.uiState.isModalOpen = !this.uiState.isModalOpen;
    } else {
      this.uiState.areFiltersVisible = !this.uiState.areFiltersVisible;
    }
  }

  private checkScreenSize() {
    if (window.innerWidth > 768) {
      this.uiState.isModalOpen = false;
    } else {
      this.uiState.areFiltersVisible = false;
    }
  }

  toggleTurno() {
    this.uiState.turnoMatutino = !this.uiState.turnoMatutino;
    this.selectedFilters.turno = this.uiState.turnoMatutino ? 'Matutino' : 'Vespertino';
    this.uiState.turnoIcono = this.uiState.turnoMatutino ? 'fi fi-ss-clouds-sun' : 'fi fi-ss-clouds-moon';
    this.applyFilters();
  }

  toggleOptionsDropdown(event: Event, usuario: Usuario) {
    event.stopPropagation();
    this.showOptions = this.showOptions === usuario ? null : usuario;
  }

  hideOptionsDropdown() {
    this.showOptions = null;
  }

  editStudent(usuario: Usuario) {
    console.log('Editar estudiante:', usuario);
  }

  deleteStudent(usuario: Usuario) {
    console.log('Eliminar estudiante:', usuario);
  }

  copyStudent(usuario: Usuario) {
    console.log('Copiar estudiante:', usuario);
  }

  openAddStudentModal() {
    this.isAddStudentModalOpen = true;
  }

  closeAddStudentModal() {
    this.isAddStudentModalOpen = false;
  }

  // Función para enviar datos del nuevo alumno
  enviarCorreo() {
    const { correoInstitucional, nombre } = this.correoData;
    const tipo = "EmailVerify"
  
    if (correoInstitucional && nombre) {
      this.emailService.enviarCorreo(correoInstitucional, nombre, tipo)
        .then(() => {
          console.log("Correo enviado desde el componente");
          this.closeAddStudentModal();
        })
        .catch((error) => console.error("Error al enviar el correo:", error));
    } else {
      console.error("Faltan datos para enviar el correo");
    }
  }
  
}
