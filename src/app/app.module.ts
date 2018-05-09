import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header/header.component';
import { FooterComponent } from './footer/footer/footer.component';

import { AuthService } from './services/auth.service';
import { SsdfYearsService } from './services/data/ssdf-years.service';
import { NewsService } from './services/data/news.service';
import { ClassLevelsService } from './services/data/class-levels.service';
import { VenuesService } from './services/data/venues.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
  ],
  providers: [AuthService,
    SsdfYearsService,
    NewsService,
    ClassLevelsService,
    VenuesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
