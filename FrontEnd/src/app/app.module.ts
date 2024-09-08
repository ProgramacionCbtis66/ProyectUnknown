import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LogInComponent } from './log-in/log-in.component';
import { LoginQRGeneratorComponent } from './login-qr-generator/login-qr-generator.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    LogInComponent,
    LoginQRGeneratorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
