import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap, first } from 'rxjs/operators';
import { EventModel } from '../../models/event.model';
import { AngularFireDatabase } from '@angular/fire/database';
import { SsdfYearsService } from './ssdf-years.service';

@Injectable()
export class EventsService {
  private events = new BehaviorSubject<EventModel[]>([]);
  constructor(private af: AngularFireDatabase,
    private ssdfYearsService: SsdfYearsService) {
      this.ssdfYearsService.getSelectedSsdfYear()
        .pipe(switchMap(ssdfYear => {
          return this.af
            .list(`/${ssdfYear}/events`)
            .snapshotChanges().pipe(map(dbEvents => ({ssdfYear, dbEvents})));
        }))
        .subscribe(({ssdfYear, dbEvents}) => {
          const outEvent: EventModel[] = [];
          dbEvents.forEach(dbEvent => {
            const inDbEvent: any = dbEvent.payload.val();
            const event: EventModel = {
              id: `/${ssdfYear}/events/${dbEvent.key}`,
              name: inDbEvent.name || '',
              startTime: inDbEvent.start | 0,
              endTime: inDbEvent.end | 0,
              type: inDbEvent.type || 'misc',
              description: inDbEvent.description || '',
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

  updateCompetition(event: EventModel): void {
    event.type = `competition_${event.competitionType}`;
    // winners
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
      description: event.description,
      start: event.startTime,
      end: event.endTime,
      type: `class_${event.classLevel}`,
      venueId: event.venueId,
      instructorIds: event.instructorIds
    };

    this.insert(fbEvent);
  }

  insertCompetition(event: EventModel): void {
    const fbEvent: FirebaseEventModel = {
      name: event.name,
      description: event.description,
      start: event.startTime,
      end: event.endTime,
      type: `competition_${event.competitionType}`,
      venueId: event.venueId
    };

    this.insert(fbEvent);
  }

  insertParty(event: EventModel): void {
    const fbEvent: FirebaseEventModel = {
      name: event.name,
      description: event.description,
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
      description: event.description,
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
    event.start = event.start | 0;
    event.end = event.end | 0;
    this.ssdfYearsService.getSelectedSsdfYear().pipe(first())
    .subscribe(ssdfYear => {
      this.af.list(`/${ssdfYear}/events/`).push(event);
    });
  }

  private update(event: EventModel): void {
    if (!event.name) { return; }
    if (!event.startTime) { return; }
    if (!event.endTime) { return; }
    if (!event.type) { return; }
    if (!event.venueId) { return; }
    this.af.object(`${event.id}/name`).set(event.name);
    this.af.object(`${event.id}/description`).set(event.description);
    this.af.object(`${event.id}/start`).set(event.startTime | 0);
    this.af.object(`${event.id}/end`).set(event.endTime | 0);
    this.af.object(`${event.id}/type`).set(event.type);
    this.af.object(`${event.id}/venueId`).set(event.venueId);
  }
}

interface FirebaseEventModel {
  name: string;
  description: string;
  start: number;
  end: number;
  type: string;
  venueId: string;
  instructorIds?: string[];
}
