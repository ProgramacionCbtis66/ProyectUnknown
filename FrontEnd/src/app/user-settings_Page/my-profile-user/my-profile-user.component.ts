import { Component, OnInit } from '@angular/core';
import { SesionService } from '../../Core/service/sesion.service';
import { UsuarioService } from '../../Core/service/usuario.service';

interface Stats {
  promedio?: number;
  tareas?: number;
  gruposActivos?: number;
  alumnosTotal?: number;
  usuariosActivos?: number;
  uptime?: number;
}

@Component({
  selector: 'app-my-profile-user',
  templateUrl: './my-profile-user.component.html',
  styleUrls: ['./my-profile-user.component.css'],
})
export class MyProfileUserComponent implements OnInit {
  // Variables de interfaz
  showEmoji: boolean = false;
  attendancePercentage: number | undefined;
  isCopied: boolean = false;
  isLoading: boolean = true;

  // Estadísticas por rol
  stats: Stats = {
    promedio: 8.5,
    tareas: 95,
  };

  teacherStats: Stats = {
    gruposActivos: 5,
    alumnosTotal: 150,
  };

  adminStats: Stats = {
    usuariosActivos: 500,
    uptime: 99.9,
  };

  constructor(
    public sesion: SesionService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
    window.scrollTo(0, 0);
    this.getAsistenceStatus();
  }

  private async loadInitialData(): Promise<void> {
    try {
      this.isLoading = true;
      await this.loadUserData();
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private async loadUserData(): Promise<void> {
    switch (this.sesion._rol) {
      case 'Alumno':
        await this.loadAlumnoData();
        break;
      case 'Profesor':
        await this.loadProfesorData();
        break;
      case 'Administrador':
        await this.loadAdminData();
        break;
    }
  }
  private async loadAlumnoData(): Promise<void> {
    // Simula una espera inicial si es necesario
    await new Promise((resolve) => setTimeout(resolve, 800));
  
    // Llamada al método getAsistenceStatus y espera del porcentaje
    const porcentajeAsistencias = await this.getAsistenceStatus();
  
    // Asigna los datos a las propiedades correspondientes
    this.stats = {
      promedio: 8.5,
      tareas: 95,
    };
    this.attendancePercentage = porcentajeAsistencias;
  }
  
  // Método getAsistenceStatus modificado para devolver Promesa
  private async getAsistenceStatus(): Promise<number> {
    const response = await this.usuarioService.calcularPorcentajeAsistencias(this.sesion._id_alumno!).toPromise();
    console.log(`Porcentaje de Asistencias: ${response.porcentaje_asistencias}%`);
    return response.porcentaje_asistencias;
  }
  

  private async loadProfesorData(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    this.teacherStats = {
      gruposActivos: 5,
      alumnosTotal: 150,
    };
  }

  private async loadAdminData(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    this.adminStats = {
      usuariosActivos: 500,
      uptime: 99.9,
    };
  }

  // Método para controlar el emoji
  toggleEmoji(show: boolean): void {
    this.showEmoji = show;
  }

  // Método para copiar al portapapeles
  copyToClipboard(): void {
    const textToCopy = this.sesion._numeroControl;
    if (!textToCopy) return;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        this.isCopied = true;
        setTimeout(() => {
          this.isCopied = false;
        }, 1000);
      })
      .catch((err) => {
        console.error('Error al copiar al portapapeles:', err);
      });
  }

  // Método para manejar errores de imagen
  handleImageError(event: any): void {
    event.target.src = 'assets/default-avatar.png';
  }

  // Utilidades
  formatDate(date: string | Date): string {
    try {
      return new Date(date).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return 'Fecha no válida';
    }
  }

  getRoleClass(): string {
    switch (this.sesion._rol) {
      case 'Alumno':
        return 'student';
      case 'Profesor':
        return 'teacher';
      case 'Administrador':
        return 'admin';
      default:
        return '';
    }
  }

  getStatusColor(value: number): string {
    if (value >= 90) return 'success';
    if (value >= 70) return 'warning';
    return 'danger';
  }

  hasProfileImage(): boolean {
    return (
      !!this.sesion._foto &&
      this.sesion._foto !== 'null' &&
      this.sesion._foto !== 'undefined'
    );
  }

  get loadingClass(): string {
    return this.isLoading ? 'loading' : '';
  }
  
}
