import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { LogInComponent } from './log-in/log-in.component';
import { LoginQRGeneratorComponent } from './login-qr-generator/login-qr-generator.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { MyProfileUserComponent } from './my-profile-user/my-profile-user.component';
import { PoliceGuard } from './guard/police.guard';

const routes: Routes = [
  { path: "", component: HomepageComponent, canActivate: [PoliceGuard]},
  { path: "main", component: HomepageComponent, canActivate: [PoliceGuard]},
  { path: "login", component: LogInComponent, canActivate: [PoliceGuard]},
  { path: "QRPage", component: LoginQRGeneratorComponent, canActivate: [PoliceGuard]},
  { path: "Main_Dashboard", component: MainDashboardComponent, canActivate: [PoliceGuard]},
  { path: "Profile_User", component: MyProfileUserComponent, canActivate: [PoliceGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
