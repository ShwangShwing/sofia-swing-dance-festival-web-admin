import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { EventModel } from '../../models/event.model';
import { AngularFireDatabase } from 'angularfire2/database';
import { SsdfYearsService } from './ssdf-years.service';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class EventsService {
  private events = new BehaviorSubject<EventModel[]>([]);
  private selectedSsdfYear = '';
  constructor(private af: AngularFireDatabase,
    private ssdfYearsService: SsdfYearsService) {
      let eventsSubscr = new Subscription();
      this.ssdfYearsService.getSelectedSsdfYear()
        .subscribe(selectedSsdfYear => {
          this.selectedSsdfYear = selectedSsdfYear;
          eventsSubscr.unsubscribe();
          eventsSubscr = this.af
            .list(`/${this.selectedSsdfYear}/events`)
            .snapshotChanges()
            .subscribe(dbEvents => {
              const outEvent: EventModel[] = [];
              dbEvents.forEach(dbEvent => {
                const inDbEvent = dbEvent.payload.val();
                const event: EventModel = {
                  id: `/${this.selectedSsdfYear}/events/${dbEvent.key}`,
                  name: inDbEvent.name || '',
                  startTime: inDbEvent.start | 0,
                  endTime: inDbEvent.end | 0,
                  type: inDbEvent.type || 'misc',
                  venueId: inDbEvent.venueId
                };
                outEvent.push(event);
              });

              outEvent.sort((left, right) => left.startTime - right.startTime);
              this.events.next(outEvent);
            });
        });
  }

  getAll() {
    return this.events;
  }

  delete(id): void {
    this.af.object(id).remove();
  }

  insert(event: EventModel): void {
    const eventIdentifier = event.name.toLowerCase().replace(/[^0-9a-z]/gi, '');
    this.af.object(`/${this.selectedSsdfYear}/events/${eventIdentifier}`).set(event);
  }

  update(event: EventModel): void {
    this.af.object(`${event.id}/name`).set(event.name);
    this.af.object(`${event.id}/startTime`).set(event.startTime | 0);
    this.af.object(`${event.id}/endTime`).set(event.endTime | 0);
    this.af.object(`${event.id}/type`).set(event.type);
    this.af.object(`${event.id}/venueId`).set(event.venueId);
  }
}
