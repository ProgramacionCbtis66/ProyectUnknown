import { Component, ViewChild, ElementRef } from '@angular/core';
import { ImageCropperComponent, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { SesionService } from 'src/app/Core/service/sesion.service';
import { UsuarioService } from 'src/app/Core/service/usuario.service';
import { EmailService } from 'src/app/Core/service/email.service';

@Component({
  selector: 'app-img-cropper',
  standalone: true,
  imports: [ImageCropperComponent, CommonModule],
  templateUrl: './img-cropper.component.html',
  styleUrls: ['./img-cropper.component.css']
})
export class ImgCropperComponent {
  @ViewChild(ImageCropperComponent) imageCropper!: ImageCropperComponent;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  isModalOpen: boolean = false;
  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl = '';
  croppedBlob: Blob | null = null; // Imagen en formato Blob comprimido

  constructor(
    private sanitizer: DomSanitizer,
    protected sesion: SesionService,
    private usuarioService: UsuarioService,
    private emailService: EmailService
  ) {}

  // Evento al seleccionar un archivo
  fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
  }

  // Evento al recortar la imagen
  imageCropped(event: ImageCroppedEvent) {
    // Vista previa de la imagen recortada
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl!);

    // Almacenar Blob sin comprimir para luego procesarlo
    if (event.blob) {
      this.compressImage(event.blob, 0.7, 500, 500).then((compressedBlob) => {
        this.croppedBlob = compressedBlob;
        console.log('Imagen comprimida:', compressedBlob);
      });
    }
  }

  imageLoaded(image: LoadedImage) {
    // show cropper
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    // show message
  }

  // Abrir modal y activar input file
  openCropperModal(): void {
    this.isModalOpen = true;
    setTimeout(() => this.fileInput.nativeElement.click(), 0); // Simula el clic en el input oculto
  }

  // Cerrar modal
  closeCropperModal(): void {
    this.isModalOpen = false;
  }

  // Confirmar recorte
  confirmCrop(): void {
    if (this.croppedBlob) {
      this.updateStudent();
      this.closeCropperModal();
    }
  }

  updateStudent(): void {  
    if (!this.croppedBlob) {
      console.error('No hay imagen comprimida para enviar');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      const usuarioActualizado = {
        id: this.sesion._id,
        rol: this.sesion._rol,
        foto: base64String
      };

      this.usuarioService.updateUsuario(usuarioActualizado).subscribe({
        next: () => {
          console.log('Usuario actualizado:', usuarioActualizado);
          const correo_institucional = this.sesion._correo_institucional;
          const nombre = this.sesion._usuario;
          const tipo = 'UserUpdateNotification';

          if (correo_institucional && nombre) {
            this.emailService
              .enviarCorreo(correo_institucional, nombre, tipo)
              .then(() => {
                console.log('Correo enviado desde el componente');
                this.sesion._foto = usuarioActualizado.foto;
                this.closeCropperModal();
              })
              .catch((error) => console.error('Error al enviar el correo:', error));
          } else {
            console.error('Faltan datos para enviar el correo');
            console.log(correo_institucional, nombre);
          }
        },
        error: (err) => console.error('Error al actualizar usuario:', err),
      });
    };
    reader.onerror = (err) => {
      console.error('Error al convertir imagen a Base64:', err);
    };
    reader.readAsDataURL(this.croppedBlob);
  }

  // Método para comprimir imagen usando canvas
  private async compressImage(blob: Blob, quality: number, maxWidth: number, maxHeight: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(blob);
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        // Redimensionar imagen manteniendo proporción
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          if (aspectRatio > 1) {
            width = maxWidth;
            height = maxWidth / aspectRatio;
          } else {
            height = maxHeight;
            width = maxHeight * aspectRatio;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir canvas a Blob
        canvas.toBlob(
          (compressedBlob) => {
            if (compressedBlob) {
              resolve(compressedBlob);
            } else {
              reject(new Error('No se pudo comprimir la imagen.'));
            }
          },
          'image/jpeg',
          quality
        );

        URL.revokeObjectURL(url);
      };
      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(err);
      };
    });
  }
}
