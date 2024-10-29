import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PoliceGuard implements CanActivate { 

  constructor(private router: Router, private autentificacion: AuthService) { }

  private rutasPermitidasPorRol = {
    Alumno: ['Main_Dashboard', 'Main_Dashboard/Profile_User', 'segurity_user', 'notifications_user', 'connected_devices_user'],
    Profesor: ['Main_Dashboard', 'Main_Dashboard/Profile_User', 'segurity_user', 'notifications_user', 'connected_devices_user'],
    Administrador: ['Main_Dashboard', 'Main_Dashboard/Profile_User', 'segurity_user', 'notifications_user', 'connected_devices_user'] 
  };

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const rutaActual = state.url.split('?')[0]; // Obtiene la ruta activa sin parámetros

    if (this.autentificacion.isAuth()) {
      const user = this.autentificacion.decodifica();

      if (user && user.rol && rutaActual) {
        const rutasPermitidas = this.rutasPermitidasPorRol[user.rol];

        if (rutasPermitidas && rutasPermitidas.some(ruta => rutaActual.includes(ruta))) {
          return true; // Si la ruta está permitida, se concede acceso
        }
      }
    }

    return this.router.createUrlTree(['/login']);
  }
}
