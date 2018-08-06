import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
import { InstructorsService } from './services/data/instructors.service';
import { EventsService } from './services/data/events.service';
import { UploadService } from './services/data/upload-service.service';
import { CompetitionTypesService } from './services/data/competition-type.service';

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
    AngularFontAwesomeModule,
    BrowserAnimationsModule
  ],
  providers: [AuthService,
    SsdfYearsService,
    NewsService,
    ClassLevelsService,
    CompetitionTypesService,
    VenuesService,
    InstructorsService,
    EventsService,
    UploadService],
  bootstrap: [AppComponent]
})
export class AppModule { }
