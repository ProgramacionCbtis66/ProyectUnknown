import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PoliceGuard implements CanActivate { 

  constructor(private router: Router, private autentificacion: AuthService) { }

  private rutasPermitidasPorRol = {
    Alumno: [
      'Main_Dashboard', 
      'Main_Dashboard/options', 
      'Main_Dashboard/Profile_User', 
      'segurity_user', 
      'notifications_user', 
      'connected_devices_user', 
      'Main_Dashboard/clase/:id',
      'Main_Dashboard/clases-dashboard',
    ],
    Profesor: [
      'Main_Dashboard', 
      'Main_Dashboard/options', 
      'Main_Dashboard/Profile_User', 
      'segurity_user', 
      'notifications_user', 
      'connected_devices_user',
      'Main_Dashboard/clase/:id',
      'Main_Dashboard/clases-dashboard',
    ],
    Administrador: [
      'Main_Dashboard', 
      'Main_Dashboard/options', 
      'Main_Dashboard/Profile_User', 
      'segurity_user', 
      'notifications_user', 
      'connected_devices_user',
      'Main_Dashboard/clase/:id', 
      'Main_Dashboard/administrativos', 
      'Main_Dashboard/alumnos-listado', 
      'Main_Dashboard/servicios-menu', 
      'Main_Dashboard/alumnos-clases-registro', 
      'Main_Dashboard/alumnos-registros', 
      'Main_Dashboard/alumnos-grupos'
    ]
  };
  

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const rutaActual = state.url; // Aquí obtenemos la URL completa
    console.log('Ruta actual:', rutaActual);
  
    if (this.autentificacion.isAuth()) {
      const user = this.autentificacion.decodifica();
  
      if (user && user.rol) {
        const rutasPermitidas = this.rutasPermitidasPorRol[user.rol];
        console.log('Rutas permitidas para el rol:', rutasPermitidas);
  
        // Asegúrate de que estamos comparando la ruta completa
        if (rutasPermitidas && rutasPermitidas.some(ruta => rutaActual === `/${ruta}`)) {
          return true;  // Si la ruta está permitida, se concede acceso
        }
      }
    }
  
    console.log('Acceso denegado. Redirigiendo al login...');
    return this.router.createUrlTree(['/login']);
  }
  
  
  
}
