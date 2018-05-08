import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetSsdfYearComponent } from './set-ssdf-year/set-ssdf-year.component';
import { NewSsdfYearComponent } from './new-ssdf-year/new-ssdf-year.component';
import { NewsComponent } from './news/news.component';
import { ClassLevelsComponent } from './class-levels/class-levels.component';

const routes: Routes = [
  { path: '', redirectTo: 'set-ssdf-year', pathMatch: 'full' },
  { path: 'set-ssdf-year', component: SetSsdfYearComponent },
  { path: 'new-ssdf-year', component: NewSsdfYearComponent },
  { path: 'news', component: NewsComponent },
  { path: 'class-levels', component: ClassLevelsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
