import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';

const routes: Routes = [
  { path: '', redirectTo: 'public/home', pathMatch: 'full'},
  { path: 'public', loadChildren: './public/public.module#PublicModule' },
  { path: 'private', loadChildren: './private/private.module#PrivateModule', canActivate: [AuthService] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
