import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LogInComponent } from './log-in/log-in.component';
import { LoginQRGeneratorComponent } from './login-qr-generator/login-qr-generator.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { MyProfileUserComponent } from './my-profile-user/my-profile-user.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    LogInComponent,
    LoginQRGeneratorComponent,
    MainDashboardComponent,
    MyProfileUserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
