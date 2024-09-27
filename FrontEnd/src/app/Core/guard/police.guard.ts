import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PoliceGuard {
  constructor(private router: Router, private autentificacion: AuthService) { }

  // Método que controla el acceso a las rutas
  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const activetedRoute = route.routeConfig?.path; // Obtiene la ruta activa

    if (this.autentificacion.isAuth()) { // Verifica si está autenticado
      if (this.autentificacion.decodifica().rol === 'alumno') { // Verifica el rol
        if (activetedRoute === 'alumno') {
          return true; // Permite el acceso si las condiciones se cumplen
        }
      }
    }

    return this.router.createUrlTree(['/login']); // Redirige a login si no cumple las condiciones
  }
}
