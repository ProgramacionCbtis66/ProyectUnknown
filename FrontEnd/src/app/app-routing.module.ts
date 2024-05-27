import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { MainAccessComponent } from './main-access/main-access.component';

const routes: Routes = [
  { path: "main", component: HomepageComponent},
  { path: "acceso", component: MainAccessComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
