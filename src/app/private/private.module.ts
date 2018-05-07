import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateRoutingModule } from './private-routing.module';
import { SetSsdfYearModule } from './set-ssdf-year/set-ssdf-year.module';
import { NewSsdfYearModule } from './new-ssdf-year/new-ssdf-year.module';

@NgModule({
  imports: [
    CommonModule,
    PrivateRoutingModule,
    SetSsdfYearModule,
    NewSsdfYearModule
  ],
  declarations: []
})
export class PrivateModule { }
