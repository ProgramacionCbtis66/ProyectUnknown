import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private ruta = environment.HTTPS; // URL base del servidor

  constructor() { }

  async enviarCorreo(destinatario: string, nombre: string, tipo: string) {
    try {
        const response = await fetch(`${this.ruta}/Email/SendEmail`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                destinatario,  // Destinatario del correo
                nombre,        // Nombre del destinatario
                tipo,  // Tipo de correo
            })
        });

        const result = await response.json();
        if (response.ok) {
            console.log("Correo enviado:", result.msg);
        } else {
            console.error("Error al enviar el correo:", result.error);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
  }
}
