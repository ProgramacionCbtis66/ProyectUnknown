import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { AuthService } from '../../../Core/service/auth.service';
import { EmailService } from '../../../Core/service/email.service';
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
  selector: 'app-alumnos-listado',
  templateUrl: './alumnos-listado.component.html',
  styleUrls: ['./alumnos-listado.component.css'],
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
    semestre: '' as number | '',
  };
  filterOptions = {
    turnos: [] as string[],
    grupos: [] as string[],
    especialidades: [] as string[],
    semestres: [] as number[],
  };

  uiState = {
    isModalOpen: false,
    areFiltersVisible: false,
    turnoMatutino: true,
    turnoIcono: 'fi fi-ss-clouds-sun',
  };

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
    curp: '',
  };
  isAddStudentModalOpen = false;
  isEditStudentModalOpen = false; // Controla la visibilidad del modal de edición
  selectedStudent: any = {
    nombre: '',
    apellido: '',
    correo_institucional: '',
    detalles: {
      numero_control: '',
      semestre: '',
      especialidad: '',
      turno: '',
      grupo: ''
    }
  };


  constructor(
    private readonly authService: AuthService,
    private emailService: EmailService,
    private usuarioService: UsuarioService
  ) {}
  
  @HostListener('window:resize')

  ngOnInit(): void {
    this.fetchUsuarios();
    this.checkScreenSize();
    document.addEventListener('click', this.hideOptionsDropdown.bind(this));
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.hideOptionsDropdown.bind(this));
  }

  private fetchUsuarios(): void {
    this.authService.getUsuarios().subscribe({
      next: (data: Usuario[]) => {
        console.log('Datos recibidos:', data);
        this.usuarios = data;
        this.filteredUsuarios = data;
        this.initializeFilterOptions();
      },
      error: (error) => console.error('Error al obtener usuarios:', error),
    });
  }

  private initializeFilterOptions(): void {
    this.filterOptions.turnos = this.getUniqueValues('detalles.turno');
    this.filterOptions.grupos = this.getUniqueValues('detalles.grupo');
    this.filterOptions.especialidades = this.getUniqueValues(
      'detalles.especialidad'
    );
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


  onResize(): void {
    this.checkScreenSize();
  }

  onSearch(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredUsuarios = this.usuarios.filter(
      (usuario) =>
        this.matchesSearch(usuario) && this.matchesSelectedFilters(usuario)
    );
  }

  private matchesSelectedFilters(usuario: Usuario): boolean {
    const { detalles } = usuario;
    if (!detalles) return false;

    return (
      (!this.selectedFilters.turno ||
        detalles.turno === this.selectedFilters.turno) &&
      (!this.selectedFilters.grupo ||
        detalles.grupo === this.selectedFilters.grupo) &&
      (!this.selectedFilters.especialidad ||
        detalles.especialidad === this.selectedFilters.especialidad) &&
      (!this.selectedFilters.semestre ||
        String(detalles.semestre) === String(this.selectedFilters.semestre))
    );
  }

  private matchesSearch(usuario: Usuario): boolean {
    const query = this.searchQuery.toLowerCase();
    const { nombre, apellido, detalles } = usuario;

    return (
      nombre.toLowerCase().includes(query) ||
      apellido.toLowerCase().includes(query) ||
      (detalles?.numero_control?.toLowerCase()?.includes(query) ?? false)
    );
  }

  toggleFilters(): void {
    if (window.innerWidth <= 768) {
      this.uiState.isModalOpen = !this.uiState.isModalOpen;
    } else {
      this.uiState.areFiltersVisible = !this.uiState.areFiltersVisible;
    }
  }

  private checkScreenSize(): void {
    if (window.innerWidth > 768) {
      this.uiState.isModalOpen = false;
    } else {
      this.uiState.areFiltersVisible = false;
    }
  }

  toggleTurno(): void {
    this.uiState.turnoMatutino = !this.uiState.turnoMatutino;
    this.selectedFilters.turno = this.uiState.turnoMatutino
      ? 'Matutino'
      : 'Vespertino';
    this.uiState.turnoIcono = this.uiState.turnoMatutino
      ? 'fi fi-ss-clouds-sun'
      : 'fi fi-ss-clouds-moon';
    this.applyFilters();
  }

  toggleOptionsDropdown(event: Event, usuario: Usuario): void {
    event.stopPropagation();
    this.showOptions = this.showOptions === usuario ? null : usuario;
  }

  hideOptionsDropdown(): void {
    this.showOptions = null;
  }

  editStudent(usuario: Usuario): void {
    this.selectedStudent = { ...usuario }; // Clonar el objeto usuario para evitar modificarlo directamente
    this.isEditStudentModalOpen = true; // Abrir el modal
  }
  
  closeEditStudentModal(): void {
    this.isEditStudentModalOpen = false; // Cerrar el modal
    this.selectedStudent = null; // Limpiar la selección
  }
  

  deleteStudent(usuario: Usuario): void {
    if (!usuario) return;
  
    const usuarioId = usuario.id;
  
    this.usuarioService.deleteUsuario(usuarioId).subscribe({
      next: () => {
        console.log(`Usuario eliminado: ID ${usuarioId}`);
        const { correo_institucional, nombre } = usuario;
        const tipo = 'UserDelete';
  
        if (correo_institucional && nombre) {
          this.emailService
            .enviarCorreo(correo_institucional, nombre, tipo)
            .then(() => console.log('Correo enviado correctamente.'))
            .catch((error) => console.error('Error al enviar el correo:', error));
        } else {
          console.warn('Datos incompletos para enviar correo:', { correo_institucional, nombre });
        }
  
        this.fetchUsuarios(); // Refresca la lista de usuarios
        this.closeEditStudentModal(); // Cierra el modal
      },
      error: (err) => console.error('Error al eliminar usuario:', err),
    });
  }
  

  copyStudent(usuario: Usuario): void {
    console.log('Copiar estudiante:', usuario);
  }

  openAddStudentModal(): void {
    this.isAddStudentModalOpen = true;
  }

  closeAddStudentModal(): void {
    this.isAddStudentModalOpen = false;
  }

  addStudent(): void {
    const { correoInstitucional, nombre } = this.correoData;
    const tipo = 'EmailVerify';

    if (correoInstitucional && nombre) {
      this.emailService
        .enviarCorreo(correoInstitucional, nombre, tipo)
        .then(() => {
          console.log('Correo enviado desde el componente');
          this.closeAddStudentModal();
        })
        .catch((error) => console.error('Error al enviar el correo:', error));
    } else {
      console.error('Faltan datos para enviar el correo');
    }
  }

  updateStudent(): void {
    if (!this.selectedStudent) return;
  
    // Aplanar los datos de selectedStudent
    const usuarioActualizado = {
      id: this.selectedStudent.id,
      rol: this.selectedStudent.rol,
      nombre: this.selectedStudent.nombre,
      apellido: this.selectedStudent.apellido,
      numero_control: this.selectedStudent.detalles?.numero_control,
      semestre: this.selectedStudent.detalles?.semestre,
      especialidad: this.selectedStudent.detalles?.especialidad,
      turno: this.selectedStudent.detalles?.turno,
      grupo: this.selectedStudent.detalles?.grupo,
    };
  
    // Llamar al servicio para actualizar el usuario
    this.usuarioService.updateUsuario(usuarioActualizado).subscribe({
      next: () => {
        console.log('Usuario actualizado:', usuarioActualizado);
        const { correo_institucional, nombre } = this.selectedStudent;
        const tipo = 'UserUpdateNotification';
    
        if (correo_institucional && nombre) {
          this.emailService
            .enviarCorreo(correo_institucional, nombre, tipo)
            .then(() => {
              console.log('Correo enviado desde el componente');
              this.closeAddStudentModal();
            })
            .catch((error) => console.error('Error al enviar el correo:', error));
        } else {
          console.error('Faltan datos para enviar el correo');
          console.log(correo_institucional, nombre);
        }
        this.fetchUsuarios(); // Actualizar la lista de usuarios
        this.closeEditStudentModal();
      },
      error: (err) => console.error('Error al actualizar usuario:', err),
    });
  }
  
  

}
