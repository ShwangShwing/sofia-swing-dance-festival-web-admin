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
                  venueId: inDbEvent.venueId,
                  classLevel:
                    inDbEvent.type.startsWith('class_') ?
                    inDbEvent.type.substr('class_'.length) :
                    '',
                  instructorIds: (
                    inDbEvent.instructorIds ?
                    Object.values(inDbEvent.instructorIds) :
                    []) || []
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

  updateClass(event: EventModel): void {
    event.type = `class_${event.classLevel}`;
    this.af.object(`${event.id}/instructorIds`).set(event.instructorIds);
    this.update(event);
  }

  updateTasterClass(event: EventModel): void {
    event.type = `taster_class`;
    this.af.object(`${event.id}/instructorIds`).set(event.instructorIds);
    this.update(event);
  }

  updateParty(event: EventModel): void {
    event.type = 'party';
    this.update(event);
  }

  updateMisc(event: EventModel): void {
    event.type = 'misc';
    this.update(event);
  }

  insertClass(event: EventModel): void {
    const fbEvent: FirebaseEventModel = {
      name: event.name,
      start: event.startTime,
      end: event.endTime,
      type: `class_${event.classLevel}`,
      venueId: event.venueId,
      instructorIds: event.instructorIds
    };

    this.insert(fbEvent);
  }

  insertTasterClass(event: EventModel): void {
    const fbEvent: FirebaseEventModel = {
      name: event.name,
      start: event.startTime,
      end: event.endTime,
      type: 'taster_class',
      venueId: event.venueId,
      instructorIds: event.instructorIds
    };

    this.insert(fbEvent);
  }

  insertParty(event: EventModel): void {
    const fbEvent: FirebaseEventModel = {
      name: event.name,
      start: event.startTime,
      end: event.endTime,
      type: 'party',
      venueId: event.venueId
    };

    this.insert(fbEvent);
  }

  insertMisc(event: EventModel): void {
    const fbEvent: FirebaseEventModel = {
      name: event.name,
      start: event.startTime,
      end: event.endTime,
      type: 'misc',
      venueId: event.venueId
    };

    this.insert(fbEvent);
  }

  private insert(event: FirebaseEventModel): void {
    if (!event.name) { return; }
    if (!event.start) { return; }
    if (!event.end) { return; }
    if (!event.type) { return; }
    if (!event.venueId) { return; }
    this.af.list(`/${this.selectedSsdfYear}/events/`).push(event);
  }

  private update(event: EventModel): void {
    if (!event.name) { return; }
    if (!event.startTime) { return; }
    if (!event.endTime) { return; }
    if (!event.type) { return; }
    if (!event.venueId) { return; }
    this.af.object(`${event.id}/name`).set(event.name);
    this.af.object(`${event.id}/start`).set(event.startTime | 0);
    this.af.object(`${event.id}/end`).set(event.endTime | 0);
    this.af.object(`${event.id}/type`).set(event.type);
    this.af.object(`${event.id}/venueId`).set(event.venueId);
  }
}

interface FirebaseEventModel {
  name: string;
  start: number;
  end: number;
  type: string;
  venueId: string;
  instructorIds?: string[];
}
