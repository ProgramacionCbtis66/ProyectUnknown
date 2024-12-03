import { Component, OnInit } from '@angular/core';
import { SesionService } from '../../Core/service/sesion.service';

@Component({
  selector: 'app-my-profile-user',
  templateUrl: './my-profile-user.component.html',
  styleUrls: ['./my-profile-user.component.css']
})
export class MyProfileUserComponent implements OnInit {
  joinDate: string = '11 14 2024';
  attendance: number = 100;

  constructor(public sesion: SesionService) {}

  ngOnInit(): void {
    // Inicializar datos del componente
    this.loadUserData();
  }

  private loadUserData(): void {
    // Aquí puedes agregar lógica para cargar datos adicionales del usuario
    // Por ejemplo, calcular asistencias, fechas, etc.
  }

  // Métodos para manejar acciones rápidas
  onGradesClick(): void {
    // Manejar click en botón de calificaciones
  }

  onCalendarClick(): void {
    // Manejar click en botón de calendario
  }

  // Método para formatear fechas si es necesario
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
}