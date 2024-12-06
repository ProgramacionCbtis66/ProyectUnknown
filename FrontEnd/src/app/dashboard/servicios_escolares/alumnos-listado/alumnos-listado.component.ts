import { Component, OnInit, HostListener, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { EmailService } from '../../../Core/service/email.service';
import { UsuarioService } from 'src/app/Core/service/usuario.service';
import { DomSanitizer } from '@angular/platform-browser';

// Interfaces
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
  @ViewChild('modalFilters') modalFilters!: ElementRef;
  @ViewChild('modalOptions') modalOptions!: ElementRef;
  
  // Variables para el manejo del gesto táctil
  translateY: number = 0;
  startY: number = 0;
  currentY: number = 0;
  isDragging: boolean = false;
  private readonly THRESHOLD = 100;
  private readonly MAX_DRAG = 200;

  // Variables para el modal de opciones
  isOptionsModalOpen = false;
  translateYOptions: number = 0;
  startYOptions: number = 0;
  currentYOptions: number = 0;
  isDraggingOptions: boolean = false;
  selectedStudentForOptions: Usuario | null = null;

  // Datos de Usuarios
  usuarios: Usuario[] = [];
  filteredUsuarios: Usuario[] = [];
  searchQuery = '';
  showOptions: Usuario | null = null;

  // Filtros
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

  // Estado de la UI
  uiState = {
    isModalOpen: false,
    areFiltersVisible: false,
    turnoMatutino: true,
    turnoIcono: 'fi fi-ss-clouds-sun',
  };

  // Modales
  isAddStudentModalOpen = false;
  isEditStudentModalOpen = false;

  addStudent(): void {
    const {
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
      foto
    } = this.nuevoAlumno;
  
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
      .subscribe({
        next: (response) => {
          console.log('Alumno registrado exitosamente:', response);
          const tipo = 'EmailVerify';
          this.emailService
            .enviarCorreo(correo_institucional, nombre, tipo)
            .then(() => {
              console.log('Correo enviado desde el componente');
              this.closeAddStudentModal();
            })
            .catch((error) => console.error('Error al enviar el correo:', error));
        },
        error: (error) => {
          console.error('Error al registrar al alumno:', error);
        }
      });
  }
  
  updateStudent(): void {
    if (!this.selectedStudent) return;
  
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
      foto: this.selectedStudent.foto
    };
  
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
              this.closeEditStudentModal();
            })
            .catch((error) => console.error('Error al enviar el correo:', error));
        } else {
          console.error('Faltan datos para enviar el correo');
          console.log(correo_institucional, nombre);
        }
  
        this.fetchUsuarios();
        this.closeEditStudentModal();
      },
      error: (err) => console.error('Error al actualizar usuario:', err),
    });
  }
  
  // Nuevo Alumno
  nuevoAlumno = {
    correo_institucional: '',
    nombre: '',
    apellido: '',
    rol: 'Alumno',
    password: '',
    numero_control: '',
    especialidad: '',
    semestre: 1,
    grupo: '',
    turno: 'Matutino',
    curp: '',
    foto: "data:image/png;base64,..." // Tu string base64 aquí
  };

  // Estudiante Seleccionado para Edición
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
    private emailService: EmailService,
    private usuarioService: UsuarioService,
    private sanitizer: DomSanitizer
  ) {}

  // Eventos táctiles para filtros
  onTouchStart(event: TouchEvent) {
    this.isDragging = true;
    this.startY = event.touches[0].clientY;
    this.currentY = this.startY;
  }

  onTouchMove(event: TouchEvent) {
    if (!this.isDragging) return;
    const deltaY = event.touches[0].clientY - this.startY;
    this.currentY = event.touches[0].clientY;
    
    if (deltaY < 0) {
      this.translateY = deltaY / 3;
    } else {
      this.translateY = deltaY;
    }

    this.translateY = Math.min(Math.max(this.translateY, -this.MAX_DRAG), this.MAX_DRAG);
  }

  onTouchEnd(event: TouchEvent) {
    if (!this.isDragging) return;
    const deltaY = this.currentY - this.startY;
    
    if (deltaY > this.THRESHOLD) {
      this.closeModalWithAnimation();
    } else {
      this.resetPosition();
    }
    
    this.isDragging = false;
  }

  // Eventos táctiles para opciones
  onTouchStartOptions(event: TouchEvent) {
    this.isDraggingOptions = true;
    this.startYOptions = event.touches[0].clientY;
    this.currentYOptions = this.startYOptions;
  }

  onTouchMoveOptions(event: TouchEvent) {
    if (!this.isDraggingOptions) return;
    const deltaY = event.touches[0].clientY - this.startYOptions;
    this.currentYOptions = event.touches[0].clientY;
    
    if (deltaY < 0) {
      this.translateYOptions = deltaY / 3;
    } else {
      this.translateYOptions = deltaY;
    }

    this.translateYOptions = Math.min(Math.max(this.translateYOptions, -this.MAX_DRAG), this.MAX_DRAG);
  }

  onTouchEndOptions(event: TouchEvent) {
    if (!this.isDraggingOptions) return;
    const deltaY = this.currentYOptions - this.startYOptions;
    
    if (deltaY > this.THRESHOLD) {
      this.closeOptionsModalWithAnimation();
    } else {
      this.resetOptionsPosition();
    }
    
    this.isDraggingOptions = false;
  }

  // Métodos de control de modales
  openOptionsModal(usuario: Usuario): void {
    if (window.innerWidth <= 768) {
      this.selectedStudentForOptions = usuario;
      this.isOptionsModalOpen = true;
      this.translateYOptions = 0;
    }
  }

  closeOptionsModal(): void {
    this.closeOptionsModalWithAnimation();
  }

  private closeModalWithAnimation() {
    const modalContent = this.modalFilters.nativeElement.querySelector('.modal-content-filters');
    modalContent.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    modalContent.style.transform = 'translateY(100%)';
    
    setTimeout(() => {
      this.uiState.isModalOpen = false;
      this.translateY = 0;
      modalContent.style.transform = '';
    }, 300);
  }

  private resetPosition() {
    const modalContent = this.modalFilters.nativeElement.querySelector('.modal-content-filters');
    modalContent.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    modalContent.style.transform = '';
    this.translateY = 0;
    
    setTimeout(() => {
      modalContent.style.transition = '';
    }, 300);
  }

  private closeOptionsModalWithAnimation() {
    const modalContent = this.modalOptions.nativeElement.querySelector('.modal-content-options');
    modalContent.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    modalContent.style.transform = 'translateY(100%)';
    
    setTimeout(() => {
      this.isOptionsModalOpen = false;
      this.translateYOptions = 0;
      modalContent.style.transform = '';
      this.selectedStudentForOptions = null;
    }, 300);
  }

  private resetOptionsPosition() {
    const modalContent = this.modalOptions.nativeElement.querySelector('.modal-content-options');
    modalContent.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    modalContent.style.transform = '';
    this.translateYOptions = 0;
    
    setTimeout(() => {
      modalContent.style.transition = '';
    }, 300);
  }

  // Métodos de manipulación de estudiantes
  toggleOptionsDropdown(event: Event, usuario: Usuario): void {
    if (window.innerWidth > 768) {
      event.stopPropagation();
      this.showOptions = this.showOptions === usuario ? null : usuario;
    }
  }

  editStudent(usuario: Usuario | null): void {
    if (!usuario) return;
    this.selectedStudent = { ...usuario };
    this.isEditStudentModalOpen = true;
    if (this.isOptionsModalOpen) {
      this.closeOptionsModal();
    }
  }

  deleteStudent(usuario: Usuario | null): void {
    if (!usuario) return;
    const usuarioId = usuario.id;

    if (this.isOptionsModalOpen) {
      this.closeOptionsModal();
    }

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

        this.fetchUsuarios();
        this.closeEditStudentModal();
      },
      error: (err) => console.error('Error al eliminar usuario:', err),
    });
  }

  copyStudent(usuario: Usuario | null): void {
    if (!usuario) return;
    if (this.isOptionsModalOpen) {
      this.closeOptionsModal();
    }
    console.log('Copiar estudiante:', usuario);
  }

  openAddStudentModal(): void {
    this.isAddStudentModalOpen = true;
  }

  closeAddStudentModal(): void {
    this.isAddStudentModalOpen = false;
  }

  closeEditStudentModal(): void {
    this.isEditStudentModalOpen = false;
    this.selectedStudent = null;
  }

  // Métodos de utilidad
  async onPhotoSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecciona un archivo de imagen válido.');
        return;
      }

      const maxSizeInBytes = 2 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        alert('La imagen seleccionada excede el tamaño máximo permitido (2MB).');
        return;
      }

      try {
        const base64Obj: any = await this.extraerBase64(file);
        const base64 = base64Obj.base;
        const resizedImageObj: any = await this.redimensionarImagen(base64, 200, 200);
        const resizedBase64 = resizedImageObj.base;
        this.selectedStudent.foto = resizedBase64;
      } catch (error) {
        console.error(error);
        alert('Hubo un error al procesar la imagen. Por favor, intenta nuevamente.');
      }
    }
  }

  extraerBase64 = async (foto: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL(foto);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL(foto);
      reader.onload = () => {
        resolve({
          base: reader.result
        });
      };
      reader.onerror = error => {
        reject('Error al leer la imagen');
      };
    } catch (e) {
      reject('Error inesperado al procesar la imagen');
    }
  });

  redimensionarImagen = (foto: any, anchoDeseado: number, altoDeseado: number) => new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas.width = anchoDeseado;
        canvas.height = altoDeseado;
        ctx.drawImage(img, 0, 0, anchoDeseado, altoDeseado);
        const imagenRedimensionadaBase64 = canvas.toDataURL('image/jpeg', 0.7);
        resolve({ base: imagenRedimensionadaBase64 });
      };
      img.onerror = () => reject('Error al cargar la imagen');
      img.src = foto;
    } catch (e) {
      reject('Error inesperado al procesar la imagen');
    }
  });

  // Ciclo de vida y eventos
  ngOnInit(): void {
    this.fetchUsuarios();
    this.checkScreenSize();
    document.addEventListener('click', this.hideOptionsDropdown.bind(this));
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.hideOptionsDropdown.bind(this));
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    if (window.innerWidth > 768) {
      this.uiState.isModalOpen = false;
    } else {
      this.uiState.areFiltersVisible = false;
    }
  }

  private fetchUsuarios(): void {
    this.usuarioService.getAlumnos().subscribe({
      next: (data: Usuario[]) => {
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

  onSearch(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredUsuarios = this.usuarios.filter(
      (usuario) => this.matchesSearch(usuario) && this.matchesSelectedFilters(usuario)
    );
  }

  toggleFilters(): void {
    if (window.innerWidth <= 768) {
      if (this.uiState.isModalOpen) {
        this.closeModalWithAnimation();
      } else {
        this.uiState.isModalOpen = true;
        this.translateY = 0;
      }
    } else {
      this.uiState.areFiltersVisible = !this.uiState.areFiltersVisible;
    }
  }

  toggleTurno(): void {
    this.uiState.turnoMatutino = !this.uiState.turnoMatutino;
    this.selectedFilters.turno = this.uiState.turnoMatutino ? 'Matutino' : 'Vespertino';
    this.uiState.turnoIcono = this.uiState.turnoMatutino ? 'fi fi-ss-clouds-sun' : 'fi fi-ss-clouds-moon';
    this.applyFilters();
  }

  hideOptionsDropdown(): void {
    this.showOptions = null;
  }

  private matchesSelectedFilters(usuario: Usuario): boolean {
    const { detalles } = usuario;
    if (!detalles) return false;
    
    return (
      (!this.selectedFilters.turno || detalles.turno === this.selectedFilters.turno) &&
      (!this.selectedFilters.grupo || detalles.grupo === this.selectedFilters.grupo) &&
      (!this.selectedFilters.especialidad || detalles.especialidad === this.selectedFilters.especialidad) &&
      (!this.selectedFilters.semestre || String(detalles.semestre) === String(this.selectedFilters.semestre))
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
}