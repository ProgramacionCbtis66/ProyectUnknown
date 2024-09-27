import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './authentication_Page/homepage/homepage.component';
import { LogInComponent } from './authentication_Page/log-in/log-in.component';
import { LoginQRGeneratorComponent } from './authentication_Page/login-qr-generator/login-qr-generator.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { MyProfileUserComponent } from './user-settings_Page/my-profile-user/my-profile-user.component';
import { PoliceGuard } from './Core/guard/police.guard';

const routes: Routes = [
  { path: "", component: HomepageComponent},
  { path: "main", component: HomepageComponent},
  { path: "login", component: LogInComponent},
  { path: "QRPage", component: LoginQRGeneratorComponent, canActivate: [PoliceGuard]},
  { path: "Main_Dashboard", component: MainDashboardComponent},
  { path: "Profile_User", component: MyProfileUserComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
