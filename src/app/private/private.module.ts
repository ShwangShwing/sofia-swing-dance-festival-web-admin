import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateRoutingModule } from './private-routing.module';
import { SetSsdfYearModule } from './set-ssdf-year/set-ssdf-year.module';

@NgModule({
  imports: [
    CommonModule,
    PrivateRoutingModule,
    SetSsdfYearModule
  ],
  declarations: []
})
export class PrivateModule { }
