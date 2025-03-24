import { Component, OnInit, HostListener, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { EmailService } from '../../../Core/service/email.service';
import { UsuarioService } from 'src/app/Core/service/usuario.service';
import { DomSanitizer } from '@angular/platform-browser';

interface Profesor {
  id_profesor: number;
  id_usuario: number;
  departamento: string;
  especialidad: string;
  telefono: string;
  correo_institucional: string;
  nombre: string;
  apellido: string;
  rol: string;
  foto?: string;
}

@Component({
  selector: 'app-profesor-listado',
  templateUrl: './profesor-listado.component.html',
  styleUrls: ['./profesor-listado.component.css']
})
export class ProfesorListadoComponent implements OnInit, OnDestroy {
  @ViewChild('modalFilters') modalFilters!: ElementRef;
  @ViewChild('modalOptions') modalOptions!: ElementRef;
  @ViewChild('editModal') editModal!: ElementRef;
  @ViewChild('addModal') addModal!: ElementRef;

  // Variables para manejo del gesto táctil (modal de filtros)
  translateY: number = 0;
  startY: number = 0;
  currentY: number = 0;
  isDragging: boolean = false;
  private readonly THRESHOLD = 100;
  private readonly MAX_DRAG = 200;

  // Variables para el modal de opciones (móvil)
  isOptionsModalOpen = false;
  translateYOptions: number = 0;
  startYOptions: number = 0;
  currentYOptions: number = 0;
  isDraggingOptions: boolean = false;
  selectedProfessorForOptions: Profesor | null = null;

  // Datos y filtros
  profesores: Profesor[] = [];
  filteredProfesores: Profesor[] = [];
  searchQuery = '';
  showOptions: Profesor | null = null;

  selectedFilters = {
    departamento: '',
    especialidad: ''
  };
  filterOptions = {
    departamentos: [] as string[],
    especialidades: [] as string[]
  };

  uiState = {
    isModalOpen: false,       // Modal de filtros (móvil)
    areFiltersVisible: false  // Filtros en desktop
  };

  // Modal de agregar y editar
  isAddProfessorModalOpen = false;
  isEditProfessorModalOpen = false;

  nuevoProfesor = {
    correo_institucional: '',
    nombre: '',
    apellido: '',
    rol: 'Profesor',
    password: '',
    departamento: '',
    especialidad: '',
    telefono: '',
    curp: '',
    foto: "data:image/png;base64,..." // Placeholder para la imagen
  };

  selectedProfessor: Profesor = {
    id_profesor: 0,
    id_usuario: 0,
    departamento: '',
    especialidad: '',
    telefono: '',
    correo_institucional: '',
    nombre: '',
    apellido: '',
    rol: '',
    foto: ''
  };

  constructor(
    private emailService: EmailService,
    private usuarioService: UsuarioService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.fetchProfesores();
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

  private fetchProfesores(): void {
    this.usuarioService.getProfesores().subscribe({
      next: (data: any) => {
        // Se castea el resultado a Profesor[]
        this.profesores = data as Profesor[];
        this.filteredProfesores = this.profesores;
        this.initializeFilterOptions();
      },
      error: (error) => console.error('Error al obtener profesores:', error)
    });
  }

  private initializeFilterOptions(): void {
    this.filterOptions.departamentos = Array.from(new Set(this.profesores.map(p => p.departamento).filter(val => !!val)));
    this.filterOptions.especialidades = Array.from(new Set(this.profesores.map(p => p.especialidad).filter(val => !!val)));
  }

  onSearch(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredProfesores = this.profesores.filter(profesor =>
      this.matchesSearch(profesor) &&
      this.matchesSelectedFilters(profesor)
    );
  }

  private matchesSearch(profesor: Profesor): boolean {
    const query = this.searchQuery.toLowerCase();
    return (
      profesor.nombre.toLowerCase().includes(query) ||
      profesor.apellido.toLowerCase().includes(query) ||
      profesor.correo_institucional.toLowerCase().includes(query)
    );
  }

  private matchesSelectedFilters(profesor: Profesor): boolean {
    return (
      (!this.selectedFilters.departamento || profesor.departamento === this.selectedFilters.departamento) &&
      (!this.selectedFilters.especialidad || profesor.especialidad === this.selectedFilters.especialidad)
    );
  }

  // Métodos para manejo de gestos en modales
  onTouchStart(event: TouchEvent): void {
    this.isDragging = true;
    this.startY = event.touches[0].clientY;
    this.currentY = this.startY;
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.isDragging) return;
    const deltaY = event.touches[0].clientY - this.startY;
    this.currentY = event.touches[0].clientY;
    this.translateY = deltaY < 0 ? deltaY / 3 : deltaY;
    this.translateY = Math.min(Math.max(this.translateY, -this.MAX_DRAG), this.MAX_DRAG);
  }

  onTouchEnd(event: TouchEvent): void {
    if (!this.isDragging) return;
    const deltaY = this.currentY - this.startY;
    if (deltaY > this.THRESHOLD) {
      this.closeModalWithAnimation();
    } else {
      this.resetPosition();
    }
    this.isDragging = false;
  }

  onTouchStartOptions(event: TouchEvent): void {
    this.isDraggingOptions = true;
    this.startYOptions = event.touches[0].clientY;
    this.currentYOptions = this.startYOptions;
  }

  onTouchMoveOptions(event: TouchEvent): void {
    if (!this.isDraggingOptions) return;
    const deltaY = event.touches[0].clientY - this.startYOptions;
    this.currentYOptions = event.touches[0].clientY;
    this.translateYOptions = deltaY < 0 ? deltaY / 3 : deltaY;
    this.translateYOptions = Math.min(Math.max(this.translateYOptions, -this.MAX_DRAG), this.MAX_DRAG);
  }

  onTouchEndOptions(event: TouchEvent): void {
    if (!this.isDraggingOptions) return;
    const deltaY = this.currentYOptions - this.startYOptions;
    if (deltaY > this.THRESHOLD) {
      this.closeOptionsModalWithAnimation();
    } else {
      this.resetOptionsPosition();
    }
    this.isDraggingOptions = false;
  }

  // Método para cerrar el modal de filtros con animación
  public closeModalWithAnimation(): void {
    const modalContent = this.modalFilters.nativeElement.querySelector('.modal-content-filters');
    if (modalContent) {
      modalContent.classList.add('closing');
      setTimeout(() => {
        this.uiState.isModalOpen = false;
        this.translateY = 0;
        modalContent.classList.remove('closing');
      }, 300);
    } else {
      this.uiState.isModalOpen = false;
    }
  }

  // Método para resetear la posición del modal de filtros
  private resetPosition(): void {
    const modalContent = this.modalFilters.nativeElement.querySelector('.modal-content-filters');
    if (modalContent) {
      modalContent.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      modalContent.style.transform = '';
      this.translateY = 0;
      setTimeout(() => {
        modalContent.style.transition = '';
      }, 300);
    }
  }

  // Método para cerrar el modal de opciones con animación
  public closeOptionsModalWithAnimation(): void {
    const modalContent = this.modalOptions.nativeElement.querySelector('.modal-content-options');
    if (modalContent) {
      modalContent.classList.add('closing');
      setTimeout(() => {
        this.isOptionsModalOpen = false;
        this.translateYOptions = 0;
        modalContent.classList.remove('closing');
        this.selectedProfessorForOptions = null;
      }, 300);
    } else {
      this.isOptionsModalOpen = false;
      this.selectedProfessorForOptions = null;
    }
  }

  // Método para resetear la posición del modal de opciones
  private resetOptionsPosition(): void {
    const modalContent = this.modalOptions.nativeElement.querySelector('.modal-content-options');
    if (modalContent) {
      modalContent.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      modalContent.style.transform = '';
      this.translateYOptions = 0;
      setTimeout(() => {
        modalContent.style.transition = '';
      }, 300);
    }
  }

  // Método para ocultar el dropdown de opciones
  public hideOptionsDropdown(): void {
    this.showOptions = null;
  }

  // Método para abrir el modal de opciones
  public openOptionsModal(profesor: Profesor): void {
    this.selectedProfessorForOptions = profesor;
    this.isOptionsModalOpen = true;
    this.translateYOptions = 0;
  }

  // Método para alternar el dropdown de opciones (en escritorio)
  public toggleOptionsDropdown(event: Event, profesor: Profesor): void {
    if (window.innerWidth > 768) {
      event.stopPropagation();
      this.showOptions = this.showOptions === profesor ? null : profesor;
    }
  }

  // Método para editar un profesor
  public editProfessor(profesor: Profesor | null): void {
    if (!profesor) return;
    this.selectedProfessor = { ...profesor };
    this.isEditProfessorModalOpen = true;
    if (this.isOptionsModalOpen) {
      this.closeOptionsModalWithAnimation();
    }
  }

  // Método para actualizar un profesor
  public updateProfessor(): void {
    const profesorActualizado = {
      id: this.selectedProfessor.id_profesor,
      departamento: this.selectedProfessor.departamento,
      especialidad: this.selectedProfessor.especialidad,
      telefono: this.selectedProfessor.telefono,
      correo_institucional: this.selectedProfessor.correo_institucional,
      nombre: this.selectedProfessor.nombre,
      apellido: this.selectedProfessor.apellido,
      foto: this.selectedProfessor.foto
    };

    this.usuarioService.updateUsuario(profesorActualizado).subscribe({
      next: () => {
        console.log('Profesor actualizado:', profesorActualizado);
        const { correo_institucional, nombre } = this.selectedProfessor;
        const tipo = 'UserUpdateNotification';
        if (correo_institucional && nombre) {
          this.emailService
            .enviarCorreo(correo_institucional, nombre, tipo)
            .then(() => {
              console.log('Correo enviado desde el componente');
              this.closeEditProfessorModal();
            })
            .catch((error) => console.error('Error al enviar el correo:', error));
        } else {
          console.error('Faltan datos para enviar el correo');
        }
        this.fetchProfesores();
        this.closeEditProfessorModal();
      },
      error: (err) => console.error('Error al actualizar profesor:', err)
    });
  }

  // Método para eliminar un profesor
  public deleteProfessor(profesor: Profesor | null): void {
    if (!profesor) return;
    const profesorId = profesor.id_profesor;
    if (this.isOptionsModalOpen) {
      this.closeOptionsModalWithAnimation();
    }
    this.usuarioService.deleteUsuario(profesorId).subscribe({
      next: () => {
        console.log(`Profesor eliminado: ID ${profesorId}`);
        const { correo_institucional, nombre } = profesor;
        const tipo = 'UserDelete';
        if (correo_institucional && nombre) {
          this.emailService
            .enviarCorreo(correo_institucional, nombre, tipo)
            .then(() => console.log('Correo enviado correctamente.'))
            .catch((error) => console.error('Error al enviar el correo:', error));
        } else {
          console.warn('Datos incompletos para enviar correo:', { correo_institucional, nombre });
        }
        this.fetchProfesores();
        this.closeEditProfessorModal();
      },
      error: (err) => console.error('Error al eliminar profesor:', err)
    });
  }

  // Método para copiar un profesor (placeholder)
  public copyProfessor(profesor: Profesor | null): void {
    if (!profesor) return;
    if (this.isOptionsModalOpen) {
      this.closeOptionsModalWithAnimation();
    }
    console.log('Copiar profesor:', profesor);
  }

  // Método para abrir el modal de agregar profesor
  public openAddProfessorModal(): void {
    this.isAddProfessorModalOpen = true;
  }

  // Método para agregar un profesor
  public addProfessor(): void {
    this.usuarioService.registrarUsuario(this.nuevoProfesor).subscribe({
      next: (response) => {
        console.log('Profesor registrado exitosamente:', response);
        const tipo = 'EmailVerify';
        this.emailService
          .enviarCorreo(this.nuevoProfesor.correo_institucional, this.nuevoProfesor.nombre, tipo)
          .then(() => {
            console.log('Correo enviado desde el componente');
            this.closeAddProfessorModal();
          })
          .catch((error) => console.error('Error al enviar el correo:', error));
      },
      error: (error) => {
        console.error('Error al registrar el profesor:', error);
      }
    });
  }

  // Método para cerrar el modal de agregar profesor con animación
  public closeAddProfessorModal(): void {
    if (this.addModal) {
      const modalContent = this.addModal.nativeElement.querySelector('.modal-content');
      modalContent.classList.add('closing');
      setTimeout(() => {
        this.isAddProfessorModalOpen = false;
        modalContent.classList.remove('closing');
      }, 300);
    } else {
      this.isAddProfessorModalOpen = false;
    }
  }

  // Método para cerrar el modal de editar profesor con animación
  public closeEditProfessorModal(): void {
    if (this.editModal) {
      const modalContent = this.editModal.nativeElement.querySelector('.modal-content');
      modalContent.classList.add('closing');
      setTimeout(() => {
        this.isEditProfessorModalOpen = false;
        this.selectedProfessor = {
          id_profesor: 0,
          id_usuario: 0,
          departamento: '',
          especialidad: '',
          telefono: '',
          correo_institucional: '',
          nombre: '',
          apellido: '',
          rol: '',
          foto: ''
        };
        modalContent.classList.remove('closing');
      }, 300);
    } else {
      this.isEditProfessorModalOpen = false;
      this.selectedProfessor = {
        id_profesor: 0,
        id_usuario: 0,
        departamento: '',
        especialidad: '',
        telefono: '',
        correo_institucional: '',
        nombre: '',
        apellido: '',
        rol: '',
        foto: ''
      };
    }
  }

  // Método para manejar la selección de fotos
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
        this.selectedProfessor.foto = resizedBase64;
      } catch (error) {
        console.error(error);
        alert('Hubo un error al procesar la imagen. Por favor, intenta nuevamente.');
      }
    }
  }

  // Método auxiliar para convertir imagen a base64
  extraerBase64 = async (foto: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL(foto);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL(foto);
      reader.onload = () => {
        resolve({ base: reader.result });
      };
      reader.onerror = error => {
        reject('Error al leer la imagen');
      };
    } catch (e) {
      reject('Error inesperado al procesar la imagen');
    }
  });

  // Método auxiliar para redimensionar imágenes
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
}