import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PoliceGuard implements CanActivate { // Implementa la interfaz CanActivate

  constructor(private router: Router, private autentificacion: AuthService) { }

  // Método que controla el acceso a las rutas
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const activetedRoute = route.routeConfig?.path; // Obtiene la ruta activa

    if (this.autentificacion.isAuth()) { // Verifica si está autenticado

      // Decodifica el token y verifica si tiene un rol definido
      const user = this.autentificacion.decodifica();
      if (user && user.rol) {

        // Controla el acceso basado en el rol y la ruta activa
        if (user.rol === 'Alumno' && activetedRoute === 'Alumnos_Dashboard') {
          return true; // Acceso permitido para alumnos
        }
        if (user.rol === 'Profesor' && activetedRoute === 'Profesores_Dashboard') {
          return true; // Acceso permitido para profesores
        }
        if (user.rol === 'Administrador' && activetedRoute === 'Administrativos_Dashboard') {
          return true; // Acceso permitido para administradores
        }

        // Puedes agregar más roles y rutas aquí
      }
    }

    // Si no cumple las condiciones, redirige al login
    return this.router.createUrlTree(['/login']);
  }
}
