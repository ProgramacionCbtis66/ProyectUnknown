import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';


import { CommonModule } from '@angular/common'; // Importa CommonModule
import { RouterModule } from '@angular/router'; // Importa RouterModule

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './features/homepage/homepage.component';
import { LogInComponent } from './features/auth/log-in/log-in.component';
import { LoginQRGeneratorComponent } from './features/auth/login-qr-generator/login-qr-generator.component';
import { MainDashboardComponent } from './features/dashboard/main-dashboard.component';
import { MyProfileUserComponent } from './features/profile/my-profile-user/my-profile-user.component';
import { UserSegurityComponent } from './features/profile/user-segurity/user-segurity.component';
import { UserNotificationsPageComponent } from './features/profile/user-notifications-page/user-notifications-page.component';
import { AlumnosListadoComponent } from './features/students/alumnos-listado/alumnos-listado.component';
import { AlumnosClasesComponent } from './features/students/alumnos-clases/alumnos-clases.component';
import { ConnectedDevicesPageComponent } from './features/profile/connected-devices-page/connected-devices-page.component';
import Notiflix from 'notiflix';
import { FormsModule } from '@angular/forms';
import { UserRegisterComponent } from './features/profile/user-register/user-register.component';
import { ImgCropperComponent } from "./shared/imageEditor/img-cropper/img-cropper.component";
import { EntregarTareaComponent } from "./features/classes/entregar-tarea/entregar-tarea.component";
import { TrabajosDetallesComponent } from './features/tasks/trabajos-detalles/trabajos-detalles.component';
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
    UserRegisterComponent,
    AlumnosListadoComponent,
    AlumnosClasesComponent,
    TrabajosDetallesComponent,
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    JwtModule.forRoot({
        config: {
            tokenGetter: tokenGetter,
            allowedDomains: ["localhost:4000"],
            disallowedRoutes: ["localhost:4000/apiAdae/usr/login/"]
        }
    }),
    CommonModule,
    RouterModule,
    ImgCropperComponent,
<<<<<<< Updated upstream
    EntregarTareaComponent,
  ],
=======
    EntregarTareaComponent
],
>>>>>>> Stashed changes
  providers: [
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    Notiflix.Notify.init({
      position: 'center-top',
      distance: '15px',
      fontSize: '15px',
      width: '380px',
      timeout: 1700,
    });
  }
}
