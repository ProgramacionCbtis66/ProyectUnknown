import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SesionService {
  constructor(private sanitizer: DomSanitizer) {}

  // Información del usuario
  private id = new BehaviorSubject<number | null>(null);
  private nombre = new BehaviorSubject<string>('No disponible');
  private apellido = new BehaviorSubject<string>('No disponible');
  private rol = new BehaviorSubject<string>('No disponible');
  private correo_institucional = new BehaviorSubject<string>('No disponible');
  private foto = new BehaviorSubject<string | null>(null);

  // Información del alumno
  private numeroControl = new BehaviorSubject<string>('No disponible');
  private especialidad = new BehaviorSubject<string>('No disponible');
  private semestre = new BehaviorSubject<number | null>(null);
  private turno = new BehaviorSubject<string>('No disponible');
  private curp = new BehaviorSubject<string>('No disponible');
  private grupo = new BehaviorSubject<string>('No disponible');
  private id_alumno = new BehaviorSubject<number | null>(null);

  // Información del profesor
  private id_profesor = new BehaviorSubject<number | null>(null);
  private departamento = new BehaviorSubject<number | null>(null);
  private especialidad_Prof = new BehaviorSubject<number | null>(null);
  private telefono = new BehaviorSubject<number | null>(null);

  // Métodos para usuario, apellido, rol y foto
  get _id(): number | null{
    return this.id.value;
  }
  set _id(value: number | null) {
    this.id.next(value);
  }
  
  get _usuario(): string {
    return this.nombre.value;
  }
  set _usuario(value: string) {
    this.nombre.next(value);
  }

  get _correo_institucional(): string {
    return this.correo_institucional.value;
  }
  set _correo_institucional(value: string) {
    this.correo_institucional.next(value);
  }

  get _apellido(): string {
    return this.apellido.value;
  }
  set _apellido(value: string) {
    this.apellido.next(value);
  }

  get _foto(): string | null {
    return this.foto.value;
  }
  set _foto(value: string | null) {
    this.foto.next(value);
  }

  get _rol(): string {
    return this.rol.value;
  }
  set _rol(value: string) {
    this.rol.next(value);
  }

  // Nuevos métodos para los campos del alumno
  get _id_alumno(): number | null {
    return this.id_alumno.value;
  }
  set _id_alumno(value: number | null) {
    this.id_alumno.next(value);
  }

  get _numeroControl(): string {
    return this.numeroControl.value;
  }
  set _numeroControl(value: string) {
    this.numeroControl.next(value);
  }

  get _especialidad(): string {
    return this.especialidad.value;
  }
  set _especialidad(value: string) {
    this.especialidad.next(value);
  }

  get _semestre(): number | null {
    return this.semestre.value;
  }
  set _semestre(value: number | null) {
    this.semestre.next(value);
  }

  get _turno(): string {
    return this.turno.value;
  }
  set _turno(value: string) {
    this.turno.next(value);
  }

  get _curp(): string {
    return this.curp.value;
  }
  set _curp(value: string) {
    this.curp.next(value);
  }

  get _grupo(): string {
    return this.grupo.value;
  }
  set _grupo(value: string) {
    this.grupo.next(value);
  }

  // Nuevos métodos para los campos del profesor
  get _id_profesor(): number | null {
    return this.id_profesor.value;
  }
  set _id_profesor(value: number | null) {
    this.id_profesor.next(value);
  }

  get _departamento(): number | null {
    return this.departamento.value;
  }
  set _departamento(value: number | null) {
    this.departamento.next(value);
  }

  get _especialidad_Prof(): number | null {
    return this.especialidad_Prof.value;
  }
  set _especialidad_Prof(value: number | null) {
    this.especialidad_Prof.next(value);
  }

  get _telefono(): number | null {
    return this.telefono.value;
  }
  set _telefono(value: number | null) {
    this.telefono.next(value);
  }

  extraerBase64 = async (foto: any) =>
    new Promise((resolve, reject) => {
      try {
        const unsafeImg = window.URL.createObjectURL(foto);
        const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
        const reader = new FileReader();
        reader.readAsDataURL(foto);
        reader.onload = () => {
          resolve({
            base: reader.result,
          });
        };
        reader.onerror = (error) => {
          reject('Error al leer la imagen');
        };
      } catch (e) {
        reject('Error inesperado al procesar la imagen'); // Devolver un valor de error en caso de excepción
      }
    });

  redimensionarImagen = (
    foto: any,
    anchoDeseado: number,
    altoDeseado: number
  ) =>
    new Promise((resolve, reject) => {
      try {
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
          canvas.width = anchoDeseado;
          canvas.height = altoDeseado;
          ctx.drawImage(img, 0, 0, anchoDeseado, altoDeseado);
          const imagenRedimensionadaBase64 = canvas.toDataURL('image/jpeg'); // Cambiar el formato si es necesario
          resolve({ base: imagenRedimensionadaBase64 });
        };

        img.onerror = () => {
          console.error('Error al cargar la imagen');
          reject('Error al cargar la imagen');
        };

        img.src = foto; // Ya tenemos la imagen en formato base64 aquí, no es necesario crear un objeto URL
      } catch (e) {
        console.error('Error inesperado al procesar la imagen');
        reject('Error inesperado al procesar la imagen');
      }
    });

  async convertBlobToBase64(blob: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };

      reader.onerror = () => {
        reject('Error al convertir el Blob en Base64.');
      };

      reader.readAsDataURL(blob);
    });
  }
}
