import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateRoutingModule } from './private-routing.module';
import { SetSsdfYearModule } from './set-ssdf-year/set-ssdf-year.module';
import { NewSsdfYearModule } from './new-ssdf-year/new-ssdf-year.module';
import { NewsModule } from './news/news.module';
import { ClassLevelsModule } from './class-levels/class-levels.module';
import { VenuesModule } from './venues/venues.module';
import { InstructorsModule } from './instructors/instructors.module';
import { EventsModule } from './events/events.module';
import { CompetitionTypesModule } from './competition-types/competition-types.module';

@NgModule({
  imports: [
    CommonModule,
    PrivateRoutingModule,
    SetSsdfYearModule,
    NewSsdfYearModule,
    NewsModule,
    ClassLevelsModule,
    CompetitionTypesModule,
    VenuesModule,
    InstructorsModule,
    EventsModule
  ],
  declarations: []
})
export class PrivateModule { }
