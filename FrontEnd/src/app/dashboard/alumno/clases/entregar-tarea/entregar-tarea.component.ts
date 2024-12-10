import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SesionService } from 'src/app/Core/service/sesion.service';

@Component({
  selector: 'app-entregar-tarea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './entregar-tarea.component.html',
  styleUrls: ['./entregar-tarea.component.css'],
})
export class EntregarTareaComponent {
  entregarTareaForm: FormGroup;
  archivoSeleccionado: File | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private sesion: SesionService) {
    this.entregarTareaForm = this.fb.group({
      id_tarea: ['', [Validators.required]],
      id_alumno: ['', [Validators.required]],
    });
  }

  // Manejar la selección de archivo
  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.archivoSeleccionado = file;
    } else {
      alert('Por favor, selecciona un archivo PDF válido.');
      this.archivoSeleccionado = null;
    }
  }

  // Manejar el envío del formulario
  onSubmit(id_tarea): void {
    const id_alumno = this.sesion._id_alumno!;
    if (this.entregarTareaForm.valid && this.archivoSeleccionado) {
      const formData = new FormData();
      formData.append('id_tarea', id_tarea.toString()); // Convertir a string
      formData.append('id_alumno', id_alumno.toString()); // Convertir a string
      formData.append('archivo', this.archivoSeleccionado);
  
      // Enviar datos al backend
      this.http
        .post('http://localhost:4000/apiAdae/file/entregar-tarea', formData)
        .subscribe(
          (response) => {
            console.log('Tarea enviada exitosamente:', response);
            alert('Tarea enviada exitosamente.');
          },
          (error) => {
            console.error('Error al enviar la tarea:', error);
            alert('Error al enviar la tarea.');
          }
        );
    }
  }
  
  
}
