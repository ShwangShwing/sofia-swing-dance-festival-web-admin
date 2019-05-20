import { Injectable } from '@angular/core';
import { ClassLevelModel } from '../../models/class-level.model';
import { Observable } from 'rxjs';
import { map, switchMap, first } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { SsdfYearsService } from './ssdf-years.service';

@Injectable()
export class ClassLevelsService {
  private classLevels$ = new BehaviorSubject<ClassLevelModel[]>([]);
  constructor(private af: AngularFireDatabase,
    private ssdfYearsService: SsdfYearsService) {
      this.ssdfYearsService.getSelectedSsdfYear()
        .pipe(switchMap(ssdfYear => {
          return this.af.list(`/${ssdfYear}/classLevels`)
            .snapshotChanges().pipe(map(dbClassLevels => ({ ssdfYear, dbClassLevels })));
        })).subscribe(({ssdfYear, dbClassLevels}) => {
          const outClassLevels: ClassLevelModel[] = [];
          dbClassLevels.forEach(dbClassLevel => {
            const inDbClassLevel: any = dbClassLevel.payload.val();
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

  getAll(): Observable<ClassLevelModel[]> {
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

    this.ssdfYearsService.getSelectedSsdfYear().pipe(first())
    .subscribe(ssdfYear => {
      this.af.object(`/${ssdfYear}/classLevels/${classLevelIdentifier}`).set(classLevel);
    });
  }

  update(classLevel: ClassLevelModel): void {
    this.af.object(`${classLevel.id}/name`).set(classLevel.name);
    this.af.object(`${classLevel.id}/position`).set(classLevel.position | 0);
  }
}
