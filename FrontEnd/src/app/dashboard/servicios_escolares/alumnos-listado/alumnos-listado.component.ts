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

  nuevoAlumno = {
    correo_institucional: 'alumno@ejemplo.com',
    nombre: 'Juan',
    apellido: 'Pérez',
    rol: 'Alumno',
    password: '123456',
    numero_control: '12345',
    especialidad: 'Ingeniería',
    semestre: 6,
    grupo: 'A',
    turno: 'Matutino',
    curp: 'ABC123456HXYZLLL00',
    foto: "data:image/png;base64,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" 
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
    this.usuarioService.getAlumnos().subscribe({
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
    const { correo_institucional, nombre, apellido, rol, password, numero_control, especialidad, semestre, grupo, turno, curp, foto } = this.nuevoAlumno;
  
    if (!correo_institucional || !nombre || !apellido || !rol || !password) {
      console.error('Faltan datos obligatorios para registrar el alumno');
      return;
    }
  
    this.usuarioService
      .registrarUsuario({
        correo_institucional,
        nombre,
        apellido,
        rol,
        password,
        numero_control,
        especialidad,
        semestre,
        grupo,
        turno,
        curp,
        foto,
      })
      .subscribe(
        (response) => {
          console.log('Alumno registrado exitosamente:', response);
  
          // Enviar correo después del registro
          const tipo = 'EmailVerify';
          this.emailService
            .enviarCorreo(correo_institucional, nombre, tipo)
            .then(() => {
              console.log('Correo enviado desde el componente');
              this.closeAddStudentModal();
            })
            .catch((error) => console.error('Error al enviar el correo:', error));
        },
        (error) => {
          console.error('Error al registrar al alumno:', error);
        }
      );
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
