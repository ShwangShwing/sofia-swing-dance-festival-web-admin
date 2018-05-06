import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetSsdfYearComponent } from './set-ssdf-year/set-ssdf-year.component';

const routes: Routes = [
  { path: '', redirectTo: 'set-ssdf-year', pathMatch: 'full' },
  { path: 'set-ssdf-year', component: SetSsdfYearComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
