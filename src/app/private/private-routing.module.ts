import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetSsdfYearComponent } from './set-ssdf-year/set-ssdf-year.component';
import { NewSsdfYearComponent } from './new-ssdf-year/new-ssdf-year.component';
import { NewsComponent } from './news/news.component';
import { ClassLevelsComponent } from './class-levels/class-levels.component';
import { VenuesComponent } from './venues/venues.component';
import { InstructorsComponent } from './instructors/instructors.component';
import { EventsComponent } from './events/events.component';

const routes: Routes = [
  { path: '', redirectTo: 'set-ssdf-year', pathMatch: 'full' },
  { path: 'set-ssdf-year', component: SetSsdfYearComponent },
  { path: 'new-ssdf-year', component: NewSsdfYearComponent },
  { path: 'news', component: NewsComponent },
  { path: 'class-levels', component: ClassLevelsComponent },
  { path: 'venues', component: VenuesComponent },
  { path: 'instructors', component: InstructorsComponent },
  { path: 'events', component: EventsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
