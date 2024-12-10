import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';


import { CommonModule } from '@angular/common'; // Importa CommonModule
import { RouterModule } from '@angular/router'; // Importa RouterModule

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './authentication_Page/homepage/homepage.component';
import { LogInComponent } from './authentication_Page/log-in/log-in.component';
import { LoginQRGeneratorComponent } from './authentication_Page/login-qr-generator/login-qr-generator.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { MyProfileUserComponent } from './user-settings_Page/my-profile-user/my-profile-user.component';
import { UserSegurityComponent } from './user-settings_Page/user-segurity/user-segurity.component';
import { ClasesComponent } from './dashboard/alumno/clases/clases.component';
import { AlumnoComponent } from './dashboard/alumno/alumno.component';
import { DocenteComponent } from './dashboard/docente/docente.component';
import { ListaComponent } from './dashboard/docente/lista/lista.component';
import { ConstanciasComponent } from './dashboard/servicios_escolares/constancias/constancias.component';
import { JustificantesFaltasComponent } from './dashboard/servicios_escolares/justificantes-faltas/justificantes-faltas.component';
import { InscripcionesComponent } from './dashboard/servicios_escolares/inscripciones/inscripciones.component';
import { ReInscripcionesComponent } from './dashboard/servicios_escolares/re-inscripciones/re-inscripciones.component';
import { SeguroSocialComponent } from './dashboard/servicios_escolares/seguro-social/seguro-social.component';
import { CertificadosComponent } from './dashboard/servicios_escolares/certificados/certificados.component';
import { TitulacionComponent } from './dashboard/servicios_escolares/titulacion/titulacion.component';
import { AdministrativosComponent } from './dashboard/administrativos/administrativos.component';
import { UserNotificationsPageComponent } from './user-settings_Page/user-notifications-page/user-notifications-page.component';
import { AlumnosListadoComponent } from './dashboard/servicios_escolares/alumnos-listado/alumnos-listado.component';
import { ServiciosMenuComponent } from './dashboard/servicios_escolares/servicios-menu/servicios-menu.component';
import { TerminosCondicionesComponent } from './politica-privacidad/terminos-condiciones/terminos-condiciones.component';
import { SobreNosotrosComponent } from './politica-privacidad/sobre-nosotros/sobre-nosotros.component';
import { PoliticaPrivacidadComponent } from './politica-privacidad/politica-privacidad.component';
import { AlumnosClasesComponent } from './dashboard/servicios_escolares/alumnos-clases/alumnos-clases.component';
import { AlumnosRegistrosComponent } from './dashboard/servicios_escolares/alumnos-registros/alumnos-registros.component';
import { AlumnosGruposComponent } from './dashboard/servicios_escolares/alumnos-grupos/alumnos-grupos.component';
import { ConnectedDevicesPageComponent } from './user-settings_Page/connected-devices-page/connected-devices-page.component';
import Notiflix from 'notiflix';
import { FormsModule } from '@angular/forms';
import { UserRegisterComponent } from './user-settings_Page/user-register/user-register.component';
import { ImgCropperComponent } from "./shared/imageEditor/img-cropper/img-cropper.component";
import { EntregarTareaComponent } from "./dashboard/alumno/clases/entregar-tarea/entregar-tarea.component";

// Función para obtener el token desde el localStorage
export function tokenGetter() {
  return localStorage.getItem("adae");
}

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    LogInComponent,
    LoginQRGeneratorComponent,
    MainDashboardComponent,
    MyProfileUserComponent,
    UserSegurityComponent,
    UserNotificationsPageComponent,
    ConnectedDevicesPageComponent,
    ClasesComponent,
    AlumnoComponent,
    DocenteComponent,
    ListaComponent,
    ConstanciasComponent,
    JustificantesFaltasComponent,
    InscripcionesComponent,
    ReInscripcionesComponent,
    SeguroSocialComponent,
    CertificadosComponent,
    TitulacionComponent,
    AdministrativosComponent,
    UserRegisterComponent,
    AlumnosListadoComponent,
    ServiciosMenuComponent,
    TerminosCondicionesComponent,
    SobreNosotrosComponent,
    PoliticaPrivacidadComponent,
    AlumnosRegistrosComponent,
    AlumnosClasesComponent,
    AlumnosGruposComponent,

  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(), // Módulo importado aquí
    JwtModule.forRoot({
        config: {
            tokenGetter: tokenGetter,
            allowedDomains: ["localhost:4000"],
            disallowedRoutes: ["localhost:4000/apiAdae/usr/login/"]
        }
    }),
    CommonModule, // Asegúrate de añadir CommonModule
    RouterModule,
    ImgCropperComponent,
    EntregarTareaComponent
],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() { 
    Notiflix.Notify.init({
      position: 'center-top', // Cambia la posición a la esquina superior izquierda
      distance:'15px',
      fontSize:'15px',
      width:'380px',
      timeout: 1700,
    });
  }
 }
