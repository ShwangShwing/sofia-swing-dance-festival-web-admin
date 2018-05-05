import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { HomeModule } from './home/home.module';
import { LoginModule } from './login/login.module';
import { LogoutModule } from './logout/logout.module';

@NgModule({
  imports: [
    CommonModule,
    PublicRoutingModule,
    HomeModule,
    LoginModule,
    LogoutModule
  ],
  declarations: []
})
export class PublicModule { }
