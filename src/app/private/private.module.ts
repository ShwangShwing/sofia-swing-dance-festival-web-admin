import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateRoutingModule } from './private-routing.module';
import { SetSsdfYearModule } from './set-ssdf-year/set-ssdf-year.module';
import { NewSsdfYearModule } from './new-ssdf-year/new-ssdf-year.module';
import { NewsModule } from './news/news.module';
import { ClassLevelsModule } from './class-levels/class-levels.module';
import { VenuesModule } from './venues/venues.module';
import { InstructorsModule } from './instructors/instructors.module';

@NgModule({
  imports: [
    CommonModule,
    PrivateRoutingModule,
    SetSsdfYearModule,
    NewSsdfYearModule,
    NewsModule,
    ClassLevelsModule,
    VenuesModule,
    InstructorsModule
  ],
  declarations: []
})
export class PrivateModule { }
