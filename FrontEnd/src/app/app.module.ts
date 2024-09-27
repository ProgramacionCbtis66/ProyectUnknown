import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';  
import { JwtModule } from '@auth0/angular-jwt';          
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './authentication_Page/homepage/homepage.component';
import { LogInComponent } from './authentication_Page/log-in/log-in.component';
import { LoginQRGeneratorComponent } from './authentication_Page/login-qr-generator/login-qr-generator.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { MyProfileUserComponent } from './user-settings_Page/my-profile-user/my-profile-user.component';
import { UserSegurityComponent } from './user-settings_Page/user-segurity/user-segurity.component';
import { ClasesComponent } from './dashboard/alumno/clases/clases.component';
import { BibliotecaComponent } from './dashboard/alumno/biblioteca/biblioteca.component';
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
import { ServiciosEscolaresComponent } from './dashboard/servicios-escolares/servicios-escolares.component';
import { AdministrativosComponent } from './dashboard/administrativos/administrativos.component';

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
    ClasesComponent,
    BibliotecaComponent,
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
    ServiciosEscolaresComponent,
    AdministrativosComponent,
  ],
  imports: [
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
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent]
})
export class AppModule { }
