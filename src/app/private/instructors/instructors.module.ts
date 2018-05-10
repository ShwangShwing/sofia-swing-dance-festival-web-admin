import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstructorsComponent } from './instructors.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [InstructorsComponent]
})
export class InstructorsModule { }
