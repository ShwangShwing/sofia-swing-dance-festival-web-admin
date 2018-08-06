import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompetitionTypesComponent } from './competition-types.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [CompetitionTypesComponent]
})
export class CompetitionTypesModule { }
