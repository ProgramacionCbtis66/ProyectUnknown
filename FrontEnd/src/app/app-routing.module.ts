import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './authentication_Page/homepage/homepage.component';
import { LogInComponent } from './authentication_Page/log-in/log-in.component';
import { LoginQRGeneratorComponent } from './authentication_Page/login-qr-generator/login-qr-generator.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { MyProfileUserComponent } from './user-settings_Page/my-profile-user/my-profile-user.component';
import { PoliceGuard } from './Core/guard/police.guard';
import { UserSegurityComponent } from './user-settings_Page/user-segurity/user-segurity.component';
import { UserNotificationsPageComponent } from './user-settings_Page/user-notifications-page/user-notifications-page.component';
import { ConnectedDevicesPageComponent } from './user-settings_Page/connected-devices-page/connected-devices-page.component';
import { AdministrativosComponent } from './dashboard/administrativos/administrativos.component';
import { AlumnoComponent } from './dashboard/alumno/alumno.component';
import { DocenteComponent } from './dashboard/docente/docente.component';
import { UserRegisterComponent } from './user-settings_Page/user-register/user-register.component';
import { AlumnosListadoComponent } from './dashboard/servicios_escolares/alumnos-listado/alumnos-listado.component';
import { ServiciosMenuComponent } from './dashboard/servicios_escolares/servicios-menu/servicios-menu.component';
import { TerminosCondicionesComponent } from './politica-privacidad/terminos-condiciones/terminos-condiciones.component';
import { SobreNosotrosComponent } from './politica-privacidad/sobre-nosotros/sobre-nosotros.component';
import { PoliticaPrivacidadComponent } from './politica-privacidad/politica-privacidad.component';
import { AlumnosClasesComponent } from './dashboard/servicios_escolares/alumnos-clases/alumnos-clases.component';
import { AlumnosRegistrosComponent } from './dashboard/servicios_escolares/alumnos-registros/alumnos-registros.component';
import { AlumnosGruposComponent } from './dashboard/servicios_escolares/alumnos-grupos/alumnos-grupos.component';


const routes: Routes = [
  { path: "", component: HomepageComponent },
  { path: "main", component: HomepageComponent },
  { path: "login", component: LogInComponent },
  { path: "QRPage", component: LoginQRGeneratorComponent },
  { path: "register", component: UserRegisterComponent },
  
  // Rutas protegidas
  { path: "Main_Dashboard", component: MainDashboardComponent, canActivate: [PoliceGuard]},
  { path: "Profile_User", component: MyProfileUserComponent, canActivate: [PoliceGuard]},
  { path: "segurity_user", component: UserSegurityComponent, canActivate: [PoliceGuard] },
  { path: 'notifications_user', component: UserNotificationsPageComponent, canActivate: [PoliceGuard] },
  { path: "connected_devices_user", component: ConnectedDevicesPageComponent, canActivate: [PoliceGuard] },
  { path: "Administrativos_Dashboard", component: AdministrativosComponent, canActivate: [PoliceGuard]}, // Ruta para el Dashboard de los Administrativos
  { path: "Alumnos_Dashboard", component: AlumnoComponent, canActivate: [PoliceGuard]  }, // Ruta para el Dashboard de los Administrativos
  { path: "Profesores_Dashboard", component: DocenteComponent, canActivate: [PoliceGuard]  }, // Ruta para el Dashboard de los Administrativos
  { path: "alumnos-listado", component: AlumnosListadoComponent},
  { path: "servicios-menu", component: ServiciosMenuComponent},
  { path: "terminos-condiciones", component: TerminosCondicionesComponent},
  { path: "sobre-nosotros", component: SobreNosotrosComponent},
  { path: "politica-privacidad", component: PoliticaPrivacidadComponent},
  { path: "alumnos-clases-registro", component: AlumnosClasesComponent},
  { path: "alumnos-registros", component: AlumnosRegistrosComponent},
  { path: "alumnos-grupos", component: AlumnosGruposComponent},
  { path: '**', redirectTo: '', pathMatch: 'full' } // Ruta por defecto
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
