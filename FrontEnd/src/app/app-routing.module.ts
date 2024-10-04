import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './authentication_Page/homepage/homepage.component';
import { LogInComponent } from './authentication_Page/log-in/log-in.component';
import { LoginQRGeneratorComponent } from './authentication_Page/login-qr-generator/login-qr-generator.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { MyProfileUserComponent } from './user-settings_Page/my-profile-user/my-profile-user.component';
import { PoliceGuard } from './Core/guard/police.guard';
import { UserSegurityComponent } from './user-settings_Page/user-segurity/user-segurity.component';
import { UserNotificationsPageComponent } from './user-settings_Page/user-notifications-page/user-notifications-page.component';
import { ConnectedDevicesPageComponent } from './user-settings_Page/connected-devices-page/connected-devices-page.component';

const routes: Routes = [
  { path: "", component: HomepageComponent },
  { path: "main", component: HomepageComponent },
  { path: "login", component: LogInComponent },
  { path: "QRPage", component: LoginQRGeneratorComponent, canActivate: [PoliceGuard] },
  { path: "Main_Dashboard", component: MainDashboardComponent },
  { path: "Profile_User", component: MyProfileUserComponent },
  { path: "segurity_user", component: UserSegurityComponent },
  { path: "notifications_user", component: UserNotificationsPageComponent },
  { path: "connected_devices_user", component: ConnectedDevicesPageComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' } // Ruta por defecto
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
