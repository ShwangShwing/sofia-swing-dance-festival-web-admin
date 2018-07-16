import { Injectable } from '@angular/core';
import { ClassLevelModel } from '../../models/class-level.model';
import { Observable } from 'rxjs/Observable';
import { map, switchMap, first } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { AngularFireDatabase } from 'angularfire2/database';
import { SsdfYearsService } from './ssdf-years.service';

@Injectable()
export class ClassLevelsService {
  private classLevels$ = new BehaviorSubject<ClassLevelModel[]>([]);
  constructor(private af: AngularFireDatabase,
    private ssdfYearsService: SsdfYearsService) {
      // let classLevelsSubscr = new Subscription();
      this.ssdfYearsService.getSelectedSsdfYear()
        .switchMap(ssdfYear => {
          return this.af.list(`/${ssdfYear}/classLevels`)
            .snapshotChanges().map(dbClassLevels => ({ ssdfYear, dbClassLevels }));
        }).subscribe(({ssdfYear, dbClassLevels}) => {
          const outClassLevels: ClassLevelModel[] = [];
          dbClassLevels.forEach(dbClassLevel => {
            const inDbClassLevel = dbClassLevel.payload.val();
            const classLevel: ClassLevelModel = {
              id: `${ssdfYear}/classLevels/${dbClassLevel.key}`,
              classLevelType: dbClassLevel.key,
              name: inDbClassLevel.name || '',
              position: inDbClassLevel.position || 0
            };
            outClassLevels.push(classLevel);
          });

          outClassLevels.sort((left, right) => left.position - right.position);
          this.classLevels$.next(outClassLevels);
        });
  }

  getAll() {
    return this.classLevels$;
  }

  delete(id: string): void {
    this.af.object(id).remove();
  }

  insert(classLevel: ClassLevelModel): void {
    const classLevelIdentifier = classLevel.name.toLowerCase().replace(/[^0-9a-z]/gi, '');
    if (!classLevel) {
      throw new Error('Put more valid name!');
    }

    this.ssdfYearsService.getSelectedSsdfYear().first()
    .subscribe(ssdfYear => {
      this.af.object(`/${ssdfYear}/classLevels/${classLevelIdentifier}`).set(classLevel);
    });
  }

  update(classLevel: ClassLevelModel): void {
    this.af.object(`${classLevel.id}/name`).set(classLevel.name);
    this.af.object(`${classLevel.id}/position`).set(classLevel.position | 0);
  }
}
