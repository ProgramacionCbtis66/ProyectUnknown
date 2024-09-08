import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { LogInComponent } from './log-in/log-in.component';
import { LoginQRGeneratorComponent } from './login-qr-generator/login-qr-generator.component';

const routes: Routes = [
  { path: "", component: HomepageComponent},
  { path: "main", component: HomepageComponent},
  { path: "login", component: LogInComponent},
  { path: "QRPage", component: LoginQRGeneratorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
