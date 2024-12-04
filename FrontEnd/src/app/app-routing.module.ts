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
import { ClasesComponent } from './dashboard/alumno/clases/clases.component';
import { OptionsComponent } from './main-dashboard/options/options.component';
import { ClassDashboardComponent } from './main-dashboard/class-dashboard/class-dashboard.component';


const routes: Routes = [
  { path: "", component: HomepageComponent },
  { path: "main", component: HomepageComponent },
  { path: "login", component: LogInComponent },
  { path: "QRPage", component: LoginQRGeneratorComponent },
  { path: "register", component: UserRegisterComponent },

  // Rutas protegidas
  {
    path: "Main_Dashboard",
    component: MainDashboardComponent,
    canActivate: [PoliceGuard],
    children: [ // Rutas hijas del Dashboard
      { path: 'administrativos', component: AdministrativosComponent, canActivate: [PoliceGuard] },
      { path: 'alumnos', component: AlumnoComponent, canActivate: [PoliceGuard] },
      { path: 'docentes', component: DocenteComponent, canActivate: [PoliceGuard] },
      { path: 'alumnos-listado', component: AlumnosListadoComponent, canActivate: [PoliceGuard] },
      { path: 'servicios-menu', component: ServiciosMenuComponent, canActivate: [PoliceGuard] },
      { path: 'alumnos-clases-registro', component: AlumnosClasesComponent, canActivate: [PoliceGuard] },
      { path: 'clases-dashboard',component:ClassDashboardComponent, canActivate: [PoliceGuard]},
      { path: 'alumnos-registros', component: AlumnosRegistrosComponent, canActivate: [PoliceGuard] },
      { path: 'alumnos-grupos', component: AlumnosGruposComponent, canActivate: [PoliceGuard] },
      { path: 'clases', component: ClasesComponent, canActivate: [PoliceGuard] },
      { path: "Profile_User", component: MyProfileUserComponent,},
      { path: "segurity_user", component: UserSegurityComponent,},
      { path: "notifications_user", component: UserNotificationsPageComponent, },
      { path: "options", component: OptionsComponent, canActivate: [PoliceGuard] },
      { path: "connected_devices_user", component: ConnectedDevicesPageComponent, canActivate: [PoliceGuard] },
      { path: '', redirectTo: '', pathMatch: 'full' } // Redirección a una vista por defecto
    ]
  },

  { path: "terminos-condiciones", component: TerminosCondicionesComponent },
  { path: "sobre-nosotros", component: SobreNosotrosComponent },
  { path: "politica-privacidad", component: PoliticaPrivacidadComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' } // Ruta por defecto
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
