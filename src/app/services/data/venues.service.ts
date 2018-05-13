import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { VenueModel } from '../../models/venue.model';
import { AngularFireDatabase } from 'angularfire2/database';
import { SsdfYearsService } from './ssdf-years.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class VenuesService {
  private venues = new BehaviorSubject<VenueModel[]>([]);
  private selectedSsdfYear = '';
  constructor(private af: AngularFireDatabase,
    private ssdfYearsService: SsdfYearsService) {
      let classLevelsSubscr = new Subscription();
      this.ssdfYearsService.getSelectedSsdfYear()
        .subscribe(selectedSsdfYear => {
          this.selectedSsdfYear = selectedSsdfYear;
          classLevelsSubscr.unsubscribe();
          classLevelsSubscr = this.af
            .list(`/${this.selectedSsdfYear}/venues`)
            .snapshotChanges()
            .subscribe(dbVenues => {
              const outClassLevels: VenueModel[] = [];
              dbVenues.forEach(dbVenue => {
                const inDbVenue = dbVenue.payload.val();
                const venue: VenueModel = {
                  id: `${this.selectedSsdfYear}/venues/${dbVenue.key}`,
                  name: inDbVenue.name || '',
                  imageUrl: inDbVenue.imageUrl || '',
                  youtubeUrl: inDbVenue.youtubeUrl || '',
                  address: inDbVenue.address || '',
                  latitude: +inDbVenue.latitude || 0,
                  longitude: +inDbVenue.longitude || 0,
                  position: inDbVenue.position || 0
                };
                outClassLevels.push(venue);
              });

              outClassLevels.sort((left, right) => left.position - right.position);
              this.venues.next(outClassLevels);
            });
        });
  }

  getAll(): Observable<VenueModel[]> {
    return this.venues;
  }

  delete(id): void {
    this.af.object(id).remove();
  }

  insert(venue: VenueModel): void {
    this.af.list(`/${this.selectedSsdfYear}/venues`).push(venue);
  }

  update(venue: VenueModel): void {
    this.af.object(`${venue.id}/name`).set(venue.name);
    this.af.object(`${venue.id}/imageUrl`).set(venue.imageUrl);
    this.af.object(`${venue.id}/youtubeUrl`).set(venue.youtubeUrl);
    this.af.object(`${venue.id}/address`).set(venue.address);
    this.af.object(`${venue.id}/latitude`).set(venue.latitude);
    this.af.object(`${venue.id}/longitude`).set(venue.longitude);
    this.af.object(`${venue.id}/position`).set(venue.position);
  }
}
