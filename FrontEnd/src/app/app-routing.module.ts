import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { LogInComponent } from './log-in/log-in.component';
import { LoginQRGeneratorComponent } from './login-qr-generator/login-qr-generator.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { MyProfileUserComponent } from './my-profile-user/my-profile-user.component';

const routes: Routes = [
  { path: "", component: HomepageComponent},
  { path: "main", component: HomepageComponent},
  { path: "login", component: LogInComponent},
  { path: "QRPage", component: LoginQRGeneratorComponent},
  { path: "Main_Dashboard", component: MainDashboardComponent},
  { path: "Profile_User", component: MyProfileUserComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
