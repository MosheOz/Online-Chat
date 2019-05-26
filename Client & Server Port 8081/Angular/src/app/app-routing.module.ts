import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RoomComponent } from './components/room/room.component';
import { Page404Component } from './components/page404/page404.component';
import { LoginGuardService } from './services/login-guard.service';

const routes: Routes = [
    { path: "room", component: RoomComponent, canActivate: [LoginGuardService] },
    { path: "login", component: LoginComponent},
    { path: "", redirectTo: "login", pathMatch: "full" } ,
    { path: "**", component: Page404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
