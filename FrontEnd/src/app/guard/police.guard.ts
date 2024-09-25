import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PoliceGuard  {
  constructor(private router: Router, private autentificacion: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const activetedRoute = route.routeConfig?.path;

    if (this.autentificacion.isAuth()) {
      if (this.autentificacion.decodifica().rol === 'alumno') {
        if (activetedRoute === 'alumno') {
          return true;
        }
      }
    }

    return this.router.createUrlTree(['/login']);
  }
}
