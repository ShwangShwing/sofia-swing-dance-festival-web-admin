import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map, first } from 'rxjs/operators';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class SsdfYearsService {
  private selectedSsdfYear$ = new BehaviorSubject<string>('');
  private isSelectedSsdfYearInit = false;

  constructor(private af: AngularFireDatabase) {
    this.af.object<string>('/activeSsdfYear').valueChanges().subscribe(activeSsdfYear => {
      if (!this.isSelectedSsdfYearInit) {
        this.selectedSsdfYear$.next(activeSsdfYear);
        this.isSelectedSsdfYearInit = true;
      }
    });
  }

  getAll(): Observable<string[]> {
    return this.af.list('/').snapshotChanges()
      .map((ssdfYears) => {
        return ssdfYears.map(ssdfYear => ssdfYear.key)
          .filter(ssdfYear => ssdfYear !== 'activeSsdfYear')
          .sort((left, right) => right > left ? 1 : 0);
      });
  }

  getSelectedSsdfYear(): Observable<string> {
    return this.selectedSsdfYear$;
  }

  getActiveSsdfYear(): Observable<string> {
    return this.af.object<string>('/activeSsdfYear').valueChanges();
  }

  setSelectedSsdfYear(selectedSsdfYear: string): void {
    this.selectedSsdfYear$.next(selectedSsdfYear);
    this.isSelectedSsdfYearInit = true;
  }

  setActiveSsdfYear(activeSsdfYear: string): void {
    this.af.object<string>('/activeSsdfYear').set(activeSsdfYear);
  }

  newSsdfYear(ssdfYearName: string): void {
    this.af.object(`/${ssdfYearName}`)
      .valueChanges()
      .first()
      .toPromise()
      .then(year => {
        if (!year) {
          this.af.object(`/${ssdfYearName}`)
            .update({ creationMethod: 'Created de novo by web admin' });
        }
      });
  }

  copySsdfYear(ssdfYearFrom: string, ssdfYearName: string): void {
    this.af.object(`/${ssdfYearName}`)
      .valueChanges()
      .first()
      .toPromise()
      .then(year => {
        if (!year) {
          this.af.object(`/${ssdfYearFrom}`)
            .valueChanges()
            .first()
            .toPromise<any>()
            .then(oldYear => {
              const events = oldYear.events || {};
              for (const eventKey in events) {
                if (events.hasOwnProperty(eventKey)) {
                  const event = events[eventKey];
                  if (typeof event.venueId === 'string') {
                    event.venueId =
                      event.venueId.replace(ssdfYearFrom, ssdfYearName);
                  }

                  const instructorIds = event.instructorIds || {};
                  for (const instructorKey in instructorIds) {
                    if (instructorIds.hasOwnProperty(instructorKey)) {
                      const instructorId = instructorIds[instructorKey];
                      if (typeof instructorId === 'string') {
                        instructorIds[instructorKey] =
                          instructorId.replace(ssdfYearFrom, ssdfYearName);
                      }
                    }
                  }
                }
              }

              oldYear.creationMethod = `Copied from ${ssdfYearFrom} by web admin`;
              this.af.object(`/${ssdfYearName}`)
                .update(oldYear);
            });
        }
      });
  }
}
