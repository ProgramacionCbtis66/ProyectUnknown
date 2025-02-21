import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './features/homepage/homepage.component';
import { LogInComponent } from './features/auth/log-in/log-in.component';
import { LoginQRGeneratorComponent } from './features/auth/login-qr-generator/login-qr-generator.component';
import { MainDashboardComponent } from './features/dashboard/main-dashboard.component';
import { MyProfileUserComponent } from './features/profile/my-profile-user/my-profile-user.component';
import { PoliceGuard } from './Core/guard/police.guard';
import { UserSegurityComponent } from './features/profile/user-segurity/user-segurity.component';
import { UserNotificationsPageComponent } from './features/profile/user-notifications-page/user-notifications-page.component';
import { ConnectedDevicesPageComponent } from './features/profile/connected-devices-page/connected-devices-page.component';
import { UserRegisterComponent } from './features/profile/user-register/user-register.component';
import { AlumnosListadoComponent } from './features/students/alumnos-listado/alumnos-listado.component';
import { TermsConditionsComponent } from './features/pages/terms-conditions/terms-conditions.component';
import { AboutUsComponent } from './features/pages/about-us/about-us.component';
import { PrivacyPolicyComponent } from './features/pages/privacy-policy/privacy-policy.component';
import { AlumnosClasesComponent } from './features/students/alumnos-clases/alumnos-clases.component';
import { ClasesComponent } from './features/classes/clases.component';
import { OptionsComponent } from './features/dashboard/options/options.component';
import { ClassDashboardComponent } from './features/classes/class-dashboard/class-dashboard.component';
import { TrabajosDetallesComponent } from './features/tasks/trabajos-detalles/trabajos-detalles.component';

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
      { path: 'alumnos-listado', component: AlumnosListadoComponent, canActivate: [PoliceGuard] },
      { path: 'alumnos-clases-registro', component: AlumnosClasesComponent, canActivate: [PoliceGuard] },
      { path: 'clases-dashboard',component:ClassDashboardComponent, canActivate: [PoliceGuard]},
      { path: 'clase/:id', component: ClasesComponent},
      { path: "Profile_User", component: MyProfileUserComponent,},
      { path: "segurity_user", component: UserSegurityComponent,},
      { path: "notifications_user", component: UserNotificationsPageComponent, },
      { path: "options", component: OptionsComponent, canActivate: [PoliceGuard] },
      { path: "connected_devices_user", component: ConnectedDevicesPageComponent, canActivate: [PoliceGuard] },
      { path: "trabajos-detalles/:id", component: TrabajosDetallesComponent},
      { path: '', redirectTo: 'options', pathMatch: 'full' }
    ]
  },

  { path: "terminos-condiciones", component: TermsConditionsComponent },
  { path: "sobre-nosotros", component: AboutUsComponent },
  { path: "politica-privacidad", component: PrivacyPolicyComponent },
  { path: '**', redirectTo: 'options', pathMatch: 'full' } // Ruta por defecto
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
