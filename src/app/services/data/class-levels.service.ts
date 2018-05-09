import { Injectable } from '@angular/core';
import { ClassLevelModel } from '../../models/class-level.model';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { AngularFireDatabase } from 'angularfire2/database';
import { SsdfYearsService } from './ssdf-years.service';

@Injectable()
export class ClassLevelsService {
  private classLevels$ = new BehaviorSubject<ClassLevelModel[]>([]);
  private selectedSsdfYear = '';
  constructor(private af: AngularFireDatabase,
    private ssdfYearsService: SsdfYearsService) {
      let classLevelsSubscr = new Subscription();
      this.ssdfYearsService.getSelectedSsdfYear()
        .subscribe(selectedSsdfYear => {
          this.selectedSsdfYear = selectedSsdfYear;
          classLevelsSubscr.unsubscribe();
          classLevelsSubscr = this.af
            .list(`/${this.selectedSsdfYear}/classLevels`)
            .snapshotChanges()
            .subscribe(dbClassLevels => {
              const outClassLevels: ClassLevelModel[] = [];
              dbClassLevels.forEach(dbClassLevel => {
                const inDbClassLevel = dbClassLevel.payload.val();
                const classLevel: ClassLevelModel = {
                  id: `/${this.selectedSsdfYear}/classLevels/${dbClassLevel.key}`,
                  name: inDbClassLevel.name || '',
                  position: inDbClassLevel.position || 0
                };
                outClassLevels.push(classLevel);
              });

              outClassLevels.sort((left, right) => left.position - right.position);
              this.classLevels$.next(outClassLevels);
            });
        });
  }

  getAll() {
    return this.classLevels$;
  }

  delete(id): void {
    this.af.object(id).remove();
  }

  insert(classLevel: ClassLevelModel): void {
    const classLevelIdentifier = classLevel.name.toLowerCase().replace(/[^0-9a-z]/gi, '');
    if (!classLevel) {
      throw new Error('Put more valid name!');
    }

    this.af.object(`/${this.selectedSsdfYear}/classLevels/${classLevelIdentifier}`).set(classLevel);
  }

  update(classLevel: ClassLevelModel): void {
    this.af.object(`${classLevel.id}/name`).set(classLevel.name);
    this.af.object(`${classLevel.id}/position`).set(classLevel.position | 0);
  }
}
