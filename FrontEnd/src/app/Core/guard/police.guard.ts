import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PoliceGuard implements CanActivate { // Implementa la interfaz CanActivate

  constructor(private router: Router, private autentificacion: AuthService) { }

  private rutasPermitidasPorRol = {
    Alumno: ['Alumnos_Dashboard', 'Profile_User', 'segurity_user', 'notifications_user', 'connected_devices_user'],
    Profesor: ['Profesores_Dashboard', 'Profile_User', 'segurity_user', 'notifications_user', 'connected_devices_user'],
    Administrador: ['Administrativos_Dashboard', 'Profile_User', 'segurity_user', 'notifications_user', 'connected_devices_user'] 
  };

  // Método que controla el acceso a las rutas
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const rutaActual = route.routeConfig?.path; // Obtiene la ruta activa

    if (this.autentificacion.isAuth()) { // Verifica si está autenticado
      const user = this.autentificacion.decodifica(); // Decodifica el token para obtener la información del usuario

      if (user && user.rol && rutaActual) {
        const rutasPermitidas = this.rutasPermitidasPorRol[user.rol]; // Obtiene las rutas permitidas para el rol del usuario

        if (rutasPermitidas && rutasPermitidas.includes(rutaActual)) {
          return true; // Si la ruta actual está permitida para el rol del usuario, se concede acceso
        }
      }
    }

    // Si no cumple las condiciones, redirige al login
    return this.router.createUrlTree(['/login']);
  }
}
