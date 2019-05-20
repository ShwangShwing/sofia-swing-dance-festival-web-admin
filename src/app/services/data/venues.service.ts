import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap, first } from 'rxjs/operators';
import { VenueModel } from '../../models/venue.model';
import { AngularFireDatabase } from '@angular/fire/database';
import { SsdfYearsService } from './ssdf-years.service';
import { Observable } from 'rxjs';

@Injectable()
export class VenuesService {
  private venues = new BehaviorSubject<VenueModel[]>([]);
  constructor(private af: AngularFireDatabase,
    private ssdfYearsService: SsdfYearsService) {
    this.ssdfYearsService.getSelectedSsdfYear()
      .pipe(switchMap(ssdfYear => {
        return this.af
          .list(`/${ssdfYear}/venues`)
          .snapshotChanges().pipe(map(dbVenues => ({ ssdfYear, dbVenues })));
      }))
      .subscribe(({ ssdfYear, dbVenues }) => {
        const outClassLevels: VenueModel[] = [];
        dbVenues.forEach(dbVenue => {
          const inDbVenue: any = dbVenue.payload.val();
          const venue: VenueModel = {
            id: `${ssdfYear}/venues/${dbVenue.key}`,
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
  }

  getAll(): Observable<VenueModel[]> {
    return this.venues;
  }

  delete(id): void {
    this.af.object(id).remove();
  }

  insert(venue: VenueModel): void {
    this.ssdfYearsService.getSelectedSsdfYear().pipe(first())
    .subscribe(ssdfYear => this.af.list(`/${ssdfYear}/venues`).push(venue));
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
