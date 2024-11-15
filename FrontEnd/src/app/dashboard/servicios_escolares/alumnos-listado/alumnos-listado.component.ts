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

  selectedTurno = '';
  selectedGrupo = '';
  selectedEspecialidad = '';
  selectedSemestre: number | '' = '';

  turnos: string[] = [];
  grupos: string[] = [];
  especialidades: string[] = [];
  semestres: number[] = [];

  isModalOpen = false;  
  areFiltersVisible = false;
  turnoMatutino = true;
  turnoIcono = 'fi fi-ss-clouds-sun';

  constructor(private readonly authService: AuthService, private emailService: EmailService) { }

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
        this.initializeUniqueFilterValues();
      },
      error: (error) => console.error('Error al obtener usuarios:', error)
    });
  }

  private initializeUniqueFilterValues() {
    this.turnos = Array.from(new Set(this.usuarios.map(usuario => usuario.turno)));
    this.grupos = Array.from(new Set(this.usuarios.map(usuario => usuario.grupo)));
    this.especialidades = Array.from(new Set(this.usuarios.map(usuario => usuario.especialidad)));
    this.semestres = Array.from(new Set(this.usuarios.map(usuario => usuario.semestre)));
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
      this.matchesSearch(usuario) &&
      this.matchesSelectedFilters(usuario)
    );
  }
  
  private matchesSelectedFilters(usuario: Usuario): boolean {
    return (!this.selectedTurno || usuario.turno === this.selectedTurno) &&
           (!this.selectedGrupo || usuario.grupo === this.selectedGrupo) &&
           (!this.selectedEspecialidad || usuario.especialidad === this.selectedEspecialidad) &&
           (!this.selectedSemestre || String(usuario.semestre) === String(this.selectedSemestre));
  }
  

  private matchesSearch(usuario: Usuario): boolean {
    const query = this.searchQuery.toLowerCase();
    return usuario.nombre.toLowerCase().includes(query) ||
           usuario.apellido.toLowerCase().includes(query) ||
           usuario.numero_control.toLowerCase().includes(query);
  }

  toggleFilters() {
    if (window.innerWidth <= 768) {
      this.isModalOpen = !this.isModalOpen;
    } else {
      this.areFiltersVisible = !this.areFiltersVisible;
    }
  }

  private checkScreenSize() {
    if (window.innerWidth > 768) {
      this.isModalOpen = false;
    } else {
      this.areFiltersVisible = false;
    }
  }

  toggleTurno() {
    this.turnoMatutino = !this.turnoMatutino;
    this.selectedTurno = this.turnoMatutino ? 'Matutino' : 'Vespertino';
    this.turnoIcono = this.turnoMatutino ? 'fi fi-ss-clouds-sun' : 'fi fi-ss-clouds-moon';
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

// Variables actuales
correoData = { destinatario: '', nombre: '' };
isAddStudentModalOpen = false;

openAddStudentModal() {
    this.isAddStudentModalOpen = true;
}

closeAddStudentModal() {
    this.isAddStudentModalOpen = false;
}



enviarCorreo() {
  const { destinatario, nombre } = this.correoData;

  if (destinatario && nombre) {
    this.emailService.enviarCorreo(destinatario, nombre)
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
