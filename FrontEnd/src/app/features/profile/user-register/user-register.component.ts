import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SesionService } from 'src/app/Core/service/sesion.service';


@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrl: './user-register.component.css'
})
export class UserRegisterComponent {

  protected foto: any ="../../../assets/img/tufoto.png";
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  constructor(
    protected Base64 : SesionService,
  ) { }

  ngOnInit(): void {
    window.scrollTo(0, 0); // Desplaza la página hacia la parte superior cuando se carga
  }
  
  cargarFoto(event: any): void {
    const archivo = event.target.files[0];
    this.Base64.extraerBase64(archivo).then((imagenBase64: any) => {

      const foto64 = imagenBase64.base;

      this.Base64.redimensionarImagen(foto64, 80, 80).then((imagenRedimensionada: any) => {
        this.foto = imagenRedimensionada.base;
      }).catch((error: any) => {
        console.error('Error al redimensionar la imagen', error);
      });
    }).catch((error: any) => {
      console.error('Error al extraer la imagen en base64', error);
    });
  }

  activarInput() {
    this.fileInput.nativeElement.click();
  }




}
