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
  styleUrls: ['./my-profile-user.component.css']
})
export class MyProfileUserComponent implements OnInit {
  // Variables de interfaz
  showEmoji: boolean = false;
  attendancePercentage: number = 100;
  isCopied: boolean = false;
  isLoading: boolean = true;

  // Estadísticas por rol
  stats: Stats = {
    promedio: 8.5,
    tareas: 95
  };

  teacherStats: Stats = {
    gruposActivos: 5,
    alumnosTotal: 150
  };

  adminStats: Stats = {
    usuariosActivos: 500,
    uptime: 99.9
  };

  constructor(
    public sesion: SesionService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
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

  private updateAttendanceStyles(): void {
    document.documentElement.style.setProperty('--percentage', this.attendancePercentage.toString());
  }
  
  private async loadUserData(): Promise<void> {
    switch(this.sesion._rol) {
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
    // Simular carga de datos - Reemplazar con llamadas reales a la API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    this.stats = {
      promedio: 8.5,
      tareas: 95
    };
    this.attendancePercentage = 100;
  }

  private async loadProfesorData(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    this.teacherStats = {
      gruposActivos: 5,
      alumnosTotal: 150
    };
  }

  private async loadAdminData(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    this.adminStats = {
      usuariosActivos: 500,
      uptime: 99.9
    };
  }

  // Métodos de interfaz
  public toggleEmoji(show: boolean): void {
    this.showEmoji = show;
  }

  public handleImageError(event: any): void {
    event.target.src = 'assets/default-avatar.png';
  }

  public copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text)
      .then(() => {
        this.isCopied = true;
        setTimeout(() => this.isCopied = false, 2000);
      })
      .catch(err => console.error('Error al copiar:', err));
  }

  // Utilidades
  public formatDate(date: string | Date): string {
    try {
      return new Date(date).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Fecha no válida';
    }
  }

  public getRoleClass(): string {
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

  public getStatusColor(value: number): string {
    if (value >= 90) return 'success';
    if (value >= 70) return 'warning';
    return 'danger';
  }

  public hasProfileImage(): boolean {
    return !!this.sesion._foto && 
           this.sesion._foto !== 'null' && 
           this.sesion._foto !== 'undefined';
  }

  public get loadingClass(): string {
    return this.isLoading ? 'loading' : '';
  }
}